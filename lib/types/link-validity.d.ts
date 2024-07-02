export interface BenefitLink {
  link: string
  type: string
  status?: number
  ok?: boolean
}

export interface BenefitLinkProperties {
  id: string
  label: string
  institution: string
  priority: number
  links: BenefitLink[]
}

interface GristFields {
  Priorite: string
  Date_d_ajout: number
  Dans_une_PR: boolean
  Corrige: boolean
  Date_PR: number
  Date_correction: Date
  PR: string
  Date_erreur_de_detection: string
  Aide: string
  Type: string
  Lien: string
  Erreur: number
  Erreur_de_detection: boolean
}

interface GristRecord {
  id: number
  fields: GristFields
}

interface GristLinkValidityResponse {
  records: GristRecord[]
}

interface GristData {
  id?: number
  fields: Partial<GristFields>
}

interface GristOperation {
  type: string
  data: GristData
}
