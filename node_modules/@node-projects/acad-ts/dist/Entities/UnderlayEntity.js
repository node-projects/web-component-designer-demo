import { Entity } from './Entity.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { UnderlayDisplayFlags } from './UnderlayDisplayFlags.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { Transform } from '../Math/Transform.js';
export class UnderlayEntity extends Entity {
    clipBoundaryVertices = [];
    get contrast() {
        return this._contrast;
    }
    set contrast(value) {
        if (value < 0 || value > 100) {
            throw new Error(`Invalid Contrast value: ${value}, must be in range 0-100`);
        }
        this._contrast = value;
    }
    definition = null;
    get fade() {
        return this._fade;
    }
    set fade(value) {
        if (value < 0 || value > 100) {
            throw new Error(`Invalid Fade value: ${value}, must be in range 0-100`);
        }
        this._fade = value;
    }
    flags = UnderlayDisplayFlags.Default;
    insertPoint = new XYZ(0, 0, 0);
    normal = new XYZ(0, 0, 1);
    rotation = 0.0;
    get subclassMarker() {
        return DxfSubclassMarker.underlay;
    }
    get xScale() {
        return this._xscale;
    }
    set xScale(value) {
        if (value === 0) {
            throw new Error('XScale value must be non-zero.');
        }
        this._xscale = value;
    }
    get yScale() {
        return this._yscale;
    }
    set yScale(value) {
        if (value === 0) {
            throw new Error('YScale value must be non-zero.');
        }
        this._yscale = value;
    }
    get zScale() {
        return this._zscale;
    }
    set zScale(value) {
        if (value === 0) {
            throw new Error('ZScale value must be non-zero.');
        }
        this._zscale = value;
    }
    _contrast = 100;
    _fade = 0;
    _xscale = 1;
    _yscale = 1;
    _zscale = 1;
    constructor(definition) {
        super();
        if (definition) {
            this.definition = definition;
        }
    }
    applyTransform(transform) {
        this.insertPoint = this.applyTransformToPoint(transform, this.insertPoint);
        this.normal = this.transformNormal(transform, this.normal);
        if (!(transform instanceof Transform)) {
            return;
        }
        const scale = this.getTransformAxisScale(transform);
        this.rotation += transform.eulerRotation.z;
        this.xScale *= scale.x === 0 ? 1 : scale.x;
        this.yScale *= scale.y === 0 ? 1 : scale.y;
        this.zScale *= scale.z === 0 ? 1 : scale.z;
    }
    clone() {
        const clone = super.clone();
        clone.definition = this.definition?.clone() ?? null;
        clone.clipBoundaryVertices = [...this.clipBoundaryVertices];
        return clone;
    }
    getBoundingBox() {
        if (this.clipBoundaryVertices.length === 0) {
            return null;
        }
        const points = this.clipBoundaryVertices.map((vertex) => {
            const scaled = new XY(vertex.x * this.xScale, vertex.y * this.yScale);
            const rotated = XY.rotate(scaled, this.rotation);
            return new XYZ(this.insertPoint.x + rotated.x, this.insertPoint.y + rotated.y, this.insertPoint.z);
        });
        return BoundingBox.fromPoints(points);
    }
    /** @internal */
    assignDocument(doc) {
        super.assignDocument(doc);
    }
    /** @internal */
    unassignDocument() {
        super.unassignDocument();
        this.definition = this.definition?.clone() ?? null;
    }
}
//# sourceMappingURL=UnderlayEntity.js.map