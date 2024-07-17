import fs from "fs"
import yaml from "js-yaml"
import epci from "@etalab/decoupage-administratif/data/epci.json" assert { type: "json" }
import all from "../data/all.js"
import { CovoiturageJson, VeloBenefit } from "../data/types/benefits.d.js"

const NAME_FORMATTER = {
  CA: "Communauté d'agglomération",
  CC: "Communauté de communes",
  CU: "Communauté urbaine",
}

const normalizeName = (name) => {
  return name
    .replace(/ /g, "_")
    .replace(/-/g, "_")
    .replace(/[`~!@#$%^&*()|+=?;:'",.<>{}[\]\\/]/gi, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

const createYamlFile = (name, content) => {
  const fileContent = yaml.dump(content, {
    skipInvalid: true,
    quotingType: '"',
  })

  fs.writeFileSync(`./data/institutions/${name}.yml`, fileContent)
}

const createCommune = (commune) => {
  const commune_slug = `ville_${normalizeName(commune.nom)}`
  const institution = {
    name: `Ville de ${commune.nom}`,
    imgSrc: `img/institutions/logo_${commune_slug}.png`,
    prefix: "de la",
    type: "commune",
    code_insee: commune.code,
    code_siren: commune.siren,
  }
  createYamlFile(commune_slug, institution)

  return institution
}

const createEPCI = (EPCIMatch) => {
  const epci_slug = normalizeName(EPCIMatch.nom)
  const nameStart = EPCIMatch.nom.substring(0, 2)
  const nom = NAME_FORMATTER[nameStart]
    ? `${NAME_FORMATTER[nameStart]}${EPCIMatch.nom.substring(2)}`
    : EPCIMatch.nom
  const institution = {
    name: nom,
    imgSrc: `img/institutions/logo_${epci_slug}.png`,
    prefix: "de la",
    type: "epci",
    code_siren: EPCIMatch.code,
  }

  createYamlFile(epci_slug, institution)
}

export const missingInstitutionsVeloBenefit = (
  missingInstitutionBenefits: VeloBenefit[]
) => {
  const missingCommune = missingInstitutionBenefits.filter(
    (b) => b.collectivity.kind === "code insee"
  )
  if (missingCommune.length) {
    missingCommune.forEach((b) => {
      let commune
      epci.some((item) => {
        commune = item.membres.find(
          (membre) => membre.code === b.collectivity.value
        )
        return commune
      })
      if (commune) {
        const institution = createCommune(commune)
        console.log(`Commune ajoutée : ${b.description} | ${institution.name}`)
      } else {
        console.log(`Commune manquant : ${b.description}`)
      }
    })
  }
  const missingEPCI = missingInstitutionBenefits.filter(
    (b) => b.collectivity.kind === "epci"
  )
  if (missingEPCI.length) {
    missingEPCI.forEach((b) => {
      const EPCIMatch = epci.find(
        (e) =>
          e.code === b.collectivity.code ||
          e.nom.match(new RegExp(b.collectivity.value.replace("’", "'"), "i"))
      )
      if (EPCIMatch) {
        const epci_slug = normalizeName(EPCIMatch.nom)
        const nameStart = EPCIMatch.nom.substring(0, 2)
        const nom = NAME_FORMATTER[nameStart]
          ? `${NAME_FORMATTER[nameStart]}${EPCIMatch.nom.substring(2)}`
          : EPCIMatch.nom
        const institution = {
          name: nom,
          imgSrc: `img/institutions/logo_${epci_slug}.png`,
          prefix: "de la",
          type: "epci",
          code_siren: EPCIMatch.code,
        }

        createYamlFile(epci_slug, institution)

        console.log(`EPCI ajoutée : ${b.description} - ${EPCIMatch.code}`)
      } else {
        console.log(`EPCI manquant : ${b.description}`)
      }
    })
  }

  console.log(
    "Institutions manquantes : ",
    missingInstitutionBenefits
      .filter((b) => !["code insee", "epci"].includes(b.collectivity.kind))
      .map((b) => `${b.description} | code_insee : ${b.collectivity.value}`)
      .join("\n")
  )
}

export const missingInstitutionsCovoiturageBenefit = (
  missingEPCI: CovoiturageJson[]
) => {
  const institutions = Object.values(all.institutionsMap)
  if (missingEPCI.length) {
    missingEPCI.forEach((b) => {
      const institution = institutions.find(
        (i) => i.code_siren === b.code_siren
      )
      if (!institution) {
        //si l'institution n'existe pas
        const EPCIMatch = epci.find((e) => e.code === b.code_siren)
        if (EPCIMatch) {
          createEPCI(EPCIMatch)
          console.log(`EPCI ajoutée : ${b.code_siren} - ${EPCIMatch.nom}`)
        } else {
          console.log(`EPCI manquant : ${b.code_siren}`)
        }
      }
    })
  }

  console.log("Vérification terminée")
}
