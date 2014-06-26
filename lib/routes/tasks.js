var tasks = require('../controllers/tasks');
var auth = require('./middlewares/auth');

module.exports = function(api) {

    /*
    ** Param injection
    */
    api.param('taskId', tasks.task);

    /*
    ** Routes
    */
    api.route('/tasks')
        .all(auth.ensureLoggedIn)
        .get(tasks.list);

    api.route('/tasks/:taskId')
        .all(auth.ensureLoggedIn)
        .get(tasks.show)
        .put(tasks.update);

};
