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
      throw new Error(
        `OF maybe offline - Failed to fetch data : ${error.message}`,
      )
    })
}

export default {
  get,
  getPromise,
}
