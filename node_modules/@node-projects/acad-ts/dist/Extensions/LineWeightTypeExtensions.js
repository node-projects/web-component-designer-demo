import { LineWeightType } from '../Types/LineWeightType.js';
export class LineWeightTypeExtensions {
    static getLineWeightValue(lineWeight) {
        const value = Math.abs(lineWeight);
        switch (lineWeight) {
            case LineWeightType.W0:
                return 0.001;
        }
        return value / 100;
    }
}
//# sourceMappingURL=LineWeightTypeExtensions.js.map