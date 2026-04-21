import { VPort } from '../../Tables/VPort.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';
export class CadVPortTemplate extends CadTableEntryTemplate {
    vportControlHandle = 0;
    backgroundHandle = null;
    styleHandle = null;
    sunHandle = null;
    namedUcsHandle = null;
    baseUcsHandle = null;
    constructor(cadObject) {
        super(cadObject ?? new VPort());
    }
    _build(builder) {
        super._build(builder);
        const baseUcs = builder.tryGetCadObject(this.baseUcsHandle);
        if (baseUcs) {
            this.cadObject.baseUcs = baseUcs;
        }
        else if (this.baseUcsHandle != null && this.baseUcsHandle > 0) {
            builder.notify(`Boundary ${this.baseUcsHandle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
        }
        const namedUcs = builder.tryGetCadObject(this.namedUcsHandle);
        if (namedUcs) {
            this.cadObject.baseUcs = namedUcs;
        }
        else if (this.namedUcsHandle != null && this.namedUcsHandle > 0) {
            builder.notify(`Boundary ${this.baseUcsHandle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
        }
        const style = builder.tryGetCadObject(this.styleHandle);
    }
}
//# sourceMappingURL=CadVPortTemplate.js.map