import { DxfStreamReaderBase } from './DxfStreamReaderBase.js';
export class DxfBinaryReader extends DxfStreamReaderBase {
    static sentinel = 'AutoCAD Binary DXF\r\n\x1a\0';
    static sentinelBytes = new Uint8Array([
        0x41, 0x75, 0x74, 0x6F, 0x43, 0x41, 0x44, 0x20,
        0x42, 0x69, 0x6E, 0x61, 0x72, 0x79, 0x20, 0x44,
        0x58, 0x46, 0x0D, 0x0A, 0x1A, 0x00,
    ]);
    get baseStream() {
        return this._data;
    }
    _data;
    _view;
    _pos = 0;
    constructor(stream) {
        super();
        this._data = stream;
        this._view = new DataView(stream.buffer, stream.byteOffset, stream.byteLength);
        this.start();
    }
    start() {
        super.start();
        this._pos = 0;
        // Skip sentinel (22 bytes)
        this._pos = 22;
        this.position = this._pos;
    }
    readStringLine() {
        const bytes = [];
        while (this._pos < this._data.length) {
            const b = this._data[this._pos++];
            if (b === 0)
                break;
            bytes.push(b);
        }
        this.valueRaw = this.decodeString(new Uint8Array(bytes));
        this.position = this._pos;
        return this.valueRaw;
    }
    readCode() {
        const code = this._view.getInt16(this._pos, true);
        this._pos += 2;
        this.position = this._pos;
        return code;
    }
    lineAsBool() {
        const val = this._data[this._pos++];
        this.position = this._pos;
        return val > 0;
    }
    lineAsDouble() {
        const val = this._view.getFloat64(this._pos, true);
        this._pos += 8;
        this.position = this._pos;
        return val;
    }
    lineAsShort() {
        const val = this._view.getInt16(this._pos, true);
        this._pos += 2;
        this.position = this._pos;
        return val;
    }
    lineAsInt() {
        const val = this._view.getInt32(this._pos, true);
        this._pos += 4;
        this.position = this._pos;
        return val;
    }
    lineAsLong() {
        // Read as two 32-bit integers (JS doesn't have native 64-bit int)
        const lo = this._view.getUint32(this._pos, true);
        const hi = this._view.getInt32(this._pos + 4, true);
        this._pos += 8;
        this.position = this._pos;
        return hi * 0x100000000 + lo;
    }
    lineAsHandle() {
        const str = this.readStringLine();
        const result = parseInt(str, 16);
        if (!isNaN(result)) {
            return result;
        }
        return 0;
    }
    lineAsBinaryChunk() {
        const length = this._data[this._pos++];
        const chunk = this._data.slice(this._pos, this._pos + length);
        this._pos += length;
        this.position = this._pos;
        return chunk;
    }
}
//# sourceMappingURL=DxfBinaryReader.js.map