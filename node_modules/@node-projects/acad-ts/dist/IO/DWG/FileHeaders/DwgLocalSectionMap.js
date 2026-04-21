export class DwgLocalSectionMap {
    compression = 2;
    isEmpty = false;
    offset = 0;
    compressedSize = 0;
    pageNumber = 0;
    decompressedSize = 0;
    seeker = 0;
    size = 0;
    checksum = 0;
    crc = 0;
    pageSize = 0;
    oda = 0;
    sectionMap = 0;
    constructor(value) {
        if (value !== undefined) {
            this.sectionMap = value;
        }
    }
}
//# sourceMappingURL=DwgLocalSectionMap.js.map