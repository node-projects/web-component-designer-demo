import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
export class ObjectContextData extends NonGraphicalObject {
    get subclassMarker() {
        return DxfSubclassMarker.objectContextData;
    }
    version = 3;
    hasFileToExtensionDictionary = true;
    default = false;
}
//# sourceMappingURL=ObjectContextData.js.map