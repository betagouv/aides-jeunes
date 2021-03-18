const bodyParser = require('body-parser')
const axios = require('axios')
const outils = require('./backend/controllers/outils')
const mapping = require('./backend/lib/openfisca/mapping')

const openfiscaRoot = 'https://openfisca.mes-aides.1jeune1solution.beta.gouv.fr'
const buildOpenFiscaRequest = mapping.buildOpenFiscaRequest
function sendToOpenfisca(situation, callback) {
    let request
    try {
        request = buildOpenFiscaRequest(situation)
    } catch(e) {
        return callback({
            message: e.message,
            name: e.name,
            stack: e.stack
        })
    }
    axios.post(`${openfiscaRoot}/calculate`, request)
    .then(response => response.data)
    .then(result => {
        callback(null, result)
    }).catch(callback)
}

var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

function mock(app) {
  app.use(bodyParser.json())

  let cache = {}
  app.route('/api/outils/communes/:codePostal').get(outils.communes)
  app.post('/api/situations', function(req, res) {
    const data = Object.assign({ _id: ID() }, req.body)
    cache[data._id] = data
    res.send(data)
  })

  app.get('/api/situations/:id', function(req, res) {
    res.send(cache[req.params.id])
  })

  app.get('/api/situations/:id/openfisca-response', function(req, res, next) {
    sendToOpenfisca(cache[req.params.id], function(err, result) {
      if (err) {
        return next(err)
      }

      res.send(Object.assign({ _id: cache[req.params.id]._id }, result))
    })
  })

  app.get('/api/situations/:id/openfisca-request', function(req, res) {
    res.send(buildOpenFiscaRequest(cache[req.params.id]))
  })

  app.get('/api/openfisca/variables', function(req, res, next) {
    axios.get(`${openfiscaRoot}/variables`)
    .then(response => response.data)
    .then(mapping => res.send(Object.keys(mapping)))
    .catch(error => next(error))
  })

  app.use(function (err, req, res, next) {
    res.status((err.response && err.response.status) || 500).send((err.response && err.response.data) || err.message || err.error || err)
    next()
  })

}

module.exports = mock
