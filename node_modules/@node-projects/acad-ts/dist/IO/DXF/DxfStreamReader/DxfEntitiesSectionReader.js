import { DxfSectionReaderBase } from './DxfSectionReaderBase.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { NotificationType } from '../../NotificationEventHandler.js';
export class DxfEntitiesSectionReader extends DxfSectionReaderBase {
    constructor(reader, builder) {
        super(reader, builder);
    }
    read() {
        this._reader.readNext();
        while (this._reader.valueAsString !== DxfFileToken.endSection) {
            let template = null;
            try {
                template = this.readEntity();
            }
            catch (ex) {
                if (!this._builder.configuration.failsafe) {
                    throw ex;
                }
                this._builder.notify(`Error while reading an entity at line ${this._reader.position}`, NotificationType.Error, ex instanceof Error ? ex : undefined);
                while (this._reader.dxfCode !== DxfCode.Start) {
                    this._reader.readNext();
                }
            }
            if (template === null) {
                continue;
            }
            this._builder.addTemplate(template);
            const owner = this._builder.tryGetObjectTemplate(template.ownerHandle);
            if (template.ownerHandle === null) {
                this._builder.modelSpaceEntities.add(template.cadObject);
            }
            else if (owner) {
                owner.ownedObjectsHandlers.add(template.cadObject.handle);
            }
            else {
                this._builder.orphanTemplates.push(template);
            }
        }
    }
}
//# sourceMappingURL=DxfEntitiesSectionReader.js.map