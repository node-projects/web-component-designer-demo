import { AttributeBase } from './AttributeBase.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class AttributeEntity extends AttributeBase {
    get objectName() {
        return DxfFileToken.entityAttribute;
    }
    get objectType() {
        return ObjectType.ATTRIB;
    }
    get subclassMarker() {
        return DxfSubclassMarker.attribute;
    }
    constructor(definition) {
        super();
        if (definition) {
            this.matchAttributeProperties(definition);
        }
    }
}
//# sourceMappingURL=AttributeEntity.js.map