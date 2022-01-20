const ACTIVITES_ACTIF = ["service_civique", "salarie", "independant"]

function estActif(activite) {
  return ACTIVITES_ACTIF.includes(activite)
}

module.exports = {
  ACTIVITES_ACTIF,
  estActif,
}
