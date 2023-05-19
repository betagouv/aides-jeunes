import axios from "axios"

export function normalize(etablissementFeature) {
  const etablissement = etablissementFeature.properties

  if (etablissement.url === "https://www.maisondeservicesaupublic.fr") {
    delete etablissement.url
  }

  if (etablissement.horaires) {
    const mapping = {
      lundi: 1,
      mardi: 2,
      mercredi: 3,
      jeudi: 4,
      vendredi: 5,
      samedi: 6,
      dimanche: 7,
    }
    etablissement.horaires = etablissement.horaires.sort(
      (a, b) => mapping[a.du.toLowerCase()] - mapping[b.du.toLowerCase()]
    )
  }

  etablissement.adresse = etablissement.adresses.find(
    (adress) => adress.type === "physique"
  )
  if (!etablissement.adresse) {
    etablissement.adresse = etablissement.adresses.find(
      (adress) => adress.type === "géopostale"
    )
  }
  if (!etablissement.adresse) {
    etablissement.adresse = etablissement.adresses[0]
  }

  return etablissement
}

export function hasEtablissements(benefit) {
  return (
    benefit.etablissements?.length || benefit.institution.etablissements?.length
  )
}

export function getBenefitEtablissements(benefit) {
  if (benefit.etablissements?.length) {
    return benefit.etablissements
  }
  return benefit.institution.etablissements || []
}

export async function getEtablissements(depcom, etablissementTypes) {
  const response = await axios.get(
    `https://etablissements-publics.api.gouv.fr/v3/communes/${depcom}/${etablissementTypes.join(
      "+"
    )}`
  )
  const etablissements = response.data.features
  return etablissements.map(normalize)
}
