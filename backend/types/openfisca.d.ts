import { individuLayout } from "../../lib/types/individu"
import { situationsLayout } from "../../lib/types/situations"

export interface openfiscaMappingLayout {
  individus: individuLayout[]
  familles?: familleLayout
  foyers_fiscaux: {
    _: {
      declarants: individuLayout[]
      personnes_a_charge: individuLayout[]
      rfr: any
    }
  }
  menages: {
    _: any
  }
}

export interface familleLayout {
  _: any
  parents?: situationsLayout
}
