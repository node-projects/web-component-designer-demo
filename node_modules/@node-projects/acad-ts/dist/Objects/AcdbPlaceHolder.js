import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class AcdbPlaceHolder extends NonGraphicalObject {
    get objectType() {
        return ObjectType.ACDBPLACEHOLDER;
    }
    get objectName() {
        return DxfFileToken.objectPlaceholder;
    }
    get subclassMarker() {
        return DxfSubclassMarker.acDbPlaceHolder;
    }
}
//# sourceMappingURL=AcdbPlaceHolder.js.map