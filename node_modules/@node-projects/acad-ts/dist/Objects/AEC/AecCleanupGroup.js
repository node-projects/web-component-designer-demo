import { NonGraphicalObject } from '../NonGraphicalObject.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';
export class AecCleanupGroup extends NonGraphicalObject {
    get objectType() { return ObjectType.UNLISTED; }
    get objectName() { return DxfFileToken.objectAecCleanupGroupDef; }
    get subclassMarker() { return DxfSubclassMarker.aecDbCleanupGroupDef; }
    version = 0;
    description = '';
    rawData = null;
    constructor(name) {
        super(name);
    }
}
//# sourceMappingURL=AecCleanupGroup.js.map