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
      (a, b) => mapping[a.du.toLowerCase()] - mapping[b.du.toLowerCase()],
    )
  }

  normalizedLieu.adresse =
    adresses.find((adress) => adress.type === "physique") ||
    adresses.find((adress) => adress.type === "géopostale") ||
    adresses[0]

  return normalizedLieu
}

export function normalizeDataInclusion(structure: any) {
  return {
    id: structure.id,
    nom: structure.nom,
    telephone: structure.telephone,
    url: structure.site_web,
    pivotLocal: "ccas",
    horaires: [], // Data Inclusion API doesn't seem to provide structured hours in the example
    adresse: {
      codePostal: structure.code_postal,
      commune: structure.commune,
      lignes: [structure.adresse, structure.complement_adresse].filter(Boolean),
    },
  }
}

export function getBenefitLieuxTypes(benefit: any): string[] {
  return benefit.lieuxTypes || benefit.institution.lieuxTypes || []
}

export async function fetchLieux(
  depcom: string,
  types: string[],
): Promise<any[]> {
  const ccasIndex = types.indexOf("ccas")
  let ccasLieux: any[] = []

  if (ccasIndex !== -1) {
    // CCAS are fetched from data-inclusion API (etablissements-publics API doesn't support them)
    try {
      const response = await axios.get(`/api/lieux/ccas/${depcom}`)
      if (response.data && response.data.items) {
        ccasLieux = response.data.items.map(normalizeDataInclusion)
      }
    } catch (e) {
      console.error("Failed to fetch CCAS lieux", e)
    }
    // Remove ccas from types for the other call
    types = types.filter((t) => t !== "ccas")
  }

  let otherLieux: any[] = []
  if (types.length > 0) {
    const url = `https://etablissements-publics.api.gouv.fr/v3/communes/${depcom}/${types.join(
      "+",
    )}`
    try {
      const response = await axios.get(url)
      otherLieux = response.data.features.map(normalize)
    } catch (e) {
      console.error("Failed to fetch other lieux", e)
    }
  }

  return [...ccasLieux, ...otherLieux]
}
