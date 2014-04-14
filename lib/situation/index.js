/*
** Module dependencies
*/
var situation = require('situation-modeler');


/*
** Load overrides
*/
require('./overrides/person')(situation);

/*
** Load prestations
*/
require('./prestations/al')(situation);
require('./prestations/rsa')(situation);

/*
** Exports
*/
module.exports = situation;
