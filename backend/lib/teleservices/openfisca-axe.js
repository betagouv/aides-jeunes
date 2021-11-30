const Promise = require("bluebird")
const openfisca = Promise.promisifyAll(require("../openfisca"))
const request = Promise.promisify(
  openfisca.sendToOpenfisca("calculate", (s) => s)
)

const { base, build, extractResults } = require("../openfisca/bulk")
const benefits = require("../../../data/all")

function OpenFiscaAxe(situation) {
  this.situation = situation
}

OpenFiscaAxe.prototype.toInternal = function () {
  return {}
}
const benefitIds = ["irpp"]
benefits.forEach((_, benefitId) => {
  benefitIds.push(benefitId)
})
const variable = "salaire_net"

function fetch(s) {
  const fs = Promise.promisifyAll(require("fs"))
  const os = require("os")
  const path = require("path")
  const cachePath = path.join(
    os.tmpdir(),
    "situation_" + s.source._id + "_" + base
  )
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

module.exports = OpenFiscaAxe
