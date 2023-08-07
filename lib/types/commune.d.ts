export interface CommuneInterface {
  code: string
  nom: string
  typeLiaison: number
  zone: string
  arrondissement: string
  departement: string
  region: string
  type: string
  rangChefLieu: number
  siren: string
  codesPostaux?: string[] | null
  population: number
  codeCommune: string
  nomCommune: string
  epci: string
  epciType: string
}
