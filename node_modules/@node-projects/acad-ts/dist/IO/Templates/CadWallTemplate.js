import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadWallTemplate extends CadEntityTemplate {
    binRecordHandle = null;
    cleanupGroupHandle = null;
    rawData = null;
    styleHandle = null;
    constructor(wall) {
        super(wall);
    }
    _build(builder) {
        super._build(builder);
        const wall = this.cadObject;
        if (this.rawData !== null) {
            wall.rawData = this.rawData;
        }
        const binRecord = builder.tryGetCadObject(this.binRecordHandle);
        if (binRecord) {
            wall.binRecord = binRecord;
        }
        const wallStyle = builder.tryGetCadObject(this.styleHandle);
        if (wallStyle) {
            wall.style = wallStyle;
        }
        const cleanupGroup = builder.tryGetCadObject(this.cleanupGroupHandle);
        if (cleanupGroup) {
            wall.cleanupGroup = cleanupGroup;
        }
    }
}
//# sourceMappingURL=CadWallTemplate.js.map