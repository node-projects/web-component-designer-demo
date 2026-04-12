import {css, TRANSPARENCY_BG, rainbow} from './css.js';
import {baseCss} from './base.js';

export const nanoSheet = css`
${baseCss}

.pcr-app {
    width: 14.25em;
    max-width: 95vw;
}

.pcr-app .pcr-swatches {
    margin-top: 0.6em;
    padding: 0 0.6em;
}

.pcr-app .pcr-interaction {
    padding: 0 0.6em 0.6em 0.6em;
}

.pcr-app .pcr-selection {
    display: grid;
    grid-gap: 0.6em;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 5fr auto auto;
    align-items: center;
    height: 10.5em;
    width: 100%;
    align-self: flex-start;
}

.pcr-app .pcr-selection .pcr-color-preview {
    grid-area: 2 / 1 / 4 / 1;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-left: 0.6em;
}

.pcr-app .pcr-selection .pcr-color-preview .pcr-last-color {
    display: none;
}

.pcr-app .pcr-selection .pcr-color-preview .pcr-current-color {
    position: relative;
    background: var(--pcr-color);
    width: 2em;
    height: 2em;
    border-radius: 50em;
    overflow: hidden;
}

.pcr-app .pcr-selection .pcr-color-preview .pcr-current-color::before {
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

.pcr-app .pcr-selection .pcr-color-palette {
    grid-area: 1 / 1 / 2 / 3;
    width: 100%;
    height: 100%;
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

.pcr-app .pcr-selection .pcr-color-chooser {
    grid-area: 2 / 2 / 2 / 2;
}

.pcr-app .pcr-selection .pcr-color-opacity {
    grid-area: 3 / 2 / 3 / 2;
}

.pcr-app .pcr-selection .pcr-color-chooser,
.pcr-app .pcr-selection .pcr-color-opacity {
    height: 0.5em;
    margin: 0 0.6em;
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
