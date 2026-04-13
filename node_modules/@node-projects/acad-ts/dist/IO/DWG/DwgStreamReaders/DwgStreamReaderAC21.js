import { DwgStreamReaderAC18 } from './DwgStreamReaderAC18.js';
export class DwgStreamReaderAC21 extends DwgStreamReaderAC18 {
    constructor(stream, resetPosition) {
        super(stream, resetPosition);
    }
    readTextUnicode() {
        const textLength = this.readShortLittleEndian();
        let value;
        if (textLength === 0) {
            value = '';
        }
        else {
            const length = (textLength << 1) & 0xFFFF;
            value = this.readStringEncoded(length, 'utf-16le').replace(/\0/g, '');
        }
        return value;
    }
    readVariableText() {
        const textLength = this.readBitShort();
        let value;
        if (textLength === 0) {
            value = '';
        }
        else {
            const length = (textLength << 1) & 0xFFFF;
            value = this.readStringEncoded(length, 'utf-16le').replace(/\0/g, '');
        }
        return value;
    }
}
//# sourceMappingURL=DwgStreamReaderAC21.js.map