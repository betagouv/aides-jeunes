var express = require('express');
var _ = require('lodash');

var app = express();

app.use(express.favicon('public/img/favicon.ico'));
app.use(express.static('public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');


var Situation = require('./lib/situation');

app.post('/process', function(req, res) {
    var situ = new Situation(req.body.situation);
    var resp = situ.get('simulation');
    res.send({
        params: req.body.situation,
        situation: _.extend({}, situ.computedValues, situ.userValues),
        response: resp,
        claimedValues: situ.claimedValues
    });
});

app.get('/', function(req, res){
  res.render('index');
});

app.listen(process.env.PORT || 5000);
