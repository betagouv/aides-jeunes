import dayjs from "dayjs"
import cloneDeep from "lodash.clonedeep"

import { situationsFamiliales } from "./situations-familiales.js"
import { IndividuProperties } from "./types/individu.js"

function isRoleParent(role: string) {
  return ["demandeur", "conjoint"].includes(role)
}

function isWithoutParent(situation) {
  return ["decedes", "sans_autorite"].includes(situation.parents?._situation)
}

function ressourceHeader(individu: IndividuProperties) {
  switch (individu._role) {
    case "demandeur":
      return "Vos ressources personnelles uniquement"
    case "conjoint":
      return "Les ressources de votre conjoint ou conjointe"
    default:
      return `Les ressources ${IndividuMethods.label(
        individu,
        "préposition"
      )}${IndividuMethods.label(individu)}`
  }
}

function find(situation, role: string, id?: string) {
  return situation[role] || situation.find((s) => s.id === id)
}

function getDemandeur() {
  return get([], "demandeur").individu
}

function getConjoint() {
  return get([], "conjoint").individu
}

function get(individus: IndividuProperties[], role: string, id?: string) {
  const DEFAULT_INDIVIDU: IndividuProperties = {
    id: role,
    annee_etude: undefined,
    date_naissance: undefined,
    enfant_a_charge: {},
    nationalite: undefined,
    _role: role,
  }

  const existingIndividu = find(individus, role, id)
  const individu = {
    ...cloneDeep(DEFAULT_INDIVIDU),
    ...cloneDeep(existingIndividu),
  }

  if (role == "enfant" && !existingIndividu) {
    const usedIds = individus.map(function (enfant) {
      return enfant.id
    })
    let count = 0
    while (usedIds.indexOf(`enfant_${count}`) >= 0) {
      count = count + 1
    }
    individu.id = `enfant_${count}`
    const countDisplay = count + 1
    individu._firstName = `votre ${countDisplay}${
      countDisplay === 1 ? "ᵉʳ" : "ᵉ"
    } enfant`
  }
  return {
    existingIndividu: Boolean(existingIndividu),
    individu,
  }
}

function getById(individus, individuId: string) {
  let individu
  if (individuId) {
    const role = individuId.split("_")[0]
    individu = get(individus, role, individuId).individu
  }
  return individu
}

const IndividuMethods = {
  age: function (individu: IndividuProperties, dateDeReference: string) {
    return dayjs(dateDeReference).diff(individu.date_naissance, "year")
  },

  label: function (individu: IndividuProperties, type?: string) {
    const VOYELLES = ["a", "e", "i", "o", "u", "y"]

    const labelDict = {
      possessive: {
        demandeur: () => "votre",
        conjoint: () => "sa",
        enfant: () => "sa",
      },
      nom: {
        demandeur: () => "vous",
        conjoint: () => "votre conjoint ou conjointe",
        enfant: () => `${individu._firstName}`,
      },
      préposition: {
        conjoint: () => "de ",
        enfant: () =>
          individu._firstName &&
          VOYELLES.includes(individu._firstName[0].toLowerCase())
            ? `d'`
            : "de ",
      },
      avoir: {
        demandeur: () => "avez-vous",
        conjoint: () => "votre conjoint ou conjointe a-t-il/elle",
        enfant: () => `${individu._firstName} a-t-il/elle`,
      },
      percevoir: {
        demandeur: () => "percevez-vous",
        conjoint: () => "votre conjoint ou conjointe perçoit-il/elle",
        enfant: () => `${individu._firstName} perçoit-il/elle`,
      },
      être: {
        demandeur: () => "êtes-vous",
        conjoint: () => "votre conjoint ou conjointe est-il/elle",
        enfant: () => `${individu._firstName} est-il/elle`,
      },
    }
    return labelDict[type || "nom"][individu._role]()
  },
  find,
  get,
  getById,
  getDemandeur,
  getConjoint,
  ressourceHeader,

  ressourceShortLabel: function (individu: IndividuProperties) {
    switch (individu._role) {
      case "demandeur":
        return "vos ressources"
      default:
        return ressourceHeader(individu)
    }
  },

  nationaliteLabel: function (individu: IndividuProperties) {
    return `TODO2${individu.id}` //NationaliteService.getLabel(individu.nationalite);
  },

  isRoleParent,
  isWithoutParent,
  isParent: function (individu: IndividuProperties) {
    return isRoleParent(individu._role)
  },

  situationsFamiliales,
}

export default IndividuMethods
