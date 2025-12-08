import express from "express"
import axios from "axios"
import { dump as yamlDump } from "js-yaml"
import fs from "fs"
import path from "path"
import { rateLimit } from "express-rate-limit"

const router = express.Router()
router.use(express.json({ limit: "512kb" }))

function slugify(input: string): string {
  const normalized = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

function sanitizeMultiline(str?: string) {
  if (!str) return []
  return str
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length)
}

const postBenefitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de requêtes. Veuillez réessayer plus tard." },
})

router.post("/benefit", postBenefitLimiter, async (req, res) => {
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
      title,
      description,
      typeCategorie = [],
      periodicite = [],
      urls = {},
      criteres = {},
      profils = [],
      autresConditions,
    } = req.body || {}

    if (!contributorName || !institutionName || !title || !description) {
      return res.status(400).json({ message: "Champs obligatoires manquants" })
    }
    if (description.length > 420) {
      return res.status(400).json({ message: "Description > 420 caractères" })
    }

    const institutionSlug = slugify(institutionName)
    const benefitSlug = `${institutionSlug}-${slugify(title)}`

    if (isDev) {
      // Mode développement : générer les fichiers localement
      const outputDir = path.join(process.cwd(), "generated-contributions")
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      const files: { path: string; content: string }[] = []

      // Vérifier si l'institution existe (simulé en dev)
      const institutionPath = path.join(
        outputDir,
        `data/institutions/${institutionSlug}.yml`,
      )
      const institutionDir = path.dirname(institutionPath)
      if (!fs.existsSync(institutionDir)) {
        fs.mkdirSync(institutionDir, { recursive: true })
      }

      const institutionExists = fs.existsSync(institutionPath)
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

      const benefitPath = path.join(
        outputDir,
        `data/benefits/javascript/${benefitSlug}.yml`,
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
    }

    // Mode production : logique GitHub existante
    const token = process.env.GITHUB_TOKEN!
    const api = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "aides-jeunes-contribution-service",
      },
    })

    const owner = "betagouv"
    const repo = "aides-jeunes"
    const mainBranch = "main"
    const newBranch = `contribution/${benefitSlug}`

    // get main ref sha
    const refResp = await api.get(
      `/repos/${owner}/${repo}/git/ref/heads/${mainBranch}`,
    )
    const baseSha = refResp.data.object.sha

    // create branch
    await api.post(`/repos/${owner}/${repo}/git/refs`, {
      ref: `refs/heads/${newBranch}`,
      sha: baseSha,
    })

    // check institution existence
    const institutionPath = `data/institutions/${institutionSlug}.yml`
    let institutionExists = true
    try {
      await api.get(
        `/repos/${owner}/${repo}/contents/${encodeURIComponent(institutionPath)}?ref=${mainBranch}`,
      )
    } catch (e: any) {
      if (e.response?.status === 404) institutionExists = false
      else throw e
    }

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
      await api.put(
        `/repos/${owner}/${repo}/contents/${encodeURIComponent(f.path)}`,
        {
          message,
          content: contentB64,
          branch: newBranch,
        },
      )
    }

    const prResp = await api.post(`/repos/${owner}/${repo}/pulls`, {
      title: `Ajout aide: ${title}`,
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
    })

    return res.json({ pullRequestUrl: prResp.data.html_url })
  } catch (err: any) {
    console.error("Contribution error", err?.response?.data || err)
    const status = err?.response?.status || 500
    const message =
      err?.response?.data?.message ||
      "Erreur serveur lors de la création de la PR"
    return res.status(status).json({ message })
  }
})

export default function contributionsRoutes(app: express.Application) {
  app.use("/contributions", router)
}
