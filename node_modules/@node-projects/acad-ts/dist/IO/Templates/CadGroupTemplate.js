import { Group } from '../../Objects/Group.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadGroupTemplate extends CadTemplateT {
    handles = new Set();
    constructor(group) {
        super(group ?? new Group());
    }
    _build(builder) {
        super._build(builder);
        for (const handle of this.handles) {
            const e = builder.getObjectTemplate(handle);
            if (e) {
                e.build(builder);
                try {
                    this.cadObject.add(e.cadObject);
                }
                catch (ex) {
                    builder.notify(`Entity with handle ${handle} could not be added to group ${this.cadObject.handle}`, NotificationType.Error, ex instanceof Error ? ex : null);
                }
            }
            else {
                builder.notify(`Entity with handle ${handle} not found for group ${this.cadObject.handle}`, NotificationType.Warning);
            }
        }
    }
}
//# sourceMappingURL=CadGroupTemplate.js.map