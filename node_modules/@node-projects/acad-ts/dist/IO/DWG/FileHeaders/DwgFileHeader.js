import { ACadVersion } from '../../../ACadVersion.js';
// Factory registration for breaking circular dependency
let _factory = null;
export class DwgFileHeader {
    acadVersion;
    previewAddress = -1;
    acadMaintenanceVersion = 0;
    drawingCodePage = 0;
    constructor(version) {
        this.acadVersion = version ?? ACadVersion.Unknown;
    }
    static registerFactory(factory) {
        _factory = factory;
    }
    static createFileHeader(version) {
        if (!_factory) {
            throw new Error('DwgFileHeader factory not registered. Import DwgFileHeaderFactory first.');
        }
        return _factory(version);
    }
}
//# sourceMappingURL=DwgFileHeader.js.map