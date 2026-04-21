import { BlockVisibilityParameter } from '../../Objects/Evaluations/BlockVisibilityParameter.js';
import { BlockVisibilityState } from '../../Objects/Evaluations/BlockVisibilityParameter.js';
import { CadBlock1PtParameterTemplate } from './CadBlock1PtParameterTemplate.js';
export class CadBlockVisibilityParameterTemplate extends CadBlock1PtParameterTemplate {
    entityHandles = [];
    stateTemplates = [];
    constructor(cadObject) {
        super(cadObject ?? new BlockVisibilityParameter());
    }
    _build(builder) {
        super._build(builder);
        const bvp = this.cadObject;
        for (const handle of this.entityHandles) {
            const entity = builder.tryGetCadObject(handle);
            if (entity) {
                bvp.entities.push(entity);
            }
            else {
                builder.notify(`[${bvp.toString()}] entity with handle ${handle} not found.`);
            }
        }
        for (const item of this.stateTemplates) {
            item.build(builder, this.entityHandles);
            bvp.addState(item.state);
        }
    }
}
(function (CadBlockVisibilityParameterTemplate) {
    class StateTemplate {
        state = new BlockVisibilityState();
        entityHandles = new Set();
        expressionHandles = new Set();
        constructor(state) {
            if (state) {
                this.state = state;
            }
        }
        build(builder, parentEntityHandles) {
            this._setEntities(builder, this.state.entities, this.entityHandles, parentEntityHandles);
            this._setEntities(builder, this.state.expressions, this.expressionHandles, null);
        }
        _setEntities(builder, subset, handles, entities) {
            for (const h of handles) {
                if (entities !== null && !entities.includes(h)) {
                    builder.notify(`[${this.state.toString()}] parent does not contain handle ${h}.`);
                }
                const obj = builder.tryGetCadObject(h);
                if (obj) {
                    subset.push(obj);
                }
                else {
                    builder.notify(`[${this.state.toString()}] object with handle ${h} not found.`);
                }
            }
        }
    }
    CadBlockVisibilityParameterTemplate.StateTemplate = StateTemplate;
})(CadBlockVisibilityParameterTemplate || (CadBlockVisibilityParameterTemplate = {}));
//# sourceMappingURL=CadBlockVisibilityParameterTemplate.js.map