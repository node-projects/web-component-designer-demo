import { CadWipeoutBase } from './CadWipeoutBase.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class RasterImage extends CadWipeoutBase {
    get objectName() {
        return DxfFileToken.entityImage;
    }
    get objectType() {
        return ObjectType.UNLISTED;
    }
    get subclassMarker() {
        return DxfSubclassMarker.rasterImage;
    }
    get definition() {
        return super.definition;
    }
    set definition(value) {
        if (value == null) {
            throw new Error('value cannot be null');
        }
        super.definition = value;
    }
    constructor(imageDefinition) {
        super();
        if (imageDefinition) {
            this.definition = imageDefinition;
        }
    }
}
//# sourceMappingURL=RasterImage.js.map