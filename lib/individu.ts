import { cloneDeep } from "lodash-es"
import dayjs from "dayjs"

import { individuLayout } from "./types/individu"

function isRoleParent(role: string) {
  return ["demandeur", "conjoint"].includes(role)
}

function ressourceHeader(individu: individuLayout) {
  switch (individu._role) {
    case "demandeur":
      return "Vos ressources personnelles uniquement"
    case "conjoint":
      return "Les ressources de votre conjoint·e"
    default:
      return `Les ressources ${Individu.label(
        individu,
        "préposition"
      )}${Individu.label(individu)}`
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

function get(individus: individuLayout[], role: string, id?: string) {
  const DEFAULT_INDIVIDU: individuLayout = {
    _role: role,
    annee_etude: undefined,
    date_naissance: undefined,
    enfant_a_charge: {},
    id: role,
    nationalite: undefined,
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

const Individu = {
  age: function (individu: individuLayout, dateDeReference: string) {
    return dayjs(dateDeReference).diff(individu.date_naissance, "year")
  },

  find,
  get,
  getById,
  getConjoint,
  getDemandeur,
  isParent: function (individu: individuLayout) {
    return isRoleParent(individu._role)
  },
  isRoleParent,

  label: function (individu: individuLayout, type?: string) {
    const VOYELLES = ["a", "e", "i", "o", "u", "y"]

    const labelDict = {
      avoir: {
        conjoint: () => "votre conjoint·e a-t-il/elle",
        demandeur: () => "avez-vous",
        enfant: () => `${individu._firstName} a-t-il/elle`,
      },
      nom: {
        conjoint: () => "votre conjoint·e",
        demandeur: () => "vous",
        enfant: () => `${individu._firstName}`,
      },
      percevoir: {
        conjoint: () => "votre conjoint·e perçoit-il/elle",
        demandeur: () => "percevez-vous",
        enfant: () => `${individu._firstName} perçoit-il/elle`,
      },
      possessive: {
        conjoint: () => "sa",
        demandeur: () => "votre",
        enfant: () => "sa",
      },
      préposition: {
        conjoint: () => "de ",
        enfant: () =>
          individu._firstName &&
          VOYELLES.includes(individu._firstName[0].toLowerCase())
            ? `d'`
            : "de ",
      },
      être: {
        conjoint: () => "votre conjoint·e est-il/elle",
        demandeur: () => "êtes-vous",
        enfant: () => `${individu._firstName} est-il/elle`,
      },
    }
    return labelDict[type || "nom"][individu._role]()
  },

  nationaliteLabel: function (individu: individuLayout) {
    return `TODO2${individu.id}` //NationaliteService.getLabel(individu.nationalite);
  },

  ressourceHeader,

  ressourceShortLabel: function (individu: individuLayout) {
    switch (individu._role) {
      case "demandeur":
        return "vos ressources"
      default:
        return ressourceHeader(individu)
    }
  },

  situationsFamiliales: [
    {
      // Enum value 1 in OpenFisca
      label: "Marié·e",
      value: "marie",
    },
    {
      // Enum value 5 in OpenFisca
      label: "Pacsé·e",
      value: "pacse",
    },
    {
      // Enum value 2 in OpenFisca
      label: "En union libre",
      value: "celibataire",
    },
  ],
}

export default Individu
