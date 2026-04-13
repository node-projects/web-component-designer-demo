import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { MultiLeaderStyle } from '../MultiLeaderStyle.js';
export class MLeaderStyleCollection extends ObjectDictionaryCollection {
    constructor(dictionary) {
        super(dictionary);
    }
    createDefaults() {
        this._dictionary.tryAdd(MultiLeaderStyle.default_);
    }
}
//# sourceMappingURL=MLeaderStyleCollection.js.map