interface GristFields {
  collectivite: string
  derniere_maj: number
  email: string
  type: string
  code_SIRET: number
  premiere_campagne: string
  budget_incitations: number | null
  date_debut: number
  date_fin: number
  conducteur_montant_max_par_passager: string
  conducteur_montant_max_par_mois: string
  conducteur_montant_min_par_passager: string
  conducteur_trajets_max_par_mois: number
  passager_trajets_max_par_mois: string
  passager_gratuite: string
  passager_eligible_gratuite: string
  passager_reduction_ticket: string
  passager_eligibilite_reduction: string
  passager_montant_ticket: string
  zone_sens_des_trajets: string
  zone_exclusion: string
  si_zone_exclue_liste: string
  autre_exclusion: string
  trajet_longueur_min: number
  trajet_longueur_max: number
  trajet_classe_de_preuve: string
  operateurs: string
  autres_informations: string
  zone_sens_des_trajets_litteral: string
  lien_page_collectivite: string
  nom_plateforme: string
  institution: string
  conducteur_trajets_max_par_jour: number
  passager_trajets_max_par_jour: number
  politique_incitative_aom: string
  code_SIREN: string
  Expire: string
}

interface GristRecord {
  id: number
  fields: GristFields
}

export interface GristIncitationsCovoiturageResponse {
  records: GristRecord[]
}

interface GristData {
  id?: number
  fields: Partial<GristFields>
}

interface GristOperation {
  type: string
  data: GristData
}
