var mongoose = require('mongoose');
var config = require('../lib/config/config');

require('../lib/config/mongoose')(mongoose, config);

var AcceptanceTest = mongoose.model('AcceptanceTest');
var Situation = mongoose.model('Situation');

var stream = AcceptanceTest
    .find()
    .select('-name -description -droitsAttendus')
    .lean()
    .stream();

stream.on('data', function(acceptanceTest) {
    Situation.findByIdAndUpdate(acceptanceTest.situation, {
        $set: { status: 'test' }
    }, function(err) {
        if (err) console.trace(err);
    });
});

stream.on('error', function(err) {
    console.trace(err);
});

stream.on('close', function() {
    console.log('Successful!');
    process.exit();
});
