import { UnderlayEntity } from './UnderlayEntity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { ObjectType } from '../Types/ObjectType.js';
export class PdfUnderlay extends UnderlayEntity {
    get objectName() {
        return DxfFileToken.entityPdfUnderlay;
    }
    get objectType() {
        return ObjectType.UNLISTED;
    }
    constructor(definition) {
        super(definition);
    }
}
//# sourceMappingURL=PdfUnderlay.js.map