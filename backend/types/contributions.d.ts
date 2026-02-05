export type BenefitContributionBody = {
  contributorName: string
  contributorEmail?: string
  institutionName: string
  institutionSlug: string
  title: string
  description: string
  criteres?: Record<string, string>
  profils?: string[]
  urls?: {
    information?: string
    guide?: string
    form?: string
    teleservice?: string
  }
  typeCategorie?: string[]
  periodicite?: string
  autresConditions?: string
}

export type InstitutionContributionBody = {
  contributorEmail: string
  institutionName: string
  institutionType: string
  codeInsee?: string
  codeSiren?: string
  logoUrl?: string
  logoBase64?: string
}
