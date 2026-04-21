import { BlockRepresentationData } from '../../Objects/BlockRepresentationData.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadBlockRepresentationDataTemplate extends CadTemplateT {
    blockHandle = null;
    constructor(representation) {
        super(representation ?? new BlockRepresentationData());
    }
    _build(builder) {
        super._build(builder);
        const record = this.getTableReference(builder, this.blockHandle, '');
        if (record) {
            this.cadObject.block = record;
        }
    }
}
//# sourceMappingURL=CadBlockRepresentationDataTemplate.js.map