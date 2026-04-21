import { CadTextEntityTemplate } from './CadTextEntityTemplate.js';
export class CadAttributeTemplate extends CadTextEntityTemplate {
    mTextTemplate = null;
    constructor(entity) {
        super(entity);
    }
    _build(builder) {
        super._build(builder);
        if (this.mTextTemplate !== null) {
            this.mTextTemplate.build(builder);
        }
    }
}
//# sourceMappingURL=CadAttributeTemplate.js.map