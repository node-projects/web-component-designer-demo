import { Insert } from '../../Entities/Insert.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadInsertTemplate extends CadEntityTemplate {
    hasAtts = false;
    ownedObjectsCount = 0;
    blockHeaderHandle = null;
    blockName = null;
    firstAttributeHandle = null;
    endAttributeHandle = null;
    seqendHandle = null;
    ownedObjectsHandlers = new Set();
    constructor(insert) {
        super(insert ?? new Insert());
    }
    _build(builder) {
        super._build(builder);
        const insert = this.cadObject;
        if (!(insert instanceof Insert))
            return;
        const block = this.getTableReference(builder, this.blockHeaderHandle, this.blockName ?? '');
        if (block) {
            insert.block = block;
        }
        else {
            builder.notify(`Block ${this.blockHeaderHandle} | ${this.blockName} not found for Insert ${this.cadObject.handle}`, NotificationType.Warning);
        }
        const seqend = builder.tryGetCadObject(this.seqendHandle);
        if (seqend) {
            insert.attributes.seqend = seqend;
            seqend.owner = insert;
        }
        if (this.firstAttributeHandle != null) {
            const attributes = this.getEntitiesCollection(builder, this.firstAttributeHandle, this.endAttributeHandle);
            for (const att of attributes) {
                insert.attributes.push(att);
                att.owner = insert;
                insert.applyAttributeTransform(att);
            }
        }
        else {
            for (const handle of this.ownedObjectsHandlers) {
                const att = builder.tryGetCadObject(handle);
                if (att) {
                    insert.attributes.push(att);
                    att.owner = insert;
                    insert.applyAttributeTransform(att);
                }
            }
        }
    }
}
//# sourceMappingURL=CadInsertTemplate.js.map