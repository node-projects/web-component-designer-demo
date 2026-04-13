import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
export class ExtendedDataString extends ExtendedDataRecordT {
    constructor(value) {
        super(DxfCode.ExtendedDataAsciiString, value);
    }
}
//# sourceMappingURL=ExtendedDataString.js.map