import { XRecord } from '../../Objects/XRecrod.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplate } from './CadTemplate.js';
export class CadXRecordTemplate extends CadTemplate {
    _entries = [];
    constructor(cadObject) {
        super(cadObject ?? new XRecord());
    }
    addHandleReference(code, handle) {
        this._entries.push([code, handle]);
    }
    _build(builder) {
        super._build(builder);
        const xrecord = this.cadObject;
        for (const entry of this._entries) {
            const obj = builder.tryGetCadObject(entry[1]);
            if (obj) {
                xrecord.createEntry(entry[0], obj);
            }
            else {
                xrecord.createEntry(entry[0], entry[1]);
                builder.notify(`XRecord reference not found ${entry[0]}|${entry[1]}`, NotificationType.Warning);
            }
        }
    }
}
//# sourceMappingURL=CadXRecordTemplate.js.map