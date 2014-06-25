'use strict';

/*
** Module dependencies
*/
var mongoose = require('mongoose');
var util = require('util');

var TTL = 24*3600;

var Schema = new mongoose.Schema({
    sid: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    usedAt: { type: Date, expires: TTL }
});

var Session = mongoose.model('Session', Schema);

module.exports = function(session) {

    var Store = session.Store;

    function MongoStore(options) {
        Store.call(this, options);
    }

    util.inherits(MongoStore, Store);

    MongoStore.prototype.get = function(sid, done) {
        Session.findOne({ sid: sid }, function(err, session) {
            if (err) return done(err);
            if (!session) return done(null, false);
            done(null, session.data);
        });
    };

    MongoStore.prototype.set = function(sid, data, done) {
        Session.update({ sid: sid }, {
            sid: sid,
            data: data,
            usedAt: new Date()
        }, { upsert: true }, done);
    };

    MongoStore.prototype.destroy = function(sid, done) {
        Session.remove({ sid: sid }, done);
    };

    MongoStore.prototype.clear = function(done) {
        Session.collection.drop(done);
    };

    return MongoStore;

};
