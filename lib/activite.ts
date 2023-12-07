import { Activite } from "./enums/activite.js"
const ACTIVITES_ACTIF = [Activite.Salarie, Activite.Independant]

function estActif(activite: Activite): boolean {
  return ACTIVITES_ACTIF.includes(activite)
}

export { ACTIVITES_ACTIF, estActif }
