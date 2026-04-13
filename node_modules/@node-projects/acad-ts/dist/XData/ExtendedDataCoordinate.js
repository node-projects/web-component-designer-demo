import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
export class ExtendedDataCoordinate extends ExtendedDataRecordT {
    constructor(coordinate) {
        super(DxfCode.ExtendedDataXCoordinate, coordinate);
    }
}
//# sourceMappingURL=ExtendedDataCoordinate.js.map