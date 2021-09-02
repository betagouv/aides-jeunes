var cors = require("cors")
const AuthContribution = require("../controllers/contributions")
const { urlencoded } = require("body-parser")

const ALLOWED_URLS = [
  "https://test-contribution.netlify.app",
  "https://contribuer-aides-jeunes.netlify.app",
]

module.exports = function (api) {
  // parse application/x-www-form-urlencoded
  api.use(urlencoded({ extended: false }))
  api
    .route("/contribution/auth")
    .post(cors({ origin: ALLOWED_URLS }), AuthContribution.verify)
}
