export interface individuLayout {
  id: string
  annee_etude?: string
  date_naissance?: string
  enfant_a_charge: any
  nationalite: any
  _role: string
  _firstName?: string
  salaire_net?: number
  statut_marital?: string
  activite?: string
  scolarite?: string
  _contrat_alternant?: string
  stagiaire?: boolean
  groupe_specialites_formation?: any
  mention_baccalaureat?: string
  handicap?: boolean
  taux_incapacite?: number
}

export interface individuGeneratorLayout {
  [id: string]: {
    src?: string
    // eslint-disable-next-line @typescript-eslint/ban-types
    fn: Function
  }
}
