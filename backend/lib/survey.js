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
    var args = parser.parseArgs();
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
            const limit = parseInt(args.multiple) || 1;
            Followup.find({
                'surveys.type': {$ne: 'initial'},
                createdAt: { $lt: new Date(new Date().getTime() - (6.5 * 24 * 60 * 60 * 1000))},
                surveyOptin: true,
            }).sort({createdAt: 1}).limit(limit).then(list => {
                return Promise.all(list.map(function(followup) {
                    return followup.sendSurvey()
                        .then(function(result) {
                            return {ok : result._id};
                        })
                        .catch(function(error) {
                            return {ko : error};
                        });
                }));
            }).then(list => {
                console.log(list);
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
