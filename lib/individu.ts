const cloneDeep = require("lodash/cloneDeep")
const dayjs = require("dayjs")

function isRoleParent(role: string) {
  return ["demandeur", "conjoint"].includes(role)
}

function ressourceHeader(individu) {
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

function find(situation, role, id) {
  return situation[role] || situation.find((s) => s.id === id)
}

function getDemandeur() {
  return get([], "demandeur").individu
}

function getConjoint() {
  return get([], "conjoint").individu
}

function get(individus, role, id?: any) {
  let DEFAULT_INDIVIDU = {
    id: role,
    annee_etude: undefined,
    date_naissance: undefined,
    enfant_a_charge: {},
    nationalite: undefined,
    _role: role,
  }

  let existingIndividu = find(individus, role, id)
  let individu = {
    ...cloneDeep(DEFAULT_INDIVIDU),
    ...cloneDeep(existingIndividu),
  }

  if (role == "enfant" && !existingIndividu) {
    let usedIds = individus.map(function (enfant) {
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

function getById(individus, individuId) {
  let individu
  if (individuId) {
    const role = individuId.split("_")[0]
    individu = get(individus, role, individuId).individu
  }
  return individu
}

const Individu = {
  age: function (individu, dateDeReference) {
    return dayjs(dateDeReference).diff(individu.date_naissance, "year")
  },

  label: function (individu, type?: string) {
    const VOYELLES = ["a", "e", "i", "o", "u", "y"]

    const labelDict = {
      possessive: {
        demandeur: () => "votre",
        conjoint: () => "sa",
        enfant: () => "sa",
      },
      nom: {
        demandeur: () => "vous",
        conjoint: () => "votre conjoint·e",
        enfant: () => `${individu._firstName}`,
      },
      préposition: {
        conjoint: () => "de ",
        enfant: () =>
          VOYELLES.includes(individu._firstName[0].toLowerCase())
            ? `d'`
            : "de ",
      },
      avoir: {
        demandeur: () => "avez-vous",
        conjoint: () => "votre conjoint·e a-t-il/elle",
        enfant: () => `${individu._firstName} a-t-il/elle`,
      },
      percevoir: {
        demandeur: () => "percevez-vous",
        conjoint: () => "votre conjoint·e perçoit-il/elle",
        enfant: () => `${individu._firstName} perçoit-il/elle`,
      },
      être: {
        demandeur: () => "êtes-vous",
        conjoint: () => "votre conjoint·e est-il/elle",
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

  ressourceShortLabel: function (individu) {
    switch (individu._role) {
      case "demandeur":
        return "vos ressources"
      default:
        return ressourceHeader(individu)
    }
  },

  nationaliteLabel: function (individu) {
    return `TODO2${individu.id}` //NationaliteService.getLabel(individu.nationalite);
  },

  isRoleParent,

  isParent: function (individu) {
    return isRoleParent(individu._role)
  },

  formatStatutsSpecifiques: function (individu) {
    let statuts = []
    if (individu.enceinte) {
      statuts.push("enceinte")
    }

    if (individu.boursier) {
      statuts.push("boursier")
    }

    if (individu.garde_alternee) {
      statuts.push("en garde alternée")
    }

    //TODO3 statuts = _.map(statuts, $filter('lowercaseFirst'));
    statuts = statuts.join(", ")
    //TODO3 statuts = $filter('uppercaseFirst')(statuts);
    return "TODO3" //statuts;
  },

  situationsFamiliales: [
    {
      value: "marie", // Enum value 1 in OpenFisca
      label: "Marié·e",
    },
    {
      value: "pacse", // Enum value 5 in OpenFisca
      label: "Pacsé·e",
    },
    {
      value: "celibataire", // Enum value 2 in OpenFisca
      label: "En union libre",
    },
  ],
}

export default Individu
