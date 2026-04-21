import { metadataLookupTable } from './MetadataLookupTable.js';
const classMetadataByName = new Map();
let initialized = false;
function clonePropertyMetadata(metadata) {
    return {
        ...metadata,
        valueCodes: [...metadata.valueCodes],
        collectionCodes: metadata.collectionCodes ? [...metadata.collectionCodes] : undefined,
    };
}
function cloneClassMetadata(metadata) {
    return {
        ...metadata,
        properties: metadata.properties.map(clonePropertyMetadata),
        systemVariables: metadata.systemVariables.map(clonePropertyMetadata),
    };
}
function ensureInitialized() {
    if (initialized) {
        return;
    }
    for (const metadata of metadataLookupTable) {
        classMetadataByName.set(metadata.typeName, cloneClassMetadata(metadata));
    }
    initialized = true;
}
export function clearMetadataCache() {
    initialized = false;
    classMetadataByName.clear();
}
export function getClassMetadata(type) {
    ensureInitialized();
    const typeName = typeof type === 'string' ? type : type.name;
    const metadata = classMetadataByName.get(typeName);
    return metadata ? cloneClassMetadata(metadata) : undefined;
}
export function getClassPropertyMetadata(type) {
    return getClassMetadata(type)?.properties ?? [];
}
export function getSystemVariableMetadata(type) {
    return getClassMetadata(type)?.systemVariables ?? [];
}
export function getSystemVariableMetadataMap(type) {
    const map = new Map();
    for (const metadata of getSystemVariableMetadata(type)) {
        map.set(metadata.name, clonePropertyMetadata(metadata));
    }
    return map;
}
//# sourceMappingURL=MetadataStore.js.map