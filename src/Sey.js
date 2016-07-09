const events = require('events'),
    ConfigManager = require('./config/index.js'),
    AddInManager = require('./addins/index.js');

class Sey {
    constructor() {
        this.events = new events.EventEmitter();
        this.config = new ConfigManager();
        this.addins = new AddInManager(this);
    }

    exec(file) {
        const backup = global.sey;

        global.sey = this;

        const returnValue = require(file);

        global.sey = backup;

        return returnValue;
    }
}

module.exports = Sey;
