var fs = require('fs'),
    deepmerge = require('deepmerge'),
    globby = require('globby');

var rogue = function (config) {
    var self = this;

    if (rogue === self) {
        return;
    }

    self.tasks = {};
    self.context = {
        config: config,
        bundle: null,
        bundleConfig: null,
        bundleOps: null,
        bundleTasks: null
    };

    self.defineTask = function (name, taskObject) {
        if (name in self.tasks) {
            return;
        }

        self.tasks[name] = new taskObject(self.context);
    };

    self.loadTask = function (names) {
        var nameArray;

        if (names.constructor === Array) {
            nameArray = names;
        } else {
            nameArray = [names];
        }

        for (var i = 0, length = nameArray.length; i < length; i++) {
            var name = nameArray[i];

            if (name in self.tasks) {
                return;
            }

            var taskObject = require('./tasks/' + name + '.js');
            self.tasks[name] = new taskObject(self.context);
        }
    };

    self.getBundleConfig = function (bundle) {
        if (self.context.config.global !== undefined) {
            if (self.context.config[bundle] !== undefined) {
                return deepmerge(self.context.config.global, self.context.config[bundle]);
            }

            return self.context.config.global;
        }

        if (self.context.config[bundle] !== undefined) {
            return self.context.config[bundle];
        }

        return {};
    };

    self.execTaskMethod = function (taskArray, method, parameters) {
        for (var i = 0, length = taskArray.length; i < length; i++) {
            var task = self.tasks[taskArray[i]];

            if (task[method] !== undefined && task[method] !== null && task[method].constructor === Function) {
                task[method].apply(task, parameters);
            }
        }
    };

    self.execChainTaskMethod = function (taskArray, method, parameters) {
        var lastParameterKey = parameters.length - 1;

        for (var i = 0, length = taskArray.length; i < length; i++) {
            var task = self.tasks[taskArray[i]];

            if (task[method] !== undefined && task[method] !== null && task[method].constructor === Function) {
                parameters[lastParameterKey] = task[method].apply(task, parameters);
            }
        }

        return parameters[lastParameterKey];
    };

    self.getBundleOpsFromConfig = function (bundleConfig) {
        var bundleOps = [];

        var ops = bundleConfig.ops;
        if (ops !== undefined && ops !== null) {
            for (var op in ops) {
                bundleOps.push(ops[op]);
            }
        }

        return bundleOps;
    };

    self.getBundleTasks = function (ops) {
        var bundleTasks = [];

        for (var op in ops) {
            var tasks = ops[op].tasks;

            if (tasks === undefined || tasks === null) {
                continue;
            }

            for (var i = 0, length = tasks.length; i < length; i++) {
                var task = tasks[i];

                if (bundleTasks.indexOf(task) === -1) {
                    bundleTasks.push(task);
                }
            }
        }

        return bundleTasks;
    };

    self.doBundleTasks = function (bundle) {
        self.context.bundle = bundle;
        self.context.bundleConfig = self.getBundleConfig(bundle);
        self.context.bundleOps = self.getBundleOpsFromConfig(self.context.bundleConfig);
        self.context.bundleTasks = self.getBundleTasks(self.context.bundleOps);

        self.loadTask(self.context.bundleTasks);

        console.log('bundleStart: ' + bundle);
        self.execTaskMethod(self.context.bundleTasks, 'bundleStart', [bundle]);

        for (var opName in self.context.bundleOps) {
            var op = self.context.bundleOps[opName],
                files = globby.sync(op.from, { nosort: true }),
                fileContents = {};

            for (var i = 0, length = files.length; i < length; i++) {
                var file = files[i];

                console.log('[' + opName + '] processFile: ' + file);
                fileContents[file] = fs.readFileSync(file, 'utf8');

                if (op.tasks !== undefined && op.tasks !== null) {
                    fileContents[file] = self.execChainTaskMethod(
                        op.tasks,
                        'processFile',
                        [file, fileContents[file]]
                    );
                }
            }

            console.log('[' + opName + '] processBundle');
            fileContents = self.execChainTaskMethod(
                op.tasks,
                'processBundle',
                [fileContents]
            );

            for (var fileKey in fileContents) {
                console.log('writing: ' + fileKey);
                // fs.writeSync(fileKey, fileContents[fileKey]);
            }
        }

        console.log('bundleEnd: ' + bundle);
        self.execTaskMethod(self.context.bundleTasks, 'bundleEnd', [bundle]);
    };

    self.doTasks = function () {
        for (var bundle in self.context.config) {
            if (bundle !== 'global') {
                self.doBundleTasks(bundle);
            }
        }
    };

    self.selfCheck = function () {

    };
};

module.exports = rogue;
