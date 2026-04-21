import { Entity } from './Entity.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Transform } from '../Math/Transform.js';
import { XYZ } from '../Math/XYZ.js';
export class Circle extends Entity {
    center = new XYZ(0, 0, 0);
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entityCircle;
    }
    get objectType() {
        return ObjectType.CIRCLE;
    }
    get radius() {
        return this._radius;
    }
    set radius(value) {
        if (value <= 0) {
            throw new Error('The radius must be greater than 0.');
        }
        this._radius = value;
    }
    get radiusRatio() {
        return 1;
    }
    get subclassMarker() {
        return DxfSubclassMarker.circle;
    }
    thickness = 0.0;
    _radius = 1.0;
    constructor() {
        super();
    }
    applyTransform(transform) {
        if (!(transform instanceof Transform)) {
            return;
        }
        this.center = this.applyTransformToPoint(transform, this.center);
        this.normal = this.applyTransformToVector(transform, this.normal).normalize();
        const scale = this.getTransformAxisScale(transform);
        this.radius *= (scale.x + scale.y) / 2;
    }
    getBoundingBox() {
        const min = new XYZ(this.center.x - this._radius, this.center.y - this._radius, this.center.z);
        const max = new XYZ(this.center.x + this._radius, this.center.y + this._radius, this.center.z);
        return new BoundingBox(min, max);
    }
    polarCoordinateRelativeToCenter(angle) {
        return new XYZ(this.center.x + this._radius * Math.cos(angle), this.center.y + this._radius * Math.sin(angle), this.center.z);
    }
    polygonalVertexes(precision) {
        if (precision < 2) {
            throw new Error('The arc precision must be equal or greater than two.');
        }
        const vertexes = [];
        const step = (Math.PI * 2) / precision;
        for (let index = 0; index < precision; index++) {
            vertexes.push(this.polarCoordinateRelativeToCenter(step * index));
        }
        return vertexes;
    }
}
//# sourceMappingURL=Circle.js.map