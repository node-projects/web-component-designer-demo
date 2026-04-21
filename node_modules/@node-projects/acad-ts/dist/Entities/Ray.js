import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
export class Ray extends Entity {
    direction = new XYZ(0, 0, 0);
    get objectName() {
        return DxfFileToken.entityRay;
    }
    get objectType() {
        return ObjectType.RAY;
    }
    startPoint = new XYZ(0, 0, 0);
    get subclassMarker() {
        return DxfSubclassMarker.ray;
    }
    applyTransform(transform) {
        this.startPoint = this.applyTransformToPoint(transform, this.startPoint);
        const direction = this.applyTransformToVector(transform, this.direction);
        if (direction.getLength() > 0) {
            this.direction = direction.normalize();
        }
    }
    getBoundingBox() {
        return BoundingBox.infinite;
    }
}
//# sourceMappingURL=Ray.js.map