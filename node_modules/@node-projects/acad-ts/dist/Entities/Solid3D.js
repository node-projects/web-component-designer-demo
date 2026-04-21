import { ModelerGeometry } from './ModelerGeometry.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class Solid3D extends ModelerGeometry {
    get objectType() {
        return ObjectType.SOLID3D;
    }
    get objectName() {
        return DxfFileToken.entity3DSolid;
    }
    get subclassMarker() {
        return DxfSubclassMarker.solid3D;
    }
}
//# sourceMappingURL=Solid3D.js.map