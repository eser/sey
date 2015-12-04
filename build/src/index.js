'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

require('babel-polyfill');

var fs = require('fs'),
    pathlib = require('path'),
    chalk = require('chalk'),
    deepmerge = require('deepmerge'),
    glob = require('./glob.js'),
    opfile = require('./opfile.js'),
    fileutils = require('./fileutils.js'),
    bundle = require('./bundle.js');

var sey = function sey(config) {
    var self = this;

    if (sey === self) {
        return;
    }

    self.ignoreTaskKeys = ['src', 'dest'];

    self.defineTask = function (name, taskObject) {
        if (name in self.tasks) {
            return;
        }

        self.tasks[name] = new taskObject();
        bundle.addTask(name);
    };

    self.loadTasks = function () {
        var normalizedPath = pathlib.join(__dirname, './tasks'),
            files = fs.readdirSync(normalizedPath);

        for (var i = 0, length = files.length; i < length; i++) {
            var basename = pathlib.basename(files[i], '.js'),
                taskObject = require('./tasks/' + files[i]);

            self.defineTask(basename, taskObject);
        }
    };

    self.getBundleConfig = function (name) {
        if (name in config && config[name] !== null && config[name] !== undefined && config[name].constructor === Object) {
            return config[name];
        }

        return {};
    };

    self.bundle = function (name) {
        if (!(name in self.bundles)) {
            var bundleConfig = deepmerge(self.globalConfig, self.getBundleConfig(name));
            self.bundles[name] = new bundle(bundleConfig);
        }

        return self.bundles[name];
    };

    self.startBundleOp = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(opTag, op) {
            var files, taskName, task, destExists, destIsDir, fileKey, file, dest;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            console.log(chalk.gray('[' + opTag + '] ') + chalk.yellow('processBundle'));

                            files = glob(op.src, opTag);
                            _context.t0 = regeneratorRuntime.keys(op);

                        case 3:
                            if ((_context.t1 = _context.t0()).done) {
                                _context.next = 20;
                                break;
                            }

                            taskName = _context.t1.value;
                            task = op[taskName];

                            if (!(self.ignoreTaskKeys.indexOf(taskName) > -1)) {
                                _context.next = 8;
                                break;
                            }

                            return _context.abrupt('return');

                        case 8:
                            if (!(self.tasks[taskName] === undefined)) {
                                _context.next = 10;
                                break;
                            }

                            throw new Error('task not found - ' + taskName);

                        case 10:
                            if (!(task === undefined || task === null || task === false)) {
                                _context.next = 12;
                                break;
                            }

                            return _context.abrupt('return');

                        case 12:
                            if (!(self.tasks[taskName].processBundle === undefined)) {
                                _context.next = 14;
                                break;
                            }

                            return _context.abrupt('return');

                        case 14:

                            console.log(chalk.gray('\op: ' + taskName));

                            _context.next = 17;
                            return self.tasks[taskName].processBundle(bundle, files);

                        case 17:
                            files = _context.sent;
                            _context.next = 3;
                            break;

                        case 20:
                            destExists = op.dest !== undefined && op.dest !== null;

                            if (destExists) {
                                destIsDir = op.dest.charAt(op.dest.length - 1) === '/';

                                for (fileKey in files) {
                                    file = files[fileKey];

                                    if (destIsDir) {
                                        dest = op.dest + file.relativeFile;
                                    } else {
                                        dest = op.dest;
                                    }

                                    console.log(chalk.gray('\twriting: ' + dest));
                                    fileutils.writeFile(dest, file.getContent());
                                }
                            }

                        case 22:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function (_x, _x2) {
            return ref.apply(this, arguments);
        };
    })();

    self.startBundle = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(bundleName) {
            var bundle, startTime, opTag, op;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            bundle = self.bundles[bundleName], startTime = Date.now();

                            if (!(bundle === undefined)) {
                                _context2.next = 3;
                                break;
                            }

                            throw new Error('bundle not found - ' + bundleName);

                        case 3:

                            console.log(chalk.green('bundleStart') + chalk.white(': ' + bundleName));

                            _context2.t0 = regeneratorRuntime.keys(bundle.ops);

                        case 5:
                            if ((_context2.t1 = _context2.t0()).done) {
                                _context2.next = 12;
                                break;
                            }

                            opTag = _context2.t1.value;
                            op = bundle.ops[opTag];
                            _context2.next = 10;
                            return self.startBundleOp(opTag, op);

                        case 10:
                            _context2.next = 5;
                            break;

                        case 12:

                            console.log(chalk.green('bundleEnd') + chalk.white(': ' + bundleName + ' (in ' + (Date.now() - startTime) / 1000 + ' secs.)'));

                        case 13:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        return function (_x3) {
            return ref.apply(this, arguments);
        };
    })();

    self.start = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var bundleName;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.t0 = regeneratorRuntime.keys(self.bundles);

                    case 1:
                        if ((_context3.t1 = _context3.t0()).done) {
                            _context3.next = 7;
                            break;
                        }

                        bundleName = _context3.t1.value;
                        _context3.next = 5;
                        return self.startBundle(bundleName);

                    case 5:
                        _context3.next = 1;
                        break;

                    case 7:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    if (config === undefined) {
        config = {};
    }

    self.globalConfig = self.getBundleConfig('global');
    self.bundles = {};
    self.tasks = {};

    self.loadTasks();

    for (var bundleName in config) {
        if (bundleName !== 'global') {
            self.bundle(bundleName);
        }
    }
};

sey.initFile = function (file) {
    var content = fs.readFileSync(__dirname + '/../seyfile.sample.js', 'utf8');
    fileutils.writeFile(file, content);

    console.log(chalk.green(file) + chalk.white(' is written successfully.'));
};

sey.clean = function () {
    var path = pathlib.join(process.cwd(), '.sey');

    fileutils.rmdir(path);

    console.log(chalk.white('clean is successful.'));
};

sey.selfCheck = function () {
    console.log(chalk.white('self-check is successful.'));
};

module.exports = sey;