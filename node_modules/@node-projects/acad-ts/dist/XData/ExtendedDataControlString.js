import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecord } from './ExtendedDataRecordBase.js';
export class ExtendedDataControlString extends ExtendedDataRecord {
    static get open() {
        return new ExtendedDataControlString(false);
    }
    static get close() {
        return new ExtendedDataControlString(true);
    }
    isClosing;
    get value() {
        return this.isClosing ? '}' : '{';
    }
    constructor(isClosing) {
        super(DxfCode.ExtendedDataControlString, isClosing ? '}' : '{');
        this.isClosing = isClosing;
    }
}
//# sourceMappingURL=ExtendedDataControlString.js.map