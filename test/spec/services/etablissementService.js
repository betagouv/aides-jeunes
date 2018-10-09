'use strict';

describe('EtablissementService', function() {
    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(EtablissementService) {
            service = EtablissementService;
        });
    });

    describe('getEtablissementTypesBySituation()', function() {

        it('Should contain default types', function() {

            var situation = {
                "individus": [
                    {
                        "id": "demandeur",
                        "role": "demandeur",
                        "specificSituations": [],
                    }
                ],
            };

            var types = service.getEtablissementTypesBySituation(situation);

            expect(types).toContain('ccas');
            expect(types).toContain('cdas');
            expect(types).toContain('sdsei');
            expect(types).toContain('edas');
            expect(types).toContain('msap');
        });

        it('Should contain "maison_handicapees" when demandeur has a disability', function() {

            var situation = {
                "individus": [
                    {
                        "id": "demandeur",
                        "role": "demandeur",
                        "specificSituations": [
                            "handicap"
                        ],
                    }
                ],
            };

            expect(service.getEtablissementTypesBySituation(situation)).toContain('maison_handicapees');
        });

        it('Should contain "maison_handicapees" when one child has a disability', function() {

            var situation = {
                "individus": [
                    {
                        "id": "demandeur",
                        "role": "demandeur",
                        "specificSituations": [],
                    },
                    {
                        "id": "enfant_1",
                        "role": "enfant",
                        "specificSituations": [],
                    },
                    {
                        "id": "enfant_2",
                        "role": "enfant",
                        "specificSituations": [
                            "handicap"
                        ],
                    }
                ],
            };

            expect(service.getEtablissementTypesBySituation(situation)).toContain('maison_handicapees');
        });
    });
});
