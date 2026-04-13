import { TextEntity } from './TextEntity.js';
import { AttributeType } from './AttributeType.js';
import { AttributeFlags } from './AttributeFlags.js';
import { TextVerticalAlignmentType } from './TextVerticalAlignmentType.js';
export class AttributeBase extends TextEntity {
    attributeType = AttributeType.SingleLine;
    flags = AttributeFlags.None;
    isReallyLocked = false;
    mText = null;
    get tag() {
        return this._tag;
    }
    set tag(value) {
        this._tag = value;
    }
    version = 0;
    verticalAlignment = TextVerticalAlignmentType.Baseline;
    _tag = '';
    constructor() {
        super();
    }
    matchAttributeProperties(src) {
        this.matchProperties(src);
        this.thickness = src.thickness;
        this.insertPoint = src.insertPoint;
        this.height = src.height;
        this.value = src.value;
        this.rotation = src.rotation;
        this.widthFactor = src.widthFactor;
        this.obliqueAngle = src.obliqueAngle;
        if (this.style.document !== src.style.document) {
            this.style = src.style.clone();
        }
        else {
            this.style = src.style;
        }
        this.mirror = src.mirror;
        this.horizontalAlignment = src.horizontalAlignment;
        this.alignmentPoint = src.alignmentPoint;
        this.normal = src.normal;
        this.verticalAlignment = src.verticalAlignment;
        this.version = src.version;
        this.tag = src.tag;
        this.flags = src.flags;
        this.attributeType = src.attributeType;
        this.isReallyLocked = src.isReallyLocked;
        this.insertPoint = src.insertPoint;
    }
}
export { AttributeType } from './AttributeType.js';
export { AttributeFlags } from './AttributeFlags.js';
//# sourceMappingURL=AttributeBase.js.map