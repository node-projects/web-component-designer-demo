import { Tolerance } from '../../Entities/Tolerance.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadToleranceTemplate extends CadEntityTemplate {
    dimensionStyleHandle = null;
    dimensionStyleName = null;
    constructor(tolerance) {
        super(tolerance ?? new Tolerance());
    }
    _build(builder) {
        super._build(builder);
        const style = this.getTableReference(builder, this.dimensionStyleHandle, this.dimensionStyleName);
        if (style) {
            this.cadObject.style = style;
        }
    }
}
//# sourceMappingURL=CadToleranceTemplate.js.map