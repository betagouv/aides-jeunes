export function filterByInterestFlag(benefit, demandeur) {
  return !benefit.interestFlag || demandeur[benefit.interestFlag]
}
