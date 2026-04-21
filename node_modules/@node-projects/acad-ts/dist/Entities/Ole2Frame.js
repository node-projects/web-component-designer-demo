import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { OleObjectType } from './OleObjectType.js';
import { XYZ } from '../Math/XYZ.js';
export class Ole2Frame extends Entity {
    binaryData = new Uint8Array(0);
    isPaperSpace = false;
    lowerRightCorner = new XYZ(0, 0, 0);
    get objectName() {
        return DxfFileToken.entityOle2Frame;
    }
    get objectType() {
        return ObjectType.OLE2FRAME;
    }
    oleObjectType = OleObjectType.Embedded;
    sourceApplication = '';
    get subclassMarker() {
        return DxfSubclassMarker.ole2Frame;
    }
    upperLeftCorner = new XYZ(1, 1, 0);
    version = 2;
    applyTransform(transform) {
        this.upperLeftCorner = this.applyTransformToPoint(transform, this.upperLeftCorner);
        this.lowerRightCorner = this.applyTransformToPoint(transform, this.lowerRightCorner);
    }
    getBoundingBox() {
        return BoundingBox.fromPoints([this.upperLeftCorner, this.lowerRightCorner]);
    }
}
//# sourceMappingURL=Ole2Frame.js.map