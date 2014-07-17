var openfisca = require('../../../lib/simulation/openfisca');

describe('openfisca', function() {
    describe('mapFamilles', function() {
        it('should map parents', function() {
            var situation = {
                individus: [
                    {
                        _id: 'demandeur',
                        role: 'demandeur'
                    },
                    {
                        _id: 'conjoint',
                        role: 'conjoint'
                    },
                    {
                        _id: 'test',
                        role: 'test'
                    }
                ]
            };
            var result = openfisca.mapFamilles(situation);
            result.should.eql([{parents: ['demandeur', 'conjoint'], enfants: []}]);
        });

        it('should map children', function() {
            var situation = {
                individus: [
                    {
                        _id: 'enfant1',
                        role: 'enfant'
                    },
                    {
                        _id: 'enfant2',
                        role: 'enfant'
                    },
                    {
                        _id: 'test',
                        role: 'test'
                    }
                ]
            };
            var result = openfisca.mapFamilles(situation);
            result.should.eql([{parents: [], enfants: ['enfant1', 'enfant2']}]);
        });
    });

    describe('mapMenages', function() {
        it('should map demandeur as personne de référence', function() {
            var situation = {
                logement: {},
                individus: [
                    {
                        _id: 'demandeur',
                        role: 'demandeur'
                    }
                ]
            };
            var result = openfisca.mapMenages(situation);
            result.should.eql([{personne_de_reference: 'demandeur', enfants: []}]);
        });

        it('should map conjoint if provided', function() {
            var situation = {
                logement: {},
                individus: [
                    {
                        _id: 'demandeur',
                        role: 'demandeur'
                    },
                    {
                        _id: 'conjoint',
                        role: 'conjoint'
                    }
                ]
            };
            var result = openfisca.mapMenages(situation);
            result.should.eql([{personne_de_reference: 'demandeur', conjoint: 'conjoint', enfants: []}]);
        });

        it('should map children', function() {
            var situation = {
                logement: {},
                individus: [
                    {
                        _id: 'demandeur',
                        role: 'demandeur'
                    },
                    {
                        _id: 'enfant',
                        role: 'enfant'
                    },
                    {
                        _id: 'test',
                        role: 'test'
                    }
                ]
            };
            var result = openfisca.mapMenages(situation);
            result.should.eql([{personne_de_reference: 'demandeur', enfants: ['enfant']}]);
        });
    });

    describe('mapFoyersFiscaux', function() {
        it('should map parents as declarants', function() {
            var situation = {
                individus: [
                    {
                        _id: 'demandeur',
                        role: 'demandeur',
                        dateDeNaissance: '1989-09-14'
                    },
                    {
                        _id: 'conjoint',
                        role: 'conjoint',
                        dateDeNaissance: '1989-09-14'
                    }
                ]
            };
            var result = openfisca.mapFoyersFiscaux(situation);
            result.should.eql([{declarants: ['demandeur', 'conjoint'], personnes_a_charge: []}]);
        });

        it('should throw an exception if one of the declarants is less than 18', function() {
            var situation = {
                individus: [
                    {
                        _id: 'demandeur',
                        role: 'demandeur',
                        dateDeNaissance: '2028-09-14'
                    }
                ]
            };
            var map = openfisca.mapFoyersFiscaux.bind(null, situation);
            map.should.throw('Le déclarant de role "demandeur" a moins de 18 ans');
        });
    });

    describe('mapIndividus', function() {
        it('should map to an well-formatted object for openfisca', function() {
            var situation = {
                individus: [
                    {
                        _id: 'demandeur',
                        role: 'demandeur',
                        dateDeNaissance: '1989-09-14'
                    }
                ]
            };
            var result = openfisca.mapIndividus(situation);
            result.should.eql([
                {
                    id: 'demandeur',
                    birth: '1989-09-14',
                    sali: 0,
                    choi: 0,
                    alr: 0,
                    rsti: 0
                }
            ]);
        });

        it('should throw an exception if no birth date is provided for an individu', function() {
            var situation = {
                individus: [
                    {
                        _id: 'demandeur',
                        role: 'demandeur'
                    }
                ]
            };
            var result = openfisca.mapIndividus.bind(null, situation);
            result.should.throw('L\'individu de role "demandeur" n\'a pas de date de naissance renseignée');
        });
    });

    describe('mapLogement', function() {
        it('should set menage status occupation to 4 when location non meublée', function() {
            var logement = {
                type: 'locataire',
                locationType: 'nonmeuble'
            };
            var result ={};
            openfisca.mapLogement(logement, result);

            result.so.should.be.exactly(4);
        });

        it('should set menage status occupation to 1 when proprietaire primo-accédant', function() {
            var logement = {
                type: 'proprietaire',
                primoAccedant: true
            };
            var result ={};
            openfisca.mapLogement(logement, result);

            result.so.should.be.exactly(1);
        });

        it('should not set menage.so when logement type is unknown', function() {
            var logement = {
                type: 'unknown'
            };
            var result ={};
            openfisca.mapLogement(logement, result);

            result.should.not.have.property('so');
        });

        it('should cast postal code to number', function() {
            var logement = { codePostal: '75011' };
            var result ={};
            openfisca.mapLogement(logement, result);
            result.code_postal.should.be.exactly(75011);
        });
    });
});
