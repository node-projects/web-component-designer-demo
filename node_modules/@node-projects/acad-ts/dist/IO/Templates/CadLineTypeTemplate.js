import { LineType, LineTypeSegment } from '../../Tables/LineType.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';
export class CadLineTypeTemplate extends CadTableEntryTemplate {
    ltypeControlHandle = null;
    totalLen = null;
    segmentTemplates = [];
    constructor(entry) {
        super(entry ?? new LineType());
    }
    _build(builder) {
        super._build(builder);
        for (const item of this.segmentTemplates) {
            item.build(builder);
            this.cadObject.addSegment(item.segment);
        }
    }
}
(function (CadLineTypeTemplate) {
    class SegmentTemplate {
        styleHandle = null;
        segment = new LineTypeSegment();
        build(builder) {
            const style = builder.tryGetCadObject(this.styleHandle);
            if (style) {
                this.segment.style = style;
            }
        }
    }
    CadLineTypeTemplate.SegmentTemplate = SegmentTemplate;
})(CadLineTypeTemplate || (CadLineTypeTemplate = {}));
//# sourceMappingURL=CadLineTypeTemplate.js.map