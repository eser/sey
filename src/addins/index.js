class AddInManager {
    constructor(owner) {
        this.owner = owner;
        this.items = [];
    }

    add(item) {
        this.items.push(item);
        item.attach(this.owner);
    }
}

module.exports = AddInManager;
