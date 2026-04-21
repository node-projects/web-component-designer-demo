import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { TextStyle } from '../TextStyle.js';
import { Table } from './Table.js';
export class TextStylesTable extends Table {
    get objectType() {
        return ObjectType.STYLE_CONTROL_OBJ;
    }
    get objectName() {
        return DxfFileToken.tableStyle;
    }
    get defaultEntries() {
        return [TextStyle.defaultName];
    }
    createDefaultEntries() {
        if (!this.contains(TextStyle.defaultName)) {
            this.add(TextStyle.default);
        }
    }
    constructor() {
        super();
    }
}
//# sourceMappingURL=TextStylesTable.js.map