export interface BenefitLink {
  link: string
  type: string
  status?: number
  ok?: boolean
}

export interface BenefitLinkProperties {
  id: string
  label: string
  institution: string
  priority: number
  links: BenefitLink[]
}

interface GristFieldsVeilleLink {
  Priorite: string
  Date_d_ajout: number
  Dans_une_PR: boolean
  Corrige: boolean
  Date_PR: number
  Date_correction: number
  PR: string
  Date_erreur_de_detection: string
  Aide: string
  Type: string
  Lien: string
  Erreur: number
  Erreur_de_detection: boolean
}

interface GristFieldsCovoiturage {
  collectivite: string
  derniere_maj: number
  email: string
  type: string
  code_SIRET: number
  premiere_campagne: string
  budget_incitations: number | null
  date_debut: number
  date_fin: number
  conducteur_montant_max_par_passager: number
  conducteur_montant_max_par_mois: number
  conducteur_montant_min_par_passager: number
  conducteur_trajets_max_par_mois: number
  passager_trajets_max_par_mois: number
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
  fields: GristFieldsCovoiturage | GristFieldsVeilleLink
}

interface GristResponse {
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
