import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadWipeoutBaseTemplate extends CadEntityTemplate {
    imgDefHandle = null;
    imgReactorHandle = null;
    constructor(image) {
        super(image);
    }
    _build(builder) {
        super._build(builder);
        const image = this.cadObject;
        const imgDef = builder.tryGetCadObject(this.imgDefHandle);
        if (imgDef) {
            image.definition = imgDef;
        }
        const imgReactor = builder.tryGetCadObject(this.imgReactorHandle);
        if (imgReactor) {
            image.definitionReactor = imgReactor;
            imgReactor.image = image;
            imgReactor.owner = image;
            builder.documentToBuild.registerCollection(imgReactor);
        }
    }
}
//# sourceMappingURL=CadWipeoutBaseTemplate.js.map