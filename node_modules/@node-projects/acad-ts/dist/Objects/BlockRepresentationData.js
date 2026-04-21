import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
export class BlockRepresentationData extends NonGraphicalObject {
    block = null;
    get objectName() {
        return DxfFileToken.objectBlockRepresentationData;
    }
    get subclassMarker() {
        return DxfSubclassMarker.blockRepresentationData;
    }
    value70 = 0;
}
//# sourceMappingURL=BlockRepresentationData.js.map