var tasks = require('../controllers/tasks');
var auth = require('./middlewares/auth');

module.exports = function(api) {

    /*
    ** Param injection
    */
    api.param('taskId', tasks.task);

    /*
    ** Middlewares
    */
    api.use('/tasks', auth.ensureLoggedIn);

    /*
    ** Routes
    */
    api.route('/tasks').get(tasks.list);

    api.route('/tasks/:taskId')
        .get(tasks.show)
        .put(tasks.update);

    api.route('/tasks/:taskId/change-status')
        .post(tasks.changeStatus);
};
