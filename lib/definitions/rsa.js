exports['rsa.conditionÂge'] = {
    required: ['demandeur.âge'],
    optional: ['demandeur.parentIsolé'],
    getValue: function(âge, parentIsolé) {
        if (âge >= 25) return true;
        this.assumeDefined('demandeur.parentIsolé');
        return parentIsolé;
    }
};
