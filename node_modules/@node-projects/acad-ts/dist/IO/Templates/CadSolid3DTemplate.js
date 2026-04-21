import { Solid3D } from '../../Entities/Solid3D.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
export class CadSolid3DTemplate extends CadEntityTemplateT {
    historyHandle = null;
    constructor(solid) {
        super(solid ?? new Solid3D());
    }
}
//# sourceMappingURL=CadSolid3DTemplate.js.map