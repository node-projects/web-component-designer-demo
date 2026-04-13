import { BlockRotationGrip } from '../../Objects/Evaluations/BlockRotationGrip.js';
import { CadBlockGripTemplate } from './CadBlockGripTemplate.js';
export class CadBlockRotationGripTemplate extends CadBlockGripTemplate {
    constructor(grip) {
        super(grip ?? new BlockRotationGrip());
    }
}
//# sourceMappingURL=CadBlockRotationGripTemplate.js.map