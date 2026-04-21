import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { VPort } from '../VPort.js';
import { Table } from './Table.js';
export class VPortsTable extends Table {
    get objectType() {
        return ObjectType.VPORT_CONTROL_OBJ;
    }
    get objectName() {
        return DxfFileToken.tableVport;
    }
    get defaultEntries() {
        return [VPort.defaultName];
    }
    createDefaultEntries() {
        if (!this.contains(VPort.defaultName)) {
            this.add(VPort.default);
        }
    }
    constructor() {
        super();
    }
    add(item) {
        if (this.contains(item.name)) {
            this.addHandlePrefix(item);
        }
        else {
            this.addEntry(item.name, item);
        }
    }
}
//# sourceMappingURL=VPortsTable.js.map