import mongoose from "mongoose"
import * as Sentry from "@sentry/node"
import config from "../config/index.js"
import utils from "../lib/utils.js"
import openfisca from "../lib/openfisca/index.js"
import {
  getComputeSignature,
  getSituationSignature,
} from "../lib/openfisca/compute-signature.js"
import {
  areParametersLoaded,
  getParametersAsync,
} from "../lib/openfisca/parameters.js"
import {
  serializeResults,
  deserializeResults,
} from "../lib/computed-results.js"
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

// Rafales de requêtes sur un même document — restauration d'onglet, iframes
// rechargées — : un seul calcul est mené, les appelants concurrents partagent
// son résultat. La clé porte la signature, donc la situation calculée.
const inFlightComputations = new Map<string, Promise<any>>()

function readCachedResults(simulation, signature: string, id: string) {
  const cached = simulation.computedResults

  if (!cached || cached.signature !== signature) {
    return null
  }

  // Le TTL borne la dérive que la signature ne voit pas : une correction de la
  // logique JavaScript ne s'accompagne pas toujours d'un changement de version.
  const computedAt = cached.computedAt?.getTime?.()
  if (!computedAt || Date.now() - computedAt >= config.computedResultsTtlMs) {
    return null
  }

  try {
    return deserializeResults(cached.results, id)
  } catch (error) {
    console.error(
      `Unable to read the cached computed results of simulation ${id}`,
      error,
    )
    Sentry.captureException(error)
    return null
  }
}

async function computeAndCache(
  simulation,
  situation,
  id,
  showPrivate,
  signature,
) {
  const openfiscaResponse = await calculate(situation)
  const aides = computeBenefits(situation, id, openfiscaResponse, showPrivate)

  // Sans paramètres OpenFisca, `getParameters` retombe sur des constantes
  // figées et les légendes produites sont fausses : le résultat est servi, mais
  // il ne doit pas être gravé en base.
  if (signature && areParametersLoaded()) {
    try {
      // `updateOne` plutôt que `save` : le hook `pre("save")` régénère le token
      // et une écriture complète du document exposerait à des conflits de
      // version sur une simple lecture des résultats.
      await (simulation.constructor as SimulationModel).updateOne(
        // Un document anonymisé ne repasse jamais par le nettoyage : la
        // condition de statut vit dans le filtre pour que l'écriture ne puisse
        // pas y réinjecter des montants dérivés de réponses personnelles.
        { _id: simulation._id, status: { $ne: SimulationStatus.Anonymized } },
        {
          $set: {
            computedResults: {
              signature,
              computedAt: new Date(),
              results: serializeResults(aides),
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
}

SimulationSchema.method("compute", async function (options = {}) {
  const { showPrivate = false, cache = true } = options
  const situation = this.getSituation()
  const id = String(this._id)

  // Les paramètres alimentent les légendes des aides : les charger avant le
  // calcul évite d'y inscrire les constantes de repli.
  try {
    await getParametersAsync(situation.dateDeValeur)
  } catch (error) {
    console.error(
      `Unable to load the OpenFisca parameters before computing simulation ${id}`,
      error,
    )
    Sentry.captureException(error)
  }

  // `showPrivate` produit un résultat enrichi réservé aux outils internes ;
  // `cache: false` sert les appelants qui modifient le document en mémoire
  // avant de calculer et dont le résultat ne décrit pas le document persisté.
  // Ni l'un ni l'autre ne lit ou n'alimente le cache.
  const context = showPrivate || !cache ? null : getComputeSignature()
  // La situation entre dans la clé de cache : une migration appliquée à la
  // volée peut modifier le document en mémoire sans être persistée.
  const signature = context
    ? `${context}|${getSituationSignature(situation)}`
    : null

  if (!signature) {
    return computeAndCache(this, situation, id, showPrivate, null)
  }

  const cached = readCachedResults(this, signature, id)
  if (cached) {
    return cached
  }

  const key = `${id}|${signature}`
  const pending = inFlightComputations.get(key)
  if (pending) {
    return pending
  }

  const computation = computeAndCache(
    this,
    situation,
    id,
    showPrivate,
    signature,
  ).finally(() => {
    inFlightComputations.delete(key)
  })
  inFlightComputations.set(key, computation)

  return computation
})

export default mongoose.model<Simulation, SimulationModel>(
  "Simulation",
  SimulationSchema,
)
