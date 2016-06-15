const path = require('path'),
    chalk = require('chalk'),
    // logger = require('simple-node-logger'),
    fsManager = require('./utils/fsManager.js'),
    Config = require('./config/'),
    Runner = require('./runner/'),
    ModuleManager = require('./ModuleManager.js');

class sey {
    constructor() {
        this.moduleManager = new ModuleManager();
        this.config = Config;
        this.options = {};
    }

    init() {
        this.moduleManager.init();
        this.moduleManager.registerOps(Config);

        // this.logManager = logger.createLogManager();
        // this.logManager.createConsoleAppender();

        // this.log = this.logManager.createLogger('sey');
    }

    initFile(file, preferApi, override) {
        if (fsManager.exists(file) && !override) {
            console.log(chalk.red('Aborted. File already exists:'), chalk.gray(file));

            return;
        }

        const sampleFile = (preferApi) ? 'seyfile.api.sample.js' : 'seyfile.config.sample.js',
            content = fsManager.readFile(`${__dirname}/../etc/${sampleFile}`);

        fsManager.writeFile(file, content);

        console.log(chalk.white('File created:'), chalk.gray(file));
    }

    clean() {
        // fsManager.rm(`${this.workingPath}/*`);

        console.log(chalk.white('Working path is cleaned.'));
    }

    selfCheck() {
        return [];
    }

    async run(config) {
        const currentConfig = (config instanceof Config) ? config : new Config(config);

        const runner = new Runner(this.moduleManager, currentConfig);

        runner.load();
        runner.populateFiles('publish', this.options);

        const result = await runner.run('publish', this.options);

        return result;
    }

    async build(options) {
        global.sey = this;
        this.options = options;

        const config = require(this.options.seyfile);

        if (Object.keys(config).length > 0) {
            await this.run(config);
        }
    }
}

const instance = new sey();

instance.init();

module.exports = instance;
