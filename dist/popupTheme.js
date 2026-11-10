import { AbstractBaseToolPopup, DraggableToolWindow } from '@node-projects/web-component-designer';
// Tool windows share this public base stylesheet. More specific selectors cover
// the literal hover/selection colors still present in the 1.1 content sheets.
const style = DraggableToolWindow.style;
for (const rule of [
    '.window-content .layer-list li { color: var(--wcd-color-text); }',
    '.window-content .layer-list li:hover { background: var(--wcd-color-surface-hover); }',
    '.window-content .layer-list li.selected { background: var(--wcd-color-surface-hover); color: var(--wcd-color-text); box-shadow: inset 3px 0 var(--wcd-color-accent); }',
    '.window-content :is(.layer-buttons, .stop-actions, .actions) button:hover, .window-content .apply-btn:hover { background: var(--wcd-color-surface-hover); color: var(--wcd-color-text); }',
    '.window-content .apply-btn { background: var(--wcd-color-surface-hover); color: var(--wcd-color-text); }',
])
    style.insertRule(rule, style.cssRules.length);
// Drawing popups live inside the canvas, which intentionally uses light controls.
// Restore the application theme for the tools without changing authored content.
const toolPopupStyle = AbstractBaseToolPopup.style;
for (const rule of [
    ':host { color-scheme: var(--demo-color-scheme); }',
    'input, select, button:not(.tool) { background: var(--wcd-input-background-color); color: var(--wcd-color-text); border: 1px solid var(--wcd-color-border); }',
    'button:not(.tool):hover { background: var(--wcd-color-surface-hover); }',
    ':is(input, select, button):focus-visible { outline: 2px solid var(--wcd-color-focus); outline-offset: -2px; }',
])
    toolPopupStyle.insertRule(rule, toolPopupStyle.cssRules.length);
