import { Velo } from "../enums/velo.js"
export interface Individu {
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
  service_civique?: boolean
  scolarite?: string
  _contrat_alternant?: string
  stagiaire?: boolean
  groupe_specialites_formation?: any
  mention_baccalaureat?: string
  handicap?: boolean
  taux_incapacite?: number
  _interetsAidesVelo?: Velo[]
}

export interface IndividuGenerator {
  [id: string]: {
    src?: string
    // eslint-disable-next-line @typescript-eslint/ban-types
    fn: Function
  }
}
