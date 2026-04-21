import { CadDictionary } from './CadDictionary.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class CadDictionaryWithDefault extends CadDictionary {
    defaultEntry = null;
    get objectName() {
        return DxfFileToken.objectDictionaryWithDefault;
    }
    get objectType() {
        return ObjectType.UNLISTED;
    }
    get subclassMarker() {
        return DxfSubclassMarker.dictionaryWithDefault;
    }
    constructor(name, defaultEntry) {
        super(name);
        if (defaultEntry) {
            this.defaultEntry = defaultEntry;
        }
    }
}
//# sourceMappingURL=CadDictionaryWithDefault.js.map