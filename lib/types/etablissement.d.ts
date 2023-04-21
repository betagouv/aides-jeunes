export default interface Etablissement {
  id: string
  nom: string
  url?: string
  telephone?: string
  adresse?: {
    lignes: string[]
    codePostal: string
    commune: string
  }
  horaires?: {
    du: string
    au: string
    heures: {
      de: string
      a: string
    }[]
  }[]
}
