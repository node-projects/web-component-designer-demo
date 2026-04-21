import { ACadVersion } from '../../ACadVersion.js';
import { NotificationEventArgs, NotificationType } from '../NotificationEventHandler.js';
export class DwgSectionIO {
    onNotification = null;
    r13_14Only;
    r13_15Only;
    r2000Plus;
    r2004Pre;
    r2007Pre;
    r2004Plus;
    r2007Plus;
    r2010Plus;
    r2013Plus;
    r2018Plus;
    _version;
    constructor(version) {
        this._version = version;
        this.r13_14Only = version === ACadVersion.AC1014 || version === ACadVersion.AC1012;
        this.r13_15Only = version >= ACadVersion.AC1012 && version <= ACadVersion.AC1015;
        this.r2000Plus = version >= ACadVersion.AC1015;
        this.r2004Pre = version < ACadVersion.AC1018;
        this.r2007Pre = version <= ACadVersion.AC1021;
        this.r2004Plus = version >= ACadVersion.AC1018;
        this.r2007Plus = version >= ACadVersion.AC1021;
        this.r2010Plus = version >= ACadVersion.AC1024;
        this.r2013Plus = version >= ACadVersion.AC1027;
        this.r2018Plus = version >= ACadVersion.AC1032;
    }
    static checkSentinel(actual, expected) {
        if (expected.length !== actual.length) {
            return false;
        }
        for (let i = 0; i < expected.length; i++) {
            if (actual[i] !== expected[i]) {
                return false;
            }
        }
        return true;
    }
    checkSentinel(sreader, expected) {
        const sn = sreader.readSentinel();
        if (!DwgSectionIO.checkSentinel(sn, expected)) {
            this.notify(`Invalid section sentinel found in ${this.sectionName}`, NotificationType.Warning);
        }
    }
    notify(message, type, ex = null) {
        this.onNotification?.(this, new NotificationEventArgs(message, type, ex));
    }
}
//# sourceMappingURL=DwgSectionIO.js.map