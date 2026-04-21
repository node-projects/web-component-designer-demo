import { EvaluationExpression } from './EvaluationExpression.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
export class BlockGripExpression extends EvaluationExpression {
    get objectName() { return DxfFileToken.objectBlockGripLocationComponent; }
    get subclassMarker() { return DxfSubclassMarker.blockGripExpression; }
    value300 = '';
    value91 = 0;
}
//# sourceMappingURL=BlockGripExpression.js.map