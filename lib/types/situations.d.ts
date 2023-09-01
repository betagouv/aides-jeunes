import { IndividuProperties } from "./individu.js"
import { Enfant } from "./enfant.d.js"

export interface situationsLayout {
  dateDeValeur: number
  version?: number
  demandeur: IndividuProperties
  enfants: Enfant[]
  famille?: any
  menage: SituationMenage
  parents?: any
  conjoint?: any
  answers?: any
  patrimoine?: any
  ressourcesFiscales?: any
}

export interface SituationMenage {
  aide_logement_date_pret_conventionne?: string
  _departement?: string
  depcom?: string
  _difficultes_acces_ou_frais_logement?: string
  _epci?: string
  _locationType?: string | any
  _logementType?: string | any
  _primoAccedant?: boolean | any
  _region?: string
  statut_occupation_logement?: string
  _codePostal?: string
}
