import axios from "axios"
import { dump as yamlDump } from "js-yaml"
import { Request, Response } from "express"
import * as Sentry from "@sentry/node"

const owner = process.env.GITHUB_OWNER
const repository_name = process.env.GITHUB_REPOSITORY

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

function sanitizeMultiline(str?: string) {
  if (!str) return []
  return str
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length)
}

async function checkInstitutionExists(
  institutionSlug: string,
  githubApi: any,
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

function validateRequiredFields(body: any): string | null {
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

function buildBenefitData(body: any) {
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

function buildPullRequestBody(body: any): string {
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

export async function handleBenefitContribution(req: Request, res: Response) {
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
    const githubApi = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "aides-jeunes-contribution-service",
      },
    })

    const mainBranch = "main"
    const newBranch = `contribution/${benefitSlug}`

    // Get main branch SHA
    const refResp = await githubApi.get(
      `/repos/${owner}/${repository_name}/git/ref/heads/${mainBranch}`,
    )
    const baseSha = refResp.data.object.sha

    // Create new branch
    await githubApi.post(`/repos/${owner}/${repository_name}/git/refs`, {
      ref: `refs/heads/${newBranch}`,
      sha: baseSha,
    })

    // Check if institution exists
    const institutionExists = await checkInstitutionExists(
      institutionSlug,
      githubApi,
    )

    // Prepare files to commit
    const files: { path: string; content: string }[] = []

    if (!institutionExists) {
      const institutionPath = `data/institutions/${institutionSlug}.yml`
      const institutionFile = yamlDump(
        createInstitutionData(institutionName, institutionSlug),
      )
      files.push({ path: institutionPath, content: institutionFile })
    }

    const benefitPath = `data/benefits/javascript/${benefitSlug}.yml`
    files.push({ path: benefitPath, content: yamlDump(benefitData) })

    // Commit files to new branch
    for (const f of files) {
      const message = `Contribution: ajout fichier ${f.path}`
      const contentB64 = Buffer.from(f.content, "utf8").toString("base64")
      await githubApi.put(
        `/repos/${owner}/${repository_name}/contents/${encodeURIComponent(f.path)}`,
        {
          message,
          content: contentB64,
          branch: newBranch,
        },
      )
    }

    // Create pull request
    const prResp = await githubApi.post(
      `/repos/${owner}/${repository_name}/pulls`,
      {
        title: `[Contribution simplifiée] Ajout aide ${title}`,
        head: newBranch,
        base: mainBranch,
        body: buildPullRequestBody(req.body),
        maintainer_can_modify: true,
      },
    )

    return res.json({ pullRequestUrl: prResp.data.html_url })
  } catch (error: any) {
    console.error("Contribution error", error?.response?.data || error)
    Sentry.captureException(error)
    const status = error?.response?.status || 500
    const message =
      error?.response?.data?.message ||
      "Erreur serveur lors de la création de la PR"
    return res.status(status).json({ message })
  }
}
