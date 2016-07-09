class TaskItem {
    constructor(owner, name, prerequisites, promise) {
        this.owner = owner;
        this.name = name;

        if (promise === undefined) {
            this.prerequisites = [];
            this.promise = prerequisites;
        }
        else {
            this.prerequisites = prerequisites;
            this.promise = promise;
        }

        if (this.promise.constructor !== Promise) {
            this.promise = new Promise(this.promise);
        }
    }

    exec() {
        // TODO not implemented yet
        // TODO throw before and after events
        throw new Error('not implemented yet: TaskItem.exec');
    }
}

module.exports = TaskItem;
