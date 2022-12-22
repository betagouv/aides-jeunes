/*
 * L'AB testing repose sur les custom variables de Matomo
 * https://matomo.org/docs/custom-variables/
 *
 * NB :
 * *  Les variables d'AB testing sont enregistrées dans le localStorage pour toujours
 *       -> afficher la même version pour un usager donné
 * *  L'utilisation des 5 customs variables de Piwik permet de
 *       -> faire 5 tests différents en même temps
 * *  La suppression des variables en fin de test permet de
 *      -> ne pas polluer Matomo d'anciennes périodes de tests
 */
function getEnvironment() {
  if (!window._paq) {
    return {}
  }
  const ABTesting = JSON.parse(localStorage.getItem("ABTesting") || "{}")

  // index doit être dans [1, 5]
  // // Prépare la variable d'AB testing
  // ABTesting.link = ABTesting.link || { index: 1 };
  // // Réparti les visiteurs l'AB testing avec cette variable
  // ABTesting.link.value = ABTesting.link.value || (Math.random() > 0.5 ? 'A' : 'B');
  // // Après l'AB testing
  // // Pour le désactiver
  // // et libérer une custom variable
  // // ABTesting.link.deleted = true;
  ABTesting.css_text = ABTesting.css_text || { index: 1 }
  ABTesting.css_text.value =
    ABTesting.css_text.value || (Math.random() > 0.5 ? "A" : "B")

  Object.keys(ABTesting).forEach(function (name) {
    const data = ABTesting[name]
    if (data.deleted) {
      window._paq.push(["deleteCustomVariable", data.index, "visit"])
    } else {
      window._paq.push([
        "setCustomVariable",
        data.index,
        name,
        data.value,
        "visit",
      ])
    }
  })
  localStorage.setItem("ABTesting", JSON.stringify(ABTesting))
  return ABTesting
}

function extractValueMap(env) {
  const experimentKeys = Object.keys(env)
  return experimentKeys.reduce((result, key) => {
    const experiment = env[key]
    if (!experiment.deleted) {
      result[key] = experiment.value
    }
    return result
  }, {})
}

const ABTestingService = {
  getValues() {
    return extractValueMap(getEnvironment())
  },
  setVariant(key, value) {
    const ABTestingEnvironment = getEnvironment()
    ABTestingEnvironment[key].value = value
    localStorage.setItem("ABTesting", JSON.stringify(ABTestingEnvironment))

    return extractValueMap(ABTestingEnvironment)
  },
}

export default ABTestingService
