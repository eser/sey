const BundleItem = require('./BundleItem.js');

class BundleManager {
    constructor(owner) {
        this.owner = owner;
        this.keys = [];
    }

    add(name, config) {
        this[name] = new BundleItem(this.owner, name, config);
        this.keys.push(name);
    }

    readFromConfig() {
        // TODO not implemented yet
        throw new Error('not implemented yet: BundleManager.readFromConfig');
    }
}

module.exports = BundleManager;
