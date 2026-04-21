import { Block } from '../Blocks/Block.js';
import { BlockEnd } from '../Blocks/BlockEnd.js';
import { BlockTypeFlags } from '../Blocks/BlockTypeFlags.js';
import { CadObjectCollection } from '../CadObjectCollection.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { AttributeDefinition } from '../Entities/AttributeDefinition.js';
import { Viewport } from '../Entities/Viewport.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { CadDictionary } from '../Objects/CadDictionary.js';
import { EvaluationGraph } from '../Objects/Evaluations/EvaluationGraph.js';
import { Layout } from '../Objects/Layout.js';
import { SortEntitiesTable } from '../Objects/SortEntitiesTable.js';
import { ObjectType } from '../Types/ObjectType.js';
import { UnitsType } from '../Types/Units/UnitsType.js';
import { ExtendedDataHandle } from '../XData/ExtendedDataHandle.js';
import { AppId } from './AppId.js';
import { TableEntry } from './TableEntry.js';
export class BlockRecord extends TableEntry {
    static get modelSpace() {
        const record = new BlockRecord(BlockRecord.modelSpaceName);
        const layout = new Layout(Layout.modelLayoutName);
        layout.associatedBlock = record;
        return record;
    }
    static get paperSpace() {
        const record = new BlockRecord(BlockRecord.paperSpaceName);
        const layout = new Layout(Layout.paperLayoutName);
        layout.associatedBlock = record;
        return record;
    }
    get attributeDefinitions() {
        return Array.from(this.entities).filter((e) => e instanceof AttributeDefinition);
    }
    get blockEnd() {
        return this._blockEnd;
    }
    set blockEnd(value) {
        this._blockEnd = value;
        this._blockEnd.owner = this;
    }
    get blockEntity() {
        return this._blockEntity;
    }
    set blockEntity(value) {
        this._blockEntity = value;
        this._blockEntity.owner = this;
    }
    canScale = true;
    entities;
    get evaluationGraph() {
        return this.xDictionary?.getEntry(EvaluationGraph.dictionaryEntryName) ?? null;
    }
    get blockFlags() {
        return this.blockEntity.flags;
    }
    set blockFlags(value) {
        this.blockEntity.flags = value;
    }
    get combinedFlags() {
        return (this.blockEntity.flags | this.flags);
    }
    get hasAttributes() {
        return this.attributeDefinitions.length > 0;
    }
    get isAnonymous() {
        return (this.blockFlags & BlockTypeFlags.Anonymous) !== 0;
    }
    set isAnonymous(value) {
        if (value) {
            this.blockFlags |= BlockTypeFlags.Anonymous;
        }
        else {
            this.blockFlags &= ~BlockTypeFlags.Anonymous;
        }
    }
    get isDynamic() {
        return this.evaluationGraph != null;
    }
    isExplodable = false;
    insertHandles = [];
    ownedObjectHandles = [];
    get isUnloaded() {
        return this.blockEntity.isUnloaded;
    }
    set isUnloaded(value) {
        this.blockEntity.isUnloaded = value;
    }
    get layout() {
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    get objectName() {
        return DxfFileToken.tableBlockRecord;
    }
    get objectType() {
        return ObjectType.BLOCK_HEADER;
    }
    preview = null;
    get sortEntitiesTable() {
        return this.xDictionary?.getEntry(SortEntitiesTable.dictionaryEntryName) ?? null;
    }
    get source() {
        const data = this.extendedData.getExtendedDataByName().get(AppId.blockRepBTag.toUpperCase());
        const handle = data?.records.find((record) => record instanceof ExtendedDataHandle) ?? null;
        if (handle == null || this.document == null) {
            return null;
        }
        const source = handle.resolveReference(this.document);
        return source instanceof BlockRecord && source !== this ? source : null;
    }
    get subclassMarker() {
        return DxfSubclassMarker.blockRecord;
    }
    units = UnitsType.Unitless;
    get viewports() {
        return Array.from(this.entities).filter((e) => e instanceof Viewport);
    }
    static anonymousPrefix = '*A';
    static modelSpaceName = '*Model_Space';
    static paperSpaceName = '*Paper_Space';
    _blockEnd;
    _blockEntity;
    _layout = null;
    constructor(name, xrefFile, isOverlay = false) {
        super(name);
        this._blockEntity = new Block(this);
        this._blockEnd = new BlockEnd(this);
        this.entities = new CadObjectCollection(this);
        if (xrefFile != null) {
            this.blockEntity.xRefPath = xrefFile;
            this.blockFlags |= isOverlay ? BlockTypeFlags.XRefOverlay : BlockTypeFlags.XRef;
        }
    }
    clone() {
        return this._cloneCore(true);
    }
    cloneWithoutLayout() {
        return this._cloneCore(false);
    }
    _cloneCore(includeLayout) {
        const clone = super.clone();
        clone._layout = null;
        clone.insertHandles = [...this.insertHandles];
        clone.ownedObjectHandles = [...this.ownedObjectHandles];
        clone.entities = new CadObjectCollection(clone);
        const entityMap = new Map();
        for (const item of this.entities) {
            const entity = item.clone();
            clone.entities.add(entity);
            entityMap.set(item, entity);
        }
        if (includeLayout && this.layout != null) {
            const layout = this.layout.cloneWithoutAssociatedBlock();
            layout.associatedBlock = clone;
        }
        const sortTable = clone.sortEntitiesTable;
        if (sortTable != null) {
            sortTable.blockOwner = clone;
            sortTable.clear();
            for (const sorter of this.sortEntitiesTable ?? []) {
                const entity = entityMap.get(sorter.entity);
                if (entity != null) {
                    sortTable.add(entity, sorter.sortHandle);
                }
            }
        }
        clone.blockEntity = this.blockEntity.clone();
        clone.blockEntity.owner = clone;
        clone.blockEnd = this.blockEnd.clone();
        clone.blockEnd.owner = clone;
        return clone;
    }
    createSortEntitiesTable() {
        let table = this.sortEntitiesTable;
        if (table != null) {
            return table;
        }
        if (this.xDictionary == null) {
            this.xDictionary = new CadDictionary();
        }
        table = new SortEntitiesTable(this);
        this.xDictionary.addByKey(SortEntitiesTable.dictionaryEntryName, table);
        return table;
    }
    getBoundingBox() {
        let bounds = null;
        for (const entity of this.getSortedEntities()) {
            const entityBounds = entity.getBoundingBox();
            if (entityBounds == null) {
                continue;
            }
            if (bounds == null) {
                bounds = new BoundingBox(new XYZ(entityBounds.min.x, entityBounds.min.y, entityBounds.min.z), new XYZ(entityBounds.max.x, entityBounds.max.y, entityBounds.max.z));
                continue;
            }
            bounds.min.x = Math.min(bounds.min.x, entityBounds.min.x);
            bounds.min.y = Math.min(bounds.min.y, entityBounds.min.y);
            bounds.min.z = Math.min(bounds.min.z, entityBounds.min.z);
            bounds.max.x = Math.max(bounds.max.x, entityBounds.max.x);
            bounds.max.y = Math.max(bounds.max.y, entityBounds.max.y);
            bounds.max.z = Math.max(bounds.max.z, entityBounds.max.z);
        }
        return bounds;
    }
    getSortedEntities() {
        const entities = Array.from(this.entities);
        const sortTable = this.sortEntitiesTable;
        if (sortTable == null) {
            return entities;
        }
        const remaining = new Set(entities);
        const ordered = [];
        for (const sorter of sortTable) {
            const entity = sorter.entity;
            if (entity != null && remaining.has(entity)) {
                ordered.push(entity);
                remaining.delete(entity);
            }
        }
        ordered.push(...remaining);
        return ordered;
    }
}
export { BlockTypeFlags } from '../Blocks/BlockTypeFlags.js';
//# sourceMappingURL=BlockRecord.js.map