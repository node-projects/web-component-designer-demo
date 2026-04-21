import { DxfMapBase } from './DxfMapBase.js';
import { getClassMetadata } from './Metadata/MetadataStore.js';
export class DxfClassMap extends DxfMapBase {
    static _cache = new Map();
    constructor(arg) {
        super();
        if (arg instanceof DxfClassMap) {
            this.name = arg.name;
            for (const [k, v] of arg.dxfProperties) {
                this.dxfProperties.set(k, v);
            }
        }
        else if (typeof arg === 'string') {
            this.name = arg;
        }
    }
    static createFromType(typeName, name) {
        if (DxfClassMap._cache.has(typeName)) {
            return new DxfClassMap(DxfClassMap._cache.get(typeName));
        }
        const classMap = new DxfClassMap();
        const metadata = getClassMetadata(typeName);
        if (!name && metadata?.dxfSubClassName == null) {
            throw new Error(`${typeName} is not a DXF subclass`);
        }
        classMap.name = name ?? metadata?.dxfSubClassName ?? typeName;
        DxfClassMap.addClassProperties(classMap, typeName);
        const baseMetadata = metadata?.baseTypeName ? getClassMetadata(metadata.baseTypeName) : undefined;
        if (baseMetadata?.dxfSubClassIsEmpty) {
            DxfClassMap.addClassProperties(classMap, baseMetadata.typeName);
        }
        DxfClassMap._cache.set(typeName, classMap);
        return new DxfClassMap(classMap);
    }
    static create(type, name) {
        const typeName = typeof type === 'string' ? type : type.name;
        return DxfClassMap.createFromType(typeName, name);
    }
    clearCache() {
        DxfClassMap._cache.clear();
    }
    toString() {
        return `DxfClassMap:${this.name}`;
    }
}
//# sourceMappingURL=DxfClassMap.js.map