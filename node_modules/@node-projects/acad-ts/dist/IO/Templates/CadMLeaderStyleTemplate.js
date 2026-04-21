import { MultiLeaderStyle } from '../../Objects/MultiLeaderStyle.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadMLeaderStyleTemplate extends CadTemplateT {
    arrowheadHandle = null;
    blockContentHandle = null;
    leaderLineTypeHandle = null;
    mTextStyleHandle = null;
    constructor(entry) {
        super(entry ?? new MultiLeaderStyle());
    }
    _build(builder) {
        super._build(builder);
        const lineType = builder.tryGetCadObject(this.leaderLineTypeHandle);
        if (lineType) {
            this.cadObject.leaderLineType = lineType;
        }
        const arrowhead = builder.tryGetCadObject(this.arrowheadHandle);
        if (arrowhead) {
            this.cadObject.arrowhead = arrowhead;
        }
        const textStyle = builder.tryGetCadObject(this.mTextStyleHandle);
        if (textStyle) {
            this.cadObject.textStyle = textStyle;
        }
        const blockContent = builder.tryGetCadObject(this.blockContentHandle);
        if (blockContent) {
            this.cadObject.blockContent = blockContent;
        }
    }
}
//# sourceMappingURL=CadMLeaderStyleTemplate.js.map