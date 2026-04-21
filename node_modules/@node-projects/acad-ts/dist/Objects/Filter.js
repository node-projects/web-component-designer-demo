import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class Filter extends NonGraphicalObject {
    static filterEntryName = 'ACAD_FILTER';
    get objectType() {
        return ObjectType.UNLISTED;
    }
    get subclassMarker() {
        return DxfSubclassMarker.filter;
    }
    constructor(name) {
        super(name);
    }
}
//# sourceMappingURL=Filter.js.map