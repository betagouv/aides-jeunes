export interface Enfant {
  id: string
  date_naissance: string
  enfant_a_charge: {
    [id: string]: string
  }
  nationalite: string
  _role: string
  _firstName: string
  garde_alternee: boolean
  handicap: boolean
  taux_incapacite: number
  enfant_place: boolean
  _hasRessources: boolean
  scolarite: string
  annee_etude: string
}
