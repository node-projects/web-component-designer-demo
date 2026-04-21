import { Polyline } from './Polyline.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { PolylineFlags } from './PolylineFlags.js';
export class PolyfaceMesh extends Polyline {
    faces = [];
    get flags() {
        return super.flags | PolylineFlags.PolyfaceMesh;
    }
    set flags(value) {
        super.flags = value;
    }
    get objectName() {
        return DxfFileToken.entityPolyline;
    }
    get objectType() {
        return ObjectType.POLYLINE_PFACE;
    }
    get subclassMarker() {
        return DxfSubclassMarker.polyfaceMesh;
    }
    clone() {
        const clone = super.clone();
        clone.faces = this.faces.map(f => f.clone());
        return clone;
    }
    getBoundingBox() {
        return super.getBoundingBox();
    }
}
//# sourceMappingURL=PolyfaceMesh.js.map