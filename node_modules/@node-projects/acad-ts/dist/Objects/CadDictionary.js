import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DictionaryCloningFlags } from './DictionaryCloningFlags.js';
export class CadDictionary extends NonGraphicalObject {
    onAdd = null;
    onRemove = null;
    clonningFlags = DictionaryCloningFlags.NotApplicable;
    get entryHandles() { return [...this._entries.values()].map(c => c.handle); }
    get entryNames() { return [...this._entries.keys()]; }
    hardOwnerFlag = false;
    get objectName() { return DxfFileToken.objectDictionary; }
    get objectType() { return ObjectType.DICTIONARY; }
    get subclassMarker() { return DxfSubclassMarker.dictionary; }
    static acadColor = 'ACAD_COLOR';
    static acadFieldList = 'ACAD_FIELDLIST';
    static acadGroup = 'ACAD_GROUP';
    static acadImageDict = 'ACAD_IMAGE_DICT';
    static acadLayout = 'ACAD_LAYOUT';
    static acadMaterial = 'ACAD_MATERIAL';
    static acadMLeaderStyle = 'ACAD_MLEADERSTYLE';
    static acadMLineStyle = 'ACAD_MLINESTYLE';
    static acadPdfDefinitions = 'ACAD_PDFDEFINITIONS';
    static acadPlotSettings = 'ACAD_PLOTSETTINGS';
    static acadPlotStyleName = 'ACAD_PLOTSTYLENAME';
    static acadScaleList = 'ACAD_SCALELIST';
    static acadSortEnts = 'ACAD_SORTENTS';
    static acadTableStyle = 'ACAD_TABLESTYLE';
    static acadVisualStyle = 'ACAD_VISUALSTYLE';
    static geographicData = 'ACAD_GEOGRAPHICDATA';
    static root = 'ROOT';
    static variableDictionary = 'AcDbVariableDictionary';
    _entries = new Map();
    constructor(name) {
        super(name);
    }
    static createDefaultEntries(root) {
        root.tryAdd(new CadDictionary(CadDictionary.acadColor));
        root.tryAdd(new CadDictionary(CadDictionary.acadGroup));
        root.tryAdd(new CadDictionary(CadDictionary.acadLayout));
        root.tryAdd(new CadDictionary(CadDictionary.acadMaterial));
        root.tryAdd(new CadDictionary(CadDictionary.acadSortEnts));
        root.tryAdd(new CadDictionary(CadDictionary.acadMLeaderStyle));
        root.tryAdd(new CadDictionary(CadDictionary.acadMLineStyle));
        root.tryAdd(new CadDictionary(CadDictionary.acadTableStyle));
        root.tryAdd(new CadDictionary(CadDictionary.acadPlotSettings));
        root.tryAdd(new CadDictionary(CadDictionary.variableDictionary));
        root.tryAdd(new CadDictionary(CadDictionary.acadScaleList));
        root.tryAdd(new CadDictionary(CadDictionary.acadVisualStyle));
        root.tryAdd(new CadDictionary(CadDictionary.acadFieldList));
        root.tryAdd(new CadDictionary(CadDictionary.acadImageDict));
    }
    static createRoot() {
        const root = new CadDictionary(CadDictionary.root);
        CadDictionary.createDefaultEntries(root);
        return root;
    }
    addByKey(key, value) {
        if (!key) {
            throw new Error('NonGraphicalObject must have a name');
        }
        this._entries.set(key.toLowerCase(), value);
        value.owner = this;
        this.onAdd?.call(this, this, new CollectionChangedEventArgs(value));
    }
    add(value) {
        this.addByKey(value.name, value);
    }
    clear() {
        for (const [key] of this._entries) {
            this.remove(key);
        }
    }
    clone() {
        const clone = super.clone();
        clone.onAdd = null;
        clone.onRemove = null;
        clone._entries = new Map();
        for (const item of this._entries.values()) {
            clone.add(item.clone());
        }
        return clone;
    }
    containsKey(key) {
        return this._entries.has(key.toLowerCase());
    }
    getEntry(name) {
        const entry = this._entries.get(name.toLowerCase());
        return entry ?? null;
    }
    remove(key) {
        const item = this._entries.get(key.toLowerCase());
        if (item) {
            this._entries.delete(key.toLowerCase());
            item.owner = null;
            this.onRemove?.call(this, this, new CollectionChangedEventArgs(item));
            return true;
        }
        return false;
    }
    tryAdd(value) {
        if (!this._entries.has(value.name.toLowerCase())) {
            this.add(value);
            return true;
        }
        return false;
    }
    get(key) {
        return this._entries.get(key.toLowerCase());
    }
    [Symbol.iterator]() {
        return this._entries.values();
    }
}
export { DictionaryCloningFlags } from './DictionaryCloningFlags.js';
//# sourceMappingURL=CadDictionary.js.map