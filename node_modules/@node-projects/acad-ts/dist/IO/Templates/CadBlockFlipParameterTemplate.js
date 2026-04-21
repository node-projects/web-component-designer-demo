import { CadBlock2PtParameterTemplate } from './CadBlock2PtParameterTemplate.js';
export class CadBlockFlipParameterTemplate extends CadBlock2PtParameterTemplate {
    get blockFlipParameter() { return this.cadObject; }
    constructor(cadObject) {
        super(cadObject);
    }
}
//# sourceMappingURL=CadBlockFlipParameterTemplate.js.map