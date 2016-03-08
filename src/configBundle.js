'use strict';

const deepmerge = require('./utils/deepmerge.js');

class configBundle {
    constructor(owner, name) {
        this.owner = owner;
        this.name = name;

        this.reset();
    }

    static addOp(name) {
        if (name in configBundle.prototype) {
            return;
        }

        configBundle.prototype[name] = function (value) {
            return this.op(name, value);
        };
    }

    getConfigNode() {
        if (!(this.name in this.owner.content)) {
            this.owner.content[this.name] = {};
        }

        return this.owner.content[this.name];
    }

    setTarget(target) {
        let configNode = this.getConfigNode();
        configNode.target = target;

        return this;
    }

    setStandard(standard) {
        let configNode = this.getConfigNode();
        configNode.standard = standard;

        return this;
    }

    set(options) {
        let configNode = this.getConfigNode();
        deepmerge(configNode, options);

        return this;
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

    op(name, value = true) {
        this._op[name] = value;
        return this;
    }

    exec() {
        let configNode = this.getConfigNode();

        if (!('ops' in configNode)) {
            configNode.ops = [];
        }

        configNode.ops.push(this._op);
        this.reset();

        return this;
    }
}

module.exports = configBundle;
