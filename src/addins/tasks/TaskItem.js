class TaskItem {
    constructor(owner, name, prerequisites, callback) {
        this.owner = owner;
        this.name = name;

        if (callback === undefined) {
            this.prerequisites = [];
            this.callback = prerequisites;
        }
        else {
            this.prerequisites = prerequisites;
            this.callback = callback;
        }
    }

    exec() {
        // TODO it's a very primitive implementation
        // TODO throw before and after events
        return new Promise(this.callback);
    }
}

module.exports = TaskItem;
