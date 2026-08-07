import * as Sentry from "@sentry/node"
import openfisca from "./getter.js"

import { OpenfiscaParameters } from "../../../lib/types/parameters.js"

export const parametersList: OpenfiscaParameters = {
  "prestations_sociales.education.carte_des_metiers.age_maximal": 26,
  "prestations_sociales.prestations_etat_de_sante.invalidite.aah.taux_capacite.taux_incapacite": 0.8,
  "taxation_capital.epargne.livret_a.taux": 0.005,
  "marche_travail.salaire_minimum.smic.smic_b_horaire": 10.57,
  "marche_travail.salaire_minimum.smic.nb_heures_travail_mensuel": 151.67,
}

// Une tentative infructueuse n'est mémoïsée que le temps de ce délai : sans
// lui, un OpenFisca indisponible au démarrage du processus laisserait
// `parameters` indéfini pour toute sa durée de vie, et les légendes
// retomberaient sur les constantes de `parametersList`.
const RETRY_DELAY_MS = 60 * 1000

let parameterPromise
let parameterFailedAt = 0
let parameters

async function fetchParameters() {
  const values = await Promise.all(
    Object.keys(parametersList).map((parameter) =>
      openfisca.getPromise(`/parameter/${parameter}`),
    ),
  )

  const newParameters = {}
  values.forEach((value) => {
    newParameters[value.id] = value.values
  })
  return newParameters
}

function requestParameters() {
  if (parameterFailedAt && Date.now() - parameterFailedAt >= RETRY_DELAY_MS) {
    parameterPromise = undefined
  }

  if (!parameterPromise) {
    parameterFailedAt = 0
    parameterPromise = fetchParameters().then(
      (values) => {
        parameters = values
        return values
      },
      (error) => {
        parameterFailedAt = Date.now()
        throw error
      },
    )
    // `getParameters` est synchrone et jette cette promesse sans la traiter.
    // Chaque fenêtre de réessai produirait sinon un rejet non géré, qui termine
    // le process quand Sentry est désactivé faute de DSN.
    parameterPromise.catch(() => {})
  }
  return parameterPromise
}

/**
 * Les paramètres alimentent les légendes des aides (« au lieu de 0,5 % ») :
 * tant qu'ils ne sont pas chargés, `computeParameter` retombe sur les
 * constantes de `parametersList`, dont la valeur ne correspond plus au barème
 * courant. Un résultat calculé dans cet état ne doit pas être persisté.
 */
export function areParametersLoaded(): boolean {
  return parameters !== undefined
}

function computeParameter(parameter, date) {
  const values = parameters?.[parameter]
  if (values) {
    const closestDate = Object.keys(values)
      .reverse()
      .find((valueDate) => new Date(valueDate) < date)
    if (closestDate) {
      return values[closestDate]
    }
  }
  Sentry.captureMessage("Openfisca parameters are not loaded", (scope) => {
    return scope.setContext("parameters", {
      date,
      parameter,
      parameters,
    })
  })
  return parametersList[parameter]
}

export function getParameter(parameter, date) {
  return computeParameter(parameter, date)
}

export function getParameters_(date): OpenfiscaParameters {
  const results = {}
  Object.keys(parametersList).forEach((parameter) => {
    results[parameter] = computeParameter(parameter, date)
  })
  return results as OpenfiscaParameters
}

export function getParameters(date): OpenfiscaParameters {
  requestParameters()
  return getParameters_(date)
}

export async function getParametersAsync(date): Promise<OpenfiscaParameters> {
  await requestParameters()
  return getParameters_(date)
}

export default {
  parametersList,
  areParametersLoaded,
  getParameter,
  getParameters,
  getParametersAsync,
}
