import { Layer } from '../../Tables/Layer.js';
import { LineType } from '../../Tables/LineType.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadEntityTemplate extends CadTemplateT {
    bookColorName = null;
    colorHandle = null;
    entityMode = 0;
    layerHandle = null;
    layerName = null;
    lineTypeHandle = null;
    lineTypeName = null;
    ltypeFlags = null;
    materialHandle = null;
    nextEntity = null;
    prevEntity = null;
    constructor(entity) {
        super(entity);
    }
    setUnlinkedReferences() {
        if (this.layerName && this.layerName.length > 0) {
            this.cadObject.layer = new Layer(this.layerName);
        }
        if (this.lineTypeName && this.lineTypeName.length > 0) {
            this.cadObject.lineType = new LineType(this.lineTypeName);
        }
    }
    _build(builder) {
        super._build(builder);
        const layer = this.getTableReference(builder, this.layerHandle, this.layerName ?? '');
        if (layer) {
            this.cadObject.layer = layer;
        }
        switch (this.ltypeFlags) {
            case 0:
                this.lineTypeName = LineType.byLayerName;
                break;
            case 1:
                this.lineTypeName = LineType.byBlockName;
                break;
            case 2:
                this.lineTypeName = LineType.continuousName;
                break;
        }
        const ltype = this.getTableReference(builder, this.lineTypeHandle, this.lineTypeName ?? '');
        if (ltype) {
            this.cadObject.lineType = ltype;
        }
        const color = builder.tryGetCadObject(this.colorHandle);
        if (color) {
            this.cadObject.bookColor = color;
        }
        else if (this.bookColorName && this.bookColorName.length > 0 &&
            builder.documentToBuild != null &&
            builder.documentToBuild.colors != null) {
            const bookColor = builder.documentToBuild.colors.tryGet(this.bookColorName);
            if (bookColor) {
                this.cadObject.bookColor = bookColor;
            }
        }
    }
}
export class CadEntityTemplateT extends CadEntityTemplate {
    constructor(entity) {
        super(entity);
    }
}
//# sourceMappingURL=CadEntityTemplate.js.map