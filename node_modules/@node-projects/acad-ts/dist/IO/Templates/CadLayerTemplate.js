import { Layer } from '../../Tables/Layer.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';
export class CadLayerTemplate extends CadTableEntryTemplate {
    layerControlHandle = 0;
    plotStyleHandle = 0;
    materialHandle = 0;
    lineTypeHandle = null;
    lineTypeName = null;
    trueColorName = null;
    constructor(entry) {
        super(entry ?? new Layer());
    }
    _build(builder) {
        super._build(builder);
        const material = builder.tryGetCadObject(this.materialHandle);
        const lineType = this.getTableReference(builder, this.lineTypeHandle, this.lineTypeName ?? '');
        if (lineType) {
            this.cadObject.lineType = lineType;
        }
        else {
            builder.notify(`Linetype with handle ${this.lineTypeHandle} could not be found for layer ${this.cadObject.name}`, NotificationType.Warning);
        }
    }
}
//# sourceMappingURL=CadLayerTemplate.js.map