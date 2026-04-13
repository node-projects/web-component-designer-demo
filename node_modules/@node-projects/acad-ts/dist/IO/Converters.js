export { LittleEndianConverter } from '../Helpers/LittleEndianConverter.js';
export class BigEndianConverter {
    static toUInt64(buffer, offset = 0) {
        // JavaScript numbers can't represent all 64-bit integers exactly
        // but for handle values this is sufficient
        let result = 0;
        for (let i = 0; i < 8; i++) {
            result = result * 256 + buffer[offset + i];
        }
        return result;
    }
    static toUInt32(buffer, offset = 0) {
        return ((buffer[offset] << 24) | (buffer[offset + 1] << 16) | (buffer[offset + 2] << 8) | buffer[offset + 3]) >>> 0;
    }
    static toUInt16(buffer, offset = 0) {
        return (buffer[offset] << 8) | buffer[offset + 1];
    }
}
//# sourceMappingURL=Converters.js.map