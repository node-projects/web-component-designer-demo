import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';
export class CadViewportEntityHeaderTemplate extends CadTableEntryTemplate {
    blockHandle = null;
    constructor(entry) {
        super(entry);
    }
    _build(builder) {
        super._build(builder);
        const blockRecord = builder.tryGetCadObject(this.blockHandle);
        if (blockRecord) {
            this.cadObject.blockRecord = blockRecord;
        }
        else if (this.blockHandle != null && this.blockHandle !== 0) {
            builder.notify(`ViewportEntityHeader block ${this.blockHandle} not found for ${this.cadObject.handle}`, NotificationType.Warning);
        }
    }
}
//# sourceMappingURL=CadViewportEntityHeaderTemplate.js.map