import { DraggableToolWindow } from '@node-projects/web-component-designer';
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
