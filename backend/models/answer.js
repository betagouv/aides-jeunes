var mongoose = require("mongoose")
var utils = require("../lib/utils")
var openfisca = require("../lib/openfisca")
var benefits = require("../../data/js/benefits/back")
var mesAides = require("../../lib/Benefits/Compute")
const { generateSituation } = require("../../lib/situations")

var computeAides = mesAides.computeAides.bind(benefits)

const answer = {
  entityName: String,
  fieldName: String,
  id: String,
  value: Object,
}

var AnswerSchema = new mongoose.Schema(
  {
    all: [answer],
    current: [answer],
    enfants: [Number],
    ressourceFiscales: Object,
    patrimoine: Object,
    dateDeValeur: Date,
    version: Number,
    abtesting: Object,
    createdAt: { type: Date, default: Date.now },
    modifiedFrom: String,
    status: {
      type: String,
      default: "new",
      enum: ["new", "test", "investigation"],
    },
    token: String,
  },
  { minimize: false }
)

AnswerSchema.statics.cookiePrefix = "situation_"
AnswerSchema.virtual("cookieName").get(function () {
  return `${AnswerSchema.statics.cookiePrefix}${this._id}`
})
AnswerSchema.virtual("returnPath").get(function () {
  return "/simulation/resultats?situationId=" + this._id
})

AnswerSchema.methods.isAccessible = function (keychain) {
  return (
    ["demo", "investigation", "test"].includes(this.status) ||
    (keychain && keychain[this.cookieName] === this.token)
  )
}
AnswerSchema.pre("save", function (next) {
  if (!this.isNew) {
    return next()
  }
  var answers = this
  utils
    .generateToken()
    .then(function (token) {
      answers.token = token
    })
    .then(next)
    .catch(next)
})
AnswerSchema.methods.compute = function () {
  var situation = generateSituation(this)
  return new Promise(function (resolve, reject) {
    openfisca.calculate(situation, function (err, openfiscaResponse) {
      if (err) {
        return reject(err)
      }

      var aides = computeAides(situation, this._id, openfiscaResponse, false)
      resolve(aides)
    })
  })
}

mongoose.model("Answer", AnswerSchema)
