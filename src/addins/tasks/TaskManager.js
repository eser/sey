const TaskItem = require('./TaskItem.js');

class TaskManager {
    constructor(owner) {
        this.owner = owner;
        this.keys = [];
    }

    add(name, prerequisites, promise) {
        this[name] = new TaskItem(this.owner, name, prerequisites, promise);
        this.keys.push(name);
    }
}

module.exports = TaskManager;
