import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { FormattedTableData } from './LinkedData.js';
export class TableContent extends FormattedTableData {
    get objectType() { return ObjectType.UNLISTED; }
    get objectName() { return DxfFileToken.objectTableContent; }
    get subclassMarker() { return DxfSubclassMarker.tableContent; }
    style = null;
    styleOverride = null;
}
//# sourceMappingURL=TableContent.js.map