function hasEtablissements(benefit) {
  return (
    benefit.etablissements?.length || benefit.institution.etablissements?.length
  )
}
function getEtablissements(benefit) {
  if (benefit.etablissements?.length) {
    return benefit.etablissements
  }
  return benefit.institution.etablissements || []
}

exports.hasEtablissements = hasEtablissements
exports.getEtablissements = getEtablissements
