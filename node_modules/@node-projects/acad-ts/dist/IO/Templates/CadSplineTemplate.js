import { Spline } from '../../Entities/Spline.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
export class CadSplineTemplate extends CadEntityTemplateT {
    constructor(entity) {
        super(entity ?? new Spline());
    }
}
//# sourceMappingURL=CadSplineTemplate.js.map