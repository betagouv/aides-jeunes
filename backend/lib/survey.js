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
send.addArgument(
    [ '--multiple' ],
    {
        help: 'Number of survey to send'
    }
);
send.addArgument(
    [ '--all' ],
    {
        action: 'storeTrue',
        help: 'Send multiple surveys'
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
        if (args.id) {
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
        } else if (args.multiple) {
            Followup.find({
                'surveys._id': {$ne: 'initial'},
                surveyOptin: true,
            }).sort({createdAt: 1}).limit(parseInt(args.multiple)).then(list => {
                console.log(list.length);
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                console.log('done');
                process.exit(0);
            });
        }
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
}
main();
