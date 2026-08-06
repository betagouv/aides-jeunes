import { createHash } from "node:crypto"
import * as Sentry from "@sentry/node"

import getter from "./getter.js"
import benefits from "../../../data/all.js"
import { version as simulationVersion } from "../../../lib/simulation.js"

const REFRESH_INTERVAL_MS = 10 * 60 * 1000
const RETRY_INTERVAL_MS = 30 * 1000

type SignatureCache = {
  value: string | null
  expiresAt: number
}

let cache: SignatureCache | undefined
let inFlight: Promise<string | null> | undefined
let benefitsDigest: string | undefined

// Sérialisation déterministe : clés triées pour ne pas dépendre de l'ordre de
// lecture du référentiel, fonctions rendues par leur source pour couvrir les
// aides dont le montant est calculé en JavaScript.
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, current) => {
    if (typeof current === "function") {
      return current.toString()
    }

    if (current && typeof current === "object" && !Array.isArray(current)) {
      return Object.keys(current)
        .sort()
        .reduce((sorted, key) => {
          sorted[key] = current[key]
          return sorted
        }, {})
    }

    return current
  })
}

/**
 * Empreinte de la situation soumise au calcul, complément local de la
 * signature globale : elle identifie les données d'entrée du résultat mis en
 * cache.
 */
export function getSituationSignature(situation: unknown): string {
  const digest = createHash("sha256")
    .update(stableStringify(situation))
    .digest("hex")
    .slice(0, 16)

  return `situation:${digest}`
}

function getBenefitsDigest(): string {
  if (!benefitsDigest) {
    benefitsDigest = createHash("sha256")
      .update(stableStringify(benefits))
      .digest("hex")
      .slice(0, 12)
  }

  return benefitsDigest
}

async function buildSignature(): Promise<string | null> {
  try {
    const { name, version } = await getter.getCountryPackageMetadata()
    const signature = [
      `openfisca:${name}@${version}`,
      `benefits:${getBenefitsDigest()}`,
      `simulation:${simulationVersion}`,
    ].join("|")

    cache = { value: signature, expiresAt: Date.now() + REFRESH_INTERVAL_MS }
    return signature
  } catch (error) {
    console.error("Unable to build the OpenFisca compute signature", error)
    Sentry.captureException(error)

    // Aucune signature de repli : servir un résultat sous une signature
    // approximative exposerait des montants périmés. L'absence de signature
    // désactive le cache, en lecture comme en écriture.
    cache = { value: null, expiresAt: Date.now() + RETRY_INTERVAL_MS }
    return null
  }
}

/**
 * Signature du contexte de calcul : version du paquet pays OpenFisca,
 * empreinte du référentiel d'aides et version du format de simulation.
 * Mémoïsée, rafraîchie périodiquement, et `null` quand elle est indéterminable.
 */
export async function getComputeSignature(): Promise<string | null> {
  if (cache && Date.now() < cache.expiresAt) {
    return cache.value
  }

  if (!inFlight) {
    inFlight = buildSignature().finally(() => {
      inFlight = undefined
    })
  }

  return inFlight
}
