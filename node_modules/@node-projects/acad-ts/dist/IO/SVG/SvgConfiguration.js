import { CadWriterConfiguration } from '../CadWriterConfiguration.js';
import { LineWeightType } from '../../Types/LineWeightType.js';
import { LineWeightTypeExtensions } from '../../Extensions/LineWeightTypeExtensions.js';
import { UnitsType } from '../../Types/Units/UnitsType.js';
export class SvgConfiguration extends CadWriterConfiguration {
    lineWeightRatio = 100;
    defaultLineWeight = 0.01;
    pointRadius = 0.1;
    arcPoints = 256;
    getLineWeightValue(lineWeight, units) {
        const value = Math.abs(lineWeight);
        if (units === UnitsType.Unitless) {
            return value / this.lineWeightRatio;
        }
        switch (lineWeight) {
            case LineWeightType.Default:
                return this.defaultLineWeight;
            case LineWeightType.W0:
                return 0.001;
        }
        return LineWeightTypeExtensions.getLineWeightValue(lineWeight);
    }
}
//# sourceMappingURL=SvgConfiguration.js.map