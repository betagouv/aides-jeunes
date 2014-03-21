var express = require('express');
var _ = require('lodash');

var app = express();

app.use(express.favicon('public/img/favicon.ico'));
app.use(express.static('public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

var Engine = require('./lib/engine');
var engine = new Engine();
require('./lib/legislation/rsa')(engine);
require('./lib/legislation/al')(engine);
require('./lib/models/person')(engine);

var Context = require('./lib/context');

app.post('/process', function(req, res) {
    var ctx = new Context(req.body.situation, engine);
    var resp = ctx.get('rsa.conditionÂge');
    res.send({
        params: req.body.situation,
        situation: _.extend({}, ctx.computedValues, ctx.userValues),
        response: resp,
        claimedValues: ctx.claimedValues
    });
});

app.get('/', function(req, res){
  res.render('index');
});

app.listen(process.env.PORT || 5000);
