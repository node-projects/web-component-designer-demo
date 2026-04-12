import {css, TRANSPARENCY_BG, rainbow} from './css.js';
import {baseCss} from './base.js';

export const classicSheet = css`
${baseCss}

.pcr-app {
    max-width: 95vw;
    padding: 0.8em;
}

.pcr-app .pcr-selection {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
}

.pcr-app .pcr-selection .pcr-color-preview {
    position: relative;
    z-index: 1;
    width: 2em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 0.75em;
}

.pcr-app .pcr-selection .pcr-color-preview::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${TRANSPARENCY_BG};
    background-size: 0.5em;
    border-radius: 0.15em;
    z-index: -1;
}

.pcr-app .pcr-selection .pcr-color-preview .pcr-last-color {
    cursor: pointer;
    border-radius: 0.15em 0.15em 0 0;
    z-index: 2;
}

.pcr-app .pcr-selection .pcr-color-preview .pcr-current-color {
    border-radius: 0 0 0.15em 0.15em;
}

.pcr-app .pcr-selection .pcr-color-preview .pcr-last-color,
.pcr-app .pcr-selection .pcr-color-preview .pcr-current-color {
    background: var(--pcr-color);
    width: 100%;
    height: 50%;
}

.pcr-app .pcr-selection .pcr-color-palette {
    width: 100%;
    height: 8em;
    z-index: 1;
}

.pcr-app .pcr-selection .pcr-color-palette .pcr-palette {
    position: relative;
    flex-grow: 1;
    border-radius: 0.15em;
}

.pcr-app .pcr-selection .pcr-color-palette .pcr-palette::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${TRANSPARENCY_BG};
    background-size: 0.5em;
    border-radius: 0.15em;
    z-index: -1;
}

.pcr-app .pcr-selection .pcr-color-chooser,
.pcr-app .pcr-selection .pcr-color-opacity {
    margin-left: 0.75em;
}

.pcr-app .pcr-selection .pcr-color-chooser .pcr-picker,
.pcr-app .pcr-selection .pcr-color-opacity .pcr-picker {
    left: 50%;
    transform: translateX(-50%);
}

.pcr-app .pcr-selection .pcr-color-chooser .pcr-slider,
.pcr-app .pcr-selection .pcr-color-opacity .pcr-slider {
    width: 8px;
    flex-grow: 1;
    border-radius: 50em;
}

.pcr-app .pcr-selection .pcr-color-chooser .pcr-slider {
    background: ${rainbow('to bottom')};
}

.pcr-app .pcr-selection .pcr-color-opacity .pcr-slider {
    background: linear-gradient(to bottom, transparent, black), ${TRANSPARENCY_BG};
    background-size: 100%, 50%;
}
`;
