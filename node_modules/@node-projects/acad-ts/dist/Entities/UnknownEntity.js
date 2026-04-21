import { Entity } from './Entity.js';
import { DxfClass } from '../Classes/DxfClass.js';
import { ObjectType } from '../Types/ObjectType.js';
export class UnknownEntity extends Entity {
    get objectType() {
        return ObjectType.UNDEFINED;
    }
    get objectName() {
        return this._objectName;
    }
    get subclassMarker() {
        return this._subclassMarker;
    }
    _objectName;
    _subclassMarker;
    constructor(dxfClass) {
        super();
        const resolvedClass = dxfClass instanceof DxfClass
            ? dxfClass
            : dxfClass?.result ?? null;
        if (resolvedClass) {
            this._objectName = resolvedClass.dxfName || '';
            this._subclassMarker = resolvedClass.cppClassName || '';
        }
        else {
            this._objectName = '';
            this._subclassMarker = '';
        }
    }
    applyTransform(transform) {
        // No-op
    }
    getBoundingBox() {
        return null;
    }
}
//# sourceMappingURL=UnknownEntity.js.map