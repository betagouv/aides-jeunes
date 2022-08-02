const ACTIVITES_ACTIF = ["service_civique", "salarie", "independant"]

function estActif(activite: string) {
  return ACTIVITES_ACTIF.includes(activite)
}

export { ACTIVITES_ACTIF, estActif }
