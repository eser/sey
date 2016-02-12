'use strict';

class configBundle {
    constructor(owner, name) {
        this.owner = owner;
        this.name = name;

        this.reset();
    }

    static addTask(name) {
        configBundle.prototype[name] = function () {
            return this.op(name);
        };
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
        this._op[name] = true;
        return this;
    }

    exec() {
        if (!(this.name in this.owner.content)) {
            this.owner.content[this.name] = {};
        }

        const configNode = this.owner.content[this.name];
        if (!('ops' in configNode)) {
            configNode.ops = [];
        }

        configNode.ops.push(this._op);
        this.reset();

        return this;
    }
/*
    const file = require('./file.js'),
        fsManager = require('./fsManager.js');

    addFiles(files) {
        for (let item of files) {
            const filepath = item,
                lastMod = fsManager.getLastMod(filepath);

            files.push(new file(filepath, lastMod));
        }

        return this;
    }

    combineFile(newFilename) {
        let mightBeCached = true,
            newest = 0;

        for (let item of files) {
            if (!item.cached) {
                mightBeCached = false;
                break;
            }

            if (newest < item.modified) {
                newest = item.modified;
            }
        }

        let newFile = new file(newFilename, mightBeCached ? newest : null);
        this.files.forEach((index, item) => {
            newFile.addHash(item.getHash());
        });

        this.files = [newFile];

        return this;
    }
*/
}

module.exports = configBundle;
