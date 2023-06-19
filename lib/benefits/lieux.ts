import axios from "axios"

export function normalize(lieuFeature) {
  const lieu = lieuFeature.properties

  if (lieu.url === "https://www.maisondeservicesaupublic.fr") {
    delete lieu.url
  }

  if (lieu.horaires) {
    const mapping = {
      lundi: 1,
      mardi: 2,
      mercredi: 3,
      jeudi: 4,
      vendredi: 5,
      samedi: 6,
      dimanche: 7,
    }
    lieu.horaires = lieu.horaires.sort(
      (a, b) => mapping[a.du.toLowerCase()] - mapping[b.du.toLowerCase()]
    )
  }

  lieu.adresse = lieu.adresses.find((adress) => adress.type === "physique")
  if (!lieu.adresse) {
    lieu.adresse = lieu.adresses.find((adress) => adress.type === "géopostale")
  }
  if (!lieu.adresse) {
    lieu.adresse = lieu.adresses[0]
  }

  return lieu
}

export function hasLieux(benefit) {
  return benefit.lieuxTypes?.length || benefit.institution.lieuxTypes?.length
}

export function getBenefitLieuxTypes(benefit) {
  if (benefit.lieuxTypes?.length) {
    return benefit.lieuxTypes
  } else {
    return benefit.institution.lieuxTypes || []
  }
}

export async function getLieux(depcom, types) {
  return axios
    .get(
      `https://etablissements-publics.api.gouv.fr/v3/communes/${depcom}/${types.join(
        "+"
      )}`
    )
    .then((response) => {
      return response.data.features
    })
    .then((lieux) => {
      return lieux.map(normalize)
    })
}
