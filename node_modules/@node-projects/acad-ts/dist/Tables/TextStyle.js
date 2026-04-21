import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { TextMirrorFlag } from '../Entities/TextMirrorFlag.js';
import { ObjectType } from '../Types/ObjectType.js';
import { TableEntry } from './TableEntry.js';
import { StyleFlags } from './StyleFlags.js';
import { FontFlags } from './FontFlags.js';
export class TextStyle extends TableEntry {
    static defaultName = 'Standard';
    get objectType() {
        return ObjectType.STYLE;
    }
    get objectName() {
        return DxfFileToken.tableStyle;
    }
    get subclassMarker() {
        return DxfSubclassMarker.textStyle;
    }
    static get default() {
        return new TextStyle(TextStyle.defaultName);
    }
    get styleFlags() {
        return this.flags;
    }
    set styleFlags(value) {
        this.flags = value;
    }
    filename = '';
    bigFontFilename = null;
    height = 0;
    width = 1.0;
    lastHeight = 0;
    obliqueAngle = 0.0;
    mirrorFlag = TextMirrorFlag.None;
    trueType = FontFlags.Regular;
    get isShapeFile() {
        return (this.styleFlags & StyleFlags.IsShape) !== 0;
    }
    constructor(name) {
        super(name);
    }
}
export { StyleFlags } from './StyleFlags.js';
export { TextMirrorFlag } from '../Entities/TextMirrorFlag.js';
//# sourceMappingURL=TextStyle.js.map