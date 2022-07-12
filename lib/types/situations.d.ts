export interface situationsLayout {
  dateDeValeur: string
  version: number
  demandeur: any //generateDefaultIndividu("demandeur", "demandeur"),
  enfants: any
  famille: any
  menage: {
    aide_logement_date_pret_conventionne: string
  }
  parents: any
}
