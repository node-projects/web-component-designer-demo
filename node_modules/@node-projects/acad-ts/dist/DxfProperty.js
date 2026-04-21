import { DxfPropertyBase } from './DxfPropertyBase.js';
import { ExtendedDataInteger16 } from './XData/ExtendedDataInteger16.js';
import { ExtendedDataRecord } from './XData/ExtendedDataRecord.js';
export class DxfProperty extends DxfPropertyBase {
    constructor(codeOrName, nameOrCodes, dxfCodes) {
        if (typeof codeOrName === 'object') {
            super(codeOrName);
        }
        else if (typeof codeOrName === 'string') {
            super(codeOrName, nameOrCodes);
        }
        else if (typeof nameOrCodes === 'object' && !Array.isArray(nameOrCodes)) {
            super(nameOrCodes);
            if (!nameOrCodes.valueCodes.includes(codeOrName)) {
                throw new Error(`The property ${nameOrCodes.propertyName} does not have a mapping for code ${codeOrName}`);
            }
            this._assignedCode = codeOrName;
        }
        else {
            super(nameOrCodes, dxfCodes ?? [codeOrName]);
            this._assignedCode = codeOrName;
        }
    }
    getCollectionCodes() {
        return this._collectionCodes ? [...this._collectionCodes] : null;
    }
    getValue(obj) {
        return this.getPropertyValue(obj);
    }
    toXDataRecords() {
        if (this.storedValue === null || this.storedValue === undefined) {
            return [];
        }
        return [
            new ExtendedDataInteger16(this.assignedCode),
            ExtendedDataRecord.create(this.groupCode, this.storedValue),
        ];
    }
    toString() {
        let str = "";
        for (const code of this.dxfCodes) {
            str += `${code}:`;
        }
        str += this._propertyName;
        return str;
    }
}
//# sourceMappingURL=DxfProperty.js.map