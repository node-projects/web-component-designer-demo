import { EvaluationGraph, EvaluationGraphNode } from '../../Objects/Evaluations/EvaluationGraph.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadEvaluationGraphTemplate extends CadTemplateT {
    nodeTemplates = [];
    constructor(evaluationGraph) {
        super(evaluationGraph ?? new EvaluationGraph());
    }
    _build(builder) {
        super._build(builder);
        for (const item of this.nodeTemplates) {
            item.build(builder);
            this.cadObject.nodes.push(item.node);
        }
    }
}
(function (CadEvaluationGraphTemplate) {
    class GraphNodeTemplate {
        node = new EvaluationGraphNode();
        expressionHandle = null;
        build(builder) {
            const evExpression = builder.tryGetCadObject(this.expressionHandle);
            if (evExpression) {
                this.node.expression = evExpression;
            }
            else {
                builder.notify(`Evaluation graph couldn't find the EvaluationExpression with handle ${this.expressionHandle}`, NotificationType.Warning);
            }
        }
    }
    CadEvaluationGraphTemplate.GraphNodeTemplate = GraphNodeTemplate;
})(CadEvaluationGraphTemplate || (CadEvaluationGraphTemplate = {}));
//# sourceMappingURL=CadEvaluationGraphTemplate.js.map