import { Entity } from './Entity.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
export class Line extends Entity {
    endPoint = new XYZ(0, 0, 0);
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entityLine;
    }
    get objectType() {
        return ObjectType.LINE;
    }
    startPoint = new XYZ(0, 0, 0);
    get subclassMarker() {
        return DxfSubclassMarker.line;
    }
    thickness = 0.0;
    constructor(start, end) {
        super();
        if (start) {
            this.startPoint = start;
        }
        if (end) {
            this.endPoint = end;
        }
    }
    applyTransform(transform) {
        this.startPoint = this.applyTransformToPoint(transform, this.startPoint);
        this.endPoint = this.applyTransformToPoint(transform, this.endPoint);
        this.normal = this.applyTransformToVector(transform, this.normal).normalize();
    }
    getBoundingBox() {
        return BoundingBox.fromPoints([this.startPoint, this.endPoint]);
    }
}
//# sourceMappingURL=Line.js.map