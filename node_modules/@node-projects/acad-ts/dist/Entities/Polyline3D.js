import { Polyline } from './Polyline.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { PolylineFlags } from './PolylineFlags.js';
import { SeqendCollection } from './SeqendCollection.js';
import { Vertex3D } from './Vertex3D.js';
export class Polyline3D extends Polyline {
    get flags() {
        return super.flags | PolylineFlags.Polyline3D;
    }
    set flags(value) {
        super.flags = value;
    }
    get objectName() {
        return DxfFileToken.entityPolyline;
    }
    get objectType() {
        return ObjectType.POLYLINE_3D;
    }
    get subclassMarker() {
        return DxfSubclassMarker.polyline3d;
    }
    constructor(vertices) {
        super();
        if (vertices && vertices.length > 0) {
            if (vertices[0] instanceof Vertex3D) {
                this.vertices = new SeqendCollection(...vertices);
            }
            else {
                this.vertices = new SeqendCollection(...vertices.map(xyz => new Vertex3D(xyz)));
            }
        }
    }
    getBoundingBox() { return super.getBoundingBox(); }
}
//# sourceMappingURL=Polyline3D.js.map