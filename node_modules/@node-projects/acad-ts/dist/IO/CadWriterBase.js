import { Dimension } from '../Entities/Dimension.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { NotificationEventArgs } from './NotificationEventHandler.js';
import { getDocumentCodePageName } from './TextEncoding.js';
export class CadWriterBase {
    onNotification = null;
    configuration;
    _document;
    _encoding = 'utf-8';
    _stream;
    constructor(stream, document) {
        this._stream = stream;
        this._document = document;
        this.configuration = this.createDefaultConfiguration();
    }
    write() {
        this._document.updateImageReactors();
        this._document.updateDxfClasses(this.configuration.resetDxfClasses);
        if (this.configuration.updateDimensionsInModel) {
            this._updateDimensions(this._document.modelSpace);
        }
        if (this.configuration.updateDimensionsInBlocks) {
            for (const item of this._document.blockRecords) {
                if (item.name.toLowerCase() === BlockRecord.modelSpaceName.toLowerCase()) {
                    continue;
                }
                this._updateDimensions(item);
            }
        }
        this._encoding = this.getListedEncoding(this._document.header.codePage);
    }
    getListedEncoding(codePage) {
        return getDocumentCodePageName(codePage);
    }
    triggerNotification(messageOrSender, notificationTypeOrArgs, ex) {
        if (typeof messageOrSender === 'string') {
            this.onNotification?.(this, new NotificationEventArgs(messageOrSender, notificationTypeOrArgs, ex ?? null));
        }
        else {
            this.onNotification?.(messageOrSender, notificationTypeOrArgs);
        }
    }
    _updateDimensions(record) {
        for (const item of record.entities) {
            if (item instanceof Dimension) {
                item.updateBlock();
            }
        }
    }
}
//# sourceMappingURL=CadWriterBase.js.map