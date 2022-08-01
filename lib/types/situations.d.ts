import { individuLayout } from "./individu"

export interface situationsLayout {
  dateDeValeur: number
  version?: number
  demandeur?: individuLayout
  enfants?: any[] | null
  famille?: any
  menage?: {
    aide_logement_date_pret_conventionne: string
  }
  parents?: any
  conjoint?: any
  answers?: any
  patrimoine?: any
  ressourcesFiscales?: any
}
