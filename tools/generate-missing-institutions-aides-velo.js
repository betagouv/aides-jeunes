const benefits = require("../data/all")
const yaml = require("js-yaml")
const fs = require("fs")
const generator = require("../data/benefits/aides-velo-generator.js")

const epci = require("@etalab/decoupage-administratif/data/epci.json")

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
  })

  fs.writeFileSync(`./data/institutions/${name}.yml`, fileContent)
}

const list = generator(Object.values(benefits.institutionsMap))

const missingInstitutionBenefits = list.filter((b) => !b.institution)

const missingCommune = missingInstitutionBenefits.filter(
  (b) => b.collectivity.kind === "code insee"
)
if (missingCommune.length) {
  missingCommune.forEach((b) => {
    let commune = null
    epci.some((item) => {
      commune = item.membres.find(
        (membre) => membre.code === b.collectivity.value
      )
      return commune
    })
    if (commune) {
      const commune_slug = `ville_${normalizeName(commune.nom)}`
      const institution = {
        name: `Ville de ${commune.nom}`,
        imgSrc: `img/logo_${commune_slug}.png`,
        prefix: "de la",
        type: "commune",
        code_insee: commune.code,
      }
      createYamlFile(commune_slug, institution)

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
    const EPCIMatch = epci.find((e) =>
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
        imgSrc: `img/logo_${epci_slug}.png`,
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
  missingInstitutionBenefits
    .filter((b) => !["code insee", "epci"].includes(b.collectivity.kind))
    .map((b) => `${b.description} | code_insee : ${b.collectivity.value}`)
    .join("\n")
)
