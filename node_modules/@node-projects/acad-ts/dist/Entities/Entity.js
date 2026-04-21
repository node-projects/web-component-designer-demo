import { CadObject } from '../CadObject.js';
import { Color } from '../Color.js';
import { Layer } from '../Tables/Layer.js';
import { LineType } from '../Tables/LineType.js';
import { LineWeightType } from '../Types/LineWeightType.js';
import { Transparency } from '../Transparency.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { Transform } from '../Math/Transform.js';
function isBlockRecordOwner(value) {
    return value != null && typeof value === 'object' && 'blockEntity' in value;
}
export class Entity extends CadObject {
    bookColor = null;
    color = Color.byLayer;
    isInvisible = false;
    get layer() {
        return this._layer;
    }
    set layer(value) {
        if (value == null) {
            throw new Error('value cannot be null');
        }
        this._layer = CadObject.updateCollection(value, this.document?.layers ?? null);
    }
    get lineType() {
        return this._lineType;
    }
    set lineType(value) {
        if (value == null) {
            throw new Error('value cannot be null');
        }
        this._lineType = CadObject.updateCollection(value, this.document?.lineTypes ?? null);
    }
    lineTypeScale = 1.0;
    lineWeight = LineWeightType.ByLayer;
    material = null;
    get subclassMarker() {
        return DxfSubclassMarker.entity;
    }
    transparency = Transparency.byLayer;
    _bookColor = null;
    _layer = Layer.default;
    _lineType = LineType.byLayer;
    constructor() {
        super();
    }
    applyRotation(axis, rotation) {
        this.applyTransform(Transform.createRotation(axis, rotation));
    }
    applyScaling(scale, origin) {
        this.applyTransform(Transform.createScaling(scale, origin));
    }
    applyTranslation(translation) {
        this.applyTransform(Transform.createTranslation(translation));
    }
    clone() {
        const clone = super.clone();
        clone._layer = this.layer.clone();
        clone._lineType = this.lineType.clone();
        clone.material = this.material?.clone?.() ?? null;
        return clone;
    }
    getActiveColor() {
        let color;
        if (this.color.isByLayer) {
            color = this.layer.color;
        }
        else if (this.color.isByBlock && isBlockRecordOwner(this.owner)) {
            color = this.owner.blockEntity.color;
        }
        else {
            color = this.color;
        }
        return color;
    }
    getActiveLineType() {
        if (this.lineType.name.toUpperCase() === LineType.byLayerName.toUpperCase()) {
            return this.layer.lineType;
        }
        else if (this.lineType.name.toUpperCase() === LineType.byBlockName.toUpperCase() &&
            isBlockRecordOwner(this.owner)) {
            return this.owner.blockEntity.lineType;
        }
        return this.lineType;
    }
    getActiveLineWeightType() {
        switch (this.lineWeight) {
            case LineWeightType.ByLayer:
                return this.layer.lineWeight;
            case LineWeightType.ByBlock:
                if (isBlockRecordOwner(this.owner)) {
                    return this.owner.blockEntity.getActiveLineWeightType();
                }
                else {
                    return this.lineWeight;
                }
            default:
                return this.lineWeight;
        }
    }
    matchProperties(entity) {
        if (entity == null) {
            throw new Error('entity cannot be null');
        }
        if (entity.handle === 0 || this.document !== entity.document) {
            this.layer = entity.layer.clone();
            this.lineType = entity.lineType.clone();
            this.material = entity.material?.clone?.() ?? null;
        }
        else {
            this.layer = entity.layer;
            this.lineType = entity.lineType;
            this.material = entity.material;
        }
        this.color = entity.color;
        this.lineWeight = entity.lineWeight;
        this.lineTypeScale = entity.lineTypeScale;
        this.isInvisible = entity.isInvisible;
        this.transparency = entity.transparency;
    }
    /** @internal */
    assignDocument(doc) {
        super.assignDocument(doc);
        this._layer = CadObject.updateCollection(this.layer, doc.layers);
        this._lineType = CadObject.updateCollection(this.lineType, doc.lineTypes);
        doc.layers.onRemove = this._tableOnRemove.bind(this);
        doc.lineTypes.onRemove = this._tableOnRemove.bind(this);
    }
    /** @internal */
    unassignDocument() {
        super.unassignDocument();
        this._layer = this.layer.clone();
        this._lineType = this.lineType.clone();
    }
    applyRotationToPoints(points, rotation) {
        if (points == null) {
            throw new Error('points cannot be null');
        }
        if (Math.abs(rotation) < 1e-12) {
            return [...points];
        }
        const sin = Math.sin(rotation);
        const cos = Math.cos(rotation);
        const transPoints = [];
        for (const p of points) {
            transPoints.push(new XY(p.x * cos - p.y * sin, p.x * sin + p.y * cos));
        }
        return transPoints;
    }
    applyTransformToPoint(transform, point) {
        if (!(transform instanceof Transform)) {
            return point;
        }
        return transform.applyTransform(point);
    }
    applyTransformToVector(transform, vector) {
        if (!(transform instanceof Transform)) {
            return vector;
        }
        const origin = transform.applyTransform(XYZ.zero);
        const transformed = transform.applyTransform(vector);
        return new XYZ(transformed.x - origin.x, transformed.y - origin.y, transformed.z - origin.z);
    }
    getTransformAxisScale(transform) {
        if (!(transform instanceof Transform)) {
            return new XYZ(1, 1, 1);
        }
        const matrix = transform.matrix;
        return new XYZ(Math.hypot(matrix.m00, matrix.m10, matrix.m20), Math.hypot(matrix.m01, matrix.m11, matrix.m21), Math.hypot(matrix.m02, matrix.m12, matrix.m22));
    }
    _tableOnRemove(sender, e) {
        if (e.item === this.layer) {
            this.layer = this.document.layers.get(Layer.defaultName);
        }
        if (e.item === this.lineType) {
            this.lineType = this.document.lineTypes.get(LineType.byLayerName);
        }
    }
    transformNormal(transform, normal) {
        return this.applyTransformToVector(transform, normal).normalize();
    }
}
//# sourceMappingURL=Entity.js.map