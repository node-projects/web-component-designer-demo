import { CadBlockActionTemplate } from './CadBlockActionTemplate.js';
export class CadBlockFlipActionTemplate extends CadBlockActionTemplate {
    get blockFlipAction() { return this.cadObject; }
    constructor(cadObject) {
        super(cadObject);
    }
}
//# sourceMappingURL=CadBlockFlipActionTemplate.js.map