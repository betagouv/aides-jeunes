export interface benefitLayout {
  label: string
  montant: any
}

// extends "Aide" type defined in "aides-velo" package
export interface benefitVeloLayout extends Aide {
  collectivity?: {
    id: string
    kind: string
    value: string
    code: string
  }
  institution?: string
  discard?: boolean
  description?: string
  title?: string
  id?: string
  url?: string
  source?: string
}
