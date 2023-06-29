export interface benefitLink {
  link: string
  type: string
  status?: number
  ok?: boolean
}

export interface benefitData {
  id: string
  label: string
  institution: string
  priority: number
  links: benefitLink[]
  editLink: string
  errors: benefitLink[]
}

interface GristData {
  id: number
  keep?: boolean
  fields: {
    Priorite: string
    Date_d_ajout: number
    Dans_une_PR: boolean
    Corrige: boolean
    Date_PR: number
    Date_correction: number
    PR: string
    Date_erreur_de_detection: string
    Aide: string
    Type: string
    Lien: string
    Erreur: number
    Erreur_de_detection: boolean
  }
}

interface GristResponse {
  records: GristData[]
}
