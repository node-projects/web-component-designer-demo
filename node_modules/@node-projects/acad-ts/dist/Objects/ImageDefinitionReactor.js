import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class ImageDefinitionReactor extends NonGraphicalObject {
    get objectType() {
        return ObjectType.UNLISTED;
    }
    get objectName() {
        return DxfFileToken.objectImageDefinitionReactor;
    }
    get subclassMarker() {
        return DxfSubclassMarker.rasterImageDefReactor;
    }
    classVersion = 2;
    image = null;
}
//# sourceMappingURL=ImageDefinitionReactor.js.map