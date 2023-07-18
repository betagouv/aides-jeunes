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
}

interface GristFields {
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

interface GristData {
  id: number
  fields: GristFields
}

interface GristOperation {
  type: string
  record: {
    id?: number
    fields: Partial<GristFields>
  }
}
