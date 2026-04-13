import { CadValueType } from './CadValueType.js';
import { CadValueUnitType } from './CadValueUnitType.js';
export class CadValue {
    flags = 0;
    format = "";
    formattedValue = "";
    get isEmpty() {
        return (this.flags & 1) !== 0;
    }
    set isEmpty(value) {
        if (value) {
            this.flags |= 0b1;
        }
        else {
            this.flags &= ~0b1;
        }
    }
    units = CadValueUnitType.NoUnits;
    value = null;
    valueType = CadValueType.Unknown;
    setValue(value, valueType) {
        if (valueType !== undefined) {
            this.valueType = valueType;
        }
        switch (this.valueType) {
            case CadValueType.Point2D:
            case CadValueType.Point3D:
            case CadValueType.Long:
            case CadValueType.Double:
            case CadValueType.Date:
            case CadValueType.Handle:
            case CadValueType.String:
            case CadValueType.General:
                this.value = value;
                break;
            case CadValueType.Unknown:
            case CadValueType.Buffer:
            case CadValueType.ResultBuffer:
            default:
                throw new Error("Invalid operation for value type");
        }
    }
    toString() {
        return `${this.valueType}:${this.value}`;
    }
}
export { CadValueUnitType } from './CadValueUnitType.js';
export { CadValueType } from './CadValueType.js';
//# sourceMappingURL=CadValue.js.map