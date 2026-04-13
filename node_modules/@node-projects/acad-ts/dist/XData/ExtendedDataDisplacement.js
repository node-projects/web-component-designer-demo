import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
export class ExtendedDataDisplacement extends ExtendedDataRecordT {
    constructor(displacement) {
        super(DxfCode.ExtendedDataWorldXDisp, displacement);
    }
}
//# sourceMappingURL=ExtendedDataDisplacement.js.map