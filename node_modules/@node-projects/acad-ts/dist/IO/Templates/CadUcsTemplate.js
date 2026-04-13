import { UCS } from '../../Tables/UCS.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';
export class CadUcsTemplate extends CadTableEntryTemplate {
    constructor(entry) {
        super(entry ?? new UCS());
    }
}
//# sourceMappingURL=CadUcsTemplate.js.map