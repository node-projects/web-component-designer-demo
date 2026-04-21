import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
export class Solid extends Entity {
    firstCorner = new XYZ(0, 0, 0);
    fourthCorner = new XYZ(0, 0, 0);
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entitySolid;
    }
    get objectType() {
        return ObjectType.SOLID;
    }
    secondCorner = new XYZ(0, 0, 0);
    get subclassMarker() {
        return DxfSubclassMarker.solid;
    }
    thickness = 0.0;
    thirdCorner = new XYZ(0, 0, 0);
    applyTransform(transform) {
        this.firstCorner = this.applyTransformToPoint(transform, this.firstCorner);
        this.secondCorner = this.applyTransformToPoint(transform, this.secondCorner);
        this.thirdCorner = this.applyTransformToPoint(transform, this.thirdCorner);
        this.fourthCorner = this.applyTransformToPoint(transform, this.fourthCorner);
        this.normal = this.applyTransformToVector(transform, this.normal).normalize();
    }
    getBoundingBox() {
        return BoundingBox.fromPoints([
            this.firstCorner,
            this.secondCorner,
            this.thirdCorner,
            this.fourthCorner,
        ]);
    }
}
//# sourceMappingURL=Solid.js.map