module.exports = function(situation) {
    var Person = situation.Person;

    Person.prototype.getÉligibleRSA = function() {
        this.get('allFamilyDefined');
        this.claimAllEligibleStatusDefined();
        this.claimAllEligibleResourcesDefined();
        this.get('allEligibleResources3Months');
        var age = this.get('age');
        if (!age) throw new Error('Unable to compute `éligibleRSA` attribute');
        if (age >= 25) return true;
        else return this.get('loneParent');
    };

};
