require('babel-polyfill');

const fs = require('fs'),
    pathlib = require('path'),
    chalk = require('chalk'),
    deepmerge = require('deepmerge'),
    glob = require('./glob.js'),
    opfile = require('./opfile.js'),
    fileutils = require('./fileutils.js'),
    bundle = require('./bundle.js');

class sey {
    constructor(config = {}) {
        this.config = config;
        this.globalConfig = this.getBundleConfig('global');
        this.ignoreTaskKeys = [ 'src', 'dest' ];

        this.bundles = {};
        this.tasks = {};

        this.loadTasks();

        for (let bundleName in config) {
            if (bundleName !== 'global') {
                this.bundle(bundleName);
            }
        }
    }

    defineTask(name, taskObject) {
        if (name in this.tasks) {
            return;
        }

        this.tasks[name] = new taskObject();
        bundle.addTask(name);
    }

    loadTasks() {
        let normalizedPath = pathlib.join(__dirname, './tasks'),
            files = fs.readdirSync(normalizedPath);

        for (let i = 0, length = files.length; i < length; i++) {
            let basename = pathlib.basename(files[i], '.js'),
                taskObject = require('./tasks/' + files[i]).default ;

            this.defineTask(basename, taskObject);
        }
    }

    getBundleConfig(name) {
        if (name in this.config && this.config[name] !== null && this.config[name] !== undefined && this.config[name].constructor === Object) {
            return this.config[name];
        }

        return {};
    }

    bundle(name) {
        if (!(name in this.bundles)) {
            let bundleConfig = deepmerge(this.globalConfig, this.getBundleConfig(name));
            this.bundles[name] = new bundle(bundleConfig);
        }

        return this.bundles[name];
    }

    async startBundleOp(opTag, op) {
        console.log(chalk.gray('[' + opTag + '] ') + chalk.yellow('processBundle'));

        let files = glob(op.src, opTag);

        for (let taskName in op) {
            let task = op[taskName];

            if (this.ignoreTaskKeys.indexOf(taskName) > -1) {
                continue;
            }

            if (this.tasks[taskName] === undefined) {
                throw new Error('task not found - ' + taskName);
            }

            if (task === undefined || task === null || task === false) {
                continue;
            }

            if (this.tasks[taskName].processBundle === undefined) {
                continue;
            }

            console.log(chalk.gray('\op: ' + taskName));

            files = await this.tasks[taskName].processBundle(bundle, files);
        }

        let destExists = (op.dest !== undefined && op.dest !== null);

        if (destExists) {
            let destIsDir = (op.dest.charAt(op.dest.length - 1) === '/');

            for (let fileKey in files) {
                let file = files[fileKey],
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

    async startBundle(bundleName) {
        let bundle = this.bundles[bundleName],
            startTime = Date.now();

        if (bundle === undefined) {
            throw new Error('bundle not found - ' + bundleName);
        }

        console.log(chalk.green('bundleStart') + chalk.white(': ' + bundleName));

        for (let opTag in bundle.ops) {
            let op = bundle.ops[opTag];

            await this.startBundleOp(opTag, op);
        }

        console.log(chalk.green('bundleEnd') + chalk.white(': ' + bundleName + ' (in ' + ((Date.now() - startTime) / 1000) + ' secs.)'));
    }

    async start() {
        for (let bundleName in this.bundles) {
            await this.startBundle(bundleName);
        }
    }

    static initFile(file) {
        let content = fs.readFileSync(__dirname + '/../seyfile.sample.js', 'utf8');
        fileutils.writeFile(file, content);

        console.log(chalk.green(file) + chalk.white(' is written successfully.'));
    }

    static clean() {
        let path = pathlib.join(process.cwd(), '.sey');

        fileutils.rmdir(path);

        console.log(chalk.white('clean is successful.'));
    }

    static selfCheck() {
        console.log(chalk.white('self-check is successful.'));
    }
}

module.exports = sey;
