import * as _ from './utils/utils.js';
import {parseToHSVA} from './utils/color.js';
import {HSVaColor} from './utils/hsvacolor.js';
import Moveable from './libs/moveable.js';
import Selectable from './libs/selectable.js';
import buildTemplate from './template.js';
import { cssString } from './styles/css.js';

const I18N_DEFAULTS = {
    'ui:dialog': 'color picker dialog',
    'btn:swatch': 'color swatch',
    'btn:last-color': 'use previous color',
    'btn:save': 'Save',
    'btn:cancel': 'Cancel',
    'btn:clear': 'Clear',
    'aria:btn:save': 'save and close',
    'aria:btn:cancel': 'cancel and close',
    'aria:btn:clear': 'clear and close',
    'aria:input': 'color input field',
    'aria:palette': 'color selection area',
    'aria:hue': 'hue selection slider',
    'aria:opacity': 'opacity selection slider'
};

const DEFAULT_CONFIG = {
    comparison: true,
    outputPrecision: 0,
    lockOpacity: false,
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            input: true,
            cancel: true,
            clear: true,
            save: true
        }
    },
    i18n: {},
    swatches: null,
    sliders: null,
    default: '#42445a',
    defaultRepresentation: null,
    adjustableNumbers: true
};

// Attribute name -> config path/parser. Attributes are merged into _config
// on attributeChangedCallback. Boolean attrs follow HTML conventions: an
// explicit "false" disables defaults that are true; presence implies true.
const ATTRIBUTE_MAP = {
    'default':                v => ({default: v}),
    'default-representation': v => ({defaultRepresentation: v}),
    'comparison':             v => ({comparison: v !== 'false'}),
    'lock-opacity':           v => ({lockOpacity: v !== null && v !== 'false'}),
    'output-precision':       v => ({outputPrecision: Number(v) || 0}),
    'adjustable-numbers':     v => ({adjustableNumbers: v !== 'false'}),
    'sliders':                v => ({sliders: v}),
    'swatches':               v => ({swatches: v ? v.split(/\s*,\s*/).filter(Boolean) : null}),
    'components':             v => ({components: v ? JSON.parse(v) : undefined}),
    'i18n':                   v => ({i18n: v ? JSON.parse(v) : undefined})
};

const cloneDefaults = () => ({
    ...DEFAULT_CONFIG,
    components: {
        ...DEFAULT_CONFIG.components,
        interaction: {...DEFAULT_CONFIG.components.interaction}
    },
    i18n: {...DEFAULT_CONFIG.i18n}
});

export class PickrElement extends HTMLElement {

    static I18N_DEFAULTS = I18N_DEFAULTS;
    static DEFAULT_CONFIG = DEFAULT_CONFIG;

    // Subclasses override with their own constructed CSSStyleSheet.
    static styleSheet = null;

    // Layout hint passed to sliders ('v' for classic, 'h' for monolith/nano).
    static defaultSliders = 'v';

    static observedAttributes = Object.keys(ATTRIBUTE_MAP);

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this._config = cloneDefaults();
        this._color = HSVaColor();
        this._lastColor = HSVaColor();
        this._swatchColors = [];
        this._eventBindings = [];
        this._recalc = true;
        this._initializingActive = true;
        this._built = false;
    }

    get config() {
        return this._config;
    }

    set config(c) {
        this._mergeConfig(c || {});
    }

    _mergeConfig(patch) {
        const curr = this._config;
        const next = {...curr, ...patch};

        if (patch.components || curr.components) {
            const currComp = curr.components || {};
            const patchComp = patch.components || {};
            next.components = {
                ...currComp,
                ...patchComp,
                interaction: {
                    ...(currComp.interaction || {}),
                    ...(patchComp.interaction || {})
                }
            };
        }

        if (patch.i18n) {
            next.i18n = {...(curr.i18n || {}), ...patch.i18n};
        }

        this._config = next;

        if (this._built) {
            this._teardown();
            this._build();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        const parser = ATTRIBUTE_MAP[name];
        if (!parser) return;

        try {
            const patch = parser(newValue);
            if (patch) this._mergeConfig(patch);
        } catch (e) {
            console.warn(`[pickr] invalid value for attribute "${name}":`, newValue, e);
        }
    }

    connectedCallback() {
        if (!this._built) {
            this._build();
        }
    }

    disconnectedCallback() {
        this._teardown();
    }

    _applyStyleSheet() {
        const sheet = this.constructor.styleSheet;
        if (sheet) {
            this.shadowRoot.adoptedStyleSheets = [sheet];
        }
    }

    _normalizeConfig() {
        const opt = this._config;
        const components = opt.components = {interaction: {}, ...opt.components};
        if (!components.interaction) {
            components.interaction = {};
        }
        const {preview, opacity, hue, palette} = components;
        components.opacity = (!opt.lockOpacity && opacity);
        components.palette = palette || preview || opacity || hue;

        if (!opt.sliders) {
            opt.sliders = this.constructor.defaultSliders;
        }
    }

    _build() {
        this._applyStyleSheet();
        this._normalizeConfig();

        this._root = buildTemplate(this);
        this.shadowRoot.appendChild(this._root.app);

        this._buildComponents();
        this._bindEvents();

        const {swatches} = this._config;
        if (swatches && swatches.length) {
            swatches.forEach(color => this.addSwatch(color));
        }

        this._built = true;

        const opt = this._config;
        const app = this._root.app;
        const init = () => {
            if (!app.offsetWidth) {
                this._setupAnimationFrame = requestAnimationFrame(init);
                return;
            }
            this.setColor(opt.default);
            if (opt.defaultRepresentation) {
                this._representation = opt.defaultRepresentation;
                this.setColorRepresentation(this._representation);
            }
            this._initializingActive = false;
            this._emit('init');
        };
        this._setupAnimationFrame = requestAnimationFrame(init);
    }

    _teardown() {
        if (!this._built) return;

        cancelAnimationFrame(this._setupAnimationFrame);

        this._eventBindings.forEach(args => _.off(...args));
        this._eventBindings = [];

        if (this._components) {
            Object.values(this._components).forEach(c => c.destroy && c.destroy());
            this._components = null;
        }

        this.shadowRoot.replaceChildren();
        this._swatchColors = [];
        this._root = null;
        this._built = false;
        this._initializingActive = true;
        this._recalc = true;
    }

    _buildComponents() {
        const inst = this;
        const cs = this._config.components;
        const sliders = (inst._config.sliders || 'v').repeat(2);
        const [so, sh] = sliders.match(/^[vh]+$/g) ? sliders : [];

        const getColor = () =>
            this._color || (this._color = this._lastColor.clone());

        const components = {

            palette: Moveable({
                element: inst._root.palette.picker,
                wrapper: inst._root.palette.palette,
                activeRoot: inst.shadowRoot,

                onstop: () => inst._emit('changestop', 'slider'),
                onchange(x, y) {
                    if (!cs.palette) return;

                    const color = getColor();
                    const {_root, _config: options} = inst;
                    const {lastColor, currentColor} = _root.preview;

                    if (inst._recalc) {
                        color.s = x * 100;
                        color.v = 100 - y * 100;
                        color.v < 0 ? color.v = 0 : 0;
                        inst._updateOutput('slider');
                    }

                    const cssRGBaString = color.toRGBA().toString(0);
                    this.element.style.background = cssRGBaString;
                    this.wrapper.style.background = `linear-gradient(to top, rgba(0, 0, 0, ${color.a}), transparent), linear-gradient(to left, hsla(${color.h}, 100%, 50%, ${color.a}), rgba(255, 255, 255, ${color.a}))`;

                    if (!options.comparison) {
                        lastColor.style.setProperty('--pcr-color', cssRGBaString);
                    } else if (!inst._lastColor) {
                        lastColor.style.setProperty('--pcr-color', cssRGBaString);
                    }

                    const hexa = color.toHEXA().toString();
                    for (const {el, color: sc} of inst._swatchColors) {
                        el.classList[hexa === sc.toHEXA().toString() ? 'add' : 'remove']('pcr-active');
                    }

                    currentColor.style.setProperty('--pcr-color', cssRGBaString);
                }
            }),

            hue: Moveable({
                lock: sh === 'v' ? 'h' : 'v',
                element: inst._root.hue.picker,
                wrapper: inst._root.hue.slider,
                activeRoot: inst.shadowRoot,

                onstop: () => inst._emit('changestop', 'slider'),
                onchange(v) {
                    if (!cs.hue || !cs.palette) return;

                    const color = getColor();
                    if (inst._recalc) {
                        color.h = v * 360;
                    }

                    this.element.style.backgroundColor = `hsl(${color.h}, 100%, 50%)`;
                    components.palette.trigger();
                }
            }),

            opacity: Moveable({
                lock: so === 'v' ? 'h' : 'v',
                element: inst._root.opacity.picker,
                wrapper: inst._root.opacity.slider,
                activeRoot: inst.shadowRoot,

                onstop: () => inst._emit('changestop', 'slider'),
                onchange(v) {
                    if (!cs.opacity || !cs.palette) return;

                    const color = getColor();
                    if (inst._recalc) {
                        color.a = Math.round(v * 1e2) / 100;
                    }

                    this.element.style.background = `rgba(0, 0, 0, ${color.a})`;
                    components.palette.trigger();
                }
            }),

            selectable: Selectable({
                elements: inst._root.interaction.options,
                className: 'active',

                onchange(e) {
                    inst._representation = e.target.getAttribute('data-type').toUpperCase();
                    inst._recalc && inst._updateOutput('swatch');
                }
            })
        };

        this._components = components;
    }

    _bindEvents() {
        const {_root, _config: options} = this;

        const eventBindings = [

            _.on(_root.interaction.clear, 'click', () => this._clearColor()),

            _.on([
                _root.interaction.cancel,
                _root.preview.lastColor
            ], 'click', () => {
                this.setHSVA(...(this._lastColor || this._color).toHSVA(), true);
                this._emit('cancel');
            }),

            _.on(_root.interaction.save, 'click', () => {
                this.applyColor();
            }),

            _.on(_root.interaction.result, ['keyup', 'input'], e => {
                if (this.setColor(e.target.value, true) && !this._initializingActive) {
                    this._emit('change', {color: this._color, source: 'input'});
                    this._emit('changestop', 'input');
                }
                e.stopImmediatePropagation();
            }),

            _.on(_root.interaction.result, ['focus', 'blur'], e => {
                this._recalc = e.type === 'blur';
                this._recalc && this._updateOutput(null);
            }),

            _.on([
                _root.palette.palette,
                _root.palette.picker,
                _root.hue.slider,
                _root.hue.picker,
                _root.opacity.slider,
                _root.opacity.picker
            ], ['mousedown', 'touchstart'], () => this._recalc = true, {passive: true})
        ];

        if (options.adjustableNumbers) {
            const ranges = {
                rgba: [255, 255, 255, 1],
                hsva: [360, 100, 100, 1],
                hsla: [360, 100, 100, 1],
                cmyk: [100, 100, 100, 100]
            };

            _.adjustableInputNumbers(_root.interaction.result, (o, step, index) => {
                const range = ranges[this.getColorRepresentation().toLowerCase()];
                if (range) {
                    const max = range[index];
                    const nv = o + (max >= 100 ? step * 1000 : step);
                    return nv <= 0 ? 0 : Number((nv < max ? nv : max).toPrecision(3));
                }
                return o;
            });
        }

        this._eventBindings = eventBindings;
    }

    _updateOutput(eventSource) {
        const {_root, _color, _config: options} = this;

        if (_root.interaction.type()) {
            const method = `to${_root.interaction.type().getAttribute('data-type')}`;
            _root.interaction.result.value = typeof _color[method] === 'function' ?
                _color[method]().toString(options.outputPrecision) : '';
        }

        if (!this._initializingActive && this._recalc) {
            this._emit('change', {color: _color, source: eventSource});
        }
    }

    _clearColor(silent = false) {
        this._lastColor = null;
        const {lastColor} = this._root.preview;
        lastColor.style.setProperty('--pcr-color', 'rgba(0, 0, 0, 0.15)');

        if (!this._initializingActive && !silent) {
            this._emit('save', null);
            this._emit('clear');
        }
    }

    _parseLocalColor(str) {
        const {values, type, a} = parseToHSVA(str);
        const {lockOpacity} = this._config;
        const alphaMakesAChange = a !== undefined && a !== 1;

        if (values && values.length === 3) {
            values[3] = undefined;
        }

        return {
            values: (!values || (lockOpacity && alphaMakesAChange)) ? null : values,
            type
        };
    }

    _t(key) {
        return this._config.i18n[key] || I18N_DEFAULTS[key];
    }

    _emit(event, detail) {
        this.dispatchEvent(new CustomEvent(event, {
            detail: {value: detail, instance: this},
            bubbles: true,
            composed: true
        }));
    }

    addSwatch(color) {
        const {values} = this._parseLocalColor(color);

        if (values) {
            const {_swatchColors, _root} = this;
            const parsed = HSVaColor(...values);

            const el = _.createElementFromString(
                `<button type="button" style="--pcr-color: ${parsed.toRGBA().toString(0)}" aria-label="${this._t('btn:swatch')}"/>`
            );

            _root.swatches.appendChild(el);
            _swatchColors.push({el, color: parsed});

            this._eventBindings.push(
                _.on(el, 'click', () => {
                    this.setHSVA(...parsed.toHSVA(), true);
                    this._emit('swatchselect', parsed);
                    this._emit('change', {color: parsed, source: 'swatch'});
                })
            );

            return true;
        }

        return false;
    }

    removeSwatch(index) {
        const swatchColor = this._swatchColors[index];
        if (swatchColor) {
            this._root.swatches.removeChild(swatchColor.el);
            this._swatchColors.splice(index, 1);
            return true;
        }
        return false;
    }

    applyColor(silent = false) {
        const {preview} = this._root;
        const cssRGBaString = this._color.toRGBA().toString(0);
        preview.lastColor.style.setProperty('--pcr-color', cssRGBaString);

        this._lastColor = this._color.clone();

        if (!this._initializingActive && !silent) {
            this._emit('save', this._color);
        }

        return this;
    }

    setHSVA(h = 360, s = 0, v = 0, a = 1, silent = false) {
        const recalc = this._recalc;
        this._recalc = false;

        if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100 || a < 0 || a > 1) {
            return false;
        }

        this._color = HSVaColor(h, s, v, a);

        const {hue, opacity, palette} = this._components;
        hue.update((h / 360));
        opacity.update(a);
        palette.update(s / 100, 1 - (v / 100));

        if (!silent) {
            this.applyColor();
        }

        if (recalc) {
            this._updateOutput();
        }

        this._recalc = recalc;
        return true;
    }

    setColor(string, silent = false) {
        if (string === null) {
            this._clearColor(silent);
            return true;
        }

        const {values, type} = this._parseLocalColor(string);

        if (values) {
            const utype = type.toUpperCase();
            const {options} = this._root.interaction;
            const target = options.find(el => el.getAttribute('data-type') === utype);

            if (target && !target.hidden) {
                for (const el of options) {
                    el.classList[el === target ? 'add' : 'remove']('active');
                }
            }

            if (!this.setHSVA(...values, silent)) {
                return false;
            }

            return this.setColorRepresentation(utype);
        }

        return false;
    }

    setColorRepresentation(type) {
        type = type.toUpperCase();
        return !!this._root.interaction.options
            .find(v => v.getAttribute('data-type').startsWith(type) && !v.click());
    }

    getColorRepresentation() {
        return this._representation;
    }

    getColor() {
        return this._color;
    }

    getSelectedColor() {
        return this._lastColor;
    }

    getRoot() {
        return this._root;
    }
}
