import { CadDocument } from '../CadDocument.js';
import { NotificationEventArgs } from './NotificationEventHandler.js';
import { getDecoderEncodingLabel } from './TextEncoding.js';
export class CadReaderBase {
    onNotification = null;
    configuration;
    _document = new CadDocument();
    _encoding = 'utf-8';
    _fileStream;
    constructor(stream, notification = null) {
        if (notification) {
            this.onNotification = notification;
        }
        this._fileStream = stream;
        this.configuration = this.createDefaultConfiguration();
    }
    dispose() {
        // No-op in TS; ArrayBuffer doesn't need disposal
    }
    getListedEncoding(code) {
        return getDecoderEncodingLabel(code);
    }
    triggerNotification(message, notificationType, ex = null) {
        this.onNotificationEvent(null, new NotificationEventArgs(message, notificationType, ex));
    }
    onNotificationEvent(sender, e) {
        this.onNotification?.(this, e);
    }
}
//# sourceMappingURL=CadReaderBase.js.map