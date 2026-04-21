import { Polyline } from './Polyline.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { PolylineFlags } from './PolylineFlags.js';
export class PolygonMesh extends Polyline {
    get flags() {
        return super.flags | PolylineFlags.PolygonMesh;
    }
    set flags(value) {
        super.flags = value;
    }
    mSmoothSurfaceDensity = 0;
    mVertexCount = 0;
    nSmoothSurfaceDensity = 0;
    nVertexCount = 0;
    get objectName() {
        return DxfFileToken.entityPolyline;
    }
    get objectType() {
        return ObjectType.POLYLINE_MESH;
    }
    get subclassMarker() {
        return DxfSubclassMarker.polygonMesh;
    }
    getBoundingBox() {
        return super.getBoundingBox();
    }
}
//# sourceMappingURL=PolygonMesh.js.map