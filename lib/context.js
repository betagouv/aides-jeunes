var _ = require('lodash');

var Context = module.exports = function(values, engine) {
    this.engine = engine;
    this.userValues = values;
    this.clearComputedValues();
    this.clearClaimedValues();
};

Context.prototype.compute = function(path) {
    var self = this;
    var def = this.engine.definitions[path];
    var missing = false;

    var requiredValues = _.map(def.required, function(path) {
        var value = self.get(path);
        if (!_.isUndefined(value)) return value;
        missing = true;
        self.claim(path);
    });

    if (missing) return;

    var optionalValues = _.map(def.optional, function(path) {
        return self.get(path);
    });

    var computedValue = def.getValue.apply(self, requiredValues.concat(optionalValues));
    if (!_.isUndefined(computedValue)) this.computedValues[path] = computedValue;

    return computedValue;
};

Context.prototype.claim = function(path) {
    this.claimedValues[path] = true;
};

Context.prototype.get = function(path) {
    if (!_.isUndefined(this.userValues[path])) return this.userValues[path];
    else if (!_.isUndefined(this.computedValues[path])) return this.computedValues[path];
    else if (this.engine.hasDefinition(path)) return this.compute(path);
};

Context.prototype.clearComputedValues = function() {
    this.computedValues = {};
};

Context.prototype.clearClaimedValues = function() {
    this.claimedValues = {};
};
