import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
export class MeshEdge {
    start;
    end;
    crease = null;
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    toString() {
        return `${this.start}|${this.end}|${this.crease ?? ''}`;
    }
}
export class Mesh extends Entity {
    blendCrease = 0;
    edges = [];
    faces = [];
    get objectName() {
        return DxfFileToken.entityMesh;
    }
    get objectType() {
        return ObjectType.UNLISTED;
    }
    get subclassMarker() {
        return DxfSubclassMarker.mesh;
    }
    subdivisionLevel = 0;
    version = 0;
    vertices = [];
    applyTransform(transform) {
        this.vertices = this.vertices.map((vertex) => this.applyTransformToPoint(transform, vertex));
    }
    clone() {
        const clone = super.clone();
        clone.vertices = this.vertices.map(v => new XYZ(v.x, v.y, v.z));
        clone.edges = this.edges.map(e => {
            const ne = new MeshEdge(e.start, e.end);
            ne.crease = e.crease;
            return ne;
        });
        clone.faces = this.faces.map(f => [...f]);
        return clone;
    }
    getBoundingBox() {
        return this.vertices.length > 0 ? BoundingBox.fromPoints(this.vertices) : null;
    }
}
//# sourceMappingURL=Mesh.js.map