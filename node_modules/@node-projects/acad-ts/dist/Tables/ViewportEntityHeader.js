import { ObjectType } from '../Types/ObjectType.js';
import { TableEntry } from './TableEntry.js';
export class ViewportEntityHeader extends TableEntry {
    blockRecord = null;
    get objectType() {
        return ObjectType.VP_ENT_HDR;
    }
}
//# sourceMappingURL=ViewportEntityHeader.js.map