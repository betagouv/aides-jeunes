var express = require('express');

module.exports = function(app, config) {

    var env = app.get('env');
    var viewsDirectory = config.root;
    if ('development' === env) {
        viewsDirectory += '/app/views';
    } else if ('production' === env) {
        viewsDirectory += '/public/views';
    }

    app.use('/partials', express.static(viewsDirectory + '/partials/front'));
    app.use('/back/partials', express.static(viewsDirectory + '/partials/back'));

    function renderBack(req, res) {
        res.sendfile(viewsDirectory + '/back.html');
    }

    app.route('/back').get(renderBack);
    app.route('/back/*').get(renderBack);

    app.route('/*').get(function(req, res) {
        res.sendfile(viewsDirectory + '/front.html');
    });

};
