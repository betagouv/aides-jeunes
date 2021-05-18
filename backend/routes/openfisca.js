var openfisca = require("../lib/openfisca")

module.exports = function (api) {
  api.route("/openfisca/parameters/:parameterId").get((req, res) => {
    return openfisca.get(`/parameter/${req.params.parameterId}`, (payload) =>
      res.send(payload)
    )
  })

  api.route("/openfisca/variables").get((req, res) => {
    return openfisca.get("/variables", (payload) =>
      res.send(Object.keys(payload))
    )
  })
}
