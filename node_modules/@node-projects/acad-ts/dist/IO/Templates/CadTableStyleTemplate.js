import { TableStyle } from '../../Objects/TableStyle.js';
import { CadTemplate } from './CadTemplate.js';
import { CadCellStyleTemplate } from './CadTableEntityTemplate.js';
export class CadTableStyleTemplate extends CadTemplate {
    cellStyleTemplates = [];
    currentCellStyleTemplate;
    constructor(tableStyle) {
        super(tableStyle ?? new TableStyle());
    }
    createCurrentCellStyleTemplate() {
        this.currentCellStyleTemplate = new CadCellStyleTemplate();
        this.cellStyleTemplates.push(this.currentCellStyleTemplate);
        return this.currentCellStyleTemplate;
    }
    _build(builder) {
        super._build(builder);
        const tableStyle = this.cadObject;
        for (const item of this.cellStyleTemplates) {
            tableStyle.cellStyles.push(item.cellStyle);
        }
    }
}
//# sourceMappingURL=CadTableStyleTemplate.js.map