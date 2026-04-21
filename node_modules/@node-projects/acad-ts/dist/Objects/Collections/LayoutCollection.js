import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { Layout } from '../Layout.js';
export class LayoutCollection extends ObjectDictionaryCollection {
    constructor(dictionary) {
        super(dictionary);
        this._dictionary = dictionary;
    }
    remove(name) {
        if (name.toLowerCase() === Layout.modelLayoutName.toLowerCase()
            || name.toLowerCase() === Layout.paperLayoutName.toLowerCase()) {
            throw new Error(`The Layout ${name} cannot be removed.`);
        }
        return super.remove(name);
    }
}
//# sourceMappingURL=LayoutCollection.js.map