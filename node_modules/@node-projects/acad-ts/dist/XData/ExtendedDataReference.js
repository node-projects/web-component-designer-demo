import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
export class ExtendedDataReference extends ExtendedDataRecordT {
    constructor(code, handle) {
        super(code, handle);
    }
    resolveReference(document) {
        return document.getCadObject(this.value);
    }
}
//# sourceMappingURL=ExtendedDataReference.js.map