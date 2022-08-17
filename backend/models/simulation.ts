import mongoose from "mongoose"
import utils from "../lib/utils.js"
import openfisca from "../lib/openfisca/index.js"
import benefits from "../../data/all.js"
import { computeAides } from "../../lib/benefits/compute.js"
import { generateSituation } from "../../lib/situations.js"
import { version } from "../../lib/simulation.js"
import {
  ANSWER_ENTITY_NAMES,
  ANSWER_FIELD_NAMES,
  ANSWER_BASIC_IDS,
} from "../lib/definitions.js"

import { MongooseLayout, SimulationModel } from "../types/models.js"

const computeBenefits = computeAides.bind(benefits)

const answer = {
  entityName: {
    enum: ANSWER_ENTITY_NAMES,
    required: true,
    type: String,
  },
  fieldName: {
    enum: ANSWER_FIELD_NAMES,
    type: String,
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
  all: { required: true, type: [answer] },
  current: { required: true, type: [answer] },
}

const SimulationSchema = new mongoose.Schema<MongooseLayout, SimulationModel>(
  {
    abtesting: Object,
    answers: { required: true, type: answers },
    createdAt: { default: Date.now, type: Date },
    dateDeValeur: {
      required: true,
      type: Date,
    },
    enfants: [Number],
    modifiedFrom: String,
    patrimoine: Object,
    ressourcesFiscales: Object,
    status: {
      default: "new",
      enum: ["new", "test", "investigation", "anonymized"],
      type: String,
    },
    teleservice: String,
    token: String,
    version: { default: version, type: Number },
  },
  { minimize: false }
)

SimulationSchema.static("cookiePrefix", (): string => {
  return "simulation_"
})
SimulationSchema.virtual("cookieName").get(function () {
  return `simulation_${this._id}`
})
SimulationSchema.virtual("returnPath").get(function () {
  return `/simulation/resultats?situationId=${this._id}`
})

SimulationSchema.method("isAccessible", function (keychain) {
  return (
    ["demo", "investigation", "test"].includes(this.status) ||
    keychain?.[this.cookieName] === this.token ||
    keychain?.token === this.token
  )
})
SimulationSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next()
  }
  try {
    const simulation = this
    simulation.token = await utils.generateToken()
    next()
  } catch {
    next()
  }
})

SimulationSchema.method("getSituation", function () {
  return generateSituation(this)
})

SimulationSchema.method("compute", function () {
  const situation = this.getSituation()
  const id = this._id
  return new Promise(function (resolve, reject) {
    openfisca.calculate(situation, function (err, openfiscaResponse) {
      if (err) {
        return reject(err)
      }

      const aides = computeBenefits(situation, id, openfiscaResponse, false)
      resolve(aides)
    })
  })
})

export default mongoose.model<MongooseLayout, SimulationModel>(
  "Simulation",
  SimulationSchema
)
