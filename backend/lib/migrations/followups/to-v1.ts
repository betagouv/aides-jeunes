const VERSION = 1
export default {
  function(followup) {
    followup.version = VERSION
    return followup
  },
  version: VERSION,
}
