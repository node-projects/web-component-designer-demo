export class LittleEndianConverter {
    static toUInt16(buffer, offset = 0) {
        return buffer[offset] | (buffer[offset + 1] << 8);
    }
    static toInt16(buffer, offset = 0) {
        const val = LittleEndianConverter.toUInt16(buffer, offset);
        return val > 0x7FFF ? val - 0x10000 : val;
    }
    static toUInt32(buffer, offset = 0) {
        return (buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24)) >>> 0;
    }
    static toInt32(buffer, offset = 0) {
        return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24);
    }
    static toFloat64(buffer, offset = 0) {
        const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 8);
        return view.getFloat64(0, true);
    }
    static toFloat32(buffer, offset = 0) {
        const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 4);
        return view.getFloat32(0, true);
    }
    static getBytes(value) {
        const buf = new Uint8Array(4);
        buf[0] = value & 0xFF;
        buf[1] = (value >>> 8) & 0xFF;
        buf[2] = (value >>> 16) & 0xFF;
        buf[3] = (value >>> 24) & 0xFF;
        return buf;
    }
    static getBytes32(value) {
        const buf = new Uint8Array(4);
        buf[0] = value & 0xFF;
        buf[1] = (value >>> 8) & 0xFF;
        buf[2] = (value >>> 16) & 0xFF;
        buf[3] = (value >>> 24) & 0xFF;
        return buf;
    }
}
//# sourceMappingURL=LittleEndianConverter.js.map