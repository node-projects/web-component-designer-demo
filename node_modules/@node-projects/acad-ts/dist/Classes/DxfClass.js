import { ProxyFlags } from './ProxyFlags.js';
export class DxfClass {
    applicationName = 'ObjectDBX Classes';
    classNumber = 0;
    cppClassName = '';
    dwgVersion = 0;
    dxfName = '';
    instanceCount = 0;
    get isAnEntity() {
        return this._isAnEntity;
    }
    set isAnEntity(value) {
        if (value) {
            this._itemClassId = 0x1F2;
        }
        else {
            this._itemClassId = 0x1F3;
        }
        this._isAnEntity = value;
    }
    get itemClassId() {
        return this._itemClassId;
    }
    set itemClassId(value) {
        if (value === 0x1F2) {
            this._isAnEntity = true;
        }
        else {
            this._isAnEntity = false;
        }
        this._itemClassId = value;
    }
    proxyFlags = ProxyFlags.None;
    wasZombie = false;
    maintenanceVersion = 0;
    _isAnEntity = false;
    _itemClassId = 0;
    toString() {
        return `${this.dxfName}:${this.classNumber}`;
    }
}
//# sourceMappingURL=DxfClass.js.map