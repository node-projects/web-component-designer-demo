import { CadDictionaryWithDefault } from '../../Objects/CadDictionaryWithDefault.js';
import { CadDictionaryTemplate } from './CadDictionaryTemplate.js';
export class CadDictionaryWithDefaultTemplate extends CadDictionaryTemplate {
    defaultEntryHandle = null;
    constructor(dictionary) {
        super(dictionary ?? new CadDictionaryWithDefault());
    }
    _build(builder) {
        super._build(builder);
        const entry = builder.tryGetCadObject(this.defaultEntryHandle);
        if (entry) {
            this.cadObject.defaultEntry = entry;
        }
    }
}
//# sourceMappingURL=CadDictionaryWithDefaultTemplate.js.map