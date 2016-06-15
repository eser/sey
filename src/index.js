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

    async start(options) {
        this.runtimeOptions = options;

        if (this.runtimeOptions.seyfileContent === undefined) {
            this.runtimeOptions.seyfileContent = require(this.runtimeOptions.seyfile);
        }

        if (Object.keys(this.runtimeOptions.seyfileContent).length > 0) {
            await this.run(this.runtimeOptions.seyfileContent, this.runtimeOptions);
        }
    }

    async run(seyfileContent, options) {
        const currentSeyfileContent = (seyfileContent instanceof Config) ? seyfileContent : new Config(seyfileContent);

        const currentOptions = options || this.runtimeOptions;

        const runner = new Runner(this.moduleManager, currentSeyfileContent);

        runner.load();
        runner.populateFiles(currentOptions);

        await runner.run(currentOptions);
    }
}

const instance = new sey();

instance.init();

global.sey = instance;
module.exports = instance;
