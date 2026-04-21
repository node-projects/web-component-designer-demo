import { ProxyObject } from '../../Objects/ProxyObject.js';
import { CadTemplate } from './CadTemplate.js';
export class CadProxyObjectTemplate extends CadTemplate {
    entries = [];
    constructor(obj) {
        super(obj ?? new ProxyObject());
    }
}
//# sourceMappingURL=CadProxyObjectTemplate.js.map