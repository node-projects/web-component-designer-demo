import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { TextHorizontalAlignment } from './TextHorizontalAlignment.js';
import { TextVerticalAlignmentType } from './TextVerticalAlignmentType.js';
import { TextMirrorFlag } from './TextMirrorFlag.js';
import { XYZ } from '../Math/XYZ.js';
import { Transform } from '../Math/Transform.js';
export class TextEntity extends Entity {
    alignmentPoint = new XYZ(0, 0, 0);
    get height() {
        return this._height;
    }
    set height(value) {
        if (value <= 0) {
            throw new Error('The Text height must be greater than zero.');
        }
        this._height = value;
    }
    horizontalAlignment = TextHorizontalAlignment.Left;
    insertPoint = new XYZ(0, 0, 0);
    get mirror() {
        return this._mirror;
    }
    set mirror(value) {
        this._mirror = value;
    }
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entityText;
    }
    get objectType() {
        return ObjectType.TEXT;
    }
    obliqueAngle = 0.0;
    rotation = 0;
    get style() {
        return this._style;
    }
    set style(value) {
        if (value == null) {
            throw new Error('value cannot be null');
        }
        if (this.document != null) {
            this._style = CadObject.updateCollection(value, this.document.textStyles);
        }
        else {
            this._style = value;
        }
    }
    get subclassMarker() {
        return DxfSubclassMarker.text;
    }
    thickness = 0.0;
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
    }
    verticalAlignment = TextVerticalAlignmentType.Baseline;
    widthFactor = 1.0;
    _height = 1.0;
    _mirror = TextMirrorFlag.None;
    _style = TextStyle.default;
    _value = '';
    constructor() {
        super();
    }
    applyTransform(transform) {
        if (!(transform instanceof Transform)) {
            return;
        }
        const matrix = transform.matrix;
        this.insertPoint = transform.applyTransform(this.insertPoint);
        const xScale = Math.hypot(matrix.m00, matrix.m10, matrix.m20);
        const yScale = Math.hypot(matrix.m01, matrix.m11, matrix.m21);
        const safeYScale = yScale === 0 ? 1 : yScale;
        this.rotation += transform.eulerRotation.z;
        this.height *= safeYScale;
        this.widthFactor *= xScale / safeYScale;
    }
    clone() {
        const clone = super.clone();
        clone._style = this._style.clone();
        return clone;
    }
    getBoundingBox() {
        return null;
    }
    /** @internal */
    assignDocument(doc) {
        super.assignDocument(doc);
        this._style = CadObject.updateCollection(this._style, doc.textStyles);
    }
    /** @internal */
    unassignDocument() {
        super.unassignDocument();
        this._style = this._style.clone();
    }
    _tableOnRemove(sender, e) {
        super._tableOnRemove(sender, e);
        if (e.item === this._style) {
            this._style = this.document.textStyles.get(TextStyle.defaultName);
        }
    }
}
export { TextHorizontalAlignment } from './TextHorizontalAlignment.js';
export { TextVerticalAlignmentType } from './TextVerticalAlignmentType.js';
export { TextMirrorFlag } from './TextMirrorFlag.js';
//# sourceMappingURL=TextEntity.js.map