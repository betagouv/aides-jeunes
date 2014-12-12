'use strict';

describe('Controller: FoyerRessourceMontantsCtrl', function() {

    var scope;

    beforeEach(function() {
        module('ddsApp');
        scope = { situation: {} };
        inject(function($controller) {
            $controller('FoyerRessourceMontantsCtrl', {
                $scope: scope
            });
        });
    });

    describe('initialization', function() {
        it('should set the yearMoinsUn var to the previous year', function() {
            expect(scope.yearMoinsUn).toBeDefined();
        });
    });

    describe('function applyIndividuRefsRessourcesToIndividus()', function() {
        it('should fill the individu.interruptedRessources field with ressources declared as interrupted', function() {
            // given
            var individu = {};
            scope.individuRefs = [
                {
                    individu: individu,
                    ressources: [
                        { type: { id: 'test' }, interrupted: false },
                        { type: { id: 'test2' }, interrupted: true }
                    ]
                }
            ];
            scope.momentDebutAnnee = { format: function() {}};
            scope.momentFinAnnee = { format: function() {}};

            // when
            scope.applyIndividuRefsRessourcesToIndividus();

            // then
            expect(individu.interruptedRessources.length).toBe(1);
            expect(individu.interruptedRessources[0]).toEqual('test2');
        });
    });
});
