const BundleManager = require('./BundleManager.js');

class BundlesAddIn {
    constructor() {
    }

    attach(owner) {
        owner.bundles = new BundleManager(owner);
    }
}

module.exports = BundlesAddIn;
