import {css, TRANSPARENCY_BG, rainbow} from './css.js';
import {baseCss} from './base.js';

export const monolithSheet = css`
${baseCss}

.pcr-app {
    width: 14.25em;
    max-width: 95vw;
    padding: 0.8em;
}

.pcr-app .pcr-selection {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
}

.pcr-app .pcr-selection .pcr-color-preview {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 1em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0.5em;
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
    transition: background-color 0.3s, box-shadow 0.3s;
    border-radius: 0.15em 0 0 0.15em;
    z-index: 2;
}

.pcr-app .pcr-selection .pcr-color-preview .pcr-current-color {
    border-radius: 0 0.15em 0.15em 0;
}

.pcr-app .pcr-selection .pcr-color-preview .pcr-last-color,
.pcr-app .pcr-selection .pcr-color-preview .pcr-current-color {
    background: var(--pcr-color);
    width: 50%;
    height: 100%;
}

.pcr-app .pcr-selection .pcr-color-palette {
    width: 100%;
    height: 8em;
    z-index: 1;
}

.pcr-app .pcr-selection .pcr-color-palette .pcr-palette {
    position: relative;
    border-radius: 0.15em;
    width: 100%;
    height: 100%;
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
    height: 0.5em;
    margin-top: 0.75em;
}

.pcr-app .pcr-selection .pcr-color-chooser .pcr-picker,
.pcr-app .pcr-selection .pcr-color-opacity .pcr-picker {
    top: 50%;
    transform: translateY(-50%);
}

.pcr-app .pcr-selection .pcr-color-chooser .pcr-slider,
.pcr-app .pcr-selection .pcr-color-opacity .pcr-slider {
    flex-grow: 1;
    border-radius: 50em;
}

.pcr-app .pcr-selection .pcr-color-chooser .pcr-slider {
    background: ${rainbow('to right')};
}

.pcr-app .pcr-selection .pcr-color-opacity .pcr-slider {
    background: linear-gradient(to right, transparent, black), ${TRANSPARENCY_BG};
    background-size: 100%, 0.25em;
}
`;
