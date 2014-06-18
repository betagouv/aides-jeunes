/* global window */
var situation = require('../situation');
var rsa = require('../simulation/rsa');
var aideLogement = require('../simulation/logement');
var questions = require('./questions');
var _ = require('lodash');
var _s = require('underscore.string');
var moment = require('moment');
require('../../node_modules/moment/lang/fr');

window.rsa = rsa;
window.aideLogement = aideLogement;
window.situation = situation;
window._ = _;
window._s = _s;
window.moment = moment;
window.questions = questions;
