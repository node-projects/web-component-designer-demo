import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadFieldListTemplate extends CadTemplateT {
    ownedObjectsHandlers = new Set();
    constructor(obj) {
        super(obj);
    }
    _build(builder) {
        super._build(builder);
        for (const handle of this.ownedObjectsHandlers) {
            const field = builder.tryGetCadObject(handle);
            if (field) {
                this.cadObject.fields.push(field);
            }
            else {
                builder.notify(`Field ${handle} not found for FieldList ${this.cadObject.handle}`, NotificationType.Warning);
            }
        }
    }
}
//# sourceMappingURL=CadFieldListTemplate.js.map