import { showPopup, w3color } from "@node-projects/web-component-designer";
import "@node-projects/pickr-webcomponent";
import { BaseCustomWebComponentConstructorAppend } from "@node-projects/base-custom-webcomponent";
export class DemoColorEditor extends BaseCustomWebComponentConstructorAppend {
    changedCallback;
    static _defaultColor = '#000000';
    _colorValue = null;
    _valueLabel;
    _swatchFill;
    static _closePopup;
    constructor(changedCallback) {
        super();
        this.changedCallback = changedCallback;
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
    refreshValue(valueType, value) {
        this._colorValue = value ? String(value) : null;
        this._applyDisplayValue(this._colorValue);
    }
    async _openPopup() {
        const pickrElement = this.ownerDocument.createElement('pickr-classic');
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
        pickrElement.addEventListener('save', (event) => void this._handlePickrSave(event));
        pickrElement.addEventListener('cancel', () => { void this._closePopup(true); });
        DemoColorEditor._closePopup = showPopup(pickrElement, this, () => { void this._closePopup(true); });
    }
    async _handlePickrSave(event) {
        let nextValue;
        if (event.detail.value !== null) {
            nextValue = this._formatColor(event.detail.value);
        }
        this._colorValue = nextValue;
        this._applyDisplayValue(nextValue);
        this.changedCallback(nextValue);
        await this._closePopup(false);
    }
    get value() {
        return this._colorValue;
    }
    set value(v) {
        this._colorValue = v;
        this._applyDisplayValue(v);
    }
    async _closePopup(removePreview) {
        DemoColorEditor._closePopup?.();
        DemoColorEditor._closePopup = undefined;
    }
    _applyDisplayValue(value) {
        const displayValue = value ?? DemoColorEditor._defaultColor;
        this._valueLabel.textContent = value ?? DemoColorEditor._defaultColor;
        this._valueLabel.title = value ?? DemoColorEditor._defaultColor;
        this._swatchFill.style.background = displayValue;
    }
    _formatColor(color) {
        const rgba = color.toRGBA();
        if (rgba[3] < 0.999)
            return rgba.toString(3);
        try {
            return w3color.toColorObject(rgba.toString()).toNameOrHexString();
        }
        catch {
            return rgba.toString();
        }
    }
}
customElements.define('demo-color-editor', DemoColorEditor);
