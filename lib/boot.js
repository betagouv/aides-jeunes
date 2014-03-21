var Engine = require('./engine');
var Context = require('./context');
require('colors');

var _ = require('lodash');

var engine = new Engine();
require('./legislation/rsa')(engine);
require('./legislation/al')(engine);
require('./models/person')(engine);

function test(situation) {
    var ctx = new Context(situation, engine);
    _(ctx.userValues).forEach(function(v, k) { console.log(k + ': ' + v); });
    var result = ctx.get('al.éligibilité');
    _(ctx.computedValues).forEach(function(v, k) { console.log(k + ': ' + v); });
    console.log('=> Response: ' + (_.isUndefined(result) ? 'undefined'.red : result.toString().green));
    _(ctx.claimedValues).forEach(function(v, k) { console.log('Claimed value: ' + k.yellow); });
    console.log('');
}

test({

});
// test({
//     'demandeur.dateDeNaissance': '2000/10/18',
//     'demandeur.situationFamiliale': 'célibataire',
//     'demandeur.nbEnfantsÀCharge': 0,
//     'demandeur.enceinte': false,
//     'demandeur.situationLogement': 'propriétaire',
//     'logement.emprunt': false
// });
// test({
//     'demandeur.dateDeNaissance': '2000/10/18',
//     'demandeur.situationFamiliale': 'célibataire',
//     'demandeur.nbEnfantsÀCharge': 0,
//     'demandeur.enceinte': true
// });
// test({
//     'demandeur.dateDeNaissance': '2000/10/18',
//     'demandeur.situationFamiliale': 'pacsé(e)',
//     'demandeur.nbEnfantsÀCharge': 1
// });