import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
export class Point extends Entity {
    location = new XYZ(0, 0, 0);
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entityPoint;
    }
    get objectType() {
        return ObjectType.POINT;
    }
    rotation = 0.0;
    get subclassMarker() {
        return DxfSubclassMarker.point;
    }
    thickness = 0.0;
    constructor(location) {
        super();
        if (location) {
            this.location = location;
        }
    }
    applyTransform(transform) {
        this.location = this.applyTransformToPoint(transform, this.location);
        this.normal = this.applyTransformToVector(transform, this.normal).normalize();
    }
    getBoundingBox() {
        return BoundingBox.fromPoints([this.location]);
    }
}
//# sourceMappingURL=Point.js.map