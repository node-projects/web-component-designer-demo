import { BlockGrip } from './BlockGrip.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
export class BlockVisibilityGrip extends BlockGrip {
    get objectName() { return DxfFileToken.objectBlockVisibilityGrip; }
    get subclassMarker() { return DxfSubclassMarker.blockVisibilityGrip; }
}
//# sourceMappingURL=BlockVisibilityGrip.js.map