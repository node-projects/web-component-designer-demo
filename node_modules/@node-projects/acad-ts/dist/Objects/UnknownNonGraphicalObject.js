import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfClass } from '../Classes/DxfClass.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
export class UnknownNonGraphicalObject extends NonGraphicalObject {
    get objectType() {
        return ObjectType.UNDEFINED;
    }
    get objectName() {
        if (!this.dxfClass) {
            return 'UNKNOWN';
        }
        return this.dxfClass.dxfName;
    }
    get subclassMarker() {
        if (!this.dxfClass) {
            return DxfSubclassMarker.entity;
        }
        return this.dxfClass.cppClassName;
    }
    dxfClass;
    constructor(dxfClass) {
        super();
        this.dxfClass = dxfClass instanceof DxfClass ? dxfClass : dxfClass?.result ?? null;
    }
}
//# sourceMappingURL=UnknownNonGraphicalObject.js.map