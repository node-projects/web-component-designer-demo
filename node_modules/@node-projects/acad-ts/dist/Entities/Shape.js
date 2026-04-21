import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Transform } from '../Math/Transform.js';
import { XY } from '../Math/XY.js';
import { XYZ } from '../Math/XYZ.js';
export class Shape extends Entity {
    get objectType() {
        return ObjectType.SHAPE;
    }
    get objectName() {
        return DxfFileToken.entityShape;
    }
    get subclassMarker() {
        return DxfSubclassMarker.shape;
    }
    thickness = 0.0;
    insertionPoint = new XYZ(0, 0, 0);
    size = 1.0;
    get shapeStyle() {
        return this._style;
    }
    set shapeStyle(value) {
        if (value == null || !value.isShapeFile) {
            throw new Error('value cannot be null and must be a shape file');
        }
        if (this.document != null) {
            this._style = CadObject.updateCollection(value, this.document.textStyles);
        }
        else {
            this._style = value;
        }
    }
    rotation = 0;
    relativeXScale = 1;
    obliqueAngle = 0;
    normal = new XYZ(0, 0, 1);
    /** @internal */
    shapeIndex = 0;
    _style;
    /** @internal */
    constructor(textStyle) {
        super();
        if (textStyle) {
            this.shapeStyle = textStyle;
        }
    }
    clone() {
        const clone = super.clone();
        clone._style = this._style?.clone();
        return clone;
    }
    getBoundingBox() {
        const width = this.size * Math.max(Math.abs(this.relativeXScale), 1e-12);
        const corners = [
            new XY(0, 0),
            new XY(width, 0),
            new XY(0, this.size),
            new XY(width, this.size),
        ].map((corner) => {
            const rotated = XY.rotate(corner, this.rotation);
            return new XYZ(this.insertionPoint.x + rotated.x, this.insertionPoint.y + rotated.y, this.insertionPoint.z);
        });
        return BoundingBox.fromPoints(corners);
    }
    applyTransform(transform) {
        this.insertionPoint = this.applyTransformToPoint(transform, this.insertionPoint);
        this.normal = this.transformNormal(transform, this.normal);
        if (!(transform instanceof Transform)) {
            return;
        }
        const scale = this.getTransformAxisScale(transform);
        const safeX = scale.x === 0 ? 1 : scale.x;
        const safeY = scale.y === 0 ? 1 : scale.y;
        this.rotation += transform.eulerRotation.z;
        this.size *= safeY;
        this.relativeXScale *= safeX / safeY;
    }
}
//# sourceMappingURL=Shape.js.map