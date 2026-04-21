import { DimensionAssociation } from '../../Objects/DimensionAssociation.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadDimensionAssociationTemplate extends CadTemplateT {
    dimensionHandle = null;
    firstPointRef = null;
    fourthPointRef = null;
    secondPointRef = null;
    thirdPointRef = null;
    constructor(obj) {
        super(obj ?? new DimensionAssociation());
    }
    _build(builder) {
        super._build(builder);
        const dimension = builder.tryGetCadObject(this.dimensionHandle);
        if (dimension) {
            this.cadObject.dimension = dimension;
        }
        if (this.firstPointRef !== null) {
            this.cadObject.firstPointRef = this.firstPointRef.osnapPointRef;
            this.firstPointRef.build(builder);
        }
        if (this.secondPointRef !== null) {
            this.cadObject.secondPointRef = this.secondPointRef.osnapPointRef;
            this.secondPointRef.build(builder);
        }
        if (this.thirdPointRef !== null) {
            this.cadObject.thirdPointRef = this.thirdPointRef.osnapPointRef;
            this.thirdPointRef.build(builder);
        }
        if (this.fourthPointRef !== null) {
            this.cadObject.fourthPointRef = this.fourthPointRef.osnapPointRef;
            this.fourthPointRef.build(builder);
        }
    }
}
(function (CadDimensionAssociationTemplate) {
    class OsnapPointRefTemplate {
        objectHandle = null;
        osnapPointRef;
        constructor(pointRef) {
            this.osnapPointRef = pointRef;
        }
        build(builder) {
            const obj = builder.tryGetCadObject(this.objectHandle);
            if (obj) {
                this.osnapPointRef.geometry = obj;
            }
        }
    }
    CadDimensionAssociationTemplate.OsnapPointRefTemplate = OsnapPointRefTemplate;
})(CadDimensionAssociationTemplate || (CadDimensionAssociationTemplate = {}));
//# sourceMappingURL=CadDimensionAssociationTemplate.js.map