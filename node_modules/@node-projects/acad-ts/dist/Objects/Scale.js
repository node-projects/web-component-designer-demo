import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class Scale extends NonGraphicalObject {
    static defaultName = '1:1';
    static get default() {
        const s = new Scale();
        s.name = Scale.defaultName;
        s.paperUnits = 1.0;
        s.drawingUnits = 1.0;
        s.isUnitScale = true;
        return s;
    }
    get objectType() {
        return ObjectType.UNLISTED;
    }
    get objectName() {
        return DxfFileToken.objectScale;
    }
    get subclassMarker() {
        return DxfSubclassMarker.scale;
    }
    paperUnits = 0;
    drawingUnits = 0;
    isUnitScale = false;
    get scaleFactor() {
        return this.paperUnits / this.drawingUnits;
    }
    constructor(name) {
        super(name);
    }
    applyTo(value) {
        return value * this.scaleFactor;
    }
}
//# sourceMappingURL=Scale.js.map