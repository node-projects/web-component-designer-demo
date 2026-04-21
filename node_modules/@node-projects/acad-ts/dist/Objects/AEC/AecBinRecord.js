import { NonGraphicalObject } from '../NonGraphicalObject.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';
export class AecBinRecord extends NonGraphicalObject {
    get objectType() { return ObjectType.UNLISTED; }
    get objectName() { return DxfFileToken.objectBinRecord; }
    get subclassMarker() { return DxfSubclassMarker.binRecord; }
    version = 0;
    binaryData = new Uint8Array(0);
}
//# sourceMappingURL=AecBinRecord.js.map