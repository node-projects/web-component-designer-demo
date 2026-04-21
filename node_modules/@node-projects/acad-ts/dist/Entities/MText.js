import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { AttachmentPointType } from './AttachmentPointType.js';
import { BackgroundFillFlags } from './BackgroundFillFlags.js';
import { ColumnType } from './ColumnType.js';
import { DrawingDirectionType } from './DrawingDirectionType.js';
import { LineSpacingStyleType } from './LineSpacingStyleType.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { Transform } from '../Math/Transform.js';
import { XY } from '../Math/XY.js';
import { XYZ } from '../Math/XYZ.js';
import { TextProcessor } from '../Text/TextProcessor.js';
export class TextColumnData {
    columnType = ColumnType.NoColumns;
    columnCount = 0;
    flowReversed = false;
    autoHeight = false;
    width = 0;
    gutter = 0;
    heights = [];
    clone() {
        const c = new TextColumnData();
        c.columnType = this.columnType;
        c.columnCount = this.columnCount;
        c.flowReversed = this.flowReversed;
        c.autoHeight = this.autoHeight;
        c.width = this.width;
        c.gutter = this.gutter;
        c.heights = [...this.heights];
        return c;
    }
}
export class MText extends Entity {
    alignmentPoint = new XYZ(0, 0, 0);
    attachmentPoint = AttachmentPointType.TopLeft;
    backgroundColor = null;
    backgroundFillFlags = BackgroundFillFlags.None;
    backgroundScale = 1.5;
    backgroundTransparency = 0;
    get columnData() {
        return this._columnData;
    }
    set columnData(value) {
        this._columnData = value;
    }
    drawingDirection = DrawingDirectionType.LeftToRight;
    get hasColumns() {
        return this._columnData != null && this._columnData.columnType !== ColumnType.NoColumns;
    }
    get height() {
        return this._height;
    }
    set height(value) {
        if (value <= 0) {
            throw new Error('The text height must be greater than zero.');
        }
        this._height = value;
    }
    horizontalWidth = 0.9;
    insertPoint = new XYZ(0, 0, 0);
    isAnnotative = false;
    lineSpacing = 1.0;
    lineSpacingStyle = LineSpacingStyleType.AtLeast;
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entityMText;
    }
    get objectType() {
        return ObjectType.MTEXT;
    }
    get plainText() {
        return TextProcessor.parse(this._value).result;
    }
    rectangleHeight = 0;
    rectangleWidth = 0;
    get rotation() {
        return Math.atan2(this.alignmentPoint.y, this.alignmentPoint.x);
    }
    set rotation(value) {
        this.alignmentPoint = new XYZ(Math.cos(value), Math.sin(value), 0);
    }
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
        return DxfSubclassMarker.mText;
    }
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
    }
    verticalHeight = 0.2;
    _height = 1.0;
    _style = TextStyle.default;
    _value = '';
    _columnData = new TextColumnData();
    constructor() {
        super();
    }
    applyTransform(transform) {
        if (!(transform instanceof Transform)) {
            return;
        }
        this.insertPoint = this.applyTransformToPoint(transform, this.insertPoint);
        const alignment = this.applyTransformToVector(transform, this.alignmentPoint);
        if (alignment.getLength() > 0) {
            this.alignmentPoint = alignment.normalize();
        }
        this.normal = this.transformNormal(transform, this.normal);
        const scale = this.getTransformAxisScale(transform);
        const safeX = scale.x === 0 ? 1 : scale.x;
        const safeY = scale.y === 0 ? 1 : scale.y;
        this.height *= safeY;
        this.horizontalWidth *= safeX;
        this.rectangleWidth *= safeX;
        this.rectangleHeight *= safeY;
        this.verticalHeight *= safeY;
    }
    clone() {
        const clone = super.clone();
        clone._style = this._style.clone();
        if (this._columnData) {
            clone._columnData = this._columnData.clone();
        }
        return clone;
    }
    getBoundingBox() {
        const lines = this.getPlainTextLines();
        const lineCount = Math.max(1, lines.length);
        const estimatedWidth = this.rectangleWidth > 0
            ? this.rectangleWidth
            : Math.max(...lines.map((line) => line.length), 0) * this.height * this.horizontalWidth * 0.6;
        const estimatedHeight = this.rectangleHeight > 0
            ? this.rectangleHeight
            : this.height * (1 + (lineCount - 1) * this.lineSpacing);
        let offsetX = 0;
        switch (this.attachmentPoint) {
            case AttachmentPointType.TopCenter:
            case AttachmentPointType.MiddleCenter:
            case AttachmentPointType.BottomCenter:
                offsetX = -estimatedWidth / 2;
                break;
            case AttachmentPointType.TopRight:
            case AttachmentPointType.MiddleRight:
            case AttachmentPointType.BottomRight:
                offsetX = -estimatedWidth;
                break;
        }
        let offsetY = 0;
        switch (this.attachmentPoint) {
            case AttachmentPointType.MiddleLeft:
            case AttachmentPointType.MiddleCenter:
            case AttachmentPointType.MiddleRight:
                offsetY = -estimatedHeight / 2;
                break;
            case AttachmentPointType.BottomLeft:
            case AttachmentPointType.BottomCenter:
            case AttachmentPointType.BottomRight:
                offsetY = -estimatedHeight;
                break;
        }
        const rotation = this.rotation;
        const corners = [
            new XY(offsetX, offsetY),
            new XY(offsetX + estimatedWidth, offsetY),
            new XY(offsetX, offsetY + estimatedHeight),
            new XY(offsetX + estimatedWidth, offsetY + estimatedHeight),
        ].map((point) => {
            const rotated = XY.rotate(point, rotation);
            return new XYZ(this.insertPoint.x + rotated.x, this.insertPoint.y + rotated.y, this.insertPoint.z);
        });
        return BoundingBox.fromPoints(corners);
    }
    getPlainTextLines() {
        return this.plainText.split(/\r\n|\r|\n/);
    }
    getTextLines() {
        const combined = this._value.replace(/\\P/gi, '\n');
        return combined.split(/\r\n|\r|\n/);
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
export { AttachmentPointType } from './AttachmentPointType.js';
export { DrawingDirectionType } from './DrawingDirectionType.js';
export { LineSpacingStyleType } from './LineSpacingStyleType.js';
export { BackgroundFillFlags } from './BackgroundFillFlags.js';
export { ColumnType } from './ColumnType.js';
//# sourceMappingURL=MText.js.map