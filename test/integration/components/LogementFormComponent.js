title: 'h1',

declareSDSRadio: '[value="sansDomicile"] ~ span',
declareLocataireRadio: '[value="locataire"] ~ span',

declareLogementIsNotColocationRadio: '[model$="coloc"] [ng-class*="false"]',
declareProprietaireNotInFamilyRadio: '[model$="membreFamilleProprietaire"] [ng-class*="false"]',
declareLogementIsNotMeubleRadio: '[value="nonmeuble"]',
declareLogementIsNotChambreRadio: '[model$="logement_chambre"] [ng-class*="false"]',
loyerInput: '#loyer',
chargesInput: '#charges',

zipCodeInput: '#postal-code',
errorMessage: '.has-error .help-block',
city: '#city [selected]',
submitButton: 'button[type="submit"]',
