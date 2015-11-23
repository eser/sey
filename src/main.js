var fs = require('fs'),
    pathlib = require('path'),
    chalk = require('chalk'),
    deepmerge = require('deepmerge'),
    glob = require('./glob.js'),
    opfile = require('./opfile.js'),
    fileutils = require('./fileutils.js'),
    bundle = require('./bundle.js');

var sey = function (config) {
    var self = this;

    if (sey === self) {
        return;
    }

    self.ignoreTaskKeys = [ 'src', 'dest' ];

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

    self.startBundle = function (bundleName) {
        var bundle = self.bundles[bundleName],
            startTime = Date.now();

        if (bundle === undefined) {
            throw new Error('bundle not found - ' + bundleName);
        }

        console.log(chalk.green('bundleStart') + chalk.white(': ' + bundleName));

        for (var opName in bundle.ops) {
            var op = bundle.ops[opName],
                files = glob(op.src, opName),
                destExists = (op.dest !== undefined && op.dest !== null),
                destIsDir = destExists && (op.dest.charAt(op.dest.length - 1) === '/');

            console.log(chalk.gray('[' + opName + '] ') + chalk.yellow('processBundle'));

            for (var taskName in op) {
                if (self.ignoreTaskKeys.indexOf(taskName) > -1) {
                    continue;
                }

                if (self.tasks[taskName] === undefined) {
                    throw new Error('task not found - ' + taskName);
                }

                var task = op[taskName];
                if (task === undefined || task === null || task === false) {
                    continue;
                }

                if (self.tasks[taskName].processBundle === undefined) {
                    continue;
                }

                console.log(chalk.gray('\op: ' + taskName));
                files = self.tasks[taskName].processBundle(bundle, files);
            }

            if (destExists) {
                for (var fileKey in files) {
                    var file = files[fileKey],
                        dest;

                    if (destIsDir) {
                        dest = op.dest + file.relativeFile;
                    } else {
                        dest = op.dest;
                    }

                    console.log(chalk.gray('\twriting: ' + dest));
                    fileutils.writeFile(dest, file.getContent());
                }
            }
        }

        console.log(chalk.green('bundleEnd') + chalk.white(': ' + bundleName + ' (in ' + ((Date.now() - startTime) / 1000) + ' secs.)'));
    };

    self.start = function () {
        for (var bundleName in self.bundles) {
            self.startBundle(bundleName);
        }
    };
    
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
    var content = fs.readFileSync(__dirname + '/../seyfile.sample.js', 'utf8')
    fileutils.writeFile(file, content);

    console.log(chalk.green(file) + chalk.white(' is written successfully.'));
};

sey.selfCheck = function () {
    console.log(chalk.white('self-check is successful.'));
};

module.exports = sey;
