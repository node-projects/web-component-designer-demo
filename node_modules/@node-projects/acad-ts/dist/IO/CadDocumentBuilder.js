import { UnknownEntity } from '../Entities/UnknownEntity.js';
import { CadDictionary } from '../Objects/CadDictionary.js';
import { UnknownNonGraphicalObject } from '../Objects/UnknownNonGraphicalObject.js';
import { AppIdsTable } from '../Tables/Collections/AppIdsTable.js';
import { BlockRecordsTable } from '../Tables/Collections/BlockRecordsTable.js';
import { DimensionStylesTable } from '../Tables/Collections/DimensionStylesTable.js';
import { LayersTable } from '../Tables/Collections/LayersTable.js';
import { LineTypesTable } from '../Tables/Collections/LineTypesTable.js';
import { TextStylesTable } from '../Tables/Collections/TextStylesTable.js';
import { UCSTable } from '../Tables/Collections/UCSTable.js';
import { ViewsTable } from '../Tables/Collections/ViewsTable.js';
import { VPortsTable } from '../Tables/Collections/VPortsTable.js';
import { NotificationEventArgs, NotificationType } from './NotificationEventHandler.js';
export class CadDocumentBuilder {
    onNotification = null;
    appIds = new AppIdsTable();
    blockRecords = new BlockRecordsTable();
    dimensionStyles = new DimensionStylesTable();
    documentToBuild;
    initialHandSeed = 0;
    layers = new LayersTable();
    lineTypesTable = new LineTypesTable();
    textStyles = new TextStylesTable();
    ucSs = new UCSTable();
    version;
    views = new ViewsTable();
    vPorts = new VPortsTable();
    cadObjects = new Map();
    cadObjectsTemplates = new Map();
    dictionaryTemplates = new Map();
    tableEntryTemplates = new Map();
    tableTemplates = new Map();
    templatesMap = new Map();
    unassignedObjects = [];
    constructor(version, document) {
        this.version = version;
        this.documentToBuild = document;
    }
    addTemplate(template) {
        if (!this._addToMap(template)) {
            return;
        }
        const handle = template.cadObject.handle;
        if (this._isDictionaryTemplate(template)) {
            this.dictionaryTemplates.set(handle, template);
        }
        else if (this._isTableTemplate(template)) {
            this.tableTemplates.set(handle, template);
        }
        else if (this._isTableEntryTemplate(template)) {
            this.tableEntryTemplates.set(handle, template);
        }
        else {
            this.cadObjectsTemplates.set(handle, template);
        }
    }
    buildDocument() {
        for (const template of this.tableEntryTemplates.values()) {
            template.build(this);
        }
        for (const template of this.cadObjectsTemplates.values()) {
            template.build(this);
        }
    }
    buildTable(table) {
        const template = this.tableTemplates.get(table.handle);
        if (template) {
            template.build(this);
        }
        else {
            this.notify(`Table ${table.objectName} not found in the document`, NotificationType.Warning);
        }
    }
    buildTables() {
        this.buildTable(this.appIds);
        this.buildTable(this.textStyles);
        this.buildTable(this.lineTypesTable);
        this.buildTable(this.layers);
        this.buildTable(this.ucSs);
        this.buildTable(this.views);
        this.buildTable(this.blockRecords);
        this.buildTable(this.dimensionStyles);
        this.buildTable(this.vPorts);
    }
    getObjectTemplate(handle) {
        const template = this.templatesMap.get(handle);
        if (template) {
            return template;
        }
        return null;
    }
    notify(message, notificationType = NotificationType.None, exception = null) {
        this.onNotification?.(this, new NotificationEventArgs(message, notificationType, exception));
    }
    registerTables() {
        this.documentToBuild.registerCollection(this.appIds);
        this.documentToBuild.registerCollection(this.textStyles);
        this.documentToBuild.registerCollection(this.lineTypesTable);
        this.documentToBuild.registerCollection(this.layers);
        this.documentToBuild.registerCollection(this.ucSs);
        this.documentToBuild.registerCollection(this.views);
        this.documentToBuild.registerCollection(this.blockRecords);
        this.documentToBuild.registerCollection(this.dimensionStyles);
        this.documentToBuild.registerCollection(this.vPorts);
    }
    tryGetCadObject(handle) {
        if (handle == null || handle === 0) {
            return null;
        }
        const obj = this.cadObjects.get(handle);
        if (obj) {
            if (obj instanceof UnknownEntity && !this.keepUnknownEntities) {
                return null;
            }
            if (obj instanceof UnknownNonGraphicalObject && !this.keepUnknownNonGraphicalObjects) {
                return null;
            }
            return obj;
        }
        return null;
    }
    tryGetObjectTemplate(handle) {
        if (handle == null || handle === 0) {
            return null;
        }
        const template = this.templatesMap.get(handle);
        if (template) {
            return template;
        }
        return null;
    }
    tryGetTableEntry(name) {
        if (!name || name.length === 0) {
            return null;
        }
        const tables = [
            this.appIds,
            this.layers,
            this.lineTypesTable,
            this.ucSs,
            this.views,
            this.dimensionStyles,
            this.textStyles,
            this.vPorts,
            this.blockRecords,
        ];
        for (const t of tables) {
            const entry = t.tryGetValue(name);
            if (entry) {
                return entry;
            }
        }
        return null;
    }
    buildDictionaries() {
        for (const dictionaryTemplate of this.dictionaryTemplates.values()) {
            dictionaryTemplate.build(this);
        }
        if (!this.documentToBuild.rootDictionary) {
            const roots = [];
            for (const t of this.dictionaryTemplates.values()) {
                if (t.cadObject instanceof CadDictionary && t.cadObject.owner == null) {
                    roots.push(t.cadObject);
                }
            }
            if (roots.length !== 1) {
                this.notify(`The root dictionary could not be found.`, NotificationType.Warning);
            }
            else {
                this.documentToBuild.rootDictionary = roots[0];
            }
        }
        this.documentToBuild.updateCollections(true, false);
    }
    createMissingHandles() {
        let nextHandle = Number.isFinite(this.initialHandSeed) ? this.initialHandSeed : 0;
        let pending = this.unassignedObjects;
        this.unassignedObjects = [];
        while (pending.length > 0) {
            for (const template of pending) {
                nextHandle += 1;
                template.cadObject.handle = nextHandle;
                this.addTemplate(template);
            }
            pending = this.unassignedObjects;
            this.unassignedObjects = [];
        }
        this.initialHandSeed = nextHandle;
    }
    registerTable(table, tableConstructor) {
        if (!table) {
            this.documentToBuild.registerCollection(new tableConstructor());
        }
        else {
            this.documentToBuild.registerCollection(table);
        }
    }
    _addToMap(template) {
        if (template.cadObject.handle === 0) {
            this._pushUnassigned(template);
            return false;
        }
        if (this.templatesMap.has(template.cadObject.handle)) {
            this.notify(`Repeated handle found ${template.cadObject.handle}.`, NotificationType.Warning);
            template.cadObject.handle = 0;
            this._pushUnassigned(template);
            return false;
        }
        if (template.cadObject.handle > this.initialHandSeed) {
            this.initialHandSeed = template.cadObject.handle;
        }
        this.templatesMap.set(template.cadObject.handle, template);
        this.cadObjects.set(template.cadObject.handle, template.cadObject);
        return true;
    }
    _pushUnassigned(template) {
        if (!Array.isArray(this.unassignedObjects)) {
            this.unassignedObjects = [];
        }
        try {
            this.unassignedObjects.push(template);
        }
        catch (e) {
            if (e instanceof RangeError) {
                this.notify('Resetting unassigned object queue due to invalid array length.', NotificationType.Warning, e);
                this.unassignedObjects = [template];
                return;
            }
            throw e;
        }
    }
    _isDictionaryTemplate(template) {
        return template.cadObject instanceof CadDictionary;
    }
    _isTableTemplate(template) {
        return 'entryHandles' in template;
    }
    _isTableEntryTemplate(template) {
        return 'type' in template && 'name' in template && !('entryHandles' in template);
    }
}
//# sourceMappingURL=CadDocumentBuilder.js.map