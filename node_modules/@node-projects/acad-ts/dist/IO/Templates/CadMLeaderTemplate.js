import { MultiLeader } from '../../Entities/MultiLeader.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
import { CadMLeaderAnnotContextTemplate } from './CadMLeaderAnnotContextTemplate.js';
export class CadMLeaderTemplate extends CadEntityTemplateT {
    arrowheadHandle = 0;
    arrowheadHandles = new Map();
    blockAttributeHandles = new Map();
    blockContentHandle = 0;
    cadMLeaderAnnotContextTemplate;
    leaderLineTypeHandle = null;
    leaderStyleHandle = 0;
    mTextStyleHandle = 0;
    constructor(entity) {
        const e = entity ?? new MultiLeader();
        super(e);
        this.cadMLeaderAnnotContextTemplate = new CadMLeaderAnnotContextTemplate(e.contextData);
    }
    _build(builder) {
        super._build(builder);
        this.cadMLeaderAnnotContextTemplate.build(builder);
        const multiLeader = this.cadObject;
        const leaderStyle = builder.tryGetCadObject(this.leaderStyleHandle);
        if (leaderStyle) {
            multiLeader.style = leaderStyle;
        }
        const lineType = builder.tryGetCadObject(this.leaderLineTypeHandle);
        if (lineType) {
            multiLeader.leaderLineType = lineType;
        }
        const textStyle = builder.tryGetCadObject(this.mTextStyleHandle);
        if (textStyle) {
            multiLeader.textStyle = textStyle;
        }
        const blockContent = builder.tryGetCadObject(this.blockContentHandle);
        if (blockContent) {
            multiLeader.blockContentId = blockContent;
        }
        const arrowHead = builder.tryGetCadObject(this.arrowheadHandle);
        if (arrowHead) {
            multiLeader.arrowhead = arrowHead;
        }
        const leaderLines = multiLeader.contextData.leaderRoots.flatMap((root) => root.lines);
        for (const [handle, isDefault] of this.arrowheadHandles) {
            const arrowhead = builder.tryGetCadObject(handle);
            if (arrowhead == null) {
                continue;
            }
            if (isDefault) {
                multiLeader.arrowhead ??= arrowhead;
                continue;
            }
            const leaderLine = leaderLines.find((line) => line.arrowhead == null);
            if (leaderLine != null) {
                leaderLine.arrowhead = arrowhead;
            }
            else {
                multiLeader.arrowhead ??= arrowhead;
            }
        }
        for (const blockAttribute of multiLeader.blockAttributes) {
            const attributeHandle = this.blockAttributeHandles.get(blockAttribute);
            if (attributeHandle !== undefined) {
                const attributeDefinition = builder.tryGetCadObject(attributeHandle);
                if (attributeDefinition) {
                    blockAttribute.attributeDefinition = attributeDefinition;
                }
            }
        }
    }
}
//# sourceMappingURL=CadMLeaderTemplate.js.map