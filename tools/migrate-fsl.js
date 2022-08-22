import { createRequire } from "module"
const require = createRequire(import.meta.url)
import fsl_eligibilite from "../data/benefits/additional-attributes/fsl-eligibilite.js"
import fs from "fs"
import yaml from "js-yaml"
const epci = require("@etalab/decoupage-administratif/data/epci.json")
const departments = require("@etalab/decoupage-administratif/data/departements.json")
import benefits from "../data/all.js"

// recuperer les codes postaux
// generer le contenu editiorial
// creeer un fichier yaml

const DEFAULT_FSL = {
  type: "bool",
  prefix: "une",
  top: 6,
  periodicite: "ponctuelle",
}

function getDepartmentInstitutionByInseeCode(inseeCode) {
  Object.keys(benefits.institutionsMap).find((institutionName) => {
    const institution = benefits.institutionsMap[institutionName]
    return institution.code_insee === inseeCode
  })
}

function generateDepartmentInstitution(inseeCode) {
  const department = departments.find(
    (department) => department.code === inseeCode
  )

  const content = {
    name: `Département ${department.nom}`,
    imgSrc: `img/logo_cd${inseeCode}.png`,
    type: "departement",
    code_insee: inseeCode,
  }
  const name = `departement_${normalizeName(department.nom)}`
  createYamlFile("./tmp/institutions", name, content)

  return name
}

function addDepartmentCondition(inseeCode) {
  return {
    conditions_generales: [
      {
        type: "departements",
        values: [inseeCode],
      },
    ],
  }
}

function formatBenefit(customizationBenefit, institution, conditions) {
  return {
    ...DEFAULT_FSL,
    ...customizationBenefit,
    institution,
    ...conditions,
  }
}

const normalizeName = (name, separator = "_") => {
  return name
    .replace(/ /g, separator)
    .replace(/-/g, separator)
    .replace(/[`~!@#$%^&*()|+=?;:'",.<>{}[\]\\/]/gi, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

const createYamlFile = (path, name, content) => {
  const fileContent = yaml.dump(content, {
    // skipInvalid: true,
  })

  fs.writeFileSync(`${path}/${name}.yml`, fileContent)
}

Object.keys(fsl_eligibilite.customization).forEach((code) => {
  const geographicalEntity = code[0]
  const geographicalCode = code.slice(1)

  // récupère l'aide customisé
  const customizationBenefit = fsl_eligibilite.customization[code]

  if (geographicalEntity === "D") {
    let benefitInstitutionName = getDepartmentInstitutionByInseeCode
    if (!benefitInstitutionName) {
      // Generate institution if doesn't exist and retrieve name
      benefitInstitutionName = generateDepartmentInstitution(geographicalCode)
    }

    // Met en forme l'aide
    // Ajoute la condition sur le département
    const benefit = formatBenefit(
      customizationBenefit,
      benefitInstitutionName,
      addDepartmentCondition(geographicalCode)
    )
    // Generer le nom de l'aide
    const benefitName = `${benefitInstitutionName.replace(
      /_/g,
      "-"
    )}-fsl-eligibilite`

    // migrer en yml et sauvegarde le fichier
    createYamlFile("./tmp/benefits", benefitName, benefit)
  } else {
    console.log(customizationBenefit)
    // Gerer les métropoles
    // Récupérer l'institution par le code siren
    // si elle existe pas la créer

    // Récupérer les communes de la métropole

    // Générer la conditions sur les communes de la métropole
    // exemple
    // conditions_generales:
    // cas epci (metropole)
    //    - type: communes
    //    values:
    //      - "06088"
    //      - "06999"

    // générer l'aide au format js à partir des infos récupérées dans les étapes précédentes

    // créer le fichier yaml
  }
})
