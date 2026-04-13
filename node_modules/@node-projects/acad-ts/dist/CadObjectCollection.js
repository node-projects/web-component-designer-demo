import { CollectionChangedEventArgs } from './CollectionChangedEventArgs.js';
export class CadObjectCollection {
    onAdd = null;
    onRemove = null;
    owner;
    get count() { return this._entries.size; }
    _entries = new Set();
    constructor(owner) {
        this.owner = owner;
    }
    getAt(index) {
        let i = 0;
        for (const entry of this._entries) {
            if (i === index)
                return entry;
            i++;
        }
        return undefined;
    }
    add(item) {
        if (item == null)
            throw new Error("item is null");
        if (item.owner != null)
            throw new Error(`Item already has an owner`);
        if (this._entries.has(item))
            throw new Error(`Item is already in the collection`);
        this._entries.add(item);
        item.owner = this.owner;
        this.onAdd?.(this, new CollectionChangedEventArgs(item));
    }
    addRange(items) {
        for (const item of items) {
            this.add(item);
        }
    }
    clear() {
        const entries = [...this._entries];
        for (const entry of entries) {
            this.remove(entry);
        }
    }
    remove(item) {
        if (!this._entries.delete(item))
            return null;
        item.owner = null;
        this.onRemove?.(this, new CollectionChangedEventArgs(item));
        return item;
    }
    [Symbol.iterator]() {
        return this._entries[Symbol.iterator]();
    }
}
//# sourceMappingURL=CadObjectCollection.js.map