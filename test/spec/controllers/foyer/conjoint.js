    'use strict';

describe('Controller: FoyerConjointCtrl', function() {
    var rootScope, scope, state;

    beforeEach(function() {
        scope = {
            $emit: function() {},
            situation: {
                dateDeValeur: '2013-04-10',
                famille: {},
                individus: [{
                    role: 'demandeur',
                }],
            },
            $watch: function() {},
        };

        state = {
            go: function() {},
        };
        module('ddsApp');
    });


    var initController = function() {
        inject(function($controller) {
            $controller('FoyerConjointCtrl', {
                $scope: scope,
                $state: state,
            });
        });
    };

    it('s initial state', function() {
        initController();

        expect(scope.locals.isInCouple).toBe(undefined);
        expect(scope.shouldDisplaySubmit()).toBeFalsy();
    });

    describe('initial interactions', function() {
        beforeEach(function() {
            spyOn(state, 'go');
            initController();
            scope.locals.isInCouple = false;

            scope.isInCoupleUpdated();
        });

        it('redirects a single person without kid to foyer.logement', function() {
            expect(state.go).toHaveBeenCalledWith('foyer.logement');
        });

        it('does not show the submit button', function() {
            expect(scope.shouldDisplaySubmit()).toBe(false);
        });
    });

    describe('couple', function() {
        beforeEach(function() {
            spyOn(state, 'go');
            initController();
            scope.locals.isInCouple = true;

            scope.isInCoupleUpdated();
        });

        it('stays on the page', function() {
            expect(state.go).not.toHaveBeenCalledWith('foyer.logement');
        });

        it('does not show the submit button', function() {
            expect(scope.shouldDisplaySubmit()).toBe(false);
        });
    });

    describe('user with kids for isolement', function() {
        beforeEach(function() {
            scope.situation.individus.push({
                role: 'enfant'
            });
            spyOn(state, 'go');
            initController();
            scope.locals.isInCouple = false;
            scope.isInCoupleUpdated();
        });

        it('ask for isolement and stays on the page', function() {
            expect(scope.captureRsaIsolementRecent()).toBe(true);
            expect(state.go).not.toHaveBeenCalled();
        });

        it('does not show a submit button', function() {
            expect(scope.shouldDisplaySubmit()).toBeFalsy();
        });

        describe('isolement input', function() {
            beforeEach(function() {
                scope.situation.famille.rsa_isolement_recent = true;
                scope.rsaIsolementRecentUpdated();
            });

            it('goes to foyer.logement', function() {
                expect(scope.shouldDisplaySubmit()).toBe(false);
                expect(state.go).toHaveBeenCalledWith('foyer.logement');
            });
        });
    });

    describe('edition', function() {
        describe('single individual w/o kids', function() {
            beforeEach(function() {
                scope.situation.individus[0].statut_marital = 2; // Célibataire
                initController();
            });

            it('has single button toggled', function() {
                expect(scope.locals.isInCouple).toBe(false);
            });

            it('does not capture isolement', function() {
                expect(scope.captureRsaIsolementRecent()).toBe(false);
            });

            it('displays the submit button', function() {
                expect(scope.shouldDisplaySubmit()).toBe(true);
            });
        });

        describe('single individual with a kid', function() {
            beforeEach(function() {
                scope.situation.individus[0].statut_marital = 2; // Célibataire
                scope.situation.individus.push({ role: 'enfant' });
                scope.situation.famille.rsa_isolement_recent = true;
                initController();
            });

            it('has single button toggled', function() {
                expect(scope.locals.isInCouple).toBe(false);
            });

            it('should not capture isolement', function() {
                expect(scope.captureRsaIsolementRecent()).toBe(true);
            });

            it('displays the submit button', function() {
                expect(scope.shouldDisplaySubmit()).toBe(false);
            });

            describe('change to couple', function() {
                beforeEach(function() {
                    scope.locals.isInCouple = true;
                    scope.isInCoupleUpdated();
                });

                it('hides the submit button', function() {
                    expect(scope.shouldDisplaySubmit()).toBe(false);
                });
            });
        });

        describe('individual in union libre', function() {
            beforeEach(function() {
                scope.situation.individus[0].statut_marital = 2; // Célibataire
                scope.situation.individus.push({ role: 'conjoint' });
                initController();
            });

            it('has single button toggled', function() {
                expect(scope.locals.isInCouple).toBe(true);
            });

            it('does not capture isolement', function() {
                expect(scope.captureRsaIsolementRecent()).toBe(false);
            });

            it('displays the submit button', function() {
                expect(scope.shouldDisplaySubmit()).toBe(false);
            });

            describe('change to single', function() {
                beforeEach(function() {
                    scope.locals.isInCouple = false;
                    scope.isInCoupleUpdated();
                });

                it('displays the submit button', function() {
                    expect(scope.shouldDisplaySubmit()).toBe(true);
                });
            });
        });
    });
});
