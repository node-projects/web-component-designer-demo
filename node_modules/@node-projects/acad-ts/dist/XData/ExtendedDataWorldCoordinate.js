import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
export class ExtendedDataWorldCoordinate extends ExtendedDataRecordT {
    constructor(coordinate) {
        super(DxfCode.ExtendedDataWorldXCoordinate, coordinate);
    }
}
//# sourceMappingURL=ExtendedDataWorldCoordinate.js.map