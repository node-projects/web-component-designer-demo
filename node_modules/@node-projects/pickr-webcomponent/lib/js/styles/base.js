import {cssString, TRANSPARENCY_BG} from './css.js';

// Shared base styles for every pickr web component, inlined into each theme
// sheet so the component owns a single CSSStyleSheet.
export const baseCss = cssString`
:host {
    display: inline-block;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
    color: #75797e;
}

*,
*::before,
*::after {
    box-sizing: border-box;
    outline: none;
    border: none;
    -webkit-appearance: none;
}

input:focus,
input.pcr-active,
button:focus,
button.pcr-active {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85), 0 0 0 3px var(--pcr-color);
}

.pcr-palette,
.pcr-slider {
    transition: box-shadow 0.3s;
}

.pcr-palette:focus,
.pcr-slider:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85), 0 0 0 3px rgba(0, 0, 0, 0.25);
}

.pcr-app {
    display: flex;
    flex-direction: column;
    border-radius: 0.1em;
    background: #fff;
    box-shadow: 0 0.15em 1.5em 0 rgba(0, 0, 0, 0.1), 0 0 1em 0 rgba(0, 0, 0, 0.03);
}

.pcr-swatches {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.75em;
}

.pcr-swatches.pcr-last {
    margin: 0;
}

@supports (display: grid) {
    .pcr-swatches {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(auto-fit, 1.75em);
    }
}

.pcr-swatches > button {
    font-size: 1em;
    position: relative;
    width: calc(1.75em - 5px);
    height: calc(1.75em - 5px);
    border-radius: 0.15em;
    cursor: pointer;
    margin: 2.5px;
    flex-shrink: 0;
    justify-self: center;
    transition: all 0.15s;
    overflow: hidden;
    background: transparent;
    z-index: 1;
}

.pcr-swatches > button::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${TRANSPARENCY_BG};
    background-size: 6px;
    border-radius: 0.15em;
    z-index: -1;
}

.pcr-swatches > button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--pcr-color);
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 0.15em;
    box-sizing: border-box;
}

.pcr-swatches > button:hover {
    filter: brightness(1.05);
}

.pcr-swatches > button:not(.pcr-active) {
    box-shadow: none;
}

.pcr-interaction {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 -0.2em;
}

.pcr-interaction > * {
    margin: 0 0.2em;
}

.pcr-interaction input {
    letter-spacing: 0.07em;
    font-size: 0.75em;
    text-align: center;
    cursor: pointer;
    color: #75797e;
    background: #f1f3f4;
    border-radius: 0.15em;
    transition: all 0.15s;
    padding: 0.45em 0.5em;
    margin-top: 0.75em;
}

.pcr-interaction input:hover {
    filter: brightness(0.975);
}

.pcr-interaction input:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85), 0 0 0 3px rgba(66, 133, 244, 0.75);
}

.pcr-interaction .pcr-result {
    color: #75797e;
    text-align: left;
    flex: 1 1 8em;
    min-width: 8em;
    transition: all 0.2s;
    border-radius: 0.15em;
    background: #f1f3f4;
    cursor: text;
}

.pcr-interaction .pcr-result::selection {
    background: #4285f4;
    color: #fff;
}

.pcr-interaction .pcr-type.active {
    color: #fff;
    background: #4285f4;
}

.pcr-interaction .pcr-save,
.pcr-interaction .pcr-cancel,
.pcr-interaction .pcr-clear {
    color: #fff;
    width: auto;
}

.pcr-interaction .pcr-save:hover,
.pcr-interaction .pcr-cancel:hover,
.pcr-interaction .pcr-clear:hover {
    filter: brightness(0.925);
}

.pcr-interaction .pcr-save {
    background: #4285f4;
}

.pcr-interaction .pcr-clear,
.pcr-interaction .pcr-cancel {
    background: #f44250;
}

.pcr-interaction .pcr-clear:focus,
.pcr-interaction .pcr-cancel:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85), 0 0 0 3px rgba(244, 66, 80, 0.75);
}

.pcr-selection .pcr-picker {
    position: absolute;
    height: 18px;
    width: 18px;
    border: 2px solid #fff;
    border-radius: 100%;
    user-select: none;
}

.pcr-selection .pcr-color-palette,
.pcr-selection .pcr-color-chooser,
.pcr-selection .pcr-color-opacity {
    position: relative;
    user-select: none;
    display: flex;
    flex-direction: column;
    cursor: grab;
}

.pcr-selection .pcr-color-palette:active,
.pcr-selection .pcr-color-chooser:active,
.pcr-selection .pcr-color-opacity:active {
    cursor: grabbing;
}
`;
