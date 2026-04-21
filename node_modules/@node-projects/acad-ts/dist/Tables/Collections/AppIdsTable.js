import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { AppId } from '../AppId.js';
import { Table } from './Table.js';
export class AppIdsTable extends Table {
    get objectType() {
        return ObjectType.APPID_CONTROL_OBJ;
    }
    get objectName() {
        return DxfFileToken.tableAppId;
    }
    get defaultEntries() {
        return [AppId.defaultName];
    }
    createDefaultEntries() {
        if (!this.contains(AppId.defaultName)) {
            this.add(AppId.default);
        }
    }
    constructor() {
        super();
    }
}
//# sourceMappingURL=AppIdsTable.js.map