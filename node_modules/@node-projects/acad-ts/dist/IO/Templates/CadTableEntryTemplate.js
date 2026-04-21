import { CadTemplateT } from './CadTemplate[T].js';
export class CadTableEntryTemplate extends CadTemplateT {
    get type() { return this.cadObject.constructor.name; }
    get name() { return this.cadObject.name; }
    constructor(entry) {
        super(entry);
    }
    _build(builder) {
        super._build(builder);
    }
}
//# sourceMappingURL=CadTableEntryTemplate.js.map