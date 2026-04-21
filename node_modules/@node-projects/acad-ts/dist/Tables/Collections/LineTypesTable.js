import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { LineType } from '../LineType.js';
import { Table } from './Table.js';
export class LineTypesTable extends Table {
    get objectType() {
        return ObjectType.LTYPE_CONTROL_OBJ;
    }
    get objectName() {
        return DxfFileToken.tableLinetype;
    }
    get byLayer() {
        return this.get(LineType.byLayerName);
    }
    get byBlock() {
        return this.get(LineType.byBlockName);
    }
    get continuous() {
        return this.get(LineType.continuousName);
    }
    get defaultEntries() {
        return [LineType.byLayerName, LineType.byBlockName, LineType.continuousName];
    }
    constructor() {
        super();
    }
    createDefaultEntries() {
        if (!this.contains(LineType.byLayerName)) {
            this.add(LineType.byLayer);
        }
        if (!this.contains(LineType.byBlockName)) {
            this.add(LineType.byBlock);
        }
        if (!this.contains(LineType.continuousName)) {
            this.add(LineType.continuous);
        }
    }
}
//# sourceMappingURL=LineTypesTable.js.map