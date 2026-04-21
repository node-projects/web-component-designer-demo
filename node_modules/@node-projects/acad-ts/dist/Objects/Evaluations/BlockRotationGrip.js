import { BlockGrip } from './BlockGrip.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
export class BlockRotationGrip extends BlockGrip {
    get objectName() { return DxfFileToken.objectBlockRotationGrip; }
    get subclassMarker() { return DxfSubclassMarker.blockRotationGrip; }
}
//# sourceMappingURL=BlockRotationGrip.js.map