import { Leader } from '../../Entities/Leader.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
export class CadLeaderTemplate extends CadEntityTemplateT {
    dimasz = 0;
    dimstyleHandle = 0;
    dimstyleName = '';
    annotationHandle = 0;
    constructor(entity) {
        super(entity ?? new Leader());
    }
    _build(builder) {
        super._build(builder);
        const leader = this.cadObject;
        const style = this.getTableReference(builder, this.dimstyleHandle, this.dimstyleName);
        if (style) {
            leader.style = style;
        }
        const annotation = builder.tryGetCadObject(this.annotationHandle);
        if (annotation) {
            leader.associatedAnnotation = annotation;
        }
    }
}
//# sourceMappingURL=CadLeaderTemplate.js.map