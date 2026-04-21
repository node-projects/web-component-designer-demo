import { TableEntity, TableEntityCell, CellStyle } from '../../Entities/TableEntity.js';
import { CadInsertTemplate } from './CadInsertTemplate.js';
export class CadTableEntityTemplate extends CadInsertTemplate {
    blockOwnerHandle = null;
    cadTableCellTemplates = [];
    get currentCell() { return this.currentCellTemplate.cell; }
    currentCellTemplate;
    horizontalMargin = null;
    nullHandle = null;
    styleHandle = null;
    get tableEntity() { return this.cadObject; }
    _currCellIndex = 0;
    constructor(table) {
        super(table ?? new TableEntity());
    }
    createCell(type) {
        const rowIndex = Math.floor(this._currCellIndex / this.tableEntity.columns.length);
        const cell = new TableEntityCell();
        cell.type = type;
        this.tableEntity.rows[rowIndex].cells.push(cell);
        this.currentCellTemplate = new CadTableCellTemplate(cell);
        this.cadTableCellTemplates.push(this.currentCellTemplate);
        this._currCellIndex++;
    }
    _build(builder) {
        super._build(builder);
        for (const cellTemplate of this.cadTableCellTemplates) {
            cellTemplate.build(builder);
        }
    }
}
export class CadTableCellContentFormatTemplate {
    format;
    textStyleHandle = null;
    textStyleName = null;
    constructor(format) {
        this.format = format;
    }
    build(builder) {
        throw new Error('Not implemented');
    }
}
export class CadCellStyleTemplate extends CadTableCellContentFormatTemplate {
    borderLinetypePairs = [];
    get cellStyle() { return this.format; }
    textStyleHandle = null;
    constructor(style) {
        super(style ?? new CellStyle());
    }
}
export class CadTableAttributeTemplate {
    attDefHandle = null;
    _tableAtt;
    constructor(tableAtt) {
        this._tableAtt = tableAtt;
    }
    build(builder) {
        throw new Error('Not implemented');
    }
}
export class CadTableCellContentTemplate {
    blockRecordHandle = null;
    cadValueTemplate = null;
    content;
    fieldHandle = null;
    constructor(content) {
        this.content = content;
    }
    build(builder) {
        throw new Error('Not implemented');
    }
}
export class CadTableCellTemplate {
    attributeHandles = new Set();
    cell;
    contentTemplates = [];
    formatTextHeight = null;
    styleId = 0;
    textStyleOverrideHandle = null;
    unknownHandle = null;
    valueHandle = null;
    constructor(cell) {
        this.cell = cell;
    }
    build(builder) {
        const cadObject = builder.tryGetCadObject(this.valueHandle);
    }
}
//# sourceMappingURL=CadTableEntityTemplate.js.map