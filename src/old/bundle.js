let bundle = function (config) {
    this.config = config;
    this.ops = this.config.ops || [];

    this.reset = () => {
        this._src = null;
        this._dest = null;
        this._tasks = [];

        return this;
    };

    this.src = (files) => {
        this._src = files;
        return this;
    };

    this.dest = (path) => {
        this._dest = path;
        return this;
    };

    this.task = (name) => {
        this._tasks.push(name);
        return this;
    };

    this.exec = () => {
        let op = {
            src: this._src,
            dest: this._dest
        };

        for (let i = 0, length = this._tasks.length; i < length; i++) {
            op[this._tasks[i]] = true;
        }

        this.ops.push(op);
    };

    this.reset();
};

bundle.addTask = function (name) {
    bundle.prototype[name] = () => {
        return this.task(name);
    };
};

module.exports = bundle;
