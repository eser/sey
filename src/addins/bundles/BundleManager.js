const deepmerge = require('../../utils/deepmerge.js'),
    BundleItem = require('./BundleItem.js');

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
        // TODO not tested
        const config = this.owner.config.save(),
            reservedNodeKeys = [ 'global', 'common' ],
            commonNode = config.common;

        for (let nodeKey in config) {
            if (nodeKey in reservedNodeKeys) {
                continue;
            }

            const node = config[nodeKey];

            if (commonNode !== undefined) {
                deepmerge(node, commonNode);
            }

            const ops = node.ops;

            if (node.ops !== undefined) {
                delete node.ops;
            }

            this.add(nodeKey, node);

            if (ops !== undefined) {
                for (let op of ops) {
                    this[nodeKey].ops.add(op);
                }
            }
        }
    }
}

module.exports = BundleManager;
