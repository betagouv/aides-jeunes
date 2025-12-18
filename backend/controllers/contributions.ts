import axios from "axios"
import { dump as yamlDump } from "js-yaml"
import fs from "fs"
import path from "path"
import { Request, Response } from "express"
import * as Sentry from "@sentry/node"

const owner = process.env.GITHUB_OWNER || "betagouv"
const repository_name = process.env.GITHUB_REPOSITORY || "aides-jeunes"
function slugify(input: string): string {
  const normalized = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

function isValidSlug(value?: string) {
  // Strict validation to prevent path traversal attacks
  // Only lowercase alphanumeric, underscore and hyphen allowed
  // Must not contain '..' or start with '/' or contain path separators
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

// Safely construct a file path preventing path traversal attacks
function safePath(baseDir: string, relativePath: string): string {
  const fullPath = path.normalize(path.join(baseDir, relativePath))

  if (!fullPath.startsWith(baseDir + path.sep)) {
    const error = new Error("Path traversal attempt detected")
    Sentry.captureException(error, {
      level: "warning",
      tags: { security: "path_traversal" },
      extra: { baseDir, relativePath, fullPath },
    })
    throw error
  }

  return fullPath
}

async function checkInstitutionExists(
  institutionSlug: string,
  isDev: boolean,
  githubApi?: any,
): Promise<boolean> {
  if (isDev) {
    const institutionPath = safePath(
      process.cwd(),
      `data/institutions/${institutionSlug}.yml`,
    )
    return fs.existsSync(institutionPath)
  } else {
    const institutionPath = `data/institutions/${institutionSlug}.yml`
    try {
      await githubApi!.get(
        `/repos/${owner}/${repository_name}/contents/${encodeURIComponent(institutionPath)}?ref=main`,
      )
      return true
    } catch (error: any) {
      if (error.response?.status === 404) return false
      throw error
    }
  }
}

export async function handleBenefitContribution(req: Request, res: Response) {
  const isDev = process.env.NODE_ENV !== "production"

  if (!isDev) {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      return res
        .status(500)
        .json({ message: "GITHUB_TOKEN manquant côté serveur" })
    }
  }

  try {
    const {
      contributorName,
      institutionName,
      institutionSlug,
      title,
      description,
      typeCategorie = [],
      periodicite = [],
      urls = {},
      criteres = {},
      profils = [],
      autresConditions,
    } = req.body || {}

    if (
      !contributorName ||
      !institutionName ||
      !institutionSlug ||
      !title ||
      !description
    ) {
      return res.status(400).json({ message: "Champs obligatoires manquants" })
    }
    if (!isValidSlug(institutionSlug)) {
      return res
        .status(400)
        .json({ message: "Format institutionSlug invalide" })
    }
    if (description.length > 420) {
      return res.status(400).json({ message: "Description > 420 caractères" })
    }

    // Generate and validate benefit slug
    const benefitSlug = `${institutionSlug}_${slugify(title)}`

    if (!isValidSlug(benefitSlug)) {
      return res.status(400).json({ message: "Format benefitSlug invalide" })
    }

    if (isDev) {
      // Mode développement : générer les fichiers localement
      const outputDir = process.cwd()

      const files: { path: string; content: string }[] = []

      try {
        // Vérifier si l'institution existe (simulé en dev)
        const institutionPath = safePath(
          outputDir,
          `data/institutions/${institutionSlug}.yml`,
        )
        const institutionDir = path.dirname(institutionPath)
        if (!fs.existsSync(institutionDir)) {
          fs.mkdirSync(institutionDir, { recursive: true })
        }

        const institutionExists = await checkInstitutionExists(
          institutionSlug,
          true,
        )
        if (!institutionExists) {
          const institutionFile = yamlDump({
            name: institutionName,
            type: "autre",
            imgSrc: "img/institutions/placeholder.png",
            slug: institutionSlug,
          })
          files.push({ path: institutionPath, content: institutionFile })
        }

        const yamlData: any = {
          label: title,
          institution: institutionSlug,
          description,
          conditions: sanitizeMultiline(autresConditions),
          conditions_generales: Object.entries(criteres)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}: ${v}`),
          profils: profils,
          link: urls.information || undefined,
          instructions: urls.guide || undefined,
          form: urls.form || undefined,
          teleservicePrefill: urls.teleservice || undefined,
          type: typeCategorie[0] || "bool",
          periodicite: periodicite[0] || "ponctuelle",
        }

        const benefitPath = safePath(
          outputDir,
          `data/benefits/javascript/${slugify(benefitSlug)}.yml`,
        )
        const benefitDir = path.dirname(benefitPath)
        if (!fs.existsSync(benefitDir)) {
          fs.mkdirSync(benefitDir, { recursive: true })
        }
        files.push({ path: benefitPath, content: yamlDump(yamlData) })

        // Écrire les fichiers
        for (const f of files) {
          fs.writeFileSync(f.path, f.content, "utf8")
          console.log(`Fichier généré : ${f.path}`)
        }

        return res.json({
          message: "Fichiers générés localement en mode développement",
          files: files.map((f) => f.path),
          outputDir,
        })
      } catch (pathError: any) {
        console.error("Path traversal attempt or filesystem error:", pathError)
        Sentry.captureException(pathError)
        return res.status(400).json({
          message: "Erreur de sécurité : chemin invalide détecté",
        })
      }
    }

    // Mode production : logique GitHub existante
    const token = process.env.GITHUB_TOKEN!
    const githubApi = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "aides-jeunes-contribution-service",
      },
    })

    const mainBranch = "main"
    const newBranch = `contribution/${benefitSlug}`

    // get main ref sha
    const refResp = await githubApi.get(
      `/repos/${owner}/${repository_name}/git/ref/heads/${mainBranch}`,
    )
    const baseSha = refResp.data.object.sha

    // create branch
    await githubApi.post(`/repos/${owner}/${repository_name}/git/refs`, {
      ref: `refs/heads/${newBranch}`,
      sha: baseSha,
    })

    // check institution existence
    const institutionPath = `data/institutions/${institutionSlug}.yml`
    const institutionExists = await checkInstitutionExists(
      institutionSlug,
      false,
      githubApi,
    )

    const files: { path: string; content: string }[] = []
    if (!institutionExists) {
      const institutionFile = yamlDump({
        name: institutionName,
        type: "autre",
        imgSrc: "img/institutions/placeholder.png",
        slug: institutionSlug,
      })
      files.push({ path: institutionPath, content: institutionFile })
    }

    const yamlData: any = {
      label: title,
      institution: institutionSlug,
      description,
      conditions: sanitizeMultiline(autresConditions),
      conditions_generales: Object.entries(criteres)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`),
      profils: profils,
      link: urls.information || undefined,
      instructions: urls.guide || undefined,
      form: urls.form || undefined,
      teleservicePrefill: urls.teleservice || undefined,
      type: typeCategorie[0] || "bool",
      periodicite: periodicite[0] || "ponctuelle",
    }
    const benefitPath = `data/benefits/javascript/${benefitSlug}.yml`
    files.push({ path: benefitPath, content: yamlDump(yamlData) })

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

    const prResp = await githubApi.post(
      `/repos/${owner}/${repository_name}/pulls`,
      {
        title: `[Contribution simplifiée] Ajout aide ${title}`,
        head: newBranch,
        base: mainBranch,
        body: `Contribution proposée par **${contributorName}**\n\nInstitution: ${institutionName}\nType: ${typeCategorie.join(", ")}\nPériodicité: ${periodicite.join(", ")}\n\nDescription:\n${description}\n\nConditions particulières:\n${Object.entries(
          req.body.criteres || {},
        )
          .filter(([, v]) => v)
          .map(([k, v]) => `- ${k}: ${v}`)
          .join(
            "\n",
          )}${autresConditions ? `\n\nAutres conditions:\n${autresConditions}` : ""}\n\nProfils: ${profils.join(", ")}\n\nURLs:\n${Object.entries(
          urls,
        )
          .filter(([, v]) => v)
          .map(([, v]) => `- ${v}`)
          .join("\n")}`,
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
