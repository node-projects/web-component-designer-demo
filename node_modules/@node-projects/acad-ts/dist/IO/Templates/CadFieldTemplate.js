import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadFieldTemplate extends CadTemplateT {
    cadObjectsHandles = [];
    cadValueTemplates = [];
    childrenHandles = [];
    constructor(obj) {
        super(obj);
    }
    _build(builder) {
        super._build(builder);
        for (const handle of this.cadObjectsHandles) {
            const cobject = builder.tryGetCadObject(handle);
            if (cobject) {
                this.cadObject.cadObjects.push(cobject);
            }
            else {
                builder.notify(`[${this.cadObject.subclassMarker}] CadObject with handle ${handle} not found.`, NotificationType.Warning);
            }
        }
        for (const handle of this.childrenHandles) {
            const f = builder.tryGetCadObject(handle);
            if (f) {
                this.cadObject.children.push(f);
            }
            else {
                builder.notify(`[${this.cadObject.subclassMarker}] CadObject with handle ${handle} not found.`, NotificationType.Warning);
            }
        }
    }
}
//# sourceMappingURL=CadFieldTemplate.js.map