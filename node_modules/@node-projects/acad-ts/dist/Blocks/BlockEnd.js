import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Entity } from '../Entities/Entity.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
export class BlockEnd extends Entity {
    get objectName() {
        return DxfFileToken.endBlock;
    }
    get objectType() {
        return ObjectType.ENDBLK;
    }
    get subclassMarker() {
        return DxfSubclassMarker.blockEnd;
    }
    constructor(record) {
        super();
        if (record) {
            this.owner = record;
        }
    }
    clone() {
        const clone = super.clone();
        const owner = this.owner;
        if (owner != null) {
            const cloneOwner = new BlockRecord(owner.name);
            cloneOwner.blockEnd = clone;
        }
        return clone;
    }
    applyTransform(transform) {
        // Nothing to transform for block end markers
    }
    getBoundingBox() {
        return null;
    }
}
//# sourceMappingURL=BlockEnd.js.map