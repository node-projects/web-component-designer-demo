import { BlockRotationAction } from '../../Objects/Evaluations/BlockRotationAction.js';
import { CadBlockActionBasePtTemplate } from './CadBlockActionBasePtTemplate.js';
export class CadBlockRotationActionTemplate extends CadBlockActionBasePtTemplate {
    constructor(blockAction) {
        super(blockAction ?? new BlockRotationAction());
    }
}
//# sourceMappingURL=CadBlockRotationActionTemplate.js.map