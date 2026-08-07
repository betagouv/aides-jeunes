import axios from "axios"
import config from "../../config/index.js"

function get(item: string, callback: (any) => void): Promise<void> {
  return axios
    .get(`${config.openfiscaURL}${item}`)
    .then((response) => response.data)
    .then(function (result) {
      callback(result)
    })
}

async function getPromise(item): Promise<any> {
  return axios
    .get(`${config.openfiscaURL}${item}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(
        `OF maybe offline - Failed to fetch data : ${error.message}`,
      )
    })
}

const COUNTRY_PACKAGE_METADATA_TIMEOUT_MS = 5000

export interface CountryPackageMetadata {
  name: string
  version: string
}

// La racine de la Web API OpenFisca répond 300 avec un simple message de
// bienvenue : les métadonnées du paquet pays ne sont exposées que par les
// en-têtes `Country-Package` et `Country-Package-Version`.
async function getCountryPackageMetadata(): Promise<CountryPackageMetadata> {
  const response = await axios.get(`${config.openfiscaURL}/`, {
    timeout: COUNTRY_PACKAGE_METADATA_TIMEOUT_MS,
    validateStatus: (status) => status >= 200 && status < 400,
  })

  const name = response.headers["country-package"]
  const version = response.headers["country-package-version"]

  if (!name || !version) {
    throw new Error(
      `Country package metadata missing from ${config.openfiscaURL}/ response headers (status ${response.status})`,
    )
  }

  return { name, version }
}

export default {
  get,
  getPromise,
  getCountryPackageMetadata,
}
