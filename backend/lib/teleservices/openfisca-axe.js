import Promise from "bluebird"
import { createRequire } from "module"
const require = createRequire(import.meta.url)

import openfiscaImport from "../openfisca/index.js"
const openfisca = Promise.promisifyAll(openfiscaImport)
const request = Promise.promisify(
  openfisca.sendToOpenfisca("calculate", (s) => s)
)

import bulk from "../openfisca/bulk/index.js"
const { base, build, extractResults } = bulk
import benefits from "../../../data/all.js"

function OpenFiscaAxe(simulation) {
  this.situation = simulation.getSituation()
}

OpenFiscaAxe.prototype.toInternal = function () {
  return {}
}
const benefitIds = ["irpp"]
benefits.all.forEach((benefit) => {
  benefitIds.push(benefit.id)
})
const variable = "salaire_net"

function fetch(s) {
  const fs = Promise.promisifyAll(require("fs"))
  const os = require("os")
  const path = require("path")
  const cachePath = path.join(os.tmpdir(), `simulation_${s.source._id}_${base}`)
  /* eslint-disable */
  if (false && fs.existsSync(cachePath)) {
    // eslint-disable-line no-constant-condition
    return fs
      .readFileAsync(cachePath)
      .then((data) => {
        s.response = JSON.parse(data)
      })
      .then(() => s)
  } else {
    return request(s.request)
      .then((payload) => {
        s.response = payload
        return fs.writeFileAsync(cachePath, JSON.stringify(payload, null, 2))
      })
      .then(() => s)
  }
}

OpenFiscaAxe.prototype.toExternal = function () {
  const s = {
    source: this.situation,
    request: build(this.situation, variable),
  }

  return fetch(s).then((s) => {
    const results = extractResults(s, benefitIds)
    const jsonResults = Object.keys(results).map((k) => {
      return Object.assign({ name: k }, results[k], { [variable]: parseInt(k) })
    })
    return {
      names: [variable].concat(benefitIds),
      data: jsonResults,
    }
  })
}

export default OpenFiscaAxe
