module.exports = function(situation) {
    var Person = situation.Person;

    Person.prototype.setNumChildren = function(numChildren) {
        if (this.children.length !== 0) return;
        for (var i = 1; i <= numChildren; i++) {
            this.situation.person(this.id + '.enfant' + i).childOf(this);
        }
    };

    Person.prototype.getNumChildren = function() {
        return this.children.length;
    };

    Person.prototype.setOccupancyStatus = function(occupancyStatus) {
        if (!this.hasUserAttribute('home') && occupancyStatus !== 'homeless') {
            return this.occupant(this.id + '.logement', occupancyStatus);
        }
        this.setUserAttribute('occupancyStatus', occupancyStatus);
    };

};
