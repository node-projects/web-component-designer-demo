import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { LwPolylineFlags } from './LwPolylineFlags.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { PolylineExtensions } from '../Extensions/PolylineExtensions.js';
export class LwPolylineVertex {
    location = new XY(0, 0);
    startWidth = 0;
    endWidth = 0;
    bulge = 0;
    flags = 0;
    curveTangent = 0;
    id = 0;
    constructor(xy) {
        if (xy) {
            this.location = new XY(xy.x, xy.y);
        }
    }
    getLocation3D() {
        return new XYZ(this.location.x, this.location.y, 0);
    }
}
export class LwPolyline extends Entity {
    constantWidth = 0;
    elevation = 0;
    get flags() { return this._flags; }
    set flags(value) { this._flags = value; }
    get isClosed() {
        return (this._flags & LwPolylineFlags.Closed) !== 0;
    }
    set isClosed(value) {
        if (value) {
            this._flags = this._flags | LwPolylineFlags.Closed;
        }
        else {
            this._flags = this._flags & ~LwPolylineFlags.Closed;
        }
    }
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entityLwPolyline;
    }
    get objectType() {
        return ObjectType.LWPOLYLINE;
    }
    get subclassMarker() {
        return DxfSubclassMarker.lwPolyline;
    }
    thickness = 0;
    vertices = [];
    _flags = LwPolylineFlags.Default;
    constructor(vertices) {
        super();
        if (vertices && vertices.length > 0) {
            if ('location' in vertices[0]) {
                this.vertices = vertices;
            }
            else {
                this.vertices = vertices.map(xy => new LwPolylineVertex(xy));
            }
        }
    }
    applyTransform(transform) {
        for (const vertex of this.vertices) {
            const point = this.applyTransformToPoint(transform, new XYZ(vertex.location.x, vertex.location.y, this.elevation));
            vertex.location = new XY(point.x, point.y);
        }
        if (this.vertices.length > 0) {
            const elevationPoint = this.applyTransformToPoint(transform, new XYZ(0, 0, this.elevation));
            this.elevation = elevationPoint.z;
        }
        this.normal = this.applyTransformToVector(transform, this.normal).normalize();
    }
    getPoints(precision = 256) {
        return PolylineExtensions.getPoints(this, precision);
    }
    clone() {
        const clone = super.clone();
        clone.vertices = this.vertices.map(v => {
            const nv = new LwPolylineVertex();
            nv.location = new XY(v.location.x, v.location.y);
            nv.startWidth = v.startWidth;
            nv.endWidth = v.endWidth;
            nv.bulge = v.bulge;
            nv.flags = v.flags;
            nv.curveTangent = v.curveTangent;
            nv.id = v.id;
            return nv;
        });
        return clone;
    }
    getBoundingBox() {
        const points = this.getPoints();
        return points.length > 0 ? BoundingBox.fromPoints(points) : null;
    }
}
export { LwPolylineFlags } from './LwPolylineFlags.js';
//# sourceMappingURL=LwPolyline.js.map