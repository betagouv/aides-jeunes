// Réplique du fichier test geographical-benefit-count.spec.js sans framework
const {
  isGeographicallyIncluded,
} = require("./tools/geographical-benefit-count")

const communes = require("@etalab/decoupage-administratif/data/communes.json")

const arcachon = "33009"

// Test national
//console.log(isGeographicallyIncluded(arcachon, { type: "national" }) == true)
/*
// 75 : Nouvelle Aquitaine
console.log(isGeographicallyIncluded(arcachon, {
    type: "region",
    id: "75",
}) == true)

// 11 : Ile de France
console.log(isGeographicallyIncluded(arcachon, {
    type: "region",
    id: "11",
}) == false)

// 33 : Gironde
console.log(isGeographicallyIncluded(arcachon, {
    type: "departement",
    id: "33",
}) == true)

// 75 : Paris
const departement_paris = {
    type: "departement",
    id: "75",
}
console.log(isGeographicallyIncluded(arcachon, departement_paris) == false)

// 243300563 : 
console.log(isGeographicallyIncluded(arcachon, {
    type: "epci",
    id: "243300563",
}) == true)

// 
console.log(isGeographicallyIncluded(arcachon, {
    type: "epci",
    id: "200035319",
}) == false)

// 33009 : Arcachon
console.log(isGeographicallyIncluded(arcachon, {
    type: "commune",
    id: "33009",
}) == true)

// Test commune dehors
console.log(isGeographicallyIncluded(arcachon, {
    type: "commune",
    id: "33527",
}) == false)
*/

var { institutionsMap } = require("./data/all")

//console.log(institutionsMap)

// Récupère l'ensemble des clés de l'objet institutionMap --> noms des institutions
const institutionIds = Object.keys(institutionsMap)

//console.log(institutionIds)

let denombrement = {}
// Combien y a t il d'institutions par type d'institution
institutionIds.forEach((id) => {
  const institution = institutionsMap[id]

  const previousValue = denombrement[institution.type] || 0
  const newValue = previousValue + 1
  // Donne une valeur de dénombrement à la propriété institution.type de l'objet dénombrement
  denombrement[institution.type] = newValue
})

//console.log(denombrement)

denombrement = {}
// Combien y a t il d'aides par institution
institutionIds.forEach((id) => {
  const institution = institutionsMap[id]
  denombrement[id] = institution.benefitsIds.length
})
//console.log(denombrement)

denombrement = {}
// Combien y a t il d'aides par type d'institution
institutionIds.forEach((id) => {
  const institution = institutionsMap[id]

  const previousValue = denombrement[institution.type] || 0
  const newValue = previousValue + institution.benefitsIds.length
  denombrement[institution.type] = newValue
})
//console.log(denombrement)

denombrement = {}
// Combien y a t il d'aides pour la ville d'Arcachon

// Récupérer l'institution qui correspond à la ville d'Arcachon

// console.log(institutionsMap.action_logement.benefitsIds.length)
/*
// Accès
// Affectation
const a = 12
institution.type = 42
denombrement.national
denombrement['national']
// J'accède à la prop type de l'obj institution de l'obj dénombrement
// J'accède à la prop qui correspond à institution.type dans l'obj dénombrement
//
denombrement[institution.type]
a || b // lazy evaluation

denombrement[institution.type] || 0
*/

// Arcachon est-il dans le territoire pertinent d'action logement ?
//console.log(institutionsMap.action_logement)

//console.log(isGeographicallyIncluded(arcachon, institutionsMap.action_logement))

// Est-ce qu'Arcachon fait partie de l'institution region_ile_de_france ?
//console.log(isGeographicallyIncluded(arcachon, institutionsMap.region_ile_de_france))

function computeInterestingBenefitsCount(codeInsee) {
  let total = 0
  /*for (const id in institutionsMap) {
        const result = isGeographicallyIncluded(codeInsee, institutionsMap[id])
        if (result) {
            total = total + institutionsMap[id].benefitsIds.length
        }
    }*/

  institutionIds.forEach((id) => {
    const institution = institutionsMap[id]
    const result = isGeographicallyIncluded(codeInsee, institution)

    if (result) {
      total = total + institution.benefitsIds.length
    }
  })
  return total
}
console.log(computeInterestingBenefitsCount(arcachon))

// --> Structure de données /tableau avec nb d'aides + commune associée

const interestingBenefitsCountList = []

/*communes.forEach(ville => {
    interestingBenefitsCount[ville.code] = computeInterestingBenefitsCount(ville.code)


   // interestingBenefitsCountList.push(interestingBenefitsCount)
    //console.log(interestingBenefitsCountList)
  
})*/
//console.log(interestingBenefitsCount)

communes.slice(0, 10).forEach((ville) => {
  interestingBenefitsCountList.push({
    codeInsee: ville.code,
    count: computeInterestingBenefitsCount(ville.code),
  })
})
console.log(interestingBenefitsCountList)
console.log(computeInterestingBenefitsCount("75056"))
