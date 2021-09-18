var cors = require("cors")
const AuthContribution = require("../controllers/contributions")
const { urlencoded } = require("body-parser")
const config = require("../config/index")

module.exports = function (api) {
  // parse application/x-www-form-urlencoded
  api.use(urlencoded({ extended: false }))
  api
    .route("/contribution/auth")
    .post(
      cors({ origin: config.netlifyContributionURL }),
      AuthContribution.verify
    )
}
