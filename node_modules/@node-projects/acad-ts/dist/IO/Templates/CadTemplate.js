import { Entity } from '../../Entities/Entity.js';
import { TableEntry } from '../../Tables/TableEntry.js';
import { ExtendedData } from '../../XData/ExtendedData.js';
import { NotificationType } from '../NotificationEventHandler.js';
export class CadTemplate {
    cadObject;
    eDataTemplate = new Map();
    eDataTemplateByAppName = new Map();
    hasBeenBuilt = false;
    ownerHandle = null;
    reactorsHandles = new Set();
    xDictHandle = null;
    constructor(cadObject) {
        this.cadObject = cadObject;
    }
    build(builder) {
        if (this.hasBeenBuilt) {
            return;
        }
        else {
            this.hasBeenBuilt = true;
        }
        this._build(builder);
    }
    toString() {
        return `${this.cadObject?.toString()}`;
    }
    _build(builder) {
        const cadDictionary = builder.tryGetCadObject(this.xDictHandle);
        if (cadDictionary) {
            this.cadObject.xDictionary = cadDictionary;
        }
        for (const handle of this.reactorsHandles) {
            const reactor = builder.tryGetCadObject(handle);
            if (reactor) {
                this.cadObject.addReactor(reactor);
            }
            else {
                builder.notify(`Reactor with handle ${handle} not found`, NotificationType.Warning);
            }
        }
        for (const [key, value] of this.eDataTemplate) {
            const app = builder.tryGetCadObject(key);
            if (app) {
                this.cadObject.extendedData.set(app, new ExtendedData(value));
            }
            else {
                builder.notify(`AppId in extended data with handle ${key} not found`, NotificationType.Warning);
            }
        }
        for (const [key, value] of this.eDataTemplateByAppName) {
            const app = builder.tryGetTableEntry(key);
            if (app) {
                this.cadObject.extendedData.set(app, new ExtendedData(value));
            }
            else {
                builder.notify(`AppId in extended data with handle ${key} not found`, NotificationType.Warning);
            }
        }
    }
    *getEntitiesCollection(builder, firstHandle, endHandle) {
        const getEntityTemplate = (handle) => {
            const candidate = builder.tryGetObjectTemplate(handle);
            if (candidate && candidate.cadObject instanceof Entity && 'nextEntity' in candidate) {
                return candidate;
            }
            return null;
        };
        const visitedHandles = new Set();
        let template = getEntityTemplate(firstHandle);
        if (!template) {
            builder.notify(`Leading entity with handle ${firstHandle} not found.`, NotificationType.Warning);
            template = getEntityTemplate(endHandle);
        }
        while (template) {
            if (visitedHandles.has(template.cadObject.handle)) {
                builder.notify(`Entity chain loop detected at handle ${template.cadObject.handle}`, NotificationType.Warning);
                break;
            }
            visitedHandles.add(template.cadObject.handle);
            yield template.cadObject;
            if (template.cadObject.handle === endHandle) {
                break;
            }
            if (template.nextEntity != null) {
                template = getEntityTemplate(template.nextEntity);
            }
            else {
                template = getEntityTemplate(template.cadObject.handle + 1);
            }
        }
    }
    getTableReference(builder, handle, name) {
        const byHandleCandidate = builder.tryGetCadObject(handle);
        const byHandle = byHandleCandidate instanceof TableEntry ? byHandleCandidate : null;
        if (byHandle) {
            return byHandle;
        }
        const byName = builder.tryGetTableEntry(name);
        if (byName) {
            return byName;
        }
        if ((name && name.length > 0) || (handle != null && handle !== 0)) {
            builder.notify(`Table reference with handle: ${handle} | name: ${name} not found for ${this.cadObject.constructor.name} with handle ${this.cadObject.handle}`, NotificationType.Warning);
        }
        return null;
    }
}
//# sourceMappingURL=CadTemplate.js.map