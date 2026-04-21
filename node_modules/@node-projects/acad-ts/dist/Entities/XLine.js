import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
export class XLine extends Entity {
    direction = new XYZ(0, 0, 0);
    firstPoint = new XYZ(0, 0, 0);
    get objectName() {
        return DxfFileToken.entityXline;
    }
    get objectType() {
        return ObjectType.XLINE;
    }
    get subclassMarker() {
        return DxfSubclassMarker.xLine;
    }
    applyTransform(transform) {
        this.firstPoint = this.applyTransformToPoint(transform, this.firstPoint);
        const direction = this.applyTransformToVector(transform, this.direction);
        if (direction.getLength() > 0) {
            this.direction = direction.normalize();
        }
    }
    getBoundingBox() {
        return BoundingBox.infinite;
    }
}
//# sourceMappingURL=XLine.js.map