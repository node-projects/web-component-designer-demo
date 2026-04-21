import { GeoData } from '../../Objects/GeoData.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadGeoDataTemplate extends CadTemplateT {
    hostBlockHandle = null;
    constructor(geodata) {
        super(geodata ?? new GeoData());
    }
    _build(builder) {
        super._build(builder);
        const host = this.getTableReference(builder, this.hostBlockHandle, '');
        if (host) {
            this.cadObject.hostBlock = host;
        }
    }
}
//# sourceMappingURL=CadGeoDataTemplate.js.map