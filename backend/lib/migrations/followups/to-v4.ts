const VERSION = 4

/*
 * Supprime le champ _oldId des followups
 */

export default {
  apply(followup) {
    followup._oldId = undefined
    return followup
  },
  version: VERSION,
}
