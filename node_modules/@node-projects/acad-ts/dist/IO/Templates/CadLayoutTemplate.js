import { Viewport } from '../../Entities/Viewport.js';
import { Layout } from '../../Objects/Layout.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadLayoutTemplate extends CadTemplateT {
    paperSpaceBlockHandle = null;
    activeViewportHandle = null;
    baseUcsHandle = null;
    namesUcsHandle = null;
    lasActiveViewportHandle = null;
    viewportHandles = new Set();
    constructor(layout) {
        super(layout ?? new Layout());
    }
    _build(builder) {
        super._build(builder);
        const record = builder.tryGetCadObject(this.paperSpaceBlockHandle);
        if (record) {
            this.cadObject.associatedBlock = record;
        }
        const viewportHandle = this.activeViewportHandle ?? this.lasActiveViewportHandle;
        const viewport = builder.tryGetCadObject(viewportHandle);
        if (viewport instanceof Viewport) {
            this.cadObject.lastActiveViewport = viewport;
        }
        const ucs = builder.tryGetCadObject(this.baseUcsHandle);
        if (ucs) {
            this.cadObject.baseUCS = ucs;
        }
        const nameducs = builder.tryGetCadObject(this.namesUcsHandle);
        if (nameducs) {
            this.cadObject.ucs = nameducs;
        }
        for (const handle of this.viewportHandles) {
            const vp = builder.tryGetCadObject(handle);
        }
    }
}
//# sourceMappingURL=CadLayoutTemplate.js.map