import { CadBlockParameterTemplate } from './CadBlockParameterTemplate.js';
export class CadBlock1PtParameterTemplate extends CadBlockParameterTemplate {
    get block1PtParameter() { return this.cadObject; }
    constructor(cadObject) {
        super(cadObject);
    }
}
//# sourceMappingURL=CadBlock1PtParameterTemplate.js.map