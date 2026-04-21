import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { InvisibleEdgeFlags } from './InvisibleEdgeFlags.js';
import { XYZ } from '../Math/XYZ.js';
export class Face3D extends Entity {
    get objectType() {
        return ObjectType.FACE3D;
    }
    get objectName() {
        return DxfFileToken.entity3DFace;
    }
    get subclassMarker() {
        return DxfSubclassMarker.face3d;
    }
    firstCorner = new XYZ(0, 0, 0);
    secondCorner = new XYZ(0, 0, 0);
    thirdCorner = new XYZ(0, 0, 0);
    fourthCorner = new XYZ(0, 0, 0);
    flags = InvisibleEdgeFlags.None;
    constructor() {
        super();
    }
    getBoundingBox() {
        return BoundingBox.fromPoints([
            this.firstCorner,
            this.secondCorner,
            this.thirdCorner,
            this.fourthCorner,
        ]);
    }
    applyTransform(transform) {
        this.firstCorner = this.applyTransformToPoint(transform, this.firstCorner);
        this.secondCorner = this.applyTransformToPoint(transform, this.secondCorner);
        this.thirdCorner = this.applyTransformToPoint(transform, this.thirdCorner);
        this.fourthCorner = this.applyTransformToPoint(transform, this.fourthCorner);
    }
}
export { InvisibleEdgeFlags } from './InvisibleEdgeFlags.js';
//# sourceMappingURL=Face3D.js.map