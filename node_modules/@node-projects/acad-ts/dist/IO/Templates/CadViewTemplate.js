import { XYZ } from '../../Math/XYZ.js';
import { View } from '../../Tables/View.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';
export class CadViewTemplate extends CadTableEntryTemplate {
    visualStyleHandle = null;
    namedUcsHandle = null;
    ucsHandle = null;
    constructor(entry) {
        super(entry ?? new View());
    }
    _build(builder) {
        super._build(builder);
        const visualStyle = builder.tryGetCadObject(this.visualStyleHandle);
        if (visualStyle) {
            this.cadObject.visualStyle = visualStyle;
        }
        else if (this.visualStyleHandle != null && this.visualStyleHandle > 0) {
            builder.notify(`Visual style ${this.visualStyleHandle} not found for view ${this.cadObject.handle}`, NotificationType.Warning);
        }
        const applyUcs = (ucs) => {
            this.cadObject.isUcsAssociated = true;
            this.cadObject.ucsOrigin = new XYZ(ucs.origin.x, ucs.origin.y, ucs.origin.z);
            this.cadObject.ucsXAxis = new XYZ(ucs.xAxis.x, ucs.xAxis.y, ucs.xAxis.z);
            this.cadObject.ucsYAxis = new XYZ(ucs.yAxis.x, ucs.yAxis.y, ucs.yAxis.z);
            this.cadObject.ucsElevation = ucs.elevation;
            this.cadObject.ucsOrthographicType = ucs.orthographicType;
        };
        const ucs = builder.tryGetCadObject(this.ucsHandle);
        if (ucs) {
            applyUcs(ucs);
        }
        else if (this.ucsHandle != null && this.ucsHandle > 0) {
            builder.notify(`Base ucs ${this.ucsHandle} not found for view ${this.cadObject.handle}`, NotificationType.Warning);
        }
        const namedUcs = builder.tryGetCadObject(this.namedUcsHandle);
        if (namedUcs) {
            applyUcs(namedUcs);
        }
        else if (this.namedUcsHandle != null && this.namedUcsHandle > 0) {
            builder.notify(`Named ucs ${this.namedUcsHandle} not found for view ${this.cadObject.handle}`, NotificationType.Warning);
        }
    }
}
//# sourceMappingURL=CadViewTemplate.js.map