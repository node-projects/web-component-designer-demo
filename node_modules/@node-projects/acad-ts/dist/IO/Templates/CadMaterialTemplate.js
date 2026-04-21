import { Material } from '../../Objects/Material.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadMaterialTemplate extends CadTemplateT {
    constructor(material) {
        super(material ?? new Material());
    }
    _build(builder) {
        super._build(builder);
    }
}
//# sourceMappingURL=CadMaterialTemplate.js.map