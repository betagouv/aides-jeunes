import { createRequire } from "module"
const require = createRequire(import.meta.url)
import fsl_eligibilite from "../data/benefits/additional-attributes/fsl-eligibilite.js"
import fs from "fs"
import yaml from "js-yaml"
const epcis = require("@etalab/decoupage-administratif/data/epci.json")
const departments = require("@etalab/decoupage-administratif/data/departements.json")
import benefits from "../data/all.js"
import { StatutOccupationLogement } from "../lib/logement.js"

const DEFAULT_FSL = {
  type: "bool",
  prefix: "une",
  top: 6,
  periodicite: "ponctuelle",
}

function getDepartmentInstitutionByInseeCode(inseeCode) {
  return Object.keys(benefits.institutionsMap)
    .filter(
      (institutionName) =>
        benefits.institutionsMap[institutionName].type === "departement"
    )
    .find((institutionName) => {
      const institution = benefits.institutionsMap[institutionName]
      return institution.code_insee === inseeCode
    })
}

function getMetropoleInstitutionBySirenCode(sirenCode) {
  return Object.keys(benefits.institutionsMap).find((institutionName) => {
    const institution = benefits.institutionsMap[institutionName]
    return institution.code_siren === sirenCode
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
  createYamlFile("./data/institutions", name, content)

  return name
}
function generateMetropoleInstitution(sirenCode, imgSrc) {
  const metropole = epcis.find((epci) => epci.code === sirenCode)
  const content = {
    name: metropole.nom,
    imgSrc: imgSrc,
    type: "epci",
    code_siren: sirenCode,
  }
  const name = normalizeName(metropole.nom)
  createYamlFile("./data/institutions", name, content)

  return name
}

function addConditions() {
  return {
    conditions_generales: [
      {
        type: "institution",
      },
      {
        type: "statut_occupation_logement",
        excludes: [
          StatutOccupationLogement.loge_gratuitement,
          StatutOccupationLogement.sans_domicile,
        ],
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
  const geographicalEntity = code[0] // département/ métropole
  const geographicalCode = code.slice(1) // code Insee pour le départemebnt ou code Siren pour la métropole

  // récupère l'aide customisé
  const customizationBenefit = fsl_eligibilite.customization[code]
  let benefitInstitutionName
  let benefit

  if (geographicalEntity === "D") {
    benefitInstitutionName =
      getDepartmentInstitutionByInseeCode(geographicalCode)
    if (!benefitInstitutionName) {
      // Generate institution if doesn't exist and retrieve name
      benefitInstitutionName = generateDepartmentInstitution(geographicalCode)
    }

    // Met en forme l'aide
    // Ajoute la condition sur le département
    benefit = formatBenefit(
      customizationBenefit,
      benefitInstitutionName,
      addConditions()
    )
    // Generer le nom de l'aide
  } else {
    //console.log(customizationBenefit)
    // Gerer les métropoles
    benefitInstitutionName =
      getMetropoleInstitutionBySirenCode(geographicalCode)

    // Récupérer l'institution par le code siren
    // si elle existe pas la créer
    if (!benefitInstitutionName) {
      benefitInstitutionName = generateMetropoleInstitution(
        geographicalCode,
        customizationBenefit.institution.imgSrc
      )
    }
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
    benefit = formatBenefit(
      customizationBenefit,
      benefitInstitutionName,
      addConditions()
    )
  }
  const benefitName = `${benefitInstitutionName.replace(
    /_/g,
    "-"
  )}-fsl-eligibilite`

  // migrer en yml et sauvegarde le fichier
  createYamlFile("./data/benefits/javascript", benefitName, benefit)
})
