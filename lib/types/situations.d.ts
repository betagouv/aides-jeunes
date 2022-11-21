import { individuLayout } from "./individu"

export interface situationsLayout {
  dateDeValeur: number
  version?: number
  demandeur?: individuLayout
  enfants?: any[] | null
  famille?: any
  menage?: situationsMenageLayout
  parents?: any
  conjoint?: any
  answers?: any
  patrimoine?: any
  ressourcesFiscales?: any
}

export interface situationsMenageLayout {
  aide_logement_date_pret_conventionne: string
  _departement?: string
  depcom?: string
  _epci?: string
  _locationType?: string | any
  _logementType?: string | any
  _primoAccedant?: boolean | any
  _region?: string
  statut_occupation_logement?: string
}
