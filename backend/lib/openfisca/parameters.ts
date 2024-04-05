import Sentry from "@sentry/node"
import openfisca from "./getter.js"

import { OpenfiscaParameters } from "../../../lib/types/parameters.js"

export const parametersList: OpenfiscaParameters = {
  "prestations_sociales.education.carte_des_metiers.age_maximal": 26,
  "prestations_sociales.prestations_etat_de_sante.invalidite.aah.taux_capacite.taux_incapacite": 0.8,
  "taxation_capital.epargne.livret_a.taux": 0.005,
  "marche_travail.salaire_minimum.smic.smic_b_horaire": 10.57,
  "marche_travail.salaire_minimum.smic.nb_heures_travail_mensuel": 151.67,
}

let parameters

const computeParameters = async () => {
  if (!parameters) {
    const values = await Promise.all(
      Object.keys(parametersList).map((parameter) =>
        openfisca.getPromise(`/parameter/${parameter}`)
      )
    )

    const newParameters = {}
    values.forEach((value) => {
      newParameters[value.id] = value.values
    })
    parameters = newParameters
  }
}

const computeParameter = (parameter, date) => {
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

export async function getParameters(date): Promise<OpenfiscaParameters> {
  await computeParameters()
  return getParametersList(date)
}

export function getParametersList(date): OpenfiscaParameters {
  const results = {}
  Object.keys(parametersList).forEach((parameter) => {
    results[parameter] = computeParameter(parameter, date)
  })
  return results as OpenfiscaParameters
}

export default {
  parametersList,
  getParameter,
  getParameters,
  getParametersList,
}
