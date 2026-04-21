import { DxfPropertyBase } from './DxfPropertyBase.js';
import { DxfReferenceType } from './Types/DxfReferenceType.js';
export class CadSystemVariable extends DxfPropertyBase {
    name;
    dxfCodes = [];
    isName = false;
    constructor(propertyNameOrMetadata, name, dxfCodes = []) {
        if (typeof propertyNameOrMetadata === 'string') {
            super(propertyNameOrMetadata, dxfCodes);
            this.name = name ?? propertyNameOrMetadata;
            this.dxfCodes = [...dxfCodes];
            this.isName = false;
            this.referenceType = 0;
        }
        else {
            super(propertyNameOrMetadata);
            this.name = propertyNameOrMetadata.name;
            this.dxfCodes = [...propertyNameOrMetadata.valueCodes];
            this.isName = propertyNameOrMetadata.isName;
            this.referenceType = propertyNameOrMetadata.referenceType;
        }
    }
    getSystemValue(code, header) {
        switch (this.referenceType) {
            case DxfReferenceType.Unprocess:
                return this.getValue(header);
            case DxfReferenceType.Handle:
                return this.getHandledValue(header);
            case DxfReferenceType.Name:
                return this.getNamedValue(header);
            case DxfReferenceType.Count:
                return this.getCounterValue(header);
            case DxfReferenceType.None:
            default:
                return this.getRawValueByCode(code, header);
        }
    }
    getValue(header) {
        return this.getPropertyValue(header);
    }
}
//# sourceMappingURL=CadSystemVariable.js.map