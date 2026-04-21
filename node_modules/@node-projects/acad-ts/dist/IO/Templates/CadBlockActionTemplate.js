import { CadBlockElementTemplate } from './CadBlockElementTemplate.js';
export class CadBlockActionTemplate extends CadBlockElementTemplate {
    get blockAction() { return this.cadObject; }
    entityHandles = new Set();
    constructor(cadObject) {
        super(cadObject);
    }
    _build(builder) {
        super._build(builder);
        for (const handle of this.entityHandles) {
            const entity = builder.tryGetCadObject(handle);
            if (entity) {
                this.blockAction.entities.push(entity);
            }
            else {
                builder.notify(`[${this.blockAction.toString()}] entity with handle ${handle} not found.`);
            }
        }
    }
}
//# sourceMappingURL=CadBlockActionTemplate.js.map