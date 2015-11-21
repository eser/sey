var bundle = function (config) {
    var self = this;

    self.config = config;
    self.ops = self.config.ops || [];

    self.reset = function () {
        self._src = null;
        self._dest = null;
        self._tasks = [];

        return self;
    };

    self.src = function (files) {
        self._src = files;
        return self;
    };

    self.dest = function (path) {
        self._dest = path;
        return self;
    };

    self.task = function (name) {
        self._tasks.push(name);
        return self;
    }

    self.exec = function () {
        var op = {
            src: self._src,
            dest: self._dest
        };

        for (var i = 0, length = self._tasks.length; i < length; i++) {
            op[self._tasks[i]] = true;
        }

        self.ops.push(op);
    };
    
    self.reset();
};

bundle.addTask = function (name) {
    var self = this;

    bundle.prototype[name] = function () {
        return self.task(name);
    };
};

module.exports = bundle;
