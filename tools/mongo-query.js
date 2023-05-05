/* global db, emit, ISODate, headers, quit */

function month(simulation) {
  return simulation.dateDeValeur.toISOString().slice(0, 7)
}

function year(simulation) {
  return simulation.dateDeValeur.toISOString().slice(0, 4)
}

function age(simulation) {
  const ageAnswer =
    simulation.answers &&
    simulation.answers.all.find(function (e) {
      return e.fieldName === "age"
    })
  if (ageAnswer) {
    return ageAnswer.value
  }

  const dobAnwser =
    simulation.answers &&
    simulation.answers.all.find(function (e) {
      return e.fieldName === "date_naissance"
    })
  return dobAnwser
    ? Math.round(
        (simulation.dateDeValeur - ISODate(dobAnwser.value)) /
          (365.25 * 24 * 60 * 60 * 1000),
        0
      )
    : "#N/A"
}

function depcom(simulation) {
  const depcomAnswer = simulation.answers.all.find(function (e) {
    return e.fieldName === "depcom"
  })
  return (
    (depcomAnswer && depcomAnswer.value && depcomAnswer.value.depcom) || "#N/A"
  )
}

function depcom100kp(simulation) {
  const depcomAnswer = simulation.answers.all.find(function (e) {
    return e.fieldName === "depcom"
  })

  const depcoms = {
    13001: 1,
    13055: 1,
    21231: 1,
    29019: 1,
    30189: 1,
    31555: 1,
    33063: 1,
    34172: 1,
    35238: 1,
    37261: 1,
    38185: 1,
    42218: 1,
    44109: 1,
    49007: 1,
    51454: 1,
    59350: 1,
    63113: 1,
    67482: 1,
    69123: 1,
    69266: 1,
    72181: 1,
    74010: 1,
    75056: 1,
    76351: 1,
    80021: 1,
    83137: 1,
    87085: 1,
    92012: 1,
    97411: 1,
    "06088": 1,
  }
  return (
    (depcomAnswer &&
      depcomAnswer.value &&
      depcomAnswer.value.depcom &&
      depcoms[depcomAnswer.value.depcom] &&
      depcomAnswer.value.depcom) ||
    "#N/A"
  )
}

function epci(simulation) {
  const depcomAnswer = simulation.answers.all.find(function (e) {
    return e.fieldName === "depcom"
  })
  return (
    (depcomAnswer &&
      depcomAnswer.value &&
      depcomAnswer.value.depcom &&
      depcomAnswer.value._epci) ||
    "#N/A"
  )
}

function departement(simulation) {
  const depcomAnswer = simulation.answers.all.find(function (e) {
    return e.fieldName === "depcom"
  })
  return (
    (depcomAnswer &&
      depcomAnswer.value &&
      depcomAnswer.value.depcom &&
      depcomAnswer.value._departement) ||
    "#N/A"
  )
}

function region(simulation) {
  const depcomAnswer = simulation.answers.all.find(function (e) {
    return e.fieldName === "depcom"
  })
  return (
    (depcomAnswer &&
      depcomAnswer.value &&
      depcomAnswer.value.depcom &&
      depcomAnswer.value._region) ||
    "#N/A"
  )
}

function activite(simulation) {
  const activiteAnswer = simulation.answers.all.find(function (e) {
    return e.fieldName === "activite"
  })
  return activiteAnswer ? activiteAnswer.value : "#N/A"
}

function avecRessources(simulation) {
  const ressourcesAnswer = simulation.answers.all.find(function (e) {
    return e.fieldName === "ressources"
  })
  return ressourcesAnswer ? ressourcesAnswer.value.length > 0 : "#N/A"
}

const props = {
  activite,
  age,
  avecRessources,
  departement,
  depcom,
  depcom100kp,
  epci,
  region,
  month,
  year,
}

function genericGetter(propName, simulation) {
  const answer = simulation.answers.all.find(function (e) {
    return e.fieldName === propName
  })
  return answer ? answer.value : "#N/A"
}

if (typeof headers == "undefined") {
  print("Usage:")
  print(
    "mongo --quiet db_aides_jeunes --eval \"const headers='month,depcom100kp,departement';\" tools/mongo-query.js > export.csv"
  )
  print("  headers doit contenir les entêtes souhaitées.")
  print("")
  print("Variables possibles :")
  Object.keys(props).forEach((p) => {
    print("  " + p)
  })
  print("  + les valeurs de fieldName dans les réponses")
  quit(1)
}
const propNames = headers.split(",")

print(propNames.join(";") + ";count")
print(
  db
    .getCollection("simulations")
    .mapReduce(
      function () {
        const sim = this
        const values = propNames.map(function (name) {
          if (props[name]) {
            return props[name](sim)
          } else {
            return genericGetter(name, sim)
          }
        })
        emit(values.join(";"), 1)
      },
      function (k, v) {
        return Array.sum(v)
      },
      {
        query: {},
        out: { inline: 1 },
        scope: {
          props,
          propNames,
          genericGetter,
        },
      }
    )
    .results.map(function (o) {
      return o._id + ";" + o.value
    })
    .join("\n")
)
