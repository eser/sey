var fs = require('fs'),
    pathlib = require('path'),
    deepmerge = require('deepmerge'),
    globAll = require('glob-all'),
    globParent = require('glob-parent');

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

    self.globConversions = function (paths) {
        var pathArray = (paths.constructor === Array) ? paths : [paths],
            result = [];

        for (var i = 0, length = pathArray.length; i < length; i++) {
            var path = pathArray[i];

            if (path.substring(0, 1) === '!') {
                continue;
            }

            result.push([
                path,
                globParent(path)
            ]);
        }

        return result;
    };

    self.globConvert = function (conversions, path) {
        for (var i = 0, length = conversions.length; i < length; i++) {
            if (conversions[i][1] === path.substring(0, conversions[i][1].length)) {
                return path.substring(conversions[i][1].length);
            }
        }

        return path;
    };

    self.globWithBases = function (paths) {
        var pathConversions = self.globConversions(paths),
            files = globAll.sync(paths, { nosort: true, nonull: false }),
            result = {};

        for (var i = 0, length = files.length; i < length; i++) {
            var file = files[i];

            result[file] = {
                file: self.globConvert(pathConversions, file),
                content: fs.readFileSync(file, 'utf8')
            };
        }

        return result;
    };

    self.createDestFile = function (path, content) {
        var buffer = [
            [path, true, content]
        ];

        while (buffer.length > 0) {
            var item = buffer[0];

            try {
                if (item[1]) {
                    fs.writeFileSync(item[0], item[2]);
                } else {
                    fs.mkdirSync(item[0]);
                }

                buffer.shift();
            } catch (ex) {
                if (ex.code === 'ENOENT') {
                    buffer.unshift([pathlib.dirname(item[0]), false]);
                } else {
                    throw ex;
                }
            }
        }
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
                files = self.globWithBases(op.from),
                destExists = (op.to !== undefined && op.to !== null),
                destIsDir = destExists && (op.to.charAt(op.to.length - 1) === '/');

            if (files === null) {
                files = [];
            }

            for (var fileKey in files) {
                console.log('[' + opName + '] processFile: ' + fileKey);

                if (op.tasks !== undefined && op.tasks !== null) {
                    files[fileKey] = self.execChainTaskMethod(
                        op.tasks,
                        'processFile',
                        [fileKey, files[fileKey]]
                    );
                }
            }

            console.log('[' + opName + '] processBundle');
            if (op.tasks !== undefined && op.tasks !== null) {
                files = self.execChainTaskMethod(
                    op.tasks,
                    'processBundle',
                    [files]
                );
            }

            if (destExists) {
                for (var fileKey2 in files) {
                    var file = files[fileKey2],
                        dest;

                    if (destIsDir) {
                        dest = op.to.replace(/\/+$/, '') + file.file;
                    } else {
                        dest = op.to;
                    }

                    console.log('writing: ' + dest);
                    self.createDestFile(dest, file.content);
                }
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
