import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { BlockRecord } from '../BlockRecord.js';
import { Table } from './Table.js';
export class BlockRecordsTable extends Table {
    get objectType() {
        return ObjectType.BLOCK_CONTROL_OBJ;
    }
    get objectName() {
        return DxfFileToken.tableBlockRecord;
    }
    get defaultEntries() {
        return [BlockRecord.modelSpaceName, BlockRecord.paperSpaceName];
    }
    constructor() {
        super();
    }
    createDefaultEntries() {
        if (!this.contains(BlockRecord.modelSpaceName)) {
            this.add(BlockRecord.modelSpace);
        }
        if (!this.contains(BlockRecord.paperSpaceName)) {
            this.add(BlockRecord.paperSpace);
        }
    }
    add(item) {
        if (item.isAnonymous && this.contains(item.name)) {
            const existing = this.tryGetValue(item.name);
            if (existing && existing === item) {
                throw new Error(`The BlockRecord with name ${item.name} has already been added.`);
            }
            item.name = this.createName(BlockRecord.anonymousPrefix);
        }
        super.add(item);
    }
}
//# sourceMappingURL=BlockRecordsTable.js.map