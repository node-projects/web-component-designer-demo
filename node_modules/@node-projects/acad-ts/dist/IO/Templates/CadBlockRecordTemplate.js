import { BlockRecord } from '../../Tables/BlockRecord.js';
import { UnknownEntity } from '../../Entities/UnknownEntity.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';
export class CadBlockRecordTemplate extends CadTableEntryTemplate {
    beginBlockHandle = null;
    blockEntityTemplate = null;
    endBlockHandle = null;
    firstEntityHandle = null;
    insertHandles = [];
    lastEntityHandle = null;
    layoutHandle = null;
    ownedObjectsHandlers = new Set();
    referenceTemplates = new Set();
    constructor(block) {
        super(block ?? new BlockRecord());
    }
    setBlockToRecord(builder, headerHandles) {
        const block = builder.tryGetCadObject(this.beginBlockHandle);
        if (block) {
            if (block.name && block.name.length > 0) {
                this.cadObject.name = block.name;
            }
            block.flags = this.cadObject.blockEntity.flags;
            block.basePoint = this.cadObject.blockEntity.basePoint;
            block.xRefPath = this.cadObject.blockEntity.xRefPath;
            block.comments = this.cadObject.blockEntity.comments;
            block.isUnloaded = this.cadObject.blockEntity.isUnloaded;
            this.cadObject.blockEntity = block;
        }
        const blockEnd = builder.tryGetCadObject(this.endBlockHandle);
        if (blockEnd) {
            this.cadObject.blockEnd = blockEnd;
        }
        this._ensureCorrectNaming(builder, headerHandles.model_space, BlockRecord.modelSpaceName);
        this._ensureCorrectNaming(builder, headerHandles.paper_space, BlockRecord.paperSpaceName);
    }
    _build(builder) {
        super._build(builder);
        this.cadObject.insertHandles = [...this.insertHandles];
        this.cadObject.ownedObjectHandles = Array.from(this.ownedObjectsHandlers);
        const layout = builder.tryGetCadObject(this.layoutHandle);
        if (layout) {
            this.cadObject.layout = layout;
        }
        if (this.firstEntityHandle != null && this.firstEntityHandle !== 0) {
            for (const e of this.getEntitiesCollection(builder, this.firstEntityHandle, this.lastEntityHandle)) {
                this._addEntity(builder, e);
            }
        }
        else {
            if (this.blockEntityTemplate !== null) {
                for (const h of this.blockEntityTemplate.ownedObjectsHandlers) {
                    this.ownedObjectsHandlers.add(h);
                }
            }
            for (const handle of this.ownedObjectsHandlers) {
                const child = builder.tryGetCadObject(handle);
                if (child) {
                    this._addEntity(builder, child);
                }
            }
        }
        for (const item of this.referenceTemplates) {
            this._addEntity(builder, item.cadObject);
        }
    }
    _addEntity(builder, entity) {
        if (!builder.keepUnknownEntities && entity instanceof UnknownEntity) {
            return;
        }
        if (entity.owner === this.cadObject) {
            return;
        }
        this.cadObject.entities.add(entity);
    }
    _ensureCorrectNaming(builder, handle, expected) {
        if (this.cadObject.handle === handle
            && this.cadObject.name.toLowerCase() !== expected.toLowerCase()) {
            builder.notify(`Invalid name for ${this.cadObject.name} changed to ${expected}`, NotificationType.Warning);
            this.cadObject.name = expected;
        }
    }
}
//# sourceMappingURL=CadBlockRecordTemplate.js.map