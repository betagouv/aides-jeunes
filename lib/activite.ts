import { ActiviteType } from "./enums/activite.js"
const ACTIVITES_ACTIF = [
  ActiviteType.service_civique,
  ActiviteType.salarie,
  ActiviteType.independant,
]

function estActif(activite: ActiviteType): boolean {
  return ACTIVITES_ACTIF.includes(activite)
}

export { ACTIVITES_ACTIF, estActif }
