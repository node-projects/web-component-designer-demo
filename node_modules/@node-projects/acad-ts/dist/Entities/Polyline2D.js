import { Polyline } from './Polyline.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class Polyline2D extends Polyline {
    get objectName() {
        return DxfFileToken.entityPolyline;
    }
    get objectType() {
        return ObjectType.POLYLINE_2D;
    }
    get subclassMarker() {
        return DxfSubclassMarker.polyline;
    }
    getBoundingBox() { return super.getBoundingBox(); }
}
//# sourceMappingURL=Polyline2D.js.map