import { EvaluationExpression } from './EvaluationExpression.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
export class BlockElement extends EvaluationExpression {
    get subclassMarker() { return DxfSubclassMarker.blockElement; }
    elementName = '';
    value1071 = 0;
}
//# sourceMappingURL=BlockElement.js.map