import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
export class ExtendedDataBinaryChunk extends ExtendedDataRecordT {
    constructor(chunk) {
        super(DxfCode.ExtendedDataBinaryChunk, chunk);
    }
}
//# sourceMappingURL=ExtendedDataBinaryChunk.js.map