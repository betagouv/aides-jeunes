const mongoose = require("mongoose")
const utils = require("../lib/utils")
const openfisca = require("../lib/openfisca")
const benefits = require("../../data/all")
const mesAides = require("../../lib/benefits/compute")
const { generateSituation } = require("../../lib/situations")
const {
  ANSWER_ENTITY_NAMES,
  ANSWER_FIELD_NAMES,
  ANSWER_BASIC_IDS,
} = require("../lib/definitions")

const computeAides = mesAides.computeAides.bind(benefits)

const answer = {
  entityName: {
    required: true,
    type: String,
    enum: ANSWER_ENTITY_NAMES,
  },
  fieldName: {
    type: String,
    enum: ANSWER_FIELD_NAMES,
  },
  id: {
    type: String,
    validate: {
      validator(value) {
        return ANSWER_BASIC_IDS.includes(value) || value.match(/^enfant_\d+$/)
      },
    },
  },
  value: Object,
}

const answers = {
  all: { type: [answer], required: true },
  current: { type: [answer], required: true },
}

const SimulationSchema = new mongoose.Schema(
  {
    answers: { type: answers, required: true },
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

SimulationSchema.statics.cookiePrefix = "simulation_"
SimulationSchema.virtual("cookieName").get(function () {
  return `${SimulationSchema.statics.cookiePrefix}${this._id}`
})
SimulationSchema.virtual("returnPath").get(function () {
  return `/simulation/resultats?situationId=${this._id}`
})

SimulationSchema.methods.isAccessible = function (keychain) {
  return (
    ["demo", "investigation", "test"].includes(this.status) ||
    keychain?.[this.cookieName] === this.token ||
    keychain?.token === this.token
  )
}
SimulationSchema.pre("save", function (next) {
  if (!this.isNew) {
    return next()
  }
  const simulation = this
  utils
    .generateToken()
    .then(function (token) {
      simulation.token = token
    })
    .then(next)
    .catch(next)
})
SimulationSchema.methods.compute = function () {
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

mongoose.model("Simulation", SimulationSchema)
