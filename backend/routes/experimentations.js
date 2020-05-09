const getExperimental = require('../../app/js/constants/benefits/experimental')

module.exports = function(api) {
  api.route('/experimentations').get((req, res) => {
    getExperimental().then(data => {
      res.json(data)
    })
  })
}
