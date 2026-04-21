import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DimensionStyle } from '../DimensionStyle.js';
import { Table } from './Table.js';
export class DimensionStylesTable extends Table {
    get objectType() {
        return ObjectType.DIMSTYLE_CONTROL_OBJ;
    }
    get objectName() {
        return DxfFileToken.tableDimstyle;
    }
    get defaultEntries() {
        return [DimensionStyle.defaultName];
    }
    createDefaultEntries() {
        if (!this.contains(DimensionStyle.defaultName)) {
            this.add(DimensionStyle.default);
        }
    }
    constructor() {
        super();
    }
}
//# sourceMappingURL=DimensionStylesTable.js.map