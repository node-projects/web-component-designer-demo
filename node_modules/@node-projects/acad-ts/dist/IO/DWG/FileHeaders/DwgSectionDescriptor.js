export class DwgSectionDescriptor {
    pageType = 0x4163043B;
    name = '';
    compressedSize = 0;
    pageCount = 0;
    decompressedSize = 0x7400;
    _compressed = 2;
    get compressedCode() {
        return this._compressed;
    }
    set compressedCode(value) {
        if (value === 1 || value === 2) {
            this._compressed = value;
        }
        else {
            throw new Error('Invalid compressed code');
        }
    }
    get isCompressed() {
        return this._compressed === 2;
    }
    sectionId = 0;
    encrypted = 0;
    hashCode = null;
    encoding = null;
    localSections = [];
    constructor(name) {
        if (name !== undefined) {
            this.name = name;
        }
    }
}
//# sourceMappingURL=DwgSectionDescriptor.js.map