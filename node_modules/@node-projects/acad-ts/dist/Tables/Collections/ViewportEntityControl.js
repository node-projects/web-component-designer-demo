import { ObjectType } from '../../Types/ObjectType.js';
import { Table } from './Table.js';
export class ViewportEntityControl extends Table {
    get objectType() {
        return ObjectType.VP_ENT_HDR_CTRL_OBJ;
    }
    get defaultEntries() {
        return [];
    }
    constructor() {
        super();
    }
}
//# sourceMappingURL=ViewportEntityControl.js.map