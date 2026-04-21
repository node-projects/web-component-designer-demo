import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { BlockTypeFlags } from './BlockTypeFlags.js';
import { Entity } from '../Entities/Entity.js';
import { XYZ } from '../Math/XYZ.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
export const XYZ_Zero = new XYZ(0, 0, 0);
export class Block extends Entity {
    basePoint = XYZ_Zero;
    get blockOwner() {
        return this.owner;
    }
    comments = null;
    flags = BlockTypeFlags.None;
    isUnloaded = false;
    get name() {
        return this.blockOwner?.name ?? '';
    }
    set name(value) {
        if (this.blockOwner) {
            this.blockOwner.name = value;
        }
    }
    get objectName() {
        return DxfFileToken.block;
    }
    get objectType() {
        return ObjectType.BLOCK;
    }
    get subclassMarker() {
        return DxfSubclassMarker.blockBegin;
    }
    xRefPath = null;
    constructor(record) {
        super();
        if (record) {
            this.owner = record;
        }
    }
    clone() {
        const clone = super.clone();
        if (this.blockOwner != null) {
            const owner = new BlockRecord(this.blockOwner.name);
            owner.blockEntity = clone;
        }
        return clone;
    }
    applyTransform(transform) {
        this.basePoint = this.applyTransformToPoint(transform, this.basePoint);
    }
    getBoundingBox() {
        return null;
    }
}
//# sourceMappingURL=Block.js.map