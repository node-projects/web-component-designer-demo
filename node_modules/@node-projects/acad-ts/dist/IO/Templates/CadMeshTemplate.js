import { Mesh } from '../../Entities/Mesh.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
export class CadMeshTemplate extends CadEntityTemplateT {
    subclassMarker = false;
    constructor(mesh) {
        super(mesh ?? new Mesh());
    }
}
//# sourceMappingURL=CadMeshTemplate.js.map