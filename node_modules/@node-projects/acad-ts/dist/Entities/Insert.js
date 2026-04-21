import { Entity } from './Entity.js';
import { SeqendCollection } from './SeqendCollection.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { AttributeEntity } from './AttributeEntity.js';
import { AttributeDefinition } from './AttributeDefinition.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { Transform } from '../Math/Transform.js';
export class Insert extends Entity {
    attributes = new SeqendCollection();
    block = null;
    columnCount = 1;
    columnSpacing = 0;
    get hasAttributes() {
        return this.attributes.length > 0;
    }
    get hasDynamicSubclass() {
        return true;
    }
    insertPoint = new XYZ(0, 0, 0);
    get isMultiple() {
        return this.rowCount > 1 || this.columnCount > 1;
    }
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entityInsert;
    }
    get objectType() {
        if (this.rowCount > 1 || this.columnCount > 1) {
            return ObjectType.MINSERT;
        }
        return ObjectType.INSERT;
    }
    rotation = 0.0;
    rowCount = 1;
    rowSpacing = 0;
    get subclassMarker() {
        return this.isMultiple ? DxfSubclassMarker.mInsert : DxfSubclassMarker.insert;
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
    _xscale = 1;
    _yscale = 1;
    _zscale = 1;
    constructor(block) {
        super();
        if (block) {
            if (block.document != null) {
                this.block = block.clone();
            }
            else {
                this.block = block;
            }
            const attDefs = block.attributeDefinitions;
            if (attDefs) {
                for (const item of attDefs) {
                    const attribute = new AttributeEntity(item);
                    this.attributes.push(attribute);
                    this.applyAttributeTransform(attribute);
                }
            }
        }
    }
    applyTransform(transform) {
        const axisScale = this.getTransformAxisScale(transform);
        this.insertPoint = this.applyTransformToPoint(transform, this.insertPoint);
        this.normal = this.applyTransformToVector(transform, this.normal).normalize();
        this.xScale *= axisScale.x === 0 ? 1 : axisScale.x;
        this.yScale *= axisScale.y === 0 ? 1 : axisScale.y;
        this.zScale *= axisScale.z === 0 ? 1 : axisScale.z;
        if (transform instanceof Transform) {
            this.rotation += transform.eulerRotation.z;
        }
        for (const att of this.attributes) {
            att.applyTransform(transform);
        }
    }
    clone() {
        const clone = super.clone();
        clone.block = this.block?.clone() ?? null;
        clone.attributes = new SeqendCollection();
        for (const att of this.attributes) {
            clone.attributes.push(att.clone());
        }
        return clone;
    }
    *explode() {
        if (this.block == null) {
            return;
        }
        const transform = this.getTransform();
        for (const entity of this.block.getSortedEntities()) {
            if (entity instanceof AttributeDefinition) {
                continue;
            }
            const clone = entity.clone();
            clone.applyTransform(transform);
            yield clone;
        }
        for (const attribute of this.attributes) {
            yield attribute.clone();
        }
    }
    getBoundingBox() {
        const blockBounds = this.block?.getBoundingBox();
        const boxes = [];
        if (blockBounds != null) {
            const transform = this.getTransform();
            const corners = [
                new XYZ(blockBounds.min.x, blockBounds.min.y, blockBounds.min.z),
                new XYZ(blockBounds.min.x, blockBounds.min.y, blockBounds.max.z),
                new XYZ(blockBounds.min.x, blockBounds.max.y, blockBounds.min.z),
                new XYZ(blockBounds.min.x, blockBounds.max.y, blockBounds.max.z),
                new XYZ(blockBounds.max.x, blockBounds.min.y, blockBounds.min.z),
                new XYZ(blockBounds.max.x, blockBounds.min.y, blockBounds.max.z),
                new XYZ(blockBounds.max.x, blockBounds.max.y, blockBounds.min.z),
                new XYZ(blockBounds.max.x, blockBounds.max.y, blockBounds.max.z),
            ].map((corner) => transform.applyTransform(corner));
            boxes.push(BoundingBox.fromPoints(corners));
        }
        for (const attribute of this.attributes) {
            const bounds = attribute.getBoundingBox();
            if (bounds != null) {
                boxes.push(bounds);
            }
        }
        return boxes.length > 0
            ? BoundingBox.fromPoints(boxes.flatMap((box) => [box.min, box.max]))
            : null;
    }
    getTransform() {
        return new Transform(this.insertPoint, new XYZ(this.xScale, this.yScale, this.zScale), new XYZ(0, 0, this.rotation));
    }
    applyAttributeTransform(attribute) {
        attribute.applyTransform(this.getTransform());
    }
    updateAttributes() {
        if (!this.block)
            return;
        const attDefs = this.block.attributeDefinitions ?? [];
        const defTags = attDefs.map(d => d.tag);
        const attTags = this.attributes.map(a => a.tag);
        const filtered = new SeqendCollection(...this.attributes.filter(att => defTags.includes(att.tag)));
        filtered.seqend = this.attributes.seqend;
        this.attributes = filtered;
        for (const attdef of attDefs) {
            if (!attTags.includes(attdef.tag)) {
                const attribute = new AttributeEntity(attdef);
                this.attributes.push(attribute);
                this.applyAttributeTransform(attribute);
            }
        }
    }
    /** @internal */
    assignDocument(doc) {
        super.assignDocument(doc);
        if (this.block == null)
            return;
        const existing = doc.blockRecords?.tryGetValue(this.block.name);
        if (existing) {
            this.block = existing;
        }
        else {
            doc.blockRecords?.add(this.block);
        }
    }
    /** @internal */
    unassignDocument() {
        this.block = this.block?.clone() ?? null;
        super.unassignDocument();
    }
}
//# sourceMappingURL=Insert.js.map