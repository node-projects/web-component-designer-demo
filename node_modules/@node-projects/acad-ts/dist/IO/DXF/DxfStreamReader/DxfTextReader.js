import { DxfStreamReaderBase } from './DxfStreamReaderBase.js';
import { DxfCode } from '../../../DxfCode.js';
export class DxfTextReader extends DxfStreamReaderBase {
    get baseStream() {
        return this._data;
    }
    _data;
    _bytePos = 0;
    constructor(stream) {
        super();
        this._data = stream;
        this.start();
    }
    start() {
        super.start();
        this._bytePos = 0;
    }
    readNext() {
        super.readNext();
        this.position += 2;
    }
    readStringLine() {
        let end = this._bytePos;
        while (end < this._data.length && this._data[end] !== 0x0A) {
            end++;
        }
        let lineBytes = this._data.subarray(this._bytePos, end);
        this._bytePos = end < this._data.length ? end + 1 : end;
        if (lineBytes.length > 0 && lineBytes[lineBytes.length - 1] === 0x0D) {
            lineBytes = lineBytes.subarray(0, lineBytes.length - 1);
        }
        let line = this.decodeString(lineBytes);
        // Trim whitespace like C# StreamReader.ReadLine()
        line = line.trim();
        this.valueRaw = line;
        return this.valueRaw;
    }
    readCode() {
        const line = this.readStringLine();
        const value = parseInt(line, 10);
        if (!isNaN(value)) {
            return value;
        }
        this.position++;
        return DxfCode.Invalid;
    }
    lineAsBool() {
        const str = this.readStringLine();
        const result = parseInt(str, 10);
        if (!isNaN(result)) {
            return result > 0;
        }
        return false;
    }
    lineAsDouble() {
        const str = this.readStringLine();
        const result = parseFloat(str);
        if (!isNaN(result)) {
            return result;
        }
        return 0.0;
    }
    lineAsShort() {
        const str = this.readStringLine();
        const result = parseInt(str, 10);
        if (!isNaN(result)) {
            return result;
        }
        return 0;
    }
    lineAsInt() {
        const str = this.readStringLine();
        const result = parseInt(str, 10);
        if (!isNaN(result)) {
            return result;
        }
        return 0;
    }
    lineAsLong() {
        const str = this.readStringLine();
        const result = parseInt(str, 10);
        if (!isNaN(result)) {
            return result;
        }
        return 0;
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
        const str = this.readStringLine();
        const bytes = [];
        for (let i = 0; i < str.length; i += 2) {
            const hex = str.substring(i, i + 2);
            const result = parseInt(hex, 16);
            if (!isNaN(result)) {
                bytes.push(result);
            }
            else {
                return new Uint8Array(0);
            }
        }
        return new Uint8Array(bytes);
    }
}
//# sourceMappingURL=DxfTextReader.js.map