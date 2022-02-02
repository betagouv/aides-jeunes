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

const list = generator(Object.values(benefits.institutionsMap))

const missingInstitutionBenefits = list.filter((b) => !b.institution)

const missingCommune = missingInstitutionBenefits.filter(
  (b) => b.collectivity.kind === "code insee"
)
if (missingCommune.length) {
  console.log(missingCommune.map((b) => b.description).join("\n"))
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
        imgSrc: `img/logo_${epci_slug}.png # TODO ajouter l'image`,
        prefix: "de # TODO vérifier le préfixe",
        type: "epci",
        id: EPCIMatch.code,
      }

      const fileContent = yaml.dump(institution, {
        skipInvalid: true,
      })

      fs.writeFileSync(`./data/institutions/${epci_slug}.yml`, fileContent)
      console.log(
        `EPCI trouvée et crée pour l'aide : ${b.description} - ${EPCIMatch.code}`
      )
    } else {
      console.log(`EPCI non trouvée pour l'aide : ${b.description}`)
    }
  })
}
