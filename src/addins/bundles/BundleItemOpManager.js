class BundleItemOpManager {
    constructor(owner) {
        this.owner = owner;
        this.items = [];
    }

    add(item) {
        this.items.push(item);
    }
}

module.exports = BundleItemOpManager;
