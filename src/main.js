var fs = require('fs'),
    pathlib = require('path'),
    chalk = require('chalk'),
    deepmerge = require('deepmerge'),
    globAll = require('glob-all'),
    globParent = require('glob-parent');

// private
var _createDestFile = function (path, content) {
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

var _file = function (path, relativeFile, cacheTag) {
    var self = this;

    self.file = relativeFile;
    self.stat = fs.statSync(path);

    self.cachefile = './.sey/cache/' + cacheTag + relativeFile;
    try {
        self.cachestat = fs.statSync(self.cachefile);
        self.invalidated = (self.stat.getTime() > self.cachestat.getTime());
    } catch (ex) {
        if (ex.code === 'ENOENT') {
            self.cachestat = null;
            self.invalidated = true;
        } else {
            throw ex;
        }
    }

    self.content = null;

    self.read = function () {
        if (self.content === null) {
            self.content = fs.readFileSync(path, 'utf8');
        }

        return self.content;
    };
};

// public
var sey = function (config) {
    var self = this;

    if (sey === self) {
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

    self.unfoldTasks = function (node) {
        var tasks = [];

        for (var item in node) {
            if (item === 'src' || item === 'dest') {
                continue;
            }

            if (node[item] === undefined || node[item] === null || node[item] === false) {
                continue;
            }

            tasks.push(item);
        }

        return tasks;
    };

    self.getBundleTasks = function (ops) {
        var bundleTasks = [];

        for (var op in ops) {
            var tasks = self.unfoldTasks(ops[op]);

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

    self.globFiles = function (paths, cacheTag) {
        var pathConversions = self.globConversions(paths),
            files = globAll.sync(paths, { nosort: true, nonull: false }),
            result = {};

        if (files !== null) {
            for (var i = 0, length = files.length; i < length; i++) {
                var file = files[i],
                    fileobj = new _file(file, self.globConvert(pathConversions, file), cacheTag);

                if (fileobj.invalidated) {
                    result[file] = fileobj;
                } else {
                    console.log('cache miss ' + file);
                }
            }
        }

        return result;
    };

    self.doBundleTasks = function (bundle) {
        self.context.bundle = bundle;
        self.context.bundleConfig = self.getBundleConfig(bundle);
        self.context.bundleOps = self.getBundleOpsFromConfig(self.context.bundleConfig);
        self.context.bundleTasks = self.getBundleTasks(self.context.bundleOps);

        self.loadTask(self.context.bundleTasks);

        var startTime = Date.now();

        console.log(chalk.green('bundleStart') + chalk.white(': ' + bundle));
        self.execTaskMethod(self.context.bundleTasks, 'bundleStart', [bundle]);

        for (var opName in self.context.bundleOps) {
            var op = self.context.bundleOps[opName],
                tasks = self.unfoldTasks(op),
                cacheTag = opName + '/' + tasks.join('_'),
                files = self.globFiles(op.src, cacheTag),
                destExists = (op.dest !== undefined && op.dest !== null),
                destIsDir = destExists && (op.dest.charAt(op.dest.length - 1) === '/');

            console.log(chalk.gray('[' + opName + '] ') + chalk.yellow('processBundle'));
            if (tasks.length > 0) {
                files = self.execChainTaskMethod(
                    tasks,
                    'processBundle',
                    [files]
                );
            }

            if (destExists) {
                for (var fileKey in files) {
                    var file = files[fileKey],
                        dest;

                    if (destIsDir) {
                        dest = op.dest.replace(/\/+$/, '') + file.file;
                    } else {
                        dest = op.dest;
                    }

                    console.log(chalk.gray('\twriting: ' + dest));
                    _createDestFile(dest, file.read());
                }
            }
            _createDestFile(file.cachefile, file.read());
        }

        console.log(chalk.green('bundleEnd') + chalk.white(': ' + bundle + ' (in ' + ((Date.now() - startTime) / 1000) + ' secs.)'));
        self.execTaskMethod(self.context.bundleTasks, 'bundleEnd', [bundle]);
    };

    self.doTasks = function () {
        for (var bundle in self.context.config) {
            if (bundle !== 'global') {
                self.doBundleTasks(bundle);
            }
        }
    };
};

sey.initFile = function (file) {
    var content = fs.readFileSync(__dirname + '/../seyfile.sample.js', 'utf8')
    _createDestFile(file, content);

    console.log(chalk.green(file) + chalk.white(' is written successfully.'));
};

sey.selfCheck = function () {
    console.log(chalk.white('self-check is successful.'));
};

module.exports = sey;
