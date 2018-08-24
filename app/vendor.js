var _ = require('lodash');
var angular = require('angular');
var Cleave = require('cleave.js');
var moment = require('moment');
var jsyaml = require('js-yaml');

require('moment/locale/fr');
require('angular-i18n/angular-locale_fr');

require('angular-sanitize');
require('angular-ui-router');
require('angular-animate');
require('ngstorage');
require('angular-ui-bootstrap');
require('angulartics');
require('angulartics-piwik');

window.angular = angular;
window.moment = moment;
window._ = _;
window.Cleave = Cleave;
window.jsyaml = jsyaml;
