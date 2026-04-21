import { Entity } from './Entity.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Transform } from '../Math/Transform.js';
import { XYZ } from '../Math/XYZ.js';
export class Ellipse extends Entity {
    center = new XYZ(0, 0, 0);
    endParameter = Math.PI * 2;
    get isFullEllipse() {
        return this.startParameter === 0 && this.endParameter === Math.PI * 2;
    }
    get majorAxis() {
        return 2 * Math.sqrt(this.majorAxisEndPoint.x ** 2 +
            this.majorAxisEndPoint.y ** 2 +
            this.majorAxisEndPoint.z ** 2);
    }
    majorAxisEndPoint = new XYZ(1, 0, 0);
    get minorAxis() {
        return this.majorAxis * this.radiusRatio;
    }
    get minorAxisEndpoint() {
        const len = Math.sqrt(this.majorAxisEndPoint.x ** 2 +
            this.majorAxisEndPoint.y ** 2 +
            this.majorAxisEndPoint.z ** 2);
        if (len === 0)
            return new XYZ(0, 0, 0);
        const nx = this.majorAxisEndPoint.x / len;
        const ny = this.majorAxisEndPoint.y / len;
        const nz = this.majorAxisEndPoint.z / len;
        // Cross product of Normal and normalized MajorAxisEndPoint
        const dx = this.normal.y * nz - this.normal.z * ny;
        const dy = this.normal.z * nx - this.normal.x * nz;
        const dz = this.normal.x * ny - this.normal.y * nx;
        const dLen = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dLen === 0)
            return new XYZ(0, 0, 0);
        const scale = this.radiusRatio * len;
        return new XYZ((dx / dLen) * scale, (dy / dLen) * scale, (dz / dLen) * scale);
    }
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entityEllipse;
    }
    get objectType() {
        return ObjectType.ELLIPSE;
    }
    get radiusRatio() {
        return this._radiusRatio;
    }
    set radiusRatio(value) {
        if (value <= 0 || value > 1) {
            throw new Error('Radius ratio must be a value between 0 (not included) and 1.');
        }
        this._radiusRatio = value;
    }
    get rotation() {
        return Math.atan2(this.majorAxisEndPoint.y, this.majorAxisEndPoint.x);
    }
    startParameter = 0.0;
    get subclassMarker() {
        return DxfSubclassMarker.ellipse;
    }
    thickness = 0.0;
    _radiusRatio = 1.0;
    applyTransform(transform) {
        if (!(transform instanceof Transform)) {
            return;
        }
        const transformedCenter = this.applyTransformToPoint(transform, this.center);
        const transformedMajor = this.applyTransformToVector(transform, this.majorAxisEndPoint);
        const transformedMinor = this.applyTransformToVector(transform, this.minorAxisEndpoint);
        let majorAxis = transformedMajor;
        let minorAxis = transformedMinor;
        let startParameter = this.startParameter;
        let endParameter = this.endParameter;
        if (transformedMinor.getLength() > transformedMajor.getLength()) {
            majorAxis = transformedMinor;
            minorAxis = transformedMajor;
            startParameter = Math.PI / 2 - this.startParameter;
            endParameter = Math.PI / 2 - this.endParameter;
        }
        const majorLength = majorAxis.getLength();
        const minorLength = minorAxis.getLength();
        if (majorLength > Number.EPSILON && minorLength > Number.EPSILON) {
            this.majorAxisEndPoint = majorAxis;
            this.radiusRatio = Math.max(Number.EPSILON, Math.min(1, minorLength / majorLength));
            this.startParameter = startParameter;
            this.endParameter = endParameter;
            const normal = majorAxis.cross(minorAxis).normalize();
            if (!Number.isNaN(normal.x) && !Number.isNaN(normal.y) && !Number.isNaN(normal.z) && normal.getLength() > 0) {
                this.normal = normal;
            }
        }
        this.center = transformedCenter;
    }
    getBoundingBox() {
        const points = this.polygonalVertexes(64);
        return points.length > 0 ? BoundingBox.fromPoints(points) : null;
    }
    getEndVertices() {
        const start = this.polarCoordinateRelativeToCenter(this.startParameter);
        const end = this.polarCoordinateRelativeToCenter(this.endParameter);
        return { start, end };
    }
    polarCoordinateRelativeToCenter(angle) {
        const minor = this.minorAxisEndpoint;
        return new XYZ(this.center.x + this.majorAxisEndPoint.x * Math.cos(angle) + minor.x * Math.sin(angle), this.center.y + this.majorAxisEndPoint.y * Math.cos(angle) + minor.y * Math.sin(angle), this.center.z + this.majorAxisEndPoint.z * Math.cos(angle) + minor.z * Math.sin(angle));
    }
    polygonalVertexes(precision) {
        if (precision < 2) {
            throw new Error('The ellipse precision must be equal or greater than two.');
        }
        let start = this.startParameter;
        let end = this.endParameter;
        if (end < start) {
            end += Math.PI * 2;
        }
        const stepCount = Math.max(2, precision);
        const step = (end - start) / (stepCount - 1);
        const vertexes = [];
        for (let index = 0; index < stepCount; index++) {
            vertexes.push(this.polarCoordinateRelativeToCenter(start + step * index));
        }
        vertexes[0] = this.polarCoordinateRelativeToCenter(this.startParameter);
        vertexes[vertexes.length - 1] = this.polarCoordinateRelativeToCenter(this.endParameter);
        return vertexes;
    }
}
//# sourceMappingURL=Ellipse.js.map