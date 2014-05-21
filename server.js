var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');
var openfisca = require('./lib/simulation/openfisca');
var moment = require('moment');

moment.lang('fr');

mongoose.connect(process.env.MONGODB_URL || process.env.MONGOHQ_URL);

var app = express();

app.locals.moment = moment;

app.use(express.favicon('public/img/favicon.ico'));
app.use(express.static('public'));
app.use('/js', express.static('dist'));
app.use(express.static('app'));
app.use(express.logger('dev'));
app.use(express.json());

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

var SituationModel = require('./lib/models/situation');
var expand = require('./lib/situation').expand;

app.get('/api/situations/:situationId', function(req, res, next) {
    SituationModel.findById(req.params.situationId, function(err, situation) {
        if (err) return next(err);
        if (!situation) return res.send(404);
        res.send(situation);
    });
});

app.put('/api/situations/:situationId', function(req, res, next) {
    SituationModel.findByIdAndUpdate(req.params.situationId, _.extend({ _updated: Date.now() }, _.omit(req.body, '_id')), { upsert: true }, function(err, situation) {
        if (err) return next(err);
        if (!situation) return res.send(400);
        res.send(situation);
    });
});

app.get('/api/situations/:situationId/simulation', function(req, res, next) {
    SituationModel.findById(req.params.situationId).lean().exec(function(err, situation) {
        if (err) return next(err);
        if (!situation) return res.send(404);
        openfisca.simulate(expand(situation), function(err, result) {
            if (err) next(err);
            res.send(result);
        });
    });
});

app.get('/api/situations/:situationId/openfisca-request', function(req, res, next) {
    SituationModel.findById(req.params.situationId).lean().exec(function(err, situation) {
        if (err) return next(err);
        if (!situation) return res.send(404);
        res.send(openfisca.buildRequest(expand(situation)));
    });
});

app.get('/situation/:situationCode', function(req, res) {
  res.render('index', { situationId: req.params.situationCode });
});

app.get('/', function(req, res) {
  res.redirect('/situation/' + mongoose.Types.ObjectId());
});

app.listen(process.env.PORT || 5000);
