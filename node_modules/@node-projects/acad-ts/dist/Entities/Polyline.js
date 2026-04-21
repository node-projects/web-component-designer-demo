import { Entity } from './Entity.js';
import { SeqendCollection } from './SeqendCollection.js';
import { PolylineFlags } from './PolylineFlags.js';
import { SmoothSurfaceType } from './SmoothSurfaceType.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { PolylineExtensions } from '../Extensions/PolylineExtensions.js';
export class Polyline extends Entity {
    static matchVerticesEntityProperties = false;
    elevation = 0;
    endWidth = 0;
    get flags() { return this._flags; }
    set flags(value) { this._flags = value; }
    get isClosed() {
        return (this._flags & PolylineFlags.ClosedPolylineOrClosedPolygonMeshInM) !== 0;
    }
    set isClosed(value) {
        if (value) {
            this._flags = this._flags | PolylineFlags.ClosedPolylineOrClosedPolygonMeshInM;
        }
        else {
            this._flags = this._flags & ~PolylineFlags.ClosedPolylineOrClosedPolygonMeshInM;
            this._flags = this._flags & ~PolylineFlags.ClosedPolygonMeshInN;
        }
    }
    get layer() { return super.layer; }
    set layer(value) {
        super.layer = value;
        if (Polyline.matchVerticesEntityProperties) {
            for (const v of this.vertices) {
                if (v instanceof Entity) {
                    v.layer = value;
                }
            }
        }
    }
    get lineType() { return super.lineType; }
    set lineType(value) {
        super.lineType = value;
        if (Polyline.matchVerticesEntityProperties) {
            for (const v of this.vertices) {
                if (v instanceof Entity) {
                    v.lineType = value;
                }
            }
        }
    }
    normal = new XYZ(0, 0, 1);
    smoothSurface = SmoothSurfaceType.NoSmooth;
    startWidth = 0;
    thickness = 0;
    vertices = new SeqendCollection();
    _flags = 0;
    constructor(vertices) {
        super();
        if (vertices) {
            this.vertices = new SeqendCollection(...vertices);
        }
    }
    applyTransform(transform) {
        for (const vertex of this.vertices) {
            if (vertex instanceof Entity) {
                vertex.applyTransform(transform);
            }
        }
        this.normal = this.applyTransformToVector(transform, this.normal).normalize();
    }
    getPoints(precision = 256) {
        return PolylineExtensions.getPoints(this, precision);
    }
    getBoundingBox() {
        const points = this.getPoints();
        return points.length > 0 ? BoundingBox.fromPoints(points) : null;
    }
    clone() {
        const clone = super.clone();
        clone.vertices = new SeqendCollection(...this.vertices.map(v => v.clone()));
        return clone;
    }
    static *explode(vertices, isClosed) {
        const polyline = {
            elevation: 0,
            isClosed,
            normal: XYZ.axisZ,
            thickness: 0,
            vertices,
        };
        for (const entity of PolylineExtensions.explode(polyline)) {
            yield entity;
        }
    }
}
//# sourceMappingURL=Polyline.js.map