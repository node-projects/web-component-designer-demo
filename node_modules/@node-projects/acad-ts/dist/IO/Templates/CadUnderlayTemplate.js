import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadUnderlayTemplate extends CadEntityTemplate {
    definitionHandle = null;
    constructor(entity) {
        super(entity);
    }
    _build(builder) {
        super._build(builder);
        const underlay = this.cadObject;
        const definition = builder.tryGetCadObject(this.definitionHandle);
        if (definition) {
            underlay.definition = definition;
        }
        else {
            builder.notify(`UnderlayDefinition not found for ${this.cadObject.handle}`, NotificationType.Warning);
        }
    }
}
//# sourceMappingURL=CadUnderlayTemplate.js.map