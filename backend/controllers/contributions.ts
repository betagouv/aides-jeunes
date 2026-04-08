import { dump as yamlDump } from "js-yaml"
import type { AxiosInstance } from "axios"
import { Request, Response } from "express"
import * as Sentry from "@sentry/node"
import Contributions from "../models/contribution.js"
import type {
  BenefitContributionBody,
  InstitutionContributionBody,
} from "../../lib/types/contributions.d.js"
import {
  ContributionCategory,
  ContributionPullRequestStatus,
} from "../../lib/enums/contribution.js"
import {
  checkInstitutionExists,
  commitBinaryFile,
  commitFile,
  createPullRequest,
  ensureGithubToken,
  initContributionBranch,
} from "./contributions/github.js"
import {
  buildBenefitData,
  buildBenefitPullRequestBody,
  buildInstitutionData,
  buildInstitutionPullRequestBody,
  createDefaultInstitutionData,
  getImageExtension,
  isValidSlug,
  parseDataUrl,
  slugify,
  validateRequiredBenefitFields,
  validateRequiredInstitutionFields,
} from "./contributions/contribution-data.js"

function handleContributionError(error: any, res: Response, context: string) {
  console.error(`${context} error`, error?.response?.data || error)
  Sentry.captureException(error)
  const status = error?.response?.status || 500
  const message =
    error?.response?.data?.message ||
    "Erreur serveur lors de la création de la PR"
  return res.status(status).json({ message })
}

async function createPRAndRecordContribution(params: {
  githubApi: AxiosInstance
  title: string
  branchName: string
  body: string
  requestBody: BenefitContributionBody | InstitutionContributionBody
  category: ContributionCategory
  contributorName?: string
  contributorEmail: string
}): Promise<string> {
  const {
    githubApi,
    title,
    branchName,
    body,
    requestBody,
    category,
    contributorName,
    contributorEmail,
  } = params

  const contributionRecord = await Contributions.create({
    type: category,
    contributorName,
    contributorEmail,
    body: requestBody,
    pullRequestStatus: ContributionPullRequestStatus.PENDING,
  })

  try {
    const pullRequestUrl = await createPullRequest(
      githubApi,
      title,
      branchName,
      body,
    )

    await Contributions.updateOne(
      { _id: contributionRecord._id },
      {
        pullRequestStatus: ContributionPullRequestStatus.SUCCEEDED,
        pullRequestUrl,
      },
    )

    return pullRequestUrl
  } catch (error: any) {
    await Contributions.updateOne(
      { _id: contributionRecord._id },
      {
        pullRequestStatus: ContributionPullRequestStatus.FAILED,
        githubError:
          error?.response?.data?.message || error?.message || String(error),
      },
    )
    Sentry.captureException(error)
    throw error
  }
}

export async function handleBenefitContribution(
  req: Request<unknown, unknown, BenefitContributionBody>,
  res: Response,
) {
  if (!ensureGithubToken(res)) {
    return
  }

  try {
    const { institutionName, institutionSlug, label } = req.body || {}

    // Validation
    const validationError = validateRequiredBenefitFields(req.body)
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    // Generate and validate benefit slug
    const benefitSlug = `${institutionSlug}_${slugify(label)}`
    if (!isValidSlug(benefitSlug)) {
      return res.status(400).json({ message: "Format benefitSlug invalide" })
    }

    // Build data
    const benefitData = buildBenefitData(req.body)

    const branchBase = `contribution/${benefitSlug}`
    const { githubApi, newBranch } = await initContributionBranch(branchBase)

    // Check if institution exists
    const institutionExists = await checkInstitutionExists(
      institutionSlug,
      githubApi,
    )

    // Commit files to new branch
    if (!institutionExists) {
      const institutionPath = `data/institutions/${institutionSlug}.yml`
      const institutionFile = yamlDump(
        createDefaultInstitutionData(institutionName, institutionSlug),
      )
      await commitFile(
        githubApi,
        institutionPath,
        institutionFile,
        newBranch,
        `Contribution: ajout fichier ${institutionPath}`,
      )
    }

    const benefitPath = `data/benefits/javascript/${benefitSlug}.yml`
    await commitFile(
      githubApi,
      benefitPath,
      yamlDump(benefitData),
      newBranch,
      `Contribution: ajout fichier ${benefitPath}`,
    )

    const pullRequestUrl = await createPRAndRecordContribution({
      githubApi,
      title: `[Contribution] Ajout aide - ${label}`,
      branchName: newBranch,
      body: buildBenefitPullRequestBody(req.body),
      requestBody: req.body,
      category: ContributionCategory.BENEFIT,
      contributorName: req.body.contributorName,
      contributorEmail: req.body.contributorEmail,
    })

    return res.json({ pullRequestUrl })
  } catch (error: any) {
    return handleContributionError(error, res, "Benefit contribution")
  }
}

export async function handleInstitutionContribution(
  req: Request<unknown, unknown, InstitutionContributionBody>,
  res: Response,
) {
  if (!ensureGithubToken(res)) {
    return
  }

  try {
    const {
      contributorName,
      contributorEmail,
      institutionName,
      institutionType,
      codeInsee,
      codeSiren,
      logoUrl,
      logoBase64,
    } = req.body || {}

    const validationError = validateRequiredInstitutionFields(req.body)
    if (validationError) {
      return res.status(400).json(validationError)
    }

    // Generate institution slug
    const institutionSlug = slugify(institutionName)
    if (!isValidSlug(institutionSlug)) {
      return res.status(400).json({
        message: "Le format de l'identifiant de l'institution est invalide",
      })
    }

    // Build institution data
    const institutionData = buildInstitutionData({
      institutionName,
      institutionType,
      codeInsee,
      codeSiren,
    })

    let logoFilePath: string | undefined
    let parsedLogo: { mimeType: string; base64: string } | null = null
    if (logoBase64) {
      parsedLogo = parseDataUrl(logoBase64)
      if (!parsedLogo) {
        return res.status(400).json({
          message: "Format d'image invalide",
          missingFields: ["logoBase64"],
        })
      }
      const extension = getImageExtension(parsedLogo.mimeType)
      if (!extension) {
        return res.status(400).json({
          message: "Type d'image non supporté",
          missingFields: ["logoBase64"],
        })
      }
      logoFilePath = `public/img/institutions/logo_${institutionSlug}.${extension}`
      institutionData.imgSrc = `img/institutions/logo_${institutionSlug}.${extension}`
    } else if (logoUrl) {
      institutionData.imgSrc = logoUrl
    }

    const branchBase = `contribution/institution/${institutionSlug}`
    const { githubApi, newBranch } = await initContributionBranch(branchBase)

    // Create institution file
    const institutionPath = `data/institutions/${institutionSlug}.yml`
    await commitFile(
      githubApi,
      institutionPath,
      yamlDump(institutionData),
      newBranch,
      `Contribution: ajout institution ${institutionName}`,
    )

    if (logoFilePath && parsedLogo) {
      await commitBinaryFile(
        githubApi,
        logoFilePath,
        parsedLogo.base64,
        newBranch,
        `Contribution: ajout logo institution ${institutionName}`,
      )
    }

    // Create pull request
    const prBody = buildInstitutionPullRequestBody({
      institutionName,
      institutionType,
      codeInsee,
      codeSiren,
    })

    const pullRequestUrl = await createPRAndRecordContribution({
      githubApi,
      title: `[Contribution] Ajout institution - ${institutionName}`,
      branchName: newBranch,
      body: prBody,
      requestBody: req.body,
      category: ContributionCategory.INSTITUTION,
      contributorName,
      contributorEmail,
    })

    return res.json({ pullRequestUrl })
  } catch (error: any) {
    return handleContributionError(error, res, "Institution contribution")
  }
}
