import { individuLayout } from "./individu"

export interface situationsLayout {
  dateDeValeur: number
  version?: number
  demandeur?: individuLayout
  enfants?: any[] | null
  famille?: any
  menage?: {
    _locationType?: string
    _primoAccedant?: boolean
    aide_logement_date_pret_conventionne: string
    _departement?: string
    depcom?: string
    _epci?: string
    _region?: string
    statut_occupation_logement?: string
    _logementType?: string
  }
  parents?: any
  conjoint?: any
  answers?: any
  patrimoine?: any
  ressourcesFiscales?: any
}
