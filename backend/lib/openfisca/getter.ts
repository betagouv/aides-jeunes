import axios from "axios"
import config from "../../config/index.js"

// Sans délai d'abandon, un OpenFisca saturé qui accepte la connexion sans
// répondre laisse ces requêtes en attente indéfiniment.
const requestOptions = { timeout: config.openfiscaTimeout }

function get(item: string, callback: (any) => void): Promise<void> {
  return axios
    .get(`${config.openfiscaURL}${item}`, requestOptions)
    .then((response) => response.data)
    .then(function (result) {
      callback(result)
    })
}

async function getPromise(item): Promise<any> {
  return axios
    .get(`${config.openfiscaURL}${item}`, requestOptions)
    .then((response) => response.data)
    .catch((error) => {
      // Le message d'axios porte l'adresse interne du service, et cette erreur
      // atteint désormais le client sur les routes /api/openfisca/*.
      throw Object.assign(
        new Error("OF maybe offline - Failed to fetch data"),
        {
          code: error.code,
        },
      )
    })
}

export default {
  get,
  getPromise,
}
