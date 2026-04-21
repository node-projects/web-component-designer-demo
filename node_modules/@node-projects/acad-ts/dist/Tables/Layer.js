import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Color } from '../Color.js';
import { LineWeightType } from '../Types/LineWeightType.js';
import { CadObject } from '../CadObject.js';
import { TableEntry } from './TableEntry.js';
import { LineType } from './LineType.js';
export class Layer extends TableEntry {
    static get default() {
        return new Layer(Layer.defaultName);
    }
    static get defpoints() {
        const l = new Layer(Layer.defpointsName);
        l.plotFlag = false;
        return l;
    }
    get color() {
        return this._color;
    }
    set color(value) {
        if (value.isByLayer || value.isByBlock) {
            throw new Error('The layer color cannot be ByLayer or ByBlock');
        }
        this._color = value;
    }
    get layerFlags() {
        return this.flags;
    }
    set layerFlags(value) {
        this.flags = value;
    }
    isOn = true;
    lineType = null;
    lineWeight = LineWeightType.Default;
    material = null;
    get objectName() {
        return DxfFileToken.tableLayer;
    }
    get objectType() {
        return ObjectType.LAYER;
    }
    get plotFlag() {
        if (this._name.toLowerCase() === Layer.defpointsName.toLowerCase()) {
            return false;
        }
        return this._plotFlag;
    }
    set plotFlag(value) {
        this._plotFlag = value;
    }
    plotStyleName = 0;
    get subclassMarker() {
        return DxfSubclassMarker.layer;
    }
    static defaultName = '0';
    static defpointsName = 'defpoints';
    _color = new Color(7);
    _plotFlag = true;
    constructor(name) {
        super(name);
    }
    clone() {
        const clone = super.clone();
        clone.lineType = this.lineType?.clone() ?? null;
        clone.material = this.material?.clone() ?? null;
        return clone;
    }
    /** @internal */
    assignDocument(doc) {
        super.assignDocument(doc);
        this.lineType = CadObject.updateCollection(this.lineType ?? LineType.continuous, doc.lineTypes);
        this.material = CadObject.updateCollection(this.material, doc.materials);
    }
    /** @internal */
    unassignDocument() {
        super.unassignDocument();
        this.lineType = this.lineType?.clone() ?? LineType.continuous;
        this.material = this.material?.clone() ?? null;
    }
}
export { LayerFlags } from './LayerFlags.js';
//# sourceMappingURL=Layer.js.map