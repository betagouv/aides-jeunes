import storageService from "@/lib/storage-service.js"

declare global {
  interface Window {
    _paq?: [
      string | (() => void),
      (number | string)?,
      string?,
      string?,
      string?
    ][]
  }
}

interface ABTesting {
  [key: string]: {
    index: number
    value: string
    deleted?: boolean
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
  const ABTestingEnvironment: ABTesting =
    storageService.local.getItem("ABTesting") || {}

  // index doit être dans [1, 5]
  // // Prépare la variable d'AB testing
  // ABTestingEnvironment.link = ABTestingEnvironment.link || { index: 1 };
  // // Réparti les visiteurs l'AB testing avec cette variable
  // ABTestingEnvironment.link.value = ABTestingEnvironment.link.value || (Math.random() > 0.5 ? 'A' : 'B');
  // // Après l'AB testing
  // // Pour le désactiver
  // // et libérer une custom variable
  // // ABTestingEnvironment.link.deleted = true;
  // cf. https://stats.data.gouv.fr/index.php?module=CustomDimensions&action=manage&idSite=165

  // Exemple de test AB :
  // /1 Copier / Remplir / Décommenter ce bloc
  // /2 Ajouter une variante pour l'Intégration Continue si nécessaire : ABTestingService.setVariant("nom_du_test", "nom_de_la_version_A")
  //   - ici : https://github.com/betagouv/aides-jeunes/blob/59e581d61fd285a68b3ccb637f29ab3c7f9972ac/src/router.ts#L280
  // /3 L'utiliser dans le code : ABTestingService.getValues().nom_du_test
  // Le bloc :
  // ABTestingEnvironment.name_of_the_test = ABTestingEnvironment.name_of_the_test || {}
  // ABTestingEnvironment.name_of_the_test.index = 2
  // ABTestingEnvironment.name_of_the_test.value =
  //   ABTestingEnvironment.name_of_the_test.value ||
  //   (Math.random() > 0.5 ? "A version name" : "B version name")

  Object.keys(ABTestingEnvironment).forEach(function (name) {
    const data = ABTestingEnvironment[name]
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
  storageService.local.setItem("ABTesting", ABTestingEnvironment)
  return ABTestingEnvironment
}

function extractValueMap(env: ABTesting): { [key: string]: string } {
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
