var tasks = require('../controllers/tasks');

module.exports = function(api) {

    /*
    ** Param injection
    */
    api.param('taskId', tasks.task);

    /*
    ** Routes
    */
    api.route('/tasks').get(tasks.list);

    api.route('/tasks/:taskId')
        .get(tasks.show)
        .put(tasks.update);

};
