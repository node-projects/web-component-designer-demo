import { MLineStyle } from '../../Objects/MLineStyle.js';
import { LineType } from '../../Tables/LineType.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
export class CadMLineStyleTemplate extends CadTemplateT {
    elementTemplates = [];
    constructor(mlStyle) {
        super(mlStyle ?? new MLineStyle());
    }
    _build(builder) {
        super._build(builder);
        for (const item of this.elementTemplates) {
            item.build(builder);
        }
    }
}
(function (CadMLineStyleTemplate) {
    class ElementTemplate {
        element;
        lineTypeHandle = null;
        linetypeIndex = null;
        lineTypeName = null;
        constructor(element) {
            this.element = element;
        }
        build(builder) {
            let lt = builder.tryGetCadObject(this.lineTypeHandle);
            if (lt) {
                this.element.lineType = lt;
            }
            else {
                lt = builder.tryGetTableEntry(this.lineTypeName ?? '');
                if (lt) {
                    this.element.lineType = lt;
                }
                else if (this.linetypeIndex != null) {
                    if (this.linetypeIndex === 0x7FFF) {
                        const bylayer = builder.tryGetTableEntry(LineType.byLayerName);
                        if (bylayer) {
                            this.element.lineType = bylayer;
                        }
                    }
                    else if (this.linetypeIndex === 0x7FFE) {
                        const byblock = builder.tryGetTableEntry(LineType.byBlockName);
                        if (byblock) {
                            this.element.lineType = byblock;
                        }
                    }
                    else {
                        try {
                            const lineTypes = builder.lineTypesTable;
                            if (lineTypes) {
                                const arr = Array.from(lineTypes);
                                if (this.linetypeIndex < arr.length) {
                                    this.element.lineType = arr[this.linetypeIndex];
                                }
                            }
                        }
                        catch (ex) {
                            builder.notify(`Linetype not assigned, index ${this.linetypeIndex}`, NotificationType.Error, ex instanceof Error ? ex : null);
                        }
                    }
                }
            }
        }
    }
    CadMLineStyleTemplate.ElementTemplate = ElementTemplate;
})(CadMLineStyleTemplate || (CadMLineStyleTemplate = {}));
//# sourceMappingURL=CadMLineStyleTemplate.js.map