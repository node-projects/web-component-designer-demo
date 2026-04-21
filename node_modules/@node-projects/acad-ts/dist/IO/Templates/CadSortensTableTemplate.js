import { BlockRecord } from '../../Tables/BlockRecord.js';
import { SortEntitiesTable } from '../../Objects/SortEntitiesTable.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadSortensTableTemplate extends CadTemplateT {
    blockOwnerHandle = null;
    values = [];
    constructor(cadObject) {
        super(cadObject ?? new SortEntitiesTable());
    }
    _build(builder) {
        super._build(builder);
        const owner = builder.tryGetCadObject(this.blockOwnerHandle);
        if (owner) {
            if (owner instanceof BlockRecord) {
                this.cadObject.blockOwner = owner;
            }
            else {
                builder.notify(`Block owner for SortEntitiesTable ${this.cadObject.handle} is not a block ${owner.constructor.name} | ${owner.handle}`, NotificationType.Warning);
                return;
            }
        }
        else {
            builder.notify(`Block owner for SortEntitiesTable ${this.cadObject.handle} not found`, NotificationType.Warning);
            return;
        }
        for (const pair of this.values) {
            const entity = builder.tryGetCadObject(pair[1]);
            if (entity) {
                this.cadObject.add(entity, pair[0]);
            }
            else {
                builder.notify(`Entity in SortEntitiesTable ${this.cadObject.handle} not found ${pair[1]}`, NotificationType.Warning);
            }
        }
    }
}
//# sourceMappingURL=CadSortensTableTemplate.js.map