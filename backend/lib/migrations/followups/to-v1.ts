const VERSION = 1
export default {
  apply(followup) {
    followup.version = VERSION
    return followup
  },
  version: VERSION,
}
