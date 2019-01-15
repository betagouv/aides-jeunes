// Include @babel/polyfill at the top of the entry point
// @see https://babeljs.io/docs/en/babel-polyfill
require('@babel/polyfill');

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
require('./styles/main.css');
require('./styles/header.css');
require('./styles/footer.css');
require('./styles/homepage.css');
require('./styles/individu-form.css');
require('./styles/resources.css');
require('./styles/logement.css');
require('./styles/redirection.css');
require('./styles/resultat.css');
require('./styles/validation.css');
require('./styles/text-container.css');
require('./styles/enfants.css');
require('./styles/foyer/capture-montant-ressource.css');
require('./styles/foyer/capture-continuation-ressource.css');
require('./styles/recap-situation.css');
require('./styles/droits-eligibles-list.scss');
require('./styles/breadcrumb.css');

if (process.env.NODE_ENV === 'production') {
    require('./sentry.js');
}

require('./js/common.js');
require('./js/app.js');

require('./js/services/abtestingService.js');
require('./js/services/cityService.js');
require('./js/services/situationService.js');
require('./js/services/resultatService.js');
require('./js/services/individuService.js');
require('./js/services/ressourceService.js');
require('./js/services/customizationService.js');
require('./js/services/logementService.js');
require('./js/services/trampolineService.js');
require('./js/services/monthService.js');
require('./js/services/etablissementService.js');
require('./js/services/suggestionService.js');

var situationsFamiliales = require('./js/constants/situationsFamiliales.js');
angular.module('ddsCommon').constant('situationsFamiliales', situationsFamiliales);

var ressources = require('./js/constants/ressources.js');
angular.module('ddsCommon').constant('ressourceCategories', ressources.ressourceCategories);
angular.module('ddsCommon').constant('ressourceTypes', ressources.ressourceTypes);
angular.module('ddsCommon').constant('categoriesRnc', ressources.categoriesRnc);
angular.module('ddsCommon').constant('patrimoineTypes', ressources.patrimoineTypes);

require('./js/constants/specificSituations.js');
require('./js/constants/nationalites.js');
require('./js/constants/logementTypes.js');

var droits = require('./js/constants/droits.js');
angular.module('ddsCommon').constant('droitsDescription', droits);

var phishingExpressions = require('./js/constants/phishingExpressions.js');
angular.module('ddsCommon').constant('phishingExpressions', phishingExpressions);

require('./js/constants/lyonMetropoleInseeCodes.js');

require('./js/controllers/body.js');
require('./js/controllers/homepage.js');
require('./js/controllers/foyer.js');
require('./js/controllers/foyer/individuForm.js');
require('./js/controllers/foyer/conjoint.js');
require('./js/controllers/foyer/enfants.js');
require('./js/controllers/foyer/logement.js');
require('./js/controllers/foyer/ressources/ressources.js');
require('./js/controllers/foyer/ressources/individu.js');
require('./js/controllers/foyer/ressources/types.js');
require('./js/controllers/foyer/ressources/montants.js');
require('./js/controllers/foyer/ressources/enfants.js');
require('./js/controllers/foyer/pensionsAlimentaires.js');
require('./js/controllers/foyer/yearMoins2.js');
require('./js/controllers/foyer/rfr.js');
require('./js/controllers/foyer/suggestion.js');
require('./js/controllers/foyer/recapSituation.js');
require('./js/controllers/foyer/patrimoine.js');
require('./js/controllers/redirection.js');
require('./js/controllers/resultat.js');
require('./js/controllers/stats.js');
require('./js/controllers/validation.js');

require('./js/directives/breadcrumb.js');
require('./js/directives/date.js');
require('./js/directives/droitCta.js');
require('./js/directives/selectOnFocus.js');
require('./js/directives/zeroToEmpty.js');
require('./js/directives/individuBlock.js');
require('./js/directives/etablissementsList.js');
require('./js/directives/droitsList.js');
require('./js/directives/focus.js');
require('./js/directives/captureMontantRessource.js');
require('./js/directives/captureContinuationRessource.js');
require('./js/directives/droitsEligiblesList.js');
require('./js/directives/ym2RessourcesCallToAction.js');
require('./js/directives/yesNoQuestion.js');

require('./js/filters/strings.js');
require('./js/filters/isEmpty.js');
require('./js/filters/orderObjectBy.js');
