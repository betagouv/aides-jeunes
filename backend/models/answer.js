const mongoose = require("mongoose")
const utils = require("../lib/utils")
const openfisca = require("../lib/openfisca")
const benefits = require("../../data/all")
const mesAides = require("../../lib/benefits/compute")
const { generateSituation } = require("../../lib/situations")
const { ANSWER_FIELD_NAMES } = require("../lib/definitions")

const computeAides = mesAides.computeAides.bind(benefits)

const answer = {
  entityName: {
    required: true,
    type: String,
    enum: ["individu", "enfants", "famille", "parents", "menage"],
  },
  fieldName: {
    type: String,
    enum: ANSWER_FIELD_NAMES,
  },
  id: String,
  value: {
    type: Object,
    required: true,
  },
}

const AnswerSchema = new mongoose.Schema(
  {
    all: { type: [answer], required: true },
    current: { type: [answer], required: true },
    enfants: [Number],
    ressourcesFiscales: Object,
    patrimoine: Object,
    dateDeValeur: {
      type: Date,
      required: true,
    },
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
    keychain?.[this.cookieName] === this.token
  )
}
AnswerSchema.pre("save", function (next) {
  if (!this.isNew) {
    return next()
  }
  const answers = this
  utils
    .generateToken()
    .then(function (token) {
      answers.token = token
    })
    .then(next)
    .catch(next)
})
AnswerSchema.methods.compute = function () {
  const situation = generateSituation(this)
  return new Promise(function (resolve, reject) {
    openfisca.calculate(situation, function (err, openfiscaResponse) {
      if (err) {
        return reject(err)
      }

      const aides = computeAides(situation, this._id, openfiscaResponse, false)
      resolve(aides)
    })
  })
}

mongoose.model("Answer", AnswerSchema)
