import { Hatch, HatchBoundaryPath } from '../../Entities/Hatch.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
export class CadHatchTemplate extends CadEntityTemplateT {
    hatchPatternName = null;
    pathTemplates = [];
    constructor(hatch) {
        super(hatch ?? new Hatch());
    }
    _build(builder) {
        super._build(builder);
        for (const t of this.pathTemplates) {
            this.cadObject.paths.push(t.path);
            t.build(builder);
        }
    }
}
(function (CadHatchTemplate) {
    class CadBoundaryPathTemplate {
        path = new HatchBoundaryPath();
        handles = new Set();
        build(builder) {
            for (const handle of this.handles) {
                const entity = builder.tryGetCadObject(handle);
                if (entity) {
                    this.path.entities.push(entity);
                }
            }
        }
    }
    CadHatchTemplate.CadBoundaryPathTemplate = CadBoundaryPathTemplate;
})(CadHatchTemplate || (CadHatchTemplate = {}));
//# sourceMappingURL=CadHatchTemplate.js.map