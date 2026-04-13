import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { Material } from '../Material.js';
export class MaterialCollection extends ObjectDictionaryCollection {
    constructor(dictionary) {
        super(dictionary);
    }
    createDefaults() {
        this._dictionary.tryAdd(new Material('Global'));
        this._dictionary.tryAdd(new Material('ByLayer'));
        this._dictionary.tryAdd(new Material('ByBlock'));
    }
}
//# sourceMappingURL=MaterialCollection.js.map