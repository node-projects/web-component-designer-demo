import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ImageDisplayQuality } from './ImageDisplayQuality.js';
export class RasterVariables extends NonGraphicalObject {
    classVersion = 0;
    displayQuality = ImageDisplayQuality.High;
    isDisplayFrameShown = false;
    get objectName() {
        return DxfFileToken.objectRasterVariables;
    }
    get subclassMarker() {
        return DxfSubclassMarker.rasterVariables;
    }
    units = 0;
}
export { ImageDisplayQuality } from './ImageDisplayQuality.js';
//# sourceMappingURL=RasterVariables.js.map