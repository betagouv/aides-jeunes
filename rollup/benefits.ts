import generator from "../data/all.js"

const benefits = {}
const excludeKeys = [
  "conditions_generales",
  "entity",
  "lieuxTypes",
  "forms",
  "interestFlag",
  "openfisca_eligibility_source",
  "openfiscaPeriod",
  "profils",
  "setToZeroRecently",
  "teleservices",
  "top",
]

for (const benefit in generator.benefitsMap) {
  if (benefit.private) {
    continue
  }
  benefits[benefit] = generator.benefitsMap[benefit]
  benefits[benefit].institution = {
    label: benefits[benefit].institution.label,
    imgSrc: benefits[benefit].institution.imgSrc,
  }
  for (const key of excludeKeys) {
    if (benefits[benefit][key]) {
      delete benefits[benefit][key]
    }
  }
}

export default benefits
