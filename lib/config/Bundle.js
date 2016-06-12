'use strict';

const deepmerge = require('../utils/deepmerge.js');

class Bundle {
    constructor(owner, name) {
        this.owner = owner;
        this.name = name;

        this.reset();
    }

    getConfigNode() {
        if (!(this.name in this.owner.content)) {
            this.owner.content[this.name] = {};
        }

        return this.owner.content[this.name];
    }

    set(options) {
        const configNode = this.getConfigNode();

        deepmerge(configNode, options);

        return this;
    }

    setTarget(target) {
        return this.set({
            target: target
        });
    }

    setStandard(standard) {
        return this.set({
            standard: standard
        });
    }

    setDestination(destination) {
        return this.set({
            destination: destination
        });
    }

    reset() {
        this._op = {};
    }

    src(source) {
        if (this._op.src === undefined) {
            this._op.src = source;

            return this;
        }

        let newSource;

        if (this._op.src.constructor !== Array) {
            newSource = [this._op.src];
        } else {
            newSource = this._op.src;
        }

        if (source.constructor === Array) {
            newSource = newSource.concat(source);
        } else {
            newSource.push(source);
        }

        this._op.src = newSource;

        return this;
    }

    dest(target) {
        this._op.dest = target;

        return this;
    }

    op(name) {
        let value = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        this._op[name] = value;

        return this;
    }

    exec() {
        const configNode = this.getConfigNode();

        if (!('ops' in configNode)) {
            configNode.ops = [];
        }

        configNode.ops.push(this._op);
        this.reset();

        return this;
    }
}

module.exports = Bundle;