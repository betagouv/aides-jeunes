import axios from "axios"
import config from "../../config/index.js"

function get(item: string, callback: Function): Promise<void> {
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
}

export default {
  get,
  getPromise,
}
