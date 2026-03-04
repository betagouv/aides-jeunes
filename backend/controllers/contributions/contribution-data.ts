import type {
  BenefitContributionBody,
  InstitutionContributionBody,
  InstitutionData,
} from "../../../lib/types/contributions.d.js"
import { normalizeString } from "../../../lib/utils.js"

type ValidationError = {
  message: string
  missingFields: string[]
}

export function parseDataUrl(
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

export function getImageExtension(mimeType: string): string | undefined {
  const mapping: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }
  return mapping[mimeType]
}

export function slugify(input: string) {
  return normalizeString(input)
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

export function isValidSlug(value?: string) {
  if (!value || typeof value !== "string") return false
  if (value.includes("..") || value.includes("/") || value.includes("\\")) {
    return false
  }
  return /^[a-z0-9_-]+$/.test(value)
}

export function sanitizeMultiline(str?: string): string[] {
  if (!str) return []
  return str
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length)
}

export function validateRequiredBenefitFields(
  body: BenefitContributionBody,
): string | null {
  const { institutionName, institutionSlug, title, description } = body

  if (!institutionName || !institutionSlug || !title || !description) {
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

export function validateRequiredInstitutionFields(
  body: InstitutionContributionBody,
): ValidationError | null {
  const missingFields: string[] = []

  if (!body.contributorEmail) missingFields.push("contributorEmail")
  if (!body.institutionName) missingFields.push("institutionName")
  if (!body.institutionType) missingFields.push("institutionType")

  if (missingFields.length > 0) {
    return {
      message: "Champs obligatoires manquants",
      missingFields,
    }
  }

  if (!body.codeInsee && !body.codeSiren) {
    return {
      message: "Au moins un code (INSEE ou SIREN) est requis",
      missingFields: ["codeInsee", "codeSiren"],
    }
  }

  return null
}

export function buildBenefitData(body: BenefitContributionBody) {
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
      .filter(([, value]) => value)
      .map(([key, value]) => key + ": " + value),
    profils: profils || [],
    link: urls?.information || undefined,
    instructions: urls?.guide || undefined,
    form: urls?.form || undefined,
    teleservicePrefill: urls?.teleservice || undefined,
    type: typeCategorie?.[0] || "bool",
    periodicite: periodicite || "ponctuelle",
  }
}

export function createDefaultInstitutionData(
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

export function buildBenefitPullRequestBody(
  body: BenefitContributionBody,
): string {
  const { title, institutionName, typeCategorie, periodicite, description } =
    body

  const sections = [
    `Aide : **${title}**`,
    `Institution: ${institutionName}`,
    `Type: ${typeCategorie}`,
    `Périodicité: ${periodicite}`,
    `Description: ${description}`,
  ]
  return sections.join("\n")
}

export function buildInstitutionPullRequestBody(params: {
  institutionName: string
  institutionType: string
  codeInsee?: string
  codeSiren?: string
}): string {
  const { institutionName, institutionType, codeInsee, codeSiren } = params

  return [
    `Institution: **${institutionName}**`,
    `Type: ${institutionType}`,
    codeInsee && `Code INSEE: ${codeInsee}`,
    codeSiren && `Code SIREN: ${codeSiren}`,
  ]
    .filter(Boolean)
    .join("\n")
}

export function buildInstitutionData(params: {
  institutionName: string
  institutionType: string
  codeInsee?: string
  codeSiren?: string
}): InstitutionData {
  const { institutionName, institutionType, codeInsee, codeSiren } = params
  const institutionData: InstitutionData = {
    name: institutionName,
    type: institutionType,
  }

  if (codeInsee) {
    institutionData.code_insee = codeInsee
  }

  if (codeSiren) {
    institutionData.code_siren = codeSiren
  }

  return institutionData
}
