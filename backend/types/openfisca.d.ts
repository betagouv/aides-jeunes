import { individuLayout } from "../../lib/types/individu"
import { situationsLayout } from "../../lib/types/situations"

export interface openfiscaMappingLayout {
  individus: individuLayout[]
  familles?: familleLayout
  foyers_fiscaux: foyersFiscauxLayout
  menages: menageLayout
}

export interface familleLayout {
  _: any
  parents?: situationsLayout
}

export interface menageLayout {
  _: any
  parents?: any
}

export interface foyersFiscauxLayout {
  _: {
    declarants: string[]
    personnes_a_charge: individuLayout[]
    rfr?: any
  }
}
