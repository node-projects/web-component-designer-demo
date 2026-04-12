import * as _ from './utils/utils.js';

const html = (s, ...v) => s[0] + v.map((val, i) => (val ?? '') + s[i + 1]).join('');

export default instance => {

    const {components, lockOpacity} = instance._config;
    const hidden = con => con ? '' : 'style="display:none" hidden';
    const t = str => instance._t(str);

    const root = _.createFromTemplate(html`
      <div :ref="app" class="pcr-app" aria-label="${t('ui:dialog')}" role="group">
        <div class="pcr-selection" ${hidden(components.palette)}>
          <div :obj="preview" class="pcr-color-preview" ${hidden(components.preview)}>
            <button type="button" :ref="lastColor" class="pcr-last-color" aria-label="${t('btn:last-color')}"></button>
            <div :ref="currentColor" class="pcr-current-color"></div>
          </div>

          <div :obj="palette" class="pcr-color-palette">
            <div :ref="palette" class="pcr-palette" tabindex="0" aria-label="${t('aria:palette')}" role="listbox"></div>
            <div :ref="picker" class="pcr-picker"></div>
          </div>

          <div :obj="hue" class="pcr-color-chooser" ${hidden(components.hue)}>
            <div :ref="slider" class="pcr-hue pcr-slider" tabindex="0" aria-label="${t('aria:hue')}" role="slider"></div>
            <div :ref="picker" class="pcr-picker"></div>
          </div>

          <div :obj="opacity" class="pcr-color-opacity" ${hidden(components.opacity)}>
            <div :ref="slider" class="pcr-opacity pcr-slider" tabindex="0" aria-label="${t('aria:opacity')}" role="slider"></div>
            <div :ref="picker" class="pcr-picker"></div>
          </div>
        </div>

        <div class="pcr-swatches ${components.palette ? '' : 'pcr-last'}" :ref="swatches"></div>

        <div :obj="interaction" class="pcr-interaction" ${hidden(Object.keys(components.interaction).length)}>
          <input :ref="result" class="pcr-result" type="text" spellcheck="false" ${hidden(components.interaction.input)} aria-label="${t('aria:input')}">

          <input :arr="options" class="pcr-type" data-type="HEXA" value="${lockOpacity ? 'HEX' : 'HEXA'}" type="button" ${hidden(components.interaction.hex)}>
          <input :arr="options" class="pcr-type" data-type="RGBA" value="${lockOpacity ? 'RGB' : 'RGBA'}" type="button" ${hidden(components.interaction.rgba)}>
          <input :arr="options" class="pcr-type" data-type="HSLA" value="${lockOpacity ? 'HSL' : 'HSLA'}" type="button" ${hidden(components.interaction.hsla)}>
          <input :arr="options" class="pcr-type" data-type="HSVA" value="${lockOpacity ? 'HSV' : 'HSVA'}" type="button" ${hidden(components.interaction.hsva)}>
          <input :arr="options" class="pcr-type" data-type="CMYK" value="CMYK" type="button" ${hidden(components.interaction.cmyk)}>

          <input :ref="save" class="pcr-save" value="${t('btn:save')}" type="button" ${hidden(components.interaction.save)} aria-label="${t('aria:btn:save')}">
          <input :ref="cancel" class="pcr-cancel" value="${t('btn:cancel')}" type="button" ${hidden(components.interaction.cancel)} aria-label="${t('aria:btn:cancel')}">
          <input :ref="clear" class="pcr-clear" value="${t('btn:clear')}" type="button" ${hidden(components.interaction.clear)} aria-label="${t('aria:btn:clear')}">
        </div>
      </div>
    `);

    const int = root.interaction;
    if (int) {
        int.options.find(o => !o.hidden && !o.classList.add('active'));
        int.type = () => int.options.find(e => e.classList.contains('active'));
    }
    return root;
};
