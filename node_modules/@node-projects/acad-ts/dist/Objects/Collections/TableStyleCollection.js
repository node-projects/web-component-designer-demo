import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { TableStyle } from '../TableStyle.js';
export class TableStyleCollection extends ObjectDictionaryCollection {
    constructor(dictionary) {
        super(dictionary);
    }
    createDefaults() {
        this._dictionary.tryAdd(TableStyle.default_);
    }
}
//# sourceMappingURL=TableStyleCollection.js.map