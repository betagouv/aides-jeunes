var statusList = require('../status');
var resourceTypeList = require('../resources');
var _ = require('lodash');

module.exports = function(situation) {
    var Person = situation.Person;

    Person.prototype.setNumChildren = function(numChildren) {
        if (this.children.length !== 0) return;
        for (var i = 1; i <= numChildren; i++) {
            this.situation.person(this.id + '.enfant' + i).childOf(this);
        }
        this.setUserAttribute('numChildren', numChildren);
    };

    Person.prototype.setOccupancyStatus = function(occupancyStatus) {
        if (!this.hasUserAttribute('home') && occupancyStatus !== 'homeless') {
            return this.occupant(this.id + '.logement', occupancyStatus);
        }
        this.setUserAttribute('occupancyStatus', occupancyStatus);
    };

    Person.prototype.setMaritalStatus = function(maritalStatus) {
        if (!this.hasUserAttribute('maritalPartner') && maritalStatus !== 'single') {
            return this.setRelationshipWith(this.id + '.conjoint', maritalStatus);
        }
        this.setUserAttribute('maritalStatus', maritalStatus);
    };

    Person.prototype.getFamilyOK = function() {
        if (this.get('maritalStatus') !== 'single') {
            this.situation.person(this.get('maritalPartner')).get('birthdate');
        }
    };

    Person.prototype.claimAllEligibleStatusDefined = function() {
        if (_.find(statusList, function(status, statusName) {
            return !this.hasAttribute(statusName);
        }, this)) {
            this.claim('allEligibleStatusDefined');
        }
    };

    Person.prototype.claimAllEligibleResourcesDefined = function() {
        if (_.find(resourceTypeList, function(resourceType, resourceTypeName) {
            return !this.hasAttribute(resourceType);
        }, this)) {
            this.claim('allEligibleResourcesDefined');
        }
    };

};
