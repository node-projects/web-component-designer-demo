import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { MLineStyle } from '../MLineStyle.js';
export class MLineStyleCollection extends ObjectDictionaryCollection {
    constructor(dictionary) {
        super(dictionary);
    }
    createDefaults() {
        this._dictionary.tryAdd(MLineStyle.default_);
    }
}
//# sourceMappingURL=MLineStyleCollection.js.map