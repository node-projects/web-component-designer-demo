import { AttributeBase } from './AttributeBase.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class AttributeDefinition extends AttributeBase {
    get objectType() {
        return ObjectType.ATTDEF;
    }
    get objectName() {
        return DxfFileToken.entityAttributeDefinition;
    }
    get subclassMarker() {
        return DxfSubclassMarker.attributeDefinition;
    }
    prompt = '';
    constructor(entity) {
        super();
        if (entity) {
            this.matchAttributeProperties(entity);
        }
    }
}
//# sourceMappingURL=AttributeDefinition.js.map