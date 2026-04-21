import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadShapeTemplate extends CadEntityTemplate {
    shapeIndex = null;
    shapeFileHandle = null;
    shapeFileName = null;
    constructor(shape) {
        super(shape);
    }
    _build(builder) {
        super._build(builder);
        const shape = this.cadObject;
        const text = this.getTableReference(builder, this.shapeFileHandle, this.shapeFileName ?? '');
        if (text) {
            if (text.isShapeFile) {
                shape.shapeStyle = text;
            }
            else {
                builder.notify(`Shape style ${this.shapeFileHandle} | ${this.shapeFileName} not found`, NotificationType.Warning);
            }
        }
    }
}
//# sourceMappingURL=CadShapeTemplate.js.map