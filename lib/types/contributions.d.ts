import {
  ContributionCategory,
  ContributionPullRequestStatus,
} from "../../lib/enums/contribution.js"

export type ContributionType =
  | ContributionCategory.BENEFIT
  | ContributionCategory.INSTITUTION

export interface BenefitContributionBody {
  contributorName?: string
  contributorEmail: string
  institutionName: string
  institutionSlug: string
  label: string
  description: string
  criteres?: Record<string, string>
  profils?: string[]
  link?: string
  instructions?: string
  form?: string
  teleservice?: string
  type?: string
  periodicite?: string
  conditions?: string
}

export interface InstitutionContributionBody {
  contributorName?: string
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

export interface Contribution {
  type: ContributionType
  contributorName?: string
  contributorEmail: string
  body: BenefitContributionBody | InstitutionContributionBody
  pullRequestStatus: ContributionPullRequestStatus
  githubError?: string
  pullRequestUrl?: string
  createdAt?: Date
}
