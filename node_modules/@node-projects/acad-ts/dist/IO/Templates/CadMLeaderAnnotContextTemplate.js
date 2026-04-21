import { LeaderLine } from '../../Objects/MultiLeaderObjectContextData.js';
import { CadAnnotScaleObjectContextDataTemplate } from './CadAnnotScaleObjectContextDataTemplate.js';
export class CadMLeaderAnnotContextTemplate extends CadAnnotScaleObjectContextDataTemplate {
    blockRecordHandle = 0;
    leaderLineTemplates = [];
    textStyleHandle = 0;
    constructor(cadObject) {
        super(cadObject);
    }
    _build(builder) {
        super._build(builder);
        const annotContext = this.cadObject;
        const annotContextTextStyle = builder.tryGetCadObject(this.textStyleHandle);
        if (annotContextTextStyle) {
            annotContext.textStyle = annotContextTextStyle;
        }
        const annotContextBlockRecord = builder.tryGetCadObject(this.blockRecordHandle);
        if (annotContextBlockRecord) {
            annotContext.blockContent = annotContextBlockRecord;
        }
        for (const leaderLineSubTemplate of this.leaderLineTemplates) {
            leaderLineSubTemplate.build(builder);
        }
    }
}
(function (CadMLeaderAnnotContextTemplate) {
    class LeaderLineTemplate {
        arrowSymbolHandle = null;
        leaderLine;
        lineTypeHandle = null;
        constructor(leaderLine) {
            this.leaderLine = leaderLine ?? new LeaderLine();
        }
        build(builder) {
            const leaderLinelineType = builder.tryGetCadObject(this.lineTypeHandle);
            if (leaderLinelineType) {
                this.leaderLine.lineType = leaderLinelineType;
            }
            const arrowhead = builder.tryGetCadObject(this.arrowSymbolHandle);
            if (arrowhead) {
                this.leaderLine.arrowhead = arrowhead;
            }
        }
    }
    CadMLeaderAnnotContextTemplate.LeaderLineTemplate = LeaderLineTemplate;
})(CadMLeaderAnnotContextTemplate || (CadMLeaderAnnotContextTemplate = {}));
//# sourceMappingURL=CadMLeaderAnnotContextTemplate.js.map