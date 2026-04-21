import { CRC } from './CRC.js';
export class CRC8StreamHandler {
    _data;
    _position = 0;
    seed;
    get length() { return this._data.length; }
    get position() { return this._position; }
    set position(value) { this._position = value; }
    constructor(data, seed) {
        this._data = data;
        this.seed = seed;
    }
    read(buffer, offset, count) {
        const nbytes = Math.min(count, this._data.length - this._position);
        const length = offset + nbytes;
        for (let index = offset; index < length; ++index) {
            buffer[index] = this._data[this._position + (index - offset)];
            this.seed = CRC8StreamHandler._decode(this.seed, buffer[index]);
        }
        this._position += nbytes;
        return nbytes;
    }
    write(buffer, offset, count) {
        const length = offset + count;
        for (let index = offset; index < length; ++index) {
            this.seed = CRC8StreamHandler._decode(this.seed, buffer[index]);
        }
        for (let i = 0; i < count; i++) {
            this._data[this._position + i] = buffer[offset + i];
        }
        this._position += count;
    }
    static getCRCValue(seed, buffer, startPos, endPos) {
        let currValue = seed;
        let index = startPos;
        let remaining = endPos;
        while (remaining-- > 0) {
            currValue = CRC8StreamHandler._decode(currValue, buffer[index]);
            index++;
        }
        return currValue;
    }
    static _decode(key, value) {
        const index = value ^ (key & 0xFF);
        key = ((key >>> 8) ^ CRC.crcTable[index]) & 0xFFFF;
        return key;
    }
}
//# sourceMappingURL=CRC8StreamHandler.js.map