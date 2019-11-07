const configureAPI = require('./configure')



var rp = require('request-promise')
var outils = require('./backend/controllers/outils');
var mapping = require('./backend/lib/openfisca/mapping');

var buildOpenFiscaRequest = mapping.buildOpenFiscaRequest;
function sendToOpenfisca (situation, callback) {
    var request;
    try {
        request = buildOpenFiscaRequest(situation);
    } catch(e) {
        return callback({
            message: e.message,
            name: e.name,
            stack: e.stack
        });
    }
    rp({
        uri: 'https://openfisca.mes-aides.gouv.fr/calculate',
        method: 'POST',
        body: request,
        json: true,
    })
        .then(function(result) {
            callback(null, result);
        }).catch(callback);
}

module.exports = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          ...options.compilerOptions,
          preserveWhitespace: true,
        },
      }));
  },
  devServer: {
    before: function(app) {

      var cache;
      app.route('/api/outils/communes/:codePostal').get(outils.communes);
      app.post('/api/situations', function(req, res) {
        cache = Object.assign({_id: 'yolo'}, req.body)

        res.send(cache)
      })

      app.get('/api/situations/:id/openfisca-response', function(req, res) {
        sendToOpenfisca(cache, function(err, result) {
        res.send(Object.assign(result, { _id: 'yolo' }));
        })
      })
    }
  }
}
