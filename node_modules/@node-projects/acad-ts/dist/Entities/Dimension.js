import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { AppId } from '../Tables/AppId.js';
import { DimensionStyle } from '../Tables/DimensionStyle.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { Layer } from '../Tables/Layer.js';
import { DimensionType } from './DimensionType.js';
import { AttachmentPointType } from './AttachmentPointType.js';
import { LineSpacingStyleType } from './LineSpacingStyleType.js';
import { DxfClassMap } from '../DxfClassMap.js';
import { Line } from './Line.js';
import { MText } from './MText.js';
import { Point } from './Point.js';
import { ExtendedData } from '../XData/ExtendedData.js';
import { ExtendedDataInteger16 } from '../XData/ExtendedDataInteger16.js';
import { XYZ } from '../Math/XYZ.js';
export class Dimension extends Entity {
    attachmentPoint = AttachmentPointType.TopLeft;
    get block() {
        return this._block;
    }
    set block(value) {
        if (this.document != null) {
            this._block = CadObject.updateCollection(value, this.document.blockRecords);
        }
        else {
            this._block = value;
        }
    }
    definitionPoint = new XYZ(0, 0, 0);
    get flags() {
        return this._flags;
    }
    /** @internal */
    set flags(value) {
        this._flags = value;
    }
    flipArrow1 = false;
    flipArrow2 = false;
    get hasStyleOverride() {
        for (const [appName, data] of this.extendedData.getExtendedDataByName()) {
            if (data.records.length > 0 && (appName === AppId.defaultName.toUpperCase() || appName.startsWith(`${AppId.defaultName.toUpperCase()}_DSTYLE`))) {
                return true;
            }
        }
        return false;
    }
    horizontalDirection = 0;
    insertionPoint = new XYZ(0, 0, 0);
    get isAngular() {
        return (this._flags & DimensionType.Angular3Point) !== 0 || (this._flags & DimensionType.Angular) !== 0;
    }
    get isTextUserDefinedLocation() {
        return (this._flags & DimensionType.TextUserDefinedLocation) !== 0;
    }
    set isTextUserDefinedLocation(value) {
        if (value) {
            this._flags = this._flags | DimensionType.TextUserDefinedLocation;
        }
        else {
            this._flags = this._flags & ~DimensionType.TextUserDefinedLocation;
        }
    }
    lineSpacingFactor = 0;
    lineSpacingStyle = LineSpacingStyleType.AtLeast;
    normal = new XYZ(0, 0, 1);
    get style() {
        return this._style;
    }
    set style(value) {
        if (value == null) {
            throw new Error('value cannot be null');
        }
        if (this.document != null) {
            this._style = CadObject.updateCollection(value, this.document.dimensionStyles);
        }
        else {
            this._style = value;
        }
    }
    get subclassMarker() {
        return DxfSubclassMarker.dimension;
    }
    text = '';
    textMiddlePoint = new XYZ(0, 0, 0);
    textRotation = 0;
    version = 0;
    _block = null;
    _flags;
    _style = DimensionStyle.default;
    constructor(type) {
        super();
        this._flags = type;
        this._flags |= DimensionType.BlockReference;
    }
    applyTransform(transform) {
        this.definitionPoint = this.applyTransformToPoint(transform, this.definitionPoint);
        this.insertionPoint = this.applyTransformToPoint(transform, this.insertionPoint);
        this.textMiddlePoint = this.applyTransformToPoint(transform, this.textMiddlePoint);
        this.normal = this.applyTransformToVector(transform, this.normal).normalize();
        const rotation = transform?.eulerRotation?.z;
        if (typeof rotation === 'number') {
            this.textRotation += rotation;
        }
    }
    clone() {
        const clone = super.clone();
        clone._style = this._style.clone();
        clone._block = this._block?.clone() ?? null;
        return clone;
    }
    getActiveDimensionStyle() {
        if (!this.hasStyleOverride) {
            return this.style;
        }
        const style = this.style.clone();
        const map = this.getStyleOverrideMap();
        if (map == null) {
            return style;
        }
        const classMap = DxfClassMap.create(DimensionStyle);
        for (const [code, value] of map) {
            const property = classMap.dxfProperties.get(code);
            if (property != null) {
                property.setValue(code, style, value);
            }
        }
        return style;
    }
    getMeasurementText(style) {
        const activeStyle = style ?? this.getActiveDimensionStyle();
        const measurement = this._formatMeasurement(this.measurement, activeStyle);
        if (this.text.length > 0) {
            return this.text.includes('<>') ? this.text.replace(/<>/g, measurement) : this.text;
        }
        return `${activeStyle.prefix}${measurement}${activeStyle.suffix}`;
    }
    getStyleOverrideMap() {
        const map = new Map();
        const classMap = DxfClassMap.create(DimensionStyle);
        for (const [name, extendedData] of this.extendedData.getExtendedDataByName()) {
            if (name !== AppId.defaultName.toUpperCase() && !name.startsWith(`${AppId.defaultName.toUpperCase()}_${DimensionStyle.styleOverrideEntryName}`)) {
                continue;
            }
            for (let index = 0; index < extendedData.records.length - 1; index++) {
                const codeRecord = extendedData.records[index];
                const valueRecord = extendedData.records[index + 1];
                if (!(codeRecord instanceof ExtendedDataInteger16)) {
                    continue;
                }
                if (classMap.dxfProperties.has(codeRecord.value)) {
                    map.set(codeRecord.value, valueRecord.rawValue);
                }
                index += 1;
            }
        }
        return map.size > 0 ? map : null;
    }
    setDimensionOverride(styleOverride) {
        const current = this.style;
        const classMap = DxfClassMap.create(DimensionStyle);
        const overrides = new Map();
        for (const [code, property] of classMap.dxfProperties) {
            const baseValue = property.getRawValue(current);
            const overrideValue = property.getRawValue(styleOverride);
            if (overrideValue !== undefined && overrideValue !== null && overrideValue !== baseValue) {
                overrides.set(code, overrideValue);
            }
        }
        this.setStyleOverrideMap(overrides);
    }
    setStyleOverrideMap(map) {
        const appName = `${AppId.defaultName}_${DimensionStyle.styleOverrideEntryName}`;
        const nextRecords = [];
        if (map != null) {
            const classMap = DxfClassMap.create(DimensionStyle);
            for (const [code, value] of map) {
                const property = classMap.dxfProperties.get(code);
                if (property == null) {
                    continue;
                }
                property.storedValue = value;
                nextRecords.push(...property.toXDataRecords());
            }
        }
        const existing = this.extendedData.tryGetByName(appName);
        if (map == null || map.size === 0) {
            if (existing.found && existing.value != null) {
                for (const [app] of this.extendedData) {
                    if (app.name.toUpperCase() === appName.toUpperCase()) {
                        this.extendedData.set(app, new ExtendedData());
                    }
                }
            }
            return;
        }
        const records = new ExtendedData(nextRecords);
        if (existing.found) {
            for (const [app] of this.extendedData) {
                if (app.name.toUpperCase() === appName.toUpperCase()) {
                    this.extendedData.set(app, records);
                }
            }
            return;
        }
        this.extendedData.addByName(appName, records);
    }
    updateBlock() {
        this.createBlock();
    }
    /** @internal */
    assignDocument(doc) {
        super.assignDocument(doc);
        this._style = CadObject.updateCollection(this._style, doc.dimensionStyles);
        this._block = CadObject.updateCollection(this._block, doc.blockRecords);
        if (this._block != null) {
            this._block.name = this._generateBlockName();
        }
        this._block = CadObject.updateCollection(this._block, doc.blockRecords);
    }
    /** @internal */
    unassignDocument() {
        super.unassignDocument();
        this._style = this._style?.clone();
        this._block = this._block?.clone() ?? null;
    }
    createBlock() {
        if (this._block == null) {
            this._block = new BlockRecord(this._generateBlockName());
            this._block.isAnonymous = true;
        }
        if (this.document != null) {
            this._block = CadObject.updateCollection(this._block, this.document.blockRecords);
        }
        this._block.entities.clear();
    }
    createDefinitionPoint(location) {
        const point = new Point(new XYZ(location.x, location.y, location.z));
        point.layer = this.document?.layers.get(Layer.defpointsName) ?? Layer.defpoints;
        point.normal = this.normal;
        return point;
    }
    createTextEntity(insertPoint, text) {
        const style = this.getActiveDimensionStyle();
        const entity = new MText();
        entity.insertPoint = new XYZ(insertPoint.x, insertPoint.y, insertPoint.z);
        entity.alignmentPoint = new XYZ(Math.cos(this.textRotation), Math.sin(this.textRotation), 0);
        entity.attachmentPoint = this.attachmentPoint;
        entity.color = style.textColor;
        entity.height = style.textHeight;
        entity.layer = this.layer;
        entity.lineSpacing = this.lineSpacingFactor === 0 ? entity.lineSpacing : this.lineSpacingFactor;
        entity.lineSpacingStyle = this.lineSpacingStyle;
        entity.normal = this.normal;
        entity.rotation = this.textRotation;
        entity.style = style.style;
        entity.value = text;
        return entity;
    }
    populateBlock(lineSegments, definitionPoints, textPoint = this.textMiddlePoint) {
        this.createBlock();
        for (const [start, end] of lineSegments) {
            this._addBlockLine(start, end);
        }
        const seenPoints = new Set();
        for (const point of definitionPoints) {
            if (!this.isFinitePoint(point)) {
                continue;
            }
            const key = `${point.x}:${point.y}:${point.z}`;
            if (seenPoints.has(key)) {
                continue;
            }
            seenPoints.add(key);
            this._block.entities.add(this.createDefinitionPoint(point));
        }
        if (this.isFinitePoint(textPoint)) {
            this._block.entities.add(this.createTextEntity(textPoint, this.getMeasurementText()));
        }
    }
    static angleBetweenVectors(first, second) {
        const lengthProduct = first.getLength() * second.getLength();
        if (lengthProduct === 0) {
            return 0;
        }
        const cosine = first.dot(second) / lengthProduct;
        const clamped = Math.max(-1, Math.min(1, cosine));
        return Math.acos(clamped);
    }
    static areParallel(first, second) {
        return Dimension.isZeroVector(first.cross(second));
    }
    isFinitePoint(point) {
        return Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z);
    }
    _addBlockLine(start, end) {
        if (!this.isFinitePoint(start) || !this.isFinitePoint(end) || start.equals(end)) {
            return;
        }
        const line = new Line(new XYZ(start.x, start.y, start.z), new XYZ(end.x, end.y, end.z));
        line.layer = this.layer;
        line.normal = this.normal;
        this._block.entities.add(line);
    }
    static intersectLinesXY(firstStart, firstEnd, secondStart, secondEnd) {
        const denominator = (firstStart.x - firstEnd.x) * (secondStart.y - secondEnd.y) -
            (firstStart.y - firstEnd.y) * (secondStart.x - secondEnd.x);
        if (Math.abs(denominator) <= 1e-12) {
            return XYZ.naN;
        }
        const firstDeterminant = firstStart.x * firstEnd.y - firstStart.y * firstEnd.x;
        const secondDeterminant = secondStart.x * secondEnd.y - secondStart.y * secondEnd.x;
        return new XYZ((firstDeterminant * (secondStart.x - secondEnd.x) - (firstStart.x - firstEnd.x) * secondDeterminant) / denominator, (firstDeterminant * (secondStart.y - secondEnd.y) - (firstStart.y - firstEnd.y) * secondDeterminant) / denominator, firstStart.z);
    }
    static isZeroVector(vector, epsilon = 1e-12) {
        return Math.abs(vector.x) <= epsilon && Math.abs(vector.y) <= epsilon && Math.abs(vector.z) <= epsilon;
    }
    static subtractPoints(first, second) {
        return new XYZ(first.x - second.x, first.y - second.y, first.z - second.z);
    }
    _tableOnRemove(sender, e) {
        super._tableOnRemove(sender, e);
        if (e.item === this._style) {
            this._style = this.document.dimensionStyles.get(DimensionStyle.defaultName);
        }
        if (e.item === this._block) {
            this._block = null;
        }
    }
    _generateBlockName() {
        return `*D${this.handle}`;
    }
    _formatMeasurement(value, style) {
        if (!Number.isFinite(value)) {
            return '';
        }
        let measurement = value;
        if (style.rounding > 0) {
            measurement = Math.round(measurement / style.rounding) * style.rounding;
        }
        return measurement.toFixed(style.decimalPlaces);
    }
}
export { DimensionType } from './DimensionType.js';
//# sourceMappingURL=Dimension.js.map