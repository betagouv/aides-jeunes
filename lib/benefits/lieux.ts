import axios from "axios"
export function normalize(lieu) {
  const { url, horaires, adresses } = lieu.properties
  const normalizedLieu = { ...lieu.properties }

  if (url === "https://www.maisondeservicesaupublic.fr") {
    delete normalizedLieu.url
  }

  if (horaires) {
    const mapping = {
      lundi: 1,
      mardi: 2,
      mercredi: 3,
      jeudi: 4,
      vendredi: 5,
      samedi: 6,
      dimanche: 7,
    }
    normalizedLieu.horaires = horaires.sort(
      (a, b) => mapping[a.du.toLowerCase()] - mapping[b.du.toLowerCase()]
    )
  }

  normalizedLieu.adresse =
    adresses.find((adress) => adress.type === "physique") ||
    adresses.find((adress) => adress.type === "géopostale") ||
    adresses[0]

  return normalizedLieu
}

export function getBenefitLieuxTypes(benefit: any): string[] {
  const lieuxTypes = benefit.lieuxTypes || benefit.institution.lieuxTypes || []
  return lieuxTypes
}

export async function fetchLieux(
  depcom: string,
  types: string[]
): Promise<any[]> {
  const url = `https://etablissements-publics.api.gouv.fr/v3/communes/${depcom}/${types.join(
    "+"
  )}`
  const response = await axios.get(url)
  const lieux = response.data.features.map(normalize)
  return lieux
}
