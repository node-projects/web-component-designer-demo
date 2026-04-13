import { DwgStreamReaderAC21 } from './DwgStreamReaderAC21.js';
export class DwgStreamReaderAC24 extends DwgStreamReaderAC21 {
    constructor(stream, resetPosition) {
        super(stream, resetPosition);
    }
    readObjectType() {
        const pair = this.read2Bits();
        let value = 0;
        switch (pair) {
            case 0:
                value = this.readByte();
                break;
            case 1:
                value = 0x1F0 + this.readByte();
                break;
            case 2:
                value = this.readShort();
                break;
            case 3:
                value = this.readShort();
                break;
        }
        return value;
    }
}
//# sourceMappingURL=DwgStreamReaderAC24.js.map