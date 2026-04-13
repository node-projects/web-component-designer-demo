import { UnitsType } from '../../Types/Units/UnitsType.js';
export class SvgConverter {
    static toSvg(value) {
        return value.toString();
    }
    static toSvgWithUnits(value, units) {
        let unitSuffix = '';
        switch (units) {
            case UnitsType.Centimeters:
                unitSuffix = 'cm';
                break;
            case UnitsType.Millimeters:
                unitSuffix = 'mm';
                break;
            case UnitsType.Inches:
                unitSuffix = 'in';
                break;
        }
        return `${value.toString()}${unitSuffix}`;
    }
    static vectorToSvg(vector) {
        return `${SvgConverter.toSvg(vector.x)},${SvgConverter.toSvg(vector.y)}`;
    }
    static vectorToSvgWithUnits(vector, units) {
        return `${SvgConverter.toSvgWithUnits(vector.x, units)},${SvgConverter.toSvgWithUnits(vector.y, units)}`;
    }
    static toPixelSize(value, units) {
        switch (units) {
            case UnitsType.Inches:
                return value * 96;
            case UnitsType.Millimeters:
                return value * 96 / 25.4;
            case UnitsType.Unitless:
                return value;
            default:
                throw new Error(`Invalid units value: ${units}`);
        }
    }
    static vectorToPixelSize(value, units) {
        const result = { ...value };
        result.x = SvgConverter.toPixelSize(result.x, units);
        result.y = SvgConverter.toPixelSize(result.y, units);
        if (result.z !== undefined) {
            result.z = SvgConverter.toPixelSize(result.z, units);
        }
        return result;
    }
}
//# sourceMappingURL=SvgConverter.js.map