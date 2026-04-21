import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class DictionaryVariable extends NonGraphicalObject {
    static currentAnnotationScale = 'CANNOSCALE';
    static currentMultiLeaderStyle = 'CMLEADERSTYLE';
    static currentTableStyle = 'CTABLESTYLE';
    static wipeoutFrame = 'WIPEOUTFRAME';
    get objectName() {
        return DxfFileToken.objectDictionaryVar;
    }
    objectSchemaNumber = 0;
    get objectType() {
        return ObjectType.UNLISTED;
    }
    get subclassMarker() {
        return DxfSubclassMarker.dictionaryVariables;
    }
    value = '';
    constructor(name, value) {
        super(name);
        if (value !== undefined) {
            this.value = value;
        }
    }
}
//# sourceMappingURL=DictionaryVariable.js.map