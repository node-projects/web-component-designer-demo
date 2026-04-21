import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadTextEntityTemplate extends CadEntityTemplate {
    styleHandle = null;
    styleName = null;
    constructor(entity) {
        super(entity);
    }
    _build(builder) {
        super._build(builder);
        const text = this.cadObject;
        const style = this.getTableReference(builder, this.styleHandle, this.styleName ?? '');
        if (style) {
            text.style = style;
        }
    }
}
//# sourceMappingURL=CadTextEntityTemplate.js.map