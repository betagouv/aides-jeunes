var expect = require('expect');
var moment = require('moment');

var situation = {
    "individus":[
        {
            "role":"demandeur",
            "date_naissance":"1983-06-05T22:00:00.000Z",
            "statut_marital":"celibataire",
            "indemnites_journalieres_maladie_professionnelle":{
                "2017-07":200,
                "2017-08":200,
                "2017-09":200,
                "2017-10":200,
                "2017-11":200,
                "2017-12":200,
                "2018-01":200,
                "2018-02":200,
                "2018-03":200,
                "2018-04":200,
                "2018-05":200,
                "2018-06":200,
                "2018-07":200
            },
            "salaire_net_hors_revenus_exceptionnels":{
                "2017-07":2200,
                "2017-08":2200,
                "2017-09":2200,
                "2017-10":2200,
                "2017-11":2200,
                "2017-12":2200,
                "2018-01":2200,
                "2018-02":2200,
                "2018-03":2200,
                "2018-04":2200,
                "2018-05":2200,
                "2018-06":2200,
                "2018-07":2200
            },
            "primes_salaires_net": {
                "2017-07":0,
                "2017-08":0,
                "2017-09":0,
                "2017-10":0,
                "2017-11":0,
                "2017-12":0,
                "2018-01":0,
                "2018-02":0,
                "2018-03":0,
                "2018-04":0,
                "2018-05":0,
                "2018-06":1000,
                "2018-07":0
            },
            "retraite_nette":{
                "2017-07":100,
                "2017-08":100,
                "2017-09":100,
                "2017-10":100,
                "2017-11":100,
                "2017-12":100,
                "2018-01":100,
                "2018-02":100,
                "2018-03":100,
                "2018-04":100,
                "2018-05":100,
                "2018-06":100,
                "2018-07":100
            },
        }
    ]
};

var Loiret = require('../../../backend/lib/teleservices/loiret');

describe('Loiret Teleservice', function() {

    it('returns expected values for internal purpose', function() {

        moment.locale('fr');

        var loiret = new Loiret(situation);
        var formatted = loiret.toInternal();
        expect(formatted).toBeA('array');
        expect(formatted).toInclude({ label: 'votre date de naissance', formattedValue: '5 juin 1983' });
        expect(formatted).toInclude({ label: 'votre situation familiale', formattedValue: 'En union libre' });
        expect(formatted).toInclude({ label: 'vos salaires (net) sur les 12 derniers mois', formattedValue: '27400 €' });
        expect(formatted).toInclude({ label: 'votre retraite (net) sur les 12 derniers mois', formattedValue: '1200 €' });
        expect(formatted).toInclude({ label: 'vos allocations sur les 12 derniers mois', formattedValue: '2400 €' });
        expect(formatted).toInclude({ label: 'vos pensions alimentaires perçues', formattedValue: '0 €' });
        expect(formatted).toInclude({ label: 'vos revenus locatifs', formattedValue: '0 €' });
        expect(formatted).toInclude({ label: 'vos revenus du capital', formattedValue: '0 €' });
    });

    it('returns expected values for date de naissance', function() {
        var loiret = new Loiret(situation);
        var formatted = loiret.toExternal();
        expect(formatted).toIncludeKey('date_naissance_dem');
        expect(formatted.date_naissance_dem).toEqual('05/06/1983');
    });

    it('returns expected values for statut marital', function() {
        var expectations = [
            {
                "statut_marital": "celibataire",
                "situationfam_dem": 0
            },
            {
                "statut_marital": "pacse",
                "situationfam_dem": 5
            },
            {
                "statut_marital": "marie",
                "situationfam_dem": 1
            }
        ];
        expectations.forEach(function(expectation) {
            var situation = {
                "individus": [
                    {
                        "role": "demandeur",
                        "statut_marital": expectation.statut_marital,
                    }
                ]
            };
            var loiret = new Loiret(situation);
            var formatted = loiret.toExternal();
            expect(formatted).toIncludeKey('situationfam_dem');
            expect(formatted.situationfam_dem).toEqual(expectation.situationfam_dem);
        });
    });

    it('returns expected values for date de naissance', function() {
        var loiret = new Loiret(situation);
        var formatted = loiret.toExternal();
        expect(formatted).toIncludeKey('date_naissance_dem');
        expect(formatted.date_naissance_dem).toEqual('05/06/1983');
    });

    it('returns expected values for retraite nette', function() {
        var situation = {
            "individus": [
                {
                    "role": "demandeur",
                    "retraite_nette":{
                        "2017-07":100,
                        "2017-08":100,
                        "2017-09":100,
                        "2017-10":100,
                        "2017-11":100,
                        "2017-12":100,
                        "2018-01":100,
                        "2018-02":100,
                        "2018-03":100,
                        "2018-04":100,
                        "2018-05":100,
                        "2018-06":100,
                        "2018-07":100
                    },
                    "retraite_combattant":{
                        "2017-07":100,
                        "2017-08":100,
                        "2017-09":100,
                        "2017-10":100,
                        "2017-11":100,
                        "2017-12":100,
                        "2018-01":100,
                        "2018-02":100,
                        "2018-03":100,
                        "2018-04":100,
                        "2018-05":100,
                        "2018-06":100,
                        "2018-07":100
                    },
                }
            ]
        };

        var loiret = new Loiret(situation);
        var formatted = loiret.toExternal();
        expect(formatted).toIncludeKey('montantRetraite_dem');
        expect(formatted.montantRetraite_dem).toEqual(2400);
    });

    it('returns expected values for salaire net', function() {
        var situation = {
            "individus": [
                {
                    "role": "demandeur",
                    "salaire_net_hors_revenus_exceptionnels":{
                        "2017-07":2000,
                        "2017-08":2000,
                        "2017-09":2000,
                        "2017-10":2000,
                        "2017-11":2000,
                        "2017-12":2000,
                        "2018-01":2000,
                        "2018-02":2000,
                        "2018-03":2000,
                        "2018-04":2000,
                        "2018-05":2000,
                        "2018-06":2000,
                        "2018-07":2000
                    }
                }
            ]
        };

        var loiret = new Loiret(situation);
        var formatted = loiret.toExternal();
        expect(formatted).toIncludeKey('salaire_dem');
        expect(formatted.salaire_dem).toEqual(24000);
    });

    it('returns expected values for pensions alimentaires', function() {
        var situation = {
            "individus": [
                {
                    "role": "demandeur",
                    "pensions_alimentaires_percues":{
                        "2017-07":100,
                        "2017-08":100,
                        "2017-09":100,
                        "2017-10":100,
                        "2017-11":100,
                        "2017-12":100,
                        "2018-01":100,
                        "2018-02":100,
                        "2018-03":100,
                        "2018-04":100,
                        "2018-05":100,
                        "2018-06":100,
                        "2018-07":100
                    }
                }
            ]
        };

        var loiret = new Loiret(situation);
        var formatted = loiret.toExternal();
        expect(formatted).toIncludeKey('pension_dem');
        expect(formatted.pension_dem).toEqual(1200);
    });

    it('returns expected values for revenus locatifs', function() {
        var situation = {
            "individus": [
                {
                    "role": "demandeur",
                    "revenus_locatifs":{
                        "2017-07":500,
                        "2017-08":500,
                        "2017-09":500,
                        "2017-10":500,
                        "2017-11":500,
                        "2017-12":500,
                        "2018-01":500,
                        "2018-02":500,
                        "2018-03":500,
                        "2018-04":500,
                        "2018-05":500,
                        "2018-06":500,
                        "2018-07":500
                    }
                }
            ]
        };

        var loiret = new Loiret(situation);
        var formatted = loiret.toExternal();
        expect(formatted).toIncludeKey('rev_loca_dem');
        expect(formatted.rev_loca_dem).toEqual(6000);
    });

    it('returns expected values for revenus du capital', function() {
        var situation = {
            "individus": [
                {
                    "role": "demandeur",
                    "revenus_capital":{
                        "2017-07":500,
                        "2017-08":500,
                        "2017-09":500,
                        "2017-10":500,
                        "2017-11":500,
                        "2017-12":500,
                        "2018-01":500,
                        "2018-02":500,
                        "2018-03":500,
                        "2018-04":500,
                        "2018-05":500,
                        "2018-06":500,
                        "2018-07":500
                    }
                }
            ]
        };

        var loiret = new Loiret(situation);
        var formatted = loiret.toExternal();
        expect(formatted).toIncludeKey('rev_biens_dem');
        expect(formatted.rev_biens_dem).toEqual(6000);
    });

    it('returns expected values for allocations', function() {
        var situation = {
            "individus": [
                {
                    "role": "demandeur",
                    "indemnites_journalieres_maladie_professionnelle":{
                        "2017-07":100,
                        "2017-08":100,
                        "2017-09":100,
                        "2017-10":100,
                        "2017-11":100,
                        "2017-12":100,
                        "2018-01":100,
                        "2018-02":100,
                        "2018-03":100,
                        "2018-04":100,
                        "2018-05":100,
                        "2018-06":100,
                        "2018-07":100
                    },
                    "indemnites_journalieres_maladie":{
                        "2017-07":100,
                        "2017-08":100,
                        "2017-09":100,
                        "2017-10":100,
                        "2017-11":100,
                        "2017-12":100,
                        "2018-01":100,
                        "2018-02":100,
                        "2018-03":100,
                        "2018-04":100,
                        "2018-05":100,
                        "2018-06":100,
                        "2018-07":100
                    },
                    "pensions_invalidite":{
                        "2017-07":100,
                        "2017-08":100,
                        "2017-09":100,
                        "2017-10":100,
                        "2017-11":100,
                        "2017-12":100,
                        "2018-01":100,
                        "2018-02":100,
                        "2018-03":100,
                        "2018-04":100,
                        "2018-05":100,
                        "2018-06":100,
                        "2018-07":100
                    },
                }
            ]
        };

        var loiret = new Loiret(situation);
        var formatted = loiret.toExternal();
        expect(formatted).toIncludeKey('allocations_dem');
        expect(formatted.allocations_dem).toEqual(3600);
    });

});
