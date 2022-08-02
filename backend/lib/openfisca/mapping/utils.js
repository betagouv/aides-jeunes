const dayjs = require("dayjs")

function formatDate(date) {
  return date && dayjs(date).format("YYYY-MM-DD")
}

module.exports = {
  formatDate,
}
