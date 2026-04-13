import { BlockVisibilityGrip } from '../../Objects/Evaluations/BlockVisibilityGrip.js';
import { CadBlockGripTemplate } from './CadBlockGripTemplate.js';
export class CadBlockVisibilityGripTemplate extends CadBlockGripTemplate {
    constructor(grip) {
        super(grip ?? new BlockVisibilityGrip());
    }
}
//# sourceMappingURL=CadBlockVisibilityGripTemplate.js.map