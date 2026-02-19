import axios, { AxiosInstance } from "axios"
import { dump as yamlDump } from "js-yaml"
import { Request, Response } from "express"
import * as Sentry from "@sentry/node"
import type {
  BenefitContributionBody,
  InstitutionContributionBody,
} from "../types/contributions.js"

const owner = process.env.GITHUB_OWNER
const repository_name = process.env.GITHUB_REPOSITORY

function createGithubApi(): AxiosInstance {
  return axios.create({
    baseURL: "https://api.github.com",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "aides-jeunes-contribution-service",
    },
  })
}

async function getMainBranchSha(githubApi: AxiosInstance): Promise<string> {
  const refResp = await githubApi.get(
    `/repos/${owner}/${repository_name}/git/ref/heads/main`,
  )
  return refResp.data.object.sha
}

function withTimestamp(branchName: string) {
  return `${branchName}-${Date.now()}`
}

async function createBranch(
  githubApi: AxiosInstance,
  branchName: string,
  baseSha: string,
): Promise<string> {
  try {
    await githubApi.post(`/repos/${owner}/${repository_name}/git/refs`, {
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    })
    return branchName
  } catch (error: any) {
    if (error?.response?.status === 422) {
      const fallbackBranch = withTimestamp(branchName)
      await githubApi.post(`/repos/${owner}/${repository_name}/git/refs`, {
        ref: `refs/heads/${fallbackBranch}`,
        sha: baseSha,
      })
      return fallbackBranch
    }
    throw error
  }
}

async function commitFile(
  githubApi: AxiosInstance,
  filePath: string,
  content: string,
  branchName: string,
  commitMessage: string,
): Promise<void> {
  const contentB64 = Buffer.from(content, "utf8").toString("base64")
  await githubApi.put(
    `/repos/${owner}/${repository_name}/contents/${encodeURIComponent(filePath)}`,
    {
      message: commitMessage,
      content: contentB64,
      branch: branchName,
    },
  )
}

async function commitBinaryFile(
  githubApi: AxiosInstance,
  filePath: string,
  base64Content: string,
  branchName: string,
  commitMessage: string,
): Promise<void> {
  await githubApi.put(
    `/repos/${owner}/${repository_name}/contents/${encodeURIComponent(filePath)}`,
    {
      message: commitMessage,
      content: base64Content,
      branch: branchName,
    },
  )
}

function parseDataUrl(
  dataUrl: string,
): { mimeType: string; base64: string } | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/)
  if (!match) {
    return null
  }
  return {
    mimeType: match[1],
    base64: match[2],
  }
}

function getImageExtension(mimeType: string): string | undefined {
  const mapping: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }
  return mapping[mimeType]
}

async function createPullRequest(
  githubApi: AxiosInstance,
  title: string,
  branchName: string,
  body: string,
): Promise<string> {
  const prResp = await githubApi.post(
    `/repos/${owner}/${repository_name}/pulls`,
    {
      title,
      head: branchName,
      base: "main",
      body,
      maintainer_can_modify: true,
    },
  )
  return prResp.data.html_url
}

function handleContributionError(error: any, res: Response, context: string) {
  console.error(`${context} error`, error?.response?.data || error)
  Sentry.captureException(error)
  const status = error?.response?.status || 500
  const message =
    error?.response?.data?.message ||
    "Erreur serveur lors de la création de la PR"
  return res.status(status).json({ message })
}

function slugify(input: string): string {
  return input
    .normalize("NFD") // Decompose accented characters (é → e + ´)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s_-]/g, "") // Keep only letters, digits, spaces, _ and -
    .replace(/\s+/g, "-") // Replace multiple spaces with a single dash
    .replace(/-+/g, "-") // Replace multiple dashes with a single dash
    .slice(0, 80) // Limit to 80 characters
}

function isValidSlug(value?: string) {
  if (!value || typeof value !== "string") return false
  if (value.includes("..") || value.includes("/") || value.includes("\\")) {
    return false
  }
  return /^[a-z0-9_-]+$/.test(value)
}

function sanitizeMultiline(str?: string): string[] {
  if (!str) return []
  return str
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length)
}

async function checkInstitutionExists(
  institutionSlug: string,
  githubApi: AxiosInstance,
): Promise<boolean> {
  const institutionPath = `data/institutions/${institutionSlug}.yml`
  try {
    await githubApi.get(
      `/repos/${owner}/${repository_name}/contents/${encodeURIComponent(institutionPath)}?ref=main`,
    )
    return true
  } catch (error: any) {
    if (error.response?.status === 404) return false
    throw error
  }
}

function validateRequiredFields(body: BenefitContributionBody): string | null {
  const {
    contributorName,
    institutionName,
    institutionSlug,
    title,
    description,
  } = body

  if (
    !contributorName ||
    !institutionName ||
    !institutionSlug ||
    !title ||
    !description
  ) {
    return "Champs obligatoires manquants"
  }
  if (!isValidSlug(institutionSlug)) {
    return "Format institutionSlug invalide"
  }
  if (description.length > 420) {
    return "Description > 420 caractères"
  }
  return null
}

function buildBenefitData(body: BenefitContributionBody) {
  const {
    title,
    institutionSlug,
    description,
    criteres,
    profils,
    urls,
    typeCategorie,
    periodicite,
    autresConditions,
  } = body

  return {
    label: title,
    institution: institutionSlug,
    description,
    conditions: sanitizeMultiline(autresConditions),
    conditions_generales: Object.entries(criteres || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`),
    profils: profils || [],
    link: urls?.information || undefined,
    instructions: urls?.guide || undefined,
    form: urls?.form || undefined,
    teleservicePrefill: urls?.teleservice || undefined,
    type: typeCategorie?.[0] || "bool",
    periodicite: periodicite || "ponctuelle",
  }
}

function createInstitutionData(
  institutionName: string,
  institutionSlug: string,
) {
  return {
    name: institutionName,
    type: "autre",
    imgSrc: "img/institutions/placeholder.png",
    slug: institutionSlug,
  }
}

function buildPullRequestBody(body: BenefitContributionBody): string {
  const {
    contributorName,
    title,
    institutionName,
    typeCategorie,
    periodicite,
    description,
  } = body

  const sections = [
    `Contributeur:  **${contributorName}**`,
    `Aide : **${title}**`,
    `Institution: ${institutionName}`,
    `Type: ${typeCategorie}`,
    `Périodicité: ${periodicite}`,
    `Description: ${description}`,
  ]
  return sections.join("\n")
}

export async function handleBenefitContribution(
  req: Request<unknown, unknown, BenefitContributionBody>,
  res: Response,
) {
  if (!process.env.GITHUB_TOKEN) {
    return res
      .status(500)
      .json({ message: "GITHUB_TOKEN manquant côté serveur" })
  }

  try {
    const { institutionName, institutionSlug, title } = req.body || {}

    // Validation
    const validationError = validateRequiredFields(req.body)
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    // Generate and validate benefit slug
    const benefitSlug = `${institutionSlug}_${slugify(title)}`
    if (!isValidSlug(benefitSlug)) {
      return res.status(400).json({ message: "Format benefitSlug invalide" })
    }

    // Build data
    const benefitData = buildBenefitData(req.body)

    // GitHub API setup
    const githubApi = createGithubApi()
    const branchBase = `contribution/${benefitSlug}`

    // Get main branch SHA and create new branch
    const baseSha = await getMainBranchSha(githubApi)
    const newBranch = await createBranch(githubApi, branchBase, baseSha)

    // Check if institution exists
    const institutionExists = await checkInstitutionExists(
      institutionSlug,
      githubApi,
    )

    // Commit files to new branch
    if (!institutionExists) {
      const institutionPath = `data/institutions/${institutionSlug}.yml`
      const institutionFile = yamlDump(
        createInstitutionData(institutionName, institutionSlug),
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

    // Create pull request
    const pullRequestUrl = await createPullRequest(
      githubApi,
      `[Contribution] Ajout aide - ${title}`,
      newBranch,
      buildPullRequestBody(req.body),
    )

    return res.json({ pullRequestUrl })
  } catch (error: any) {
    return handleContributionError(error, res, "Benefit contribution")
  }
}

export async function handleInstitutionContribution(
  req: Request<unknown, unknown, InstitutionContributionBody>,
  res: Response,
) {
  if (!process.env.GITHUB_TOKEN) {
    return res
      .status(500)
      .json({ message: "GITHUB_TOKEN manquant côté serveur" })
  }

  try {
    const {
      contributorEmail,
      institutionName,
      institutionType,
      codeInsee,
      codeSiren,
      logoUrl,
      logoBase64,
    } = req.body || {}

    // Validation
    const missingFields: string[] = []
    if (!contributorEmail) missingFields.push("contributorEmail")
    if (!institutionName) missingFields.push("institutionName")
    if (!institutionType) missingFields.push("institutionType")

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Champs obligatoires manquants",
        missingFields,
      })
    }

    if (!codeInsee && !codeSiren) {
      return res.status(400).json({
        message: "Au moins un code (INSEE ou SIREN) est requis",
        missingFields: ["codeInsee", "codeSiren"],
      })
    }

    // Generate institution slug
    const institutionSlug = slugify(institutionName)
    if (!isValidSlug(institutionSlug)) {
      return res
        .status(400)
        .json({ message: "Format institutionSlug invalide" })
    }

    // Build institution data
    const institutionData: any = {
      name: institutionName,
      type: institutionType,
    }

    if (codeInsee) {
      institutionData.code_insee = codeInsee
    }

    if (codeSiren) {
      institutionData.code_siren = codeSiren
    }

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

    // GitHub API setup
    const githubApi = createGithubApi()
    const branchBase = `contribution/institution/${institutionSlug}`

    // Get main branch SHA and create new branch
    const baseSha = await getMainBranchSha(githubApi)
    const newBranch = await createBranch(githubApi, branchBase, baseSha)

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
    const prBody = [
      `Contributeur: ${contributorName}`,
      `Institution: **${institutionName}**`,
      `Type: ${institutionType}`,
      codeInsee && `Code INSEE: ${codeInsee}`,
      codeSiren && `Code SIREN: ${codeSiren}`,
    ]
      .filter(Boolean)
      .join("\n")

    const pullRequestUrl = await createPullRequest(
      githubApi,
      `[Contribution] Ajout institution - ${institutionName}`,
      newBranch,
      prBody,
    )

    return res.json({ pullRequestUrl })
  } catch (error: any) {
    return handleContributionError(error, res, "Institution contribution")
  }
}
