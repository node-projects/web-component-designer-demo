import { DxfSectionWriterBase } from './DxfSectionWriterBase.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
export class DxfEntitiesSectionWriter extends DxfSectionWriterBase {
    get sectionName() {
        return DxfFileToken.entitiesSection;
    }
    constructor(writer, document, objectHolder, configuration) {
        super(writer, document, objectHolder, configuration);
    }
    writeSection() {
        while (this.holder.entities.length > 0) {
            const item = this.holder.entities.shift();
            this.writeEntity(item);
        }
    }
}
//# sourceMappingURL=DxfEntitiesSectionWriter.js.map