import { PlotSettings } from './PlotSettings.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { LayoutFlags } from './LayoutFlags.js';
import { Viewport } from '../Entities/Viewport.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
export class Layout extends PlotSettings {
    _blockRecord = null;
    _lastViewport = null;
    get associatedBlock() {
        return this._blockRecord;
    }
    set associatedBlock(value) {
        if (value == null) {
            throw new Error('value cannot be null');
        }
        if (this._blockRecord === value) {
            return;
        }
        if (this._blockRecord?.layout === this) {
            this._blockRecord.layout = null;
        }
        this._blockRecord = value;
        this._blockRecord.layout = this;
    }
    baseUCS = null;
    elevation = 0.0;
    insertionBasePoint = new XYZ(0, 0, 0);
    get isPaperSpace() {
        return this.name?.toLowerCase() !== Layout.modelLayoutName.toLowerCase();
    }
    get lastActiveViewport() {
        return this._lastViewport;
    }
    set lastActiveViewport(value) {
        this._lastViewport = value;
    }
    layoutFlags = LayoutFlags.PaperSpaceLinetypeScaling;
    maxExtents = new XYZ(231.3, 175.5, 0.0);
    maxLimits = new XY(277.0, 202.5);
    minExtents = new XYZ(25.7, 19.5, 0.0);
    minLimits = new XY(-20.0, -7.5);
    get objectName() { return DxfFileToken.objectLayout; }
    get objectType() { return ObjectType.LAYOUT; }
    origin = new XYZ(0, 0, 0);
    get subclassMarker() { return DxfSubclassMarker.layout; }
    tabOrder = 0;
    ucs = null;
    ucsOrthographicType = 0;
    get viewports() {
        return this.associatedBlock?.viewports ?? null;
    }
    xAxis = new XYZ(1, 0, 0);
    yAxis = new XYZ(0, 1, 0);
    static modelLayoutName = 'Model';
    static paperLayoutName = 'Layout1';
    constructor(name, blockName) {
        super();
        if (name != null) {
            this.name = name;
        }
        void blockName;
    }
    addViewport(viewport) {
        this.associatedBlock?.entities?.add(viewport);
    }
    clone() {
        return this._cloneCore(true);
    }
    cloneWithoutAssociatedBlock() {
        return this._cloneCore(false);
    }
    toString() {
        return `${this.objectName}:${this.name}`;
    }
    updatePaperViewport() {
        if (!this.isPaperSpace || this.associatedBlock == null) {
            return;
        }
        const paperViewport = this.viewports?.find((viewport) => viewport.representsPaper) ?? null;
        if (paperViewport != null) {
            this.lastActiveViewport ??= paperViewport;
            return;
        }
        const viewport = new Viewport();
        viewport.id = Viewport.paperViewId;
        this.addViewport(viewport);
        this.lastActiveViewport = viewport;
    }
    _cloneCore(includeAssociatedBlock) {
        const clone = super.clone();
        clone._blockRecord = null;
        clone._lastViewport = null;
        if (!includeAssociatedBlock || this._blockRecord == null) {
            return clone;
        }
        clone.associatedBlock = this._blockRecord.cloneWithoutLayout();
        if (this._lastViewport != null) {
            clone._lastViewport = clone.viewports?.find((viewport) => viewport.id === this._lastViewport?.id) ?? null;
        }
        return clone;
    }
}
export { LayoutFlags } from './LayoutFlags.js';
//# sourceMappingURL=Layout.js.map