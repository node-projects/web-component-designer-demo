import { Dimension } from './Dimension.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionType } from './DimensionType.js';
import { XYZ } from '../Math/XYZ.js';
function distanceFrom(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function mid(a, b) {
    return new XYZ((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
}
export class DimensionDiameter extends Dimension {
    angleVertex = new XYZ(0, 0, 0);
    get center() {
        return mid(this.angleVertex, this.definitionPoint);
    }
    leaderLength = 0;
    get measurement() {
        return distanceFrom(this.definitionPoint, this.angleVertex);
    }
    get objectName() {
        return DxfFileToken.entityDimension;
    }
    get objectType() {
        return ObjectType.DIMENSION_DIAMETER;
    }
    get subclassMarker() {
        return DxfSubclassMarker.diametricDimension;
    }
    constructor() {
        super(DimensionType.Diameter);
    }
    applyTransform(transform) {
        super.applyTransform(transform);
        this.angleVertex = this.applyTransformToPoint(transform, this.angleVertex);
    }
    getBoundingBox() {
        return BoundingBox.fromPoints([this.definitionPoint, this.angleVertex, this.insertionPoint, this.textMiddlePoint]);
    }
    updateBlock() {
        this.populateBlock([[this.angleVertex, this.definitionPoint]], [this.angleVertex, this.definitionPoint, this.insertionPoint, this.textMiddlePoint]);
    }
}
//# sourceMappingURL=DimensionDiameter.js.map