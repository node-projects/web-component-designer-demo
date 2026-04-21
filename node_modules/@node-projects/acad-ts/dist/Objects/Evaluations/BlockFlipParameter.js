import { Block2PtParameter } from './Block2PtParameter.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';
export class BlockFlipParameter extends Block2PtParameter {
    get objectName() { return DxfFileToken.objectBlockFlipParameter; }
    get subclassMarker() { return DxfSubclassMarker.blockFlipParameter; }
    caption = '';
    description = '';
    baseStateName = '';
    flippedStateName = '';
    captionLocation = new XYZ(0, 0, 0);
    caption309 = '';
    value96 = 0;
    caption1001 = '';
    point1010 = new XYZ(0, 0, 0);
}
//# sourceMappingURL=BlockFlipParameter.js.map