const moment = require("moment")

function formatDate(date) {
  return date && moment(date).format("YYYY-MM-DD")
}

module.exports = {
  formatDate,
}
