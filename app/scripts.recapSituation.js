// @see https://babeljs.io/docs/en/babel-polyfill
require('core-js/stable');
require('regenerator-runtime/runtime');

global.moment = require('moment');

require('angular-ui-router');
require('angular-ui-bootstrap');
require('angular-animate');
require('angular-sanitize');
require('angulartics');
require('angulartics-piwik');
require('ngstorage');

require('moment/locale/fr');
require('angular-i18n/angular-locale_fr');

require('./styles/front.scss');

if (process.env.NODE_ENV === 'production') {
    require('./sentry.js');
}

require('./js/embed.js');
require('./js/common.js');

require('./js/controllers/foyer/recapSituation.js');

var situationsFamiliales = require('./js/constants/situationsFamiliales.js');
angular.module('ddsCommon').constant('situationsFamiliales', situationsFamiliales);

var ressources = require('./js/constants/ressources.js');
angular.module('ddsCommon').constant('ressourceCategories', ressources.ressourceCategories);
angular.module('ddsCommon').constant('ressourceTypes', ressources.ressourceTypes);
angular.module('ddsCommon').constant('categoriesRnc', ressources.categoriesRnc);
angular.module('ddsCommon').constant('patrimoineTypes', ressources.patrimoineTypes);

require('./js/constants/specificSituations.js');
require('./js/constants/logementTypes.js');

require('./js/directives/individuBlock.js');

require('./js/services/nationaliteService.js');
require('./js/services/cityService.js');
require('./js/services/individuService.js');
require('./js/services/logementService.js');
require('./js/services/monthService.js');
require('./js/services/ressourceService.js');
require('./js/services/situationService.js');

require('./js/directives/recapSituation.js');

require('./js/filters/strings.js');
