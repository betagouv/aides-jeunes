var ArgumentParser = require('argparse').ArgumentParser;

var config = require('../config');
var mongoose = require('mongoose');
require('../config/mongoose')(mongoose, config);

var Followup = mongoose.model('Followup');

var parser = new ArgumentParser({
    addHelp:true,
    description: 'Outil d\'envoi des emails de suivi',
});

var subparsers = parser.addSubparsers({
    title: 'Commandes',
    dest: 'command'
});

var send = subparsers.addParser('send');
send.addArgument(
    [ '--id' ],
    {
        help: 'Followup Id'
    }
);

var reply = subparsers.addParser('reply');
reply.addArgument(
    [ '--id' ],
    {
        help: 'Survey Id'
    }
);

function main() {
    parser.printHelp();
    var args = parser.parseArgs();
    console.log(args);
    if (args.command === 'send') {
        Followup.findOne({
            '_id': args.id
        }).then(f => {
            return f.sendSurvey();
        }).then(e => {
            console.log('log', e);
        }).catch(e => {
            console.error('error', e);
        }).finally(() => {
            console.log('done');
            process.exit(0);
        });
    } else if (args.command === 'reply') {
        Followup.findOne({
            'surveys._id': args.id
        }).then(e => {
            console.log(e);
        }).catch(e => {
            console.error(e);
        }).finally(() => {
            process.exit(0);
        });
    } else {
        parser.printHelp();
        process.exit(1);
    }

    // var surveyId = 'dxmx9m8B19IvgxMbt7jP8epT-kaMh9kCrB_2H-9Ev81om8wOo2YFUnghOpNmbehp'
    // Followup.find({'surveys._id': surveyId})
    // .then(f => {
    //     e = f[0]
    //     return e.updateSurvey(surveyId, [{id: 'test', value: 'ok', 'comments': '!!'}])
    // })
    // .then(e => {
    //     console.log(e)
    // })
    // .catch(e => {
    //     console.error(e)
    // })
    // .finally(() => {
    //     process.exit(0);
    // })
}
main();
