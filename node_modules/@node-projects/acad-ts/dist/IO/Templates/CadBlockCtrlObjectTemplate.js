import { CadTableTemplate } from './CadTableTemplate.js';
export class CadBlockCtrlObjectTemplate extends CadTableTemplate {
    modelSpaceHandle = null;
    paperSpaceHandle = null;
    constructor(blocks) {
        super(blocks);
    }
    _build(builder) {
        super._build(builder);
        const modelSpace = builder.tryGetCadObject(this.modelSpaceHandle);
        if (modelSpace) {
            this.cadObject.add(modelSpace);
        }
        const paperSpace = builder.tryGetCadObject(this.paperSpaceHandle);
        if (paperSpace) {
            this.cadObject.add(paperSpace);
        }
    }
}
//# sourceMappingURL=CadBlockCtrlObjectTemplate.js.map