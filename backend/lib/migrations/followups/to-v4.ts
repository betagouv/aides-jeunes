const VERSION = 4

/*
 * Supprime le champ _oldId des followups
 */

export default {
  apply(followup) {
    delete followup._oldId
    return followup
  },
  version: VERSION,
}
