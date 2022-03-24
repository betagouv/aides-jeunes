const benefits = require("./benefits.json")

const benefitARA = benefits.filter((benefit) => {
    return ["region", "departement", "commune", "epci"].includes(benefit.institution.type) && benefit.source === "javascript"
}).forEach((benefit) => {
    if (!testGeoRelevancy(benefit)) {
        console.log(benefit.id)
        console.log(`${testGeoRelevancy(benefit)}`)
    }
})

// console.log(benefitARA.conditions_generales)

function testGeoRelevancy (benefit) {
    const conditionGeo = benefit.conditions_generales.find((condition) => {
        return condition.type === "regions" || condition.type === "departements" || condition.type === "communes" || condition.type === "epcis"
    })
    if (!conditionGeo) {
        return false
    }
    return conditionGeo.values[0] === benefit.institution.code_insee
}

 console.log(testGeoRelevancy(benefitARA))


 
