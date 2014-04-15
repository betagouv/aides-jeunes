module.exports = function(situation) {
    var Person = situation.Person;

    Person.prototype.getÉligibleLogement = function() {
        var home;
        var occupancyStatus = this.get('occupancyStatus');
        if (occupancyStatus === 'owner') {
            home = this.situation.dwelling(this.get('home'));
            return home.get('underMortgage');
        }
        if (occupancyStatus === 'tenant') {
            home = this.situation.dwelling(this.get('home'));
            return !home.get('ownedByOccupantFamily');
        }
        return false;
    };

    Person.prototype.getÉligibleAideAuLogement = function() {
        var éligibleLogement = this.get('éligibleLogement');
        var home = this.situation.dwelling(this.get('home'));
        return !!(éligibleLogement && home.get('rent') && home.get('postalCode'));
    };

};
