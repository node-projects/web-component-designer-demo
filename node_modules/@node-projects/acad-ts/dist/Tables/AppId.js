import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { TableEntry } from './TableEntry.js';
export class AppId extends TableEntry {
    static get default() {
        return new AppId(AppId.defaultName);
    }
    get objectName() {
        return DxfFileToken.tableAppId;
    }
    get objectType() {
        return ObjectType.APPID;
    }
    get subclassMarker() {
        return DxfSubclassMarker.applicationId;
    }
    static blockRepBTag = 'AcDbBlockRepBTag';
    static blockRepETag = 'AcDbBlockRepETag';
    static defaultName = 'ACAD';
    constructor(name) {
        super(name);
        if (name !== undefined && !name) {
            throw new Error('Application id must have a name.');
        }
    }
}
//# sourceMappingURL=AppId.js.map