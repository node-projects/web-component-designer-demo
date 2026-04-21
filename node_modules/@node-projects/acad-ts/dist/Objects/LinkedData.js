import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { CellStyle } from '../Entities/TableEntity.js';
export class LinkedData extends NonGraphicalObject {
    get subclassMarker() {
        return DxfSubclassMarker.linkedData;
    }
    description = '';
}
export class LinkedTableData extends LinkedData {
    get subclassMarker() {
        return DxfSubclassMarker.linkedTableData;
    }
    rows = [];
    columns = [];
}
export class FormattedTableData extends LinkedTableData {
    get subclassMarker() {
        return DxfSubclassMarker.formattedTableData;
    }
    mergedCellRanges = [];
    cellStyleOverride = new CellStyle();
}
//# sourceMappingURL=LinkedData.js.map