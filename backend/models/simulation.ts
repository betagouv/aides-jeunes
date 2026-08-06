import mongoose from "mongoose"
import * as Sentry from "@sentry/node"
import utils from "../lib/utils.js"
import openfisca from "../lib/openfisca/index.js"
import {
  getComputeSignature,
  getSituationSignature,
} from "../lib/openfisca/compute-signature.js"
import benefits from "../../data/all.js"
import { computeAides } from "../../lib/benefits/compute.js"
import { generateSituation } from "../../lib/situations.js"
import { version } from "../../lib/simulation.js"
import {
  ANSWER_ENTITY_NAMES,
  ANSWER_FIELD_NAMES,
  ANSWER_BASIC_IDS,
} from "../lib/definitions.js"

import { Simulation } from "../../lib/types/simulation.d.js"
import { SimulationModel } from "../types/models.js"
import { SimulationStatus } from "../../lib/enums/simulation.js"

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

const SimulationSchema = new mongoose.Schema<Simulation, SimulationModel>(
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
    abtesting: { type: Map, of: String },
    finishedAt: Date,
    createdAt: { type: Date, default: Date.now },
    hasFollowup: Boolean,
    modifiedFrom: String,
    status: {
      type: String,
      default: SimulationStatus.New,
      enum: Object.values(SimulationStatus),
    },
    teleservice: String,
    token: String,
    computedResults: {
      signature: String,
      computedAt: Date,
      results: Object,
    },
  },
  { minimize: false },
)

SimulationSchema.static("cookiePrefix", (): string => {
  return "simulation_"
})
SimulationSchema.virtual("cookieName").get(function () {
  return `simulation_${this._id}`
})

SimulationSchema.method("isAccessible", function (keychain) {
  return (
    [
      SimulationStatus.Demo,
      SimulationStatus.Investigation,
      SimulationStatus.Test,
    ].includes(this.status) ||
    keychain?.[this.cookieName] === this.token ||
    keychain?.token === this.token ||
    keychain?.authorization === `Bearer ${this.token}`
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

function calculate(situation): Promise<any> {
  return new Promise(function (resolve, reject) {
    openfisca.calculate(situation, function (err, openfiscaResponse) {
      if (err) {
        return reject(err)
      }
      resolve(openfiscaResponse)
    })
  })
}

SimulationSchema.method("compute", async function (showPrivate) {
  const situation = this.getSituation()
  const id = String(this._id)

  // `showPrivate` produit un résultat enrichi réservé aux outils internes : il
  // ne doit ni être servi depuis le cache ni l'alimenter.
  const context = showPrivate ? null : await getComputeSignature()
  // La situation entre dans la clé de cache : certains appelants modifient le
  // document en mémoire avant de calculer (scénarios du téléservice logement,
  // migrations appliquées à la volée) et ne décrivent alors plus le document
  // persisté.
  const signature = context
    ? `${context}|${getSituationSignature(situation)}`
    : null

  if (signature && this.computedResults?.signature === signature) {
    return this.computedResults.results
  }

  const openfiscaResponse = await calculate(situation)
  const aides = computeBenefits(situation, id, openfiscaResponse, showPrivate)

  if (signature) {
    try {
      // `updateOne` plutôt que `save` : le hook `pre("save")` régénère le token
      // et une écriture complète du document exposerait à des conflits de
      // version sur une simple lecture des résultats.
      await (this.constructor as SimulationModel).updateOne(
        { _id: this._id },
        {
          $set: {
            computedResults: {
              signature,
              computedAt: new Date(),
              results: aides,
            },
          },
        },
      )
    } catch (error) {
      // Le calcul a abouti : l'échec de mise en cache est signalé mais ne prive
      // pas l'appelant de son résultat.
      console.error(
        `Unable to cache the computed results of simulation ${id}`,
        error,
      )
      Sentry.captureException(error)
    }
  }

  return aides
})

export default mongoose.model<Simulation, SimulationModel>(
  "Simulation",
  SimulationSchema,
)
