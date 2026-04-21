import { DxfCode } from '../DxfCode.js';
import { ExtendedDataReference } from './ExtendedDataReference.js';
export class ExtendedDataLayer extends ExtendedDataReference {
    constructor(handle) {
        super(DxfCode.ExtendedDataLayerName, handle);
    }
}
//# sourceMappingURL=ExtendedDataLayer.js.map