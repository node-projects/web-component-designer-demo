import { DxfBinaryReader } from './DxfBinaryReader.js';
export class DxfBinaryReaderAC1009 extends DxfBinaryReader {
    constructor(stream) {
        super(stream);
    }
    readCode() {
        let code = this._data[this._pos++];
        if (code === 0xFF) {
            code = this._view.getInt16(this._pos, true);
            this._pos += 2;
        }
        return code;
    }
}
//# sourceMappingURL=DxfBinaryReaderAC1009.js.map