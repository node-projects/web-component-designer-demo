import { Dimension } from './Dimension.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionType } from './DimensionType.js';
import { XYZ } from '../Math/XYZ.js';
export class DimensionAngular3Pt extends Dimension {
    angleVertex = new XYZ(0, 0, 0);
    firstPoint = new XYZ(0, 0, 0);
    get measurement() {
        const firstVector = Dimension.subtractPoints(this.firstPoint, this.angleVertex);
        const secondVector = Dimension.subtractPoints(this.secondPoint, this.angleVertex);
        if (firstVector.equals(secondVector)) {
            return 0;
        }
        if (Dimension.areParallel(firstVector, secondVector)) {
            return Math.PI;
        }
        return Dimension.angleBetweenVectors(firstVector, secondVector);
    }
    get objectName() {
        return DxfFileToken.entityDimension;
    }
    get objectType() {
        return ObjectType.DIMENSION_ANG_3_Pt;
    }
    secondPoint = new XYZ(0, 0, 0);
    get subclassMarker() {
        return DxfSubclassMarker.angular3PointDimension;
    }
    constructor() {
        super(DimensionType.Angular3Point);
    }
    applyTransform(transform) {
        super.applyTransform(transform);
        this.angleVertex = this.applyTransformToPoint(transform, this.angleVertex);
        this.firstPoint = this.applyTransformToPoint(transform, this.firstPoint);
        this.secondPoint = this.applyTransformToPoint(transform, this.secondPoint);
    }
    getBoundingBox() {
        return BoundingBox.fromPoints([this.angleVertex, this.firstPoint, this.secondPoint, this.definitionPoint]);
    }
    updateBlock() {
        super.updateBlock();
    }
}
//# sourceMappingURL=DimensionAngular3Pt.js.map