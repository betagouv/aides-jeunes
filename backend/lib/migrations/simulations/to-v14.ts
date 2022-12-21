/*
 * Migre la gestion de abtesting
 */

const VERSION = 14

export default {
  apply(simulation) {
    const ab = simulation.abtesting
    if (!ab) {
      return simulation
    }

    const keys = Object.keys(ab)
    simulation.abtesting = keys.reduce((result, key) => {
      const v = ab[key]
      if (!v.deleted) {
        result[key] = v.value
      }
      return result
    }, {})
    console.log(simulation.abtesting)
    return simulation
  },
  version: VERSION,
}
