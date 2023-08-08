import storageService from "@/lib/storage-service.js"

declare global {
  interface Window {
    _paq?: [string, number, string?][]
  }
}

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
  const ABTesting = storageService.local.getItem("ABTesting") || {}

  // index doit être dans [1, 5]
  // // Prépare la variable d'AB testing
  // ABTesting.link = ABTesting.link || { index: 1 };
  // // Réparti les visiteurs l'AB testing avec cette variable
  // ABTesting.link.value = ABTesting.link.value || (Math.random() > 0.5 ? 'A' : 'B');
  // // Après l'AB testing
  // // Pour le désactiver
  // // et libérer une custom variable
  // // ABTesting.link.deleted = true;
  // cf. https://stats.data.gouv.fr/index.php?module=CustomDimensions&action=manage&idSite=165

  // Définition de la valeur d'AB testing pour la refonte de la page de résultats d'une aide
  ABTesting.benefit_result_page = ABTesting.benefit_result_page || {}
  ABTesting.benefit_result_page.index = 2
  ABTesting.benefit_result_page.value =
    ABTesting.benefit_result_page.value ||
    (Math.random() > 0.5 ? "OldUI" : "NewUI")

  // Définition de la valeur d'AB testing pour la question de la vie en couple
  ABTesting.en_couple_step = ABTesting.en_couple_step || {}
  ABTesting.en_couple_step.index = 3
  ABTesting.en_couple_step.value =
    ABTesting.en_couple_step.value ||
    (Math.random() > 0.5 ? "OldQuestion" : "NewQuestion")

  // Définition de la valeur d'AB testing pour le formulaire du récapitulatif par email
  ABTesting.recap_email_form = ABTesting.recap_email_form || {}
  ABTesting.recap_email_form.index = 4
  ABTesting.recap_email_form.value =
    ABTesting.recap_email_form.value || (Math.random() > 0.5 ? "Modal" : "Page")

  Object.keys(ABTesting).forEach(function (name) {
    const data = ABTesting[name]
    if (data.deleted) {
      window._paq!.push(["deleteCustomDimension", data.index])
    } else {
      window._paq!.push([
        "setCustomDimension",
        data.index,
        `${name}/${data.value}`,
      ])
    }
  })
  storageService.local.setItem("ABTesting", ABTesting)
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
    storageService.local.setItem("ABTesting", ABTestingEnvironment)

    return extractValueMap(ABTestingEnvironment)
  },
}

export default ABTestingService
