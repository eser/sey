const BundleItemOpManager = require('./BundleItemOpManager.js');

class BundleItem {
    constructor(owner, name, config) {
        this.owner = owner;
        this.name = name;
        this.config = config;
        this.ops = new BundleItemOpManager(this.owner);
    }

    exec() {
        // TODO not implemented yet
        // TODO throw before and after events
        throw new Error('not implemented yet: BundleItem.exec');
    }
}

module.exports = BundleItem;
