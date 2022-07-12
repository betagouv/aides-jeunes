import mongoose from "mongoose"
import utils from "../lib/utils.js"
import openfisca from "../lib/openfisca/index.js"
import benefits from "../../data/all.js"
import { computeAides } from "../../lib/benefits/compute.js"
import generateSituation from "../../lib/situations.js"
import { version } from "../../lib/simulation.js"
import {
  ANSWER_ENTITY_NAMES,
  ANSWER_FIELD_NAMES,
  ANSWER_BASIC_IDS,
} from "../lib/definitions.js"

const computeBenefits = computeAides.bind(benefits)

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
    version: { type: Number, default: version },
    abtesting: Object,
    createdAt: { type: Date, default: Date.now },
    modifiedFrom: String,
    status: {
      type: String,
      default: "new",
      enum: ["new", "test", "investigation", "anonymized"],
    },
    teleservice: String,
    token: String,
  },
  { minimize: false }
)

SimulationSchema.statics.cookiePrefix = () => {
  return "simulation_"
}
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

SimulationSchema.methods.getSituation = function () {
  return generateSituation(this)
}

SimulationSchema.methods.compute = function () {
  const situation = this.getSituation()
  return new Promise(function (resolve, reject) {
    openfisca.calculate(situation, function (err, openfiscaResponse) {
      if (err) {
        return reject(err)
      }

      const aides = computeBenefits(
        situation,
        this._id,
        openfiscaResponse,
        false
      )
      resolve(aides)
    })
  })
}

mongoose.model("Simulation", SimulationSchema)
