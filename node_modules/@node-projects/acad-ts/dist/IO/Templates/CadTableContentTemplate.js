import { TableContent } from '../../Objects/TableContent.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadTableContentTemplate extends CadTemplateT {
    sytleHandle = 0;
    constructor(cadObject) {
        super(cadObject ?? new TableContent());
    }
}
//# sourceMappingURL=CadTableContentTemplate.js.map