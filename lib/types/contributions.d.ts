export type ContributionType = "benefit" | "institution"

export interface BenefitContributionBody {
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

export interface InstitutionContributionBody {
  contributorName: string
  contributorEmail: string
  institutionName: string
  institutionType: string
  codeInsee?: string
  codeSiren?: string
  logoUrl?: string
  logoBase64?: string
}

export interface InstitutionData {
  name: string
  type: string
  code_insee?: string
  code_siren?: string
  imgSrc?: string
}

export interface ContributionRecord {
  type: ContributionType
  contributorName?: string
  contributorEmail?: string
  pullRequestUrl: string
}

export interface Contribution {
  type: ContributionType
  contributorName?: string
  contributorEmail?: string
  pullRequestUrl?: string
  createdAt?: Date
}
