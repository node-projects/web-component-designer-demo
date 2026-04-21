import { Entity } from './Entity.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { VertexFlags } from './VertexFlags.js';
import { XYZ } from '../Math/XYZ.js';
export class Vertex extends Entity {
    bulge = 0.0;
    curveTangent = 0;
    endWidth = 0.0;
    get flags() {
        return this._flags;
    }
    set flags(value) {
        this._flags = value;
    }
    id = 0;
    location = new XYZ(0, 0, 0);
    get objectName() {
        return DxfFileToken.entityVertex;
    }
    startWidth = 0.0;
    _flags = VertexFlags.Default;
    constructor(location) {
        super();
        if (location) {
            this.location = location;
        }
    }
    applyTransform(transform) {
        this.location = this.applyTransformToPoint(transform, this.location);
    }
    getBoundingBox() {
        return BoundingBox.fromPoints([this.location]);
    }
    toString() {
        return `${this.subclassMarker}|${this.location.x},${this.location.y},${this.location.z}`;
    }
}
//# sourceMappingURL=Vertex.js.map