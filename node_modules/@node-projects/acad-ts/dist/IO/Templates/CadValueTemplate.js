import { CadValueType } from '../../CadValueType.js';
export class CadValueTemplate {
    cadValue;
    valueHandle = null;
    constructor(value) {
        this.cadValue = value;
    }
    build(builder) {
        const cadObject = builder.tryGetCadObject(this.valueHandle);
        if (cadObject) {
            this.cadValue.setValue(cadObject, CadValueType.Handle);
        }
    }
}
//# sourceMappingURL=CadValueTemplate.js.map