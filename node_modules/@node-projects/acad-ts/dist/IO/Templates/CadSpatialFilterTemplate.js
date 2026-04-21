import { SpatialFilter } from '../../Objects/SpatialFilter.js';
import { CadNonGraphicalObjectTemplate } from './CadNonGraphicalObjectTemplate.js';
export class CadSpatialFilterTemplate extends CadNonGraphicalObjectTemplate {
    hasFrontPlane = false;
    insertTransformRead = false;
    constructor(obj) {
        super(obj ?? new SpatialFilter());
    }
}
//# sourceMappingURL=CadSpatialFilterTemplate.js.map