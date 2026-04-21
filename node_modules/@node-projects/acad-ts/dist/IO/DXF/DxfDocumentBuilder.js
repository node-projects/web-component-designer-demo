import { Entity } from '../../Entities/Entity.js';
import { CadDictionary } from '../../Objects/CadDictionary.js';
import { CadEntityTemplate } from '../Templates/CadEntityTemplate.js';
import { CadBlockRecordTemplate } from '../Templates/CadBlockRecordTemplate.js';
import { CadPolyLineTemplate } from '../Templates/CadPolyLineTemplate.js';
import { CadInsertTemplate } from '../Templates/CadInsertTemplate.js';
import { Vertex } from '../../Entities/Vertex.js';
import { Seqend } from '../../Entities/Seqend.js';
import { AttributeEntity } from '../../Entities/AttributeEntity.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
export class DxfDocumentBuilder extends CadDocumentBuilder {
    configuration;
    get keepUnknownEntities() {
        return this.configuration.keepUnknownEntities;
    }
    get keepUnknownNonGraphicalObjects() {
        return this.configuration.keepUnknownNonGraphicalObjects;
    }
    modelSpaceEntities = new Set();
    modelSpaceTemplate = null;
    orphanTemplates = [];
    constructor(version, document, configuration) {
        super(version, document);
        this.configuration = configuration;
    }
    buildDocument() {
        if (this.modelSpaceTemplate === null) {
            const record = BlockRecord.modelSpace;
            this.blockRecords.add(record);
            this.modelSpaceTemplate = new CadBlockRecordTemplate(record);
            this.addTemplate(this.modelSpaceTemplate);
        }
        this.createMissingHandles();
        for (const entity of this.modelSpaceEntities) {
            this.modelSpaceTemplate.ownedObjectsHandlers.add(entity.handle);
        }
        this.registerTables();
        this.buildTables();
        this.buildDictionaries();
        for (const template of this.orphanTemplates) {
            this._assignOwner(template);
        }
        super.buildDocument();
        if (this.configuration.createDefaults) {
            this.documentToBuild.createDefaults();
        }
    }
    buildEntities() {
        const entities = [];
        for (const item of this.cadObjectsTemplates.values()) {
            if (item instanceof CadEntityTemplate) {
                item.build(this);
                item.setUnlinkedReferences();
            }
        }
        for (const item of this.cadObjectsTemplates.values()) {
            if (item instanceof CadEntityTemplate && item.cadObject.owner === null) {
                item.cadObject.handle = 0;
                entities.push(item.cadObject);
            }
        }
        return entities;
    }
    _assignOwner(template) {
        if (template.cadObject.owner !== null || template.cadObject instanceof CadDictionary || !template.ownerHandle) {
            return;
        }
        const ownerResult = this.tryGetObjectTemplate(template.ownerHandle);
        if (ownerResult) {
            const owner = ownerResult;
            if (owner instanceof CadBlockRecordTemplate && template.cadObject instanceof Entity) {
                // The entries should be assigned in the blocks or entities section
            }
            else if (owner instanceof CadPolyLineTemplate && template.cadObject instanceof Vertex) {
                owner.ownedObjectsHandlers.add(template.cadObject.handle);
            }
            else if (owner instanceof CadPolyLineTemplate && template.cadObject instanceof Seqend) {
                owner.seqendHandle = template.cadObject.handle;
            }
            else if (owner instanceof CadInsertTemplate && template.cadObject instanceof AttributeEntity) {
                owner.ownedObjectsHandlers.add(template.cadObject.handle);
            }
            else if (owner instanceof CadInsertTemplate && template.cadObject instanceof Seqend) {
                owner.seqendHandle = template.cadObject.handle;
            }
            else {
                this.notify(`Owner ${owner.constructor.name} with handle ${template.ownerHandle} assignation not implemented for ${template.cadObject.constructor.name} with handle ${template.cadObject.handle}`, NotificationType.Warning);
            }
        }
        else {
            this.notify(`Owner ${template.ownerHandle} not found for ${template.constructor.name} with handle ${template.cadObject.handle}`, NotificationType.Warning);
        }
    }
}
//# sourceMappingURL=DxfDocumentBuilder.js.map