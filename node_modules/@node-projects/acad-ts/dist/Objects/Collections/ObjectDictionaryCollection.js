export class ObjectDictionaryCollection {
    onAdd = null;
    onRemove = null;
    get handle() { return this._dictionary.handle; }
    _dictionary;
    constructor(dictionary) {
        if (!dictionary) {
            throw new Error('dictionary cannot be null');
        }
        this._dictionary = dictionary;
    }
    add(entry) {
        this._dictionary.add(entry);
    }
    clear() {
        this._dictionary.clear();
    }
    containsKey(key) {
        return this._dictionary.containsKey(key);
    }
    remove(name) {
        return this._dictionary.remove(name);
    }
    tryAdd(item) {
        const existing = this.tryGet(item.name);
        if (existing) {
            return existing;
        }
        this.add(item);
        return item;
    }
    tryGet(name) {
        return this._dictionary.getEntry(name);
    }
    get(key) {
        return this._dictionary.getEntry(key);
    }
    [Symbol.iterator]() {
        const items = [];
        for (const item of this._dictionary) {
            items.push(item);
        }
        return items[Symbol.iterator]();
    }
}
//# sourceMappingURL=ObjectDictionaryCollection.js.map