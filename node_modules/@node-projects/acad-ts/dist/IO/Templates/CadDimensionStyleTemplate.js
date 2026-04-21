import { DimensionStyle } from '../../Tables/DimensionStyle.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';
export class CadDimensionStyleTemplate extends CadTableEntryTemplate {
    dimbL_Name = null;
    dimblk = null;
    dimblk1 = null;
    dimblK1_Name = null;
    dimblk2 = null;
    dimblK2_Name = null;
    dimldrblk = null;
    dimltex1 = 0;
    dimltex2 = 0;
    dimltype = null;
    textStyle_Name = null;
    textStyleHandle = null;
    blockHandle = null;
    dxfFlagsAssigned = false;
    constructor(dimStyle) {
        super(dimStyle ?? new DimensionStyle());
    }
    _build(builder) {
        super._build(builder);
        const style = this.getTableReference(builder, this.textStyleHandle, this.textStyle_Name ?? '');
        if (style) {
            this.cadObject.style = style;
        }
        const linetType = this.getTableReference(builder, this.dimltype, '');
        if (linetType) {
            this.cadObject.lineType = linetType;
        }
        const linetTypeEx1 = this.getTableReference(builder, this.dimltex1, '');
        if (linetTypeEx1) {
            this.cadObject.lineTypeExt1 = linetTypeEx1;
        }
        const linetTypeEx2 = this.getTableReference(builder, this.dimltex2, '');
        if (linetTypeEx2) {
            this.cadObject.lineTypeExt2 = linetTypeEx2;
        }
        const leaderArrow = this.getTableReference(builder, this.dimldrblk, this.dimbL_Name ?? '');
        if (leaderArrow) {
            this.cadObject.leaderArrow = leaderArrow;
        }
        const dimArrow1 = this.getTableReference(builder, this.dimblk1, this.dimblK1_Name ?? '');
        if (dimArrow1) {
            this.cadObject.dimArrow1 = dimArrow1;
        }
        const dimArrow2 = this.getTableReference(builder, this.dimblk2, this.dimblK2_Name ?? '');
        if (dimArrow2) {
            this.cadObject.dimArrow2 = dimArrow2;
        }
        const external = this.getTableReference(builder, this.blockHandle, '');
    }
}
//# sourceMappingURL=CadDimensionStyleTemplate.js.map