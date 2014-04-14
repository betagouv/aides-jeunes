var express = require('express');

var app = express();

app.use(express.favicon('public/img/favicon.ico'));
app.use(express.static('public'));
app.use('/js', express.static('dist'));
app.use(express.logger('dev'));
app.use(express.json());

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');


var Situation = require('./lib/situation');

// app.post('/process', function(req, res) {
//     var situ = new Situation(req.body.situation);
//     situ.get('simulation').then(
//         function(resp) {
//             res.send({
//                 params: req.body.situation,
//                 situation: situ.toJSON(),
//                 response: resp
//             });
//         },
//         function(reason) {
//             res.send({
//                 params: req.body.situation,
//                 situation: situ.toJSON(),
//                 claimedValues: reason.claimedValues
//             });
//         }
//     );
// });

app.get('/:situationId', function(req, res) {
  res.render('index', { situationId: req.params.situationId });
});

app.get('/', function(req, res) {
  res.redirect('/' + Math.floor(Math.random() * 100000));
});

app.listen(process.env.PORT || 5000);
