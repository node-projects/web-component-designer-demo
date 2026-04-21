import { DxfProperty } from './DxfProperty.js';
import { getClassPropertyMetadata } from './Metadata/MetadataStore.js';
export class DxfMapBase {
    name = "";
    dxfProperties = new Map();
    static addClassProperties(map, type, obj) {
        for (const [code, property] of DxfMapBase.cadObjectMapDxf(type)) {
            map.dxfProperties.set(code, property);
            if (obj != null) {
                property.storedValue = property.getRawValue(obj);
            }
        }
    }
    static *cadObjectMapDxf(type) {
        for (const metadata of getClassPropertyMetadata(type)) {
            for (const code of metadata.valueCodes) {
                yield [code, new DxfProperty(code, metadata)];
            }
        }
    }
}
//# sourceMappingURL=DxfMapBase.js.map