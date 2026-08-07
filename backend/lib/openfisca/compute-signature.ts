import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import * as Sentry from "@sentry/node"

import getter from "./getter.js"
import benefits from "../../../data/all.js"
import { version as simulationVersion } from "../../../lib/simulation.js"

const REFRESH_INTERVAL_MS = 10 * 60 * 1000
const RETRY_INTERVAL_MS = 30 * 1000

let lastKnownSignature: string | undefined
let refreshedAt = 0
let attemptedAt = 0
let inFlight: Promise<void> | undefined
let benefitsDigest: string | undefined
let environmentDigest: string | null | undefined

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

function digest(value: unknown, length: number): string {
  return createHash("sha256")
    .update(stableStringify(value))
    .digest("hex")
    .slice(0, length)
}

/**
 * Empreinte de la situation soumise au calcul, complément local de la
 * signature globale : elle identifie les données d'entrée du résultat mis en
 * cache.
 */
export function getSituationSignature(situation: unknown): string {
  return `situation:${digest(situation, 16)}`
}

function getBenefitsDigest(): string {
  if (!benefitsDigest) {
    benefitsDigest = digest(benefits, 12)
  }

  return benefitsDigest
}

// La racine du dépôt porte `openfisca/requirements.txt` et `package.json` :
// elle se trouve trois niveaux au-dessus de ce module dans l'arborescence des
// sources, quatre une fois compilé sous `dist-server`.
function findRepositoryRoot(): string {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
  let directory = moduleDirectory

  for (;;) {
    if (existsSync(path.join(directory, "package.json"))) {
      return directory
    }

    const parent = path.dirname(directory)
    if (parent === directory) {
      throw new Error(`No package.json found above ${moduleDirectory}`)
    }

    directory = parent
  }
}

/**
 * Empreinte des sources de calcul que l'API OpenFisca n'expose pas :
 * `get_package_metadata()` ne décrit que le paquet pays, sans les extensions
 * (`OpenFisca-France-Local`, `Openfisca-Paris`) ni la réforme EPCI, toutes
 * épinglées par `openfisca/requirements.txt`. `package.json` couvre la version
 * applicative et les dépendances de calcul côté Node, dont `@betagouv/aides-velo`.
 */
function getEnvironmentDigest(): string | null {
  if (environmentDigest === undefined) {
    try {
      const root = findRepositoryRoot()
      const requirements = readFileSync(
        path.join(root, "openfisca", "requirements.txt"),
        "utf8",
      )
      const { version, dependencies } = JSON.parse(
        readFileSync(path.join(root, "package.json"), "utf8"),
      )

      environmentDigest = digest({ requirements, version, dependencies }, 12)
    } catch (error) {
      console.error("Unable to digest the compute environment sources", error)
      Sentry.captureException(error)

      // Sans cette empreinte, une signature resterait aveugle aux extensions
      // OpenFisca et au code applicatif : le cache est désactivé plutôt que
      // signé sur un périmètre incomplet.
      environmentDigest = null
    }
  }

  return environmentDigest
}

async function buildSignature(): Promise<string> {
  const environment = getEnvironmentDigest()
  if (!environment) {
    throw new Error("The compute environment digest is unavailable")
  }

  const { name, version } = await getter.getCountryPackageMetadata()

  return [
    `openfisca:${name}@${version}`,
    `environment:${environment}`,
    `benefits:${getBenefitsDigest()}`,
    `simulation:${simulationVersion}`,
  ].join("|")
}

function refresh(): void {
  if (inFlight || Date.now() - attemptedAt < RETRY_INTERVAL_MS) {
    return
  }

  attemptedAt = Date.now()
  inFlight = buildSignature()
    .then((signature) => {
      lastKnownSignature = signature
      refreshedAt = Date.now()
    })
    .catch((error) => {
      console.error("Unable to build the OpenFisca compute signature", error)
      Sentry.captureException(error)
    })
    .finally(() => {
      inFlight = undefined
    })
}

/**
 * Signature du contexte de calcul : version du paquet pays OpenFisca, empreinte
 * des sources de calcul, empreinte du référentiel d'aides et version du format
 * de simulation.
 *
 * L'appel ne bloque jamais : il sert la dernière signature obtenue et déclenche
 * le rafraîchissement en arrière-plan. Un échec ne remplace jamais cette
 * signature — la version d'un paquet ne change pas sans redémarrage du
 * processus, alors que la jeter relancerait un calcul complet pour tout le
 * monde au pire moment. Tant qu'aucune signature n'a été obtenue, son absence
 * désactive le cache en lecture comme en écriture.
 */
export function getComputeSignature(): string | null {
  if (!lastKnownSignature || Date.now() - refreshedAt >= REFRESH_INTERVAL_MS) {
    refresh()
  }

  return lastKnownSignature ?? null
}
