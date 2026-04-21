import { Dimension, DimensionType } from '../../Entities/Dimension.js';
import { DimensionAligned } from '../../Entities/DimensionAligned.js';
import { DimensionLinear } from '../../Entities/DimensionLinear.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadDimensionTemplate extends CadEntityTemplate {
    styleHandle = null;
    blockHandle = null;
    blockName = null;
    styleName = null;
    constructor(dimension) {
        super(dimension ?? new DimensionPlaceholder());
    }
    _build(builder) {
        super._build(builder);
        const dimension = this.cadObject;
        const style = this.getTableReference(builder, this.styleHandle, this.styleName ?? '');
        if (style) {
            dimension.style = style;
        }
        const block = this.getTableReference(builder, this.blockHandle, this.blockName ?? '');
        if (block) {
            dimension.block = block;
        }
    }
    setDimensionFlags(flags) {
        const dimension = this.cadObject;
        dimension.flags = flags;
    }
    setDimensionObject(dimension) {
        dimension.handle = this.cadObject.handle;
        dimension.owner = this.cadObject.owner;
        dimension.xDictionary = this.cadObject.xDictionary;
        dimension.color = this.cadObject.color;
        dimension.lineWeight = this.cadObject.lineWeight;
        dimension.lineTypeScale = this.cadObject.lineTypeScale;
        dimension.isInvisible = this.cadObject.isInvisible;
        dimension.transparency = this.cadObject.transparency;
        const source = this.cadObject;
        dimension.version = source.version;
        dimension.definitionPoint = source.definitionPoint;
        dimension.textMiddlePoint = source.textMiddlePoint;
        dimension.insertionPoint = source.insertionPoint;
        dimension.normal = source.normal;
        dimension.isTextUserDefinedLocation = source.isTextUserDefinedLocation;
        dimension.attachmentPoint = source.attachmentPoint;
        dimension.lineSpacingStyle = source.lineSpacingStyle;
        dimension.lineSpacingFactor = source.lineSpacingFactor;
        dimension.text = source.text;
        dimension.textRotation = source.textRotation;
        dimension.horizontalDirection = source.horizontalDirection;
        dimension.flags = source.flags;
        if (this.cadObject instanceof DimensionAligned &&
            dimension instanceof DimensionLinear) {
            const aligned = this.cadObject;
            const linear = dimension;
            linear.firstPoint = aligned.firstPoint;
            linear.secondPoint = aligned.secondPoint;
            linear.extLineRotation = aligned.extLineRotation;
        }
        this.cadObject = dimension;
    }
}
export class DimensionPlaceholder extends Dimension {
    get objectType() { return ObjectType.INVALID; }
    get measurement() { return 0; }
    getBoundingBox() { return null; }
    constructor() {
        super(DimensionType.Linear);
    }
}
//# sourceMappingURL=CadDimensionTemplate.js.map