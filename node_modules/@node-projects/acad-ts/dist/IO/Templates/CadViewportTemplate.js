import { Viewport } from '../../Entities/Viewport.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
export class CadViewportTemplate extends CadEntityTemplateT {
    viewportHeaderHandle = null;
    boundaryHandle = null;
    namedUcsHandle = null;
    baseUcsHandle = null;
    visualStyleHandle = null;
    viewportId = null;
    blockHandle = null;
    frozenLayerHandles = new Set();
    constructor(entity) {
        super(entity ?? new Viewport());
    }
    _build(builder) {
        super._build(builder);
        if (this.viewportId != null) {
            this.cadObject.id = this.viewportId;
        }
        const entity = builder.tryGetCadObject(this.boundaryHandle);
        if (entity) {
            this.cadObject.boundary = entity;
        }
        else if (this.boundaryHandle != null && this.boundaryHandle > 0) {
            builder.notify(`Boundary ${this.boundaryHandle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
        }
        if (this.namedUcsHandle != null && this.namedUcsHandle > 0) {
            builder.notify(`Named ucs not implemented for Viewport, handle ${this.namedUcsHandle}`);
        }
        if (this.baseUcsHandle != null && this.baseUcsHandle > 0) {
            builder.notify(`Base ucs not implemented for Viewport, handle ${this.baseUcsHandle}`);
        }
        for (const handle of this.frozenLayerHandles) {
            const layer = builder.tryGetCadObject(handle);
            if (layer) {
                this.cadObject.frozenLayers.push(layer);
            }
            else {
                builder.notify(`Frozen layer ${handle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
            }
        }
    }
}
//# sourceMappingURL=CadViewportTemplate.js.map