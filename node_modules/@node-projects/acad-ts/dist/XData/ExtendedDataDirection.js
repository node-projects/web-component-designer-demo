import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
export class ExtendedDataDirection extends ExtendedDataRecordT {
    constructor(direction) {
        super(DxfCode.ExtendedDataWorldXDir, direction);
    }
}
//# sourceMappingURL=ExtendedDataDirection.js.map