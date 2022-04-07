const VERSION = 1
module.exports = {
  function: function (followup) {
    followup.version = VERSION
    return followup
  },
  version: VERSION,
}
