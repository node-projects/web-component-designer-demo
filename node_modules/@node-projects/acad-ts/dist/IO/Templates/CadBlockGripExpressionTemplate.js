import { BlockGripExpression } from '../../Objects/Evaluations/BlockGripExpression.js';
import { CadEvaluationExpressionTemplate } from './CadEvaluationExpressionTemplate.js';
export class CadBlockGripExpressionTemplate extends CadEvaluationExpressionTemplate {
    constructor(grip) {
        super(grip ?? new BlockGripExpression());
    }
}
//# sourceMappingURL=CadBlockGripExpressionTemplate.js.map