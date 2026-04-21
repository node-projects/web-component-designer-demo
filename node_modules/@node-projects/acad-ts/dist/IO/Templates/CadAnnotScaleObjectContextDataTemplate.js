import { CadNonGraphicalObjectTemplate } from './CadNonGraphicalObjectTemplate.js';
export class CadAnnotScaleObjectContextDataTemplate extends CadNonGraphicalObjectTemplate {
    scaleHandle = null;
    constructor(cadObject) {
        super(cadObject);
    }
    _build(builder) {
        super._build(builder);
        const contextData = this.cadObject;
        const scale = builder.tryGetCadObject(this.scaleHandle);
        if (scale) {
            contextData.scale = scale;
        }
    }
}
//# sourceMappingURL=CadAnnotScaleObjectContextDataTemplate.js.map