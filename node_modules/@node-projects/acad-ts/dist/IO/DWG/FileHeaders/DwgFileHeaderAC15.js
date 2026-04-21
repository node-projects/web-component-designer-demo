import { DwgFileHeader } from './DwgFileHeader.js';
import { DwgSectionDefinition } from './DwgSectionDefinition.js';
import { DwgSectionDescriptor } from './DwgSectionDescriptor.js';
export class DwgFileHeaderAC15 extends DwgFileHeader {
    static endSentinel = new Uint8Array([0x95, 0xA0, 0x4E, 0x28, 0x99, 0x82, 0x1A, 0xE5, 0x5E, 0x41, 0xE0, 0x5F, 0x9D, 0x3A, 0x4D, 0x00]);
    records = new Map();
    _descriptors = new Map();
    constructor(version) {
        super(version);
    }
    addSection(name) {
        if (!this._descriptors.has(name)) {
            this._descriptors.set(name, new DwgSectionDescriptor(name));
        }
    }
    getDescriptor(name) {
        const existing = this._descriptors.get(name);
        if (existing) {
            return existing;
        }
        const descriptor = new DwgSectionDescriptor(name);
        const sectionLocator = DwgSectionDefinition.getSectionLocatorByName(name);
        if (sectionLocator !== null) {
            const record = this.records.get(sectionLocator);
            if (record) {
                descriptor.compressedSize = record.size;
                descriptor.decompressedSize = record.size;
                descriptor.pageCount = 1;
                descriptor.compressedCode = 1;
            }
        }
        this._descriptors.set(name, descriptor);
        return descriptor;
    }
}
//# sourceMappingURL=DwgFileHeaderAC15.js.map