import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ACadVersion } from '../ACadVersion.js';
export class ProxyObject extends NonGraphicalObject {
    get classId() {
        return this.dxfClass?.classNumber ?? 0;
    }
    get drawingFormat() {
        return this.version | (this.maintenanceVersion << 16);
    }
    dxfClass = null;
    maintenanceVersion = 0;
    get objectName() {
        return DxfFileToken.objectProxyObject;
    }
    originalDataFormatDxf = false;
    proxyClassId = 499;
    binaryData = null;
    data = null;
    get subclassMarker() {
        return DxfSubclassMarker.proxyObject;
    }
    version = ACadVersion.Unknown;
}
//# sourceMappingURL=ProxyObject.js.map