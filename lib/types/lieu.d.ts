export interface LieuProperties {
  id: string
  nom: string
  telephone: string
  url: string
  pivotLocal: string
  horaires: {
    du: string
    au: string
    heures: {
      de: string
      a: string
    }[]
  }[]
  adresse: {
    codePostal: string
    commune: string
    lignes: string[]
  }
}
