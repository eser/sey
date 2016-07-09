const TaskManager = require('./TaskManager.js');

class TasksAddIn {
    constructor() {
    }

    attach(owner) {
        owner.tasks = new TaskManager(owner);
    }
}

module.exports = TasksAddIn;
