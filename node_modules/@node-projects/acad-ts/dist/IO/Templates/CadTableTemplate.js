import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplate } from './CadTemplate.js';
export class CadTableTemplate extends CadTemplate {
    entryHandles = new Set();
    constructor(tableControl) {
        super(tableControl);
    }
    _build(builder) {
        super._build(builder);
        for (const handle of this.entryHandles) {
            const entry = builder.tryGetCadObject(handle);
            if (!entry)
                continue;
            try {
                this.cadObject.add(entry);
            }
            catch (ex) {
                builder.notify(`[${this.cadObject.subclassMarker}] error adding entry`, NotificationType.Error, ex instanceof Error ? ex : null);
            }
        }
    }
}
//# sourceMappingURL=CadTableTemplate.js.map