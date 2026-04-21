import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { Layer } from '../Layer.js';
import { LineType } from '../LineType.js';
import { Table } from './Table.js';
export class LayersTable extends Table {
    get objectType() {
        return ObjectType.LAYER_CONTROL_OBJ;
    }
    get objectName() {
        return DxfFileToken.tableLayer;
    }
    get defaultEntries() {
        return [Layer.defaultName];
    }
    constructor() {
        super();
    }
    createDefaultEntries() {
        if (!this.contains(Layer.defaultName)) {
            const layer = Layer.default;
            layer.lineType = LineType.continuous;
            this.add(layer);
        }
    }
}
//# sourceMappingURL=LayersTable.js.map