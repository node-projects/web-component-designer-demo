import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { CellStyle } from '../Entities/TableEntity.js';
import { TableFlowDirectionType } from './TableFlowDirectionType.js';
export class TableStyle extends NonGraphicalObject {
    static get default_() { return new TableStyle(TableStyle.defaultName); }
    cellStyles = [];
    dataCellStyle = new CellStyle();
    description = '';
    flags = 0;
    flowDirection = TableFlowDirectionType.Down;
    headerCellStyle = new CellStyle();
    horizontalCellMargin = 0.06;
    get objectName() { return DxfFileToken.objectTableStyle; }
    get objectType() { return ObjectType.UNLISTED; }
    get subclassMarker() { return DxfSubclassMarker.tableStyle; }
    suppressHeaderRow = false;
    suppressTitle = false;
    tableCellStyle = new CellStyle();
    titleCellStyle = new CellStyle();
    verticalCellMargin = 0.06;
    static defaultName = 'Standard';
    constructor(name = '') {
        super(name);
    }
}
export { TableFlowDirectionType } from './TableFlowDirectionType.js';
//# sourceMappingURL=TableStyle.js.map