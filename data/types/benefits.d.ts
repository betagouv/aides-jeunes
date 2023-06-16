// extends "Aide" type defined in "aides-velo" package
type Aide = {
  title: string
  description: string
  url: string
  amount?: number
}

export interface benefitLayout {
  id: string
  label: string
  type?: string
  montant?: number
  mock?: boolean
}

export interface benefitVeloLayout extends Aide {
  collectivity: {
    kind: string
    value: string
    code?: string
  }
  institution?: string
  discard?: boolean
  id: string

  source?: string
  url?: string
  link?: string
}
