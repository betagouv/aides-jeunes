exports['prestationFictive.baseRessources'] = {
    required: ['demandeur.revenus'],
    optional: ['demandeur.travailSalarié', 'demandeur.rsa', 'demandeur.allocationsChômage', 'demandeur.pensionAlimentaire'],
    getValue: function(revenus, travailSalarié, rsa, allocationsChômage, pensionAlimentaire) {
        if (!revenus) return 0;
        var keys = ['demandeur.travailSalarié', 'demandeur.rsa', 'demandeur.allocationsChômage', 'demandeur.pensionAlimentaire'];
        this.assumeDefined(keys);
        this.assumeFilter(keys, function(value) { return value !== true; });
        return (travailSalarié || 0) + (rsa || 0) + (allocationsChômage || 0) + (pensionAlimentaire || 0);
    }
};
