import { showPopup, ValueType, w3color } from "@node-projects/web-component-designer";
import "@node-projects/pickr-webcomponent";
import { BaseCustomWebComponentConstructorAppend } from "@node-projects/base-custom-webcomponent";

type PickrRgba = [number, number, number, number] & {
    toString: (precision?: number) => string;
};

type PickrColor = {
    toRGBA(): PickrRgba;
};

type PickrSaveEvent = CustomEvent<{
    value: PickrColor | null;
}>;

type PickrElement = HTMLElement & {
    config: {
        default?: string;
        swatches?: string[];
        components?: {
            preview?: boolean;
            opacity?: boolean;
            hue?: boolean;
            interaction?: {
                hex?: boolean;
                rgba?: boolean;
                hsla?: boolean;
                hsva?: boolean;
                input?: boolean;
                cancel?: boolean;
                save?: boolean;
            };
        };
    };
    setColor(value: string | null, silent?: boolean): boolean;
};

export class DemoColorEditor extends BaseCustomWebComponentConstructorAppend{
    private static readonly _defaultColor = '#000000';
   
    private _colorValue: string | null = null;
    private _valueLabel: HTMLSpanElement;
    private _swatchFill: HTMLSpanElement;
    private static _closePopup?: () => void;

    constructor(private changedCallback: (newValue: any) => void) {
        super();

        const element = document.createElement('button');
        element.type = 'button';
        element.style.display = 'grid';
        element.style.gridTemplateColumns = '18px minmax(0, 1fr)';
        element.style.alignItems = 'center';
        element.style.gap = '8px';
        element.style.width = '100%';
        element.style.minHeight = '24px';
        element.style.padding = '2px 6px';
        element.style.border = '1px solid var(--input-border-color, #596c7a)';
        element.style.background = 'transparent';
        element.style.color = 'inherit';
        //element.style.cursor = property.readonly ? 'default' : 'pointer';
        element.style.textAlign = 'left';

        const swatch = document.createElement('span');
        swatch.style.position = 'relative';
        swatch.style.display = 'block';
        swatch.style.width = '16px';
        swatch.style.height = '16px';
        swatch.style.borderRadius = '3px';
        swatch.style.overflow = 'hidden';
        swatch.style.border = '1px solid gray';

        this._swatchFill = document.createElement('span');
        this._swatchFill.style.position = 'absolute';
        this._swatchFill.style.inset = '0';
        swatch.appendChild(this._swatchFill);

        this._valueLabel = document.createElement('span');
        this._valueLabel.style.overflow = 'hidden';
        this._valueLabel.style.textOverflow = 'ellipsis';
        this._valueLabel.style.whiteSpace = 'nowrap';

        element.append(swatch, this._valueLabel);

        //if (property.readonly)
        //    element.disabled = true;
        //else
            element.onclick = () => { void this._openPopup(); };

        this.shadowRoot.appendChild(element);
        this._applyDisplayValue(null);
    }

    refreshValue(valueType: ValueType, value: any) {
        this._colorValue = value ? String(value) : null;
        this._applyDisplayValue(this._colorValue);
    }

    private async _openPopup() {
        const pickrElement = this.ownerDocument.createElement('pickr-classic') as PickrElement;
        pickrElement.config = {
            default: this._colorValue ?? DemoColorEditor._defaultColor,
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    hsva: true,
                    input: true,
                    cancel: true,
                    save: true
                }
            }
        };

        //pickrElement.setColor(this._colorValue ?? TsColorPropertyEditor._defaultColor, true);
        pickrElement.addEventListener('save', (event) => void this._handlePickrSave(event as PickrSaveEvent));
        pickrElement.addEventListener('cancel', () => { void this._closePopup(true); });

        DemoColorEditor._closePopup = showPopup(pickrElement, this, () => { void this._closePopup(true); });
    }

    private async _handlePickrSave(event: PickrSaveEvent) {
        let nextValue
        if (event.detail.value !== null) {
            nextValue = this._formatColor(event.detail.value);
        }
        this._colorValue = <any>nextValue;
        this._applyDisplayValue(nextValue!);
        this.changedCallback(nextValue);
        await this._closePopup(false);
    }

    public get value() {
        return this._colorValue;
    }
    public set value(v: string | null) {
        this._colorValue = v;
        this._applyDisplayValue(v);
    }

    private async _closePopup(removePreview: boolean) {
        DemoColorEditor._closePopup?.();
        DemoColorEditor._closePopup = undefined;
    }


    private _applyDisplayValue(value: string | null) {
        const displayValue = value ?? DemoColorEditor._defaultColor;
        this._valueLabel.textContent = value ?? DemoColorEditor._defaultColor;
        this._valueLabel.title = value ?? DemoColorEditor._defaultColor;
        this._swatchFill.style.background = displayValue;
    }

    private _formatColor(color: PickrColor) {
        const rgba = color.toRGBA();
        if (rgba[3] < 0.999)
            return rgba.toString(3);
        try {
            return w3color.toColorObject(rgba.toString()).toNameOrHexString();
        } catch {
            return rgba.toString();
        }
    }
}
customElements.define('demo-color-editor', DemoColorEditor);