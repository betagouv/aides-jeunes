var _ = require('lodash');
var Q = require('q');
var colors = require('colors');

var definitions = require('./definitions');

var Situation = module.exports = function(values) {
    this._values = _.clone(values);
};

Situation.prototype.get = function(key) {
    if (!(key in this._values)) this.compute(key);
    return Q(this._values[key]);
};

Situation.prototype.respond = function(value) {
    return Q(value);
};

Situation.prototype.claim = function(key) {
    return Q.reject({ claimedValues: [key] });
};

Situation.prototype.compute = function(key) {
    if (key in this._values) return;

    if (!definitions[key]) {
        this._values[key] = Q.reject({ claimedValues: [key] });
        return;
    }

    var self = this;
    var def = definitions[key];

    var requiredValues = def.required ? def.required.map(function(key) { return self.get(key); }) : [];
    var optionalValues = def.optional ? def.optional.map(function(key) { return self.get(key); }) : [];

    var requiredValuesProcessed = Q.allSettled(requiredValues).then(function(promises) {
        var values = [];
        var claimedValues = [];
        promises.forEach(function(promise) {
            values.push(promise.value);
            if (promise.state === 'rejected') {
                claimedValues.push(promise.reason.claimedValues);
            }
        });

        if (claimedValues.length > 0) return Q.reject({ claimedValues: _.uniq(_.flatten(claimedValues)) });
        return values;
    });

    var optionalValuesProcessed = Q.allSettled(optionalValues).then(function(promises) {
        return _.pluck(promises, 'value');
    });

    this._values[key] = Q.all([requiredValuesProcessed, optionalValuesProcessed]).then(function(values) {
        return Q.fapply(_.bind(def.getValue, self), _.flatten(values)).fail(function(reason) {
            if (!reason.claimedValues) throw reason;
            // TODO: When claimedValues.length > 1
            return Q.reject(self._values[reason.claimedValues].inspect().reason);
        });
    });
};

Situation.prototype.toJSON = function() {
    var response = {};
    _(this._values).forEach(function(promise, key) {
        var snapshot = Q(promise).inspect();
        // Important!
        console.log(key, 'is', snapshot.state.green, snapshot.value, snapshot.reason);
        if (snapshot.state === 'fulfilled') response[key] = snapshot.value;
    });
    return response;
};
