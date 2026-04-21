import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
export class DwgAppInfoReader extends DwgSectionIO {
    get sectionName() {
        return DwgSectionDefinition.appInfo;
    }
    _reader;
    constructor(version, reader) {
        super(version);
        this._reader = reader;
    }
    read() {
        if (!this.r2007Plus) {
            this._readR18();
        }
        const unknown1 = this._reader.readInt();
        const infoname = this._reader.readTextUnicode();
        const unknown2 = this._reader.readInt();
        const bytes = this._reader.readBytes(16);
        const version = this._reader.readTextUnicode();
        const comm = this._reader.readBytes(16);
        if (!this.r2010Plus) {
            return;
        }
        const comment = this._reader.readTextUnicode();
        const product = this._reader.readBytes(16);
        const xml = this._reader.readTextUnicode();
    }
    _readR18() {
        const infoname = this._reader.readVariableText();
        const unknown2 = this._reader.readInt();
        const version = this._reader.readVariableText();
        const xml = this._reader.readVariableText();
        const comment = this._reader.readVariableText();
    }
}
//# sourceMappingURL=DwgAppInfoReader.js.map