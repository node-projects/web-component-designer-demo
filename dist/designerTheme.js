import { css } from '@node-projects/base-custom-webcomponent';
import { CodeViewMonaco } from '@node-projects/web-component-designer-codeview-monaco';
import { DesignerCanvas, DesignerToolbarButton, DebugView } from '@node-projects/web-component-designer';
export function getMonacoTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'wcd-demo-dark' : 'vs';
}
const monaco = await CodeViewMonaco.getMonacoLib();
monaco.editor.defineTheme('wcd-demo-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
        'editor.background': '#212121',
        'editor.foreground': '#ececec',
        'editorLineNumber.foreground': '#a5a5a5',
        'editor.selectionBackground': '#404040',
        'editor.inactiveSelectionBackground': '#343434',
        'editor.lineHighlightBorder': '#383838',
        'editorCursor.foreground': '#f0f0f0'
    }
});
const updateMonacoTheme = () => monaco.editor.setTheme(getMonacoTheme());
window.addEventListener('wcd-demo-theme-change', updateMonacoTheme);
// Third-party dialogs can create editors with their own default theme.
monaco.editor.onDidCreateEditor(updateMonacoTheme);
updateMonacoTheme();
// The upstream toolbar has no icon-color token; extend its shared stylesheet.
DesignerToolbarButton.style.insertRule('img { filter: var(--demo-tool-icon-filter, none); }', DesignerToolbarButton.style.cssRules.length);
// Authored screens keep their native control appearance and default text color.
DesignerCanvas.style.insertRule(':host { color-scheme: light; color: initial; }', DesignerCanvas.style.cssRules.length);
export class DesignerCodeView extends CodeViewMonaco {
    updateTheme = () => { this.theme = getMonacoTheme(); };
    connectedCallback() {
        this.updateTheme();
        window.addEventListener('wcd-demo-theme-change', this.updateTheme);
    }
    disconnectedCallback() {
        window.removeEventListener('wcd-demo-theme-change', this.updateTheme);
    }
}
customElements.define('demo-code-view', DesignerCodeView);
export const treeTheme = css `
    div.wunderbaum {
      --wb-node-text-color: var(--demo-text);
      --wb-background-color: var(--demo-surface);
      --wb-border-color: var(--demo-border);
      --wb-focus-border-color: var(--demo-accent);
      --wb-hover-color: var(--demo-hover);
      --wb-hover-border-color: var(--demo-hover);
      --wb-active-color: var(--demo-pressed);
      --wb-active-border-color: var(--demo-accent);
      --wb-active-hover-color: var(--demo-hover);
      --wb-active-hover-border-color: var(--demo-accent);
      --wb-active-color-grayscale: var(--demo-selected);
      --wb-active-border-color-grayscale: var(--demo-border);
      --wb-active-hover-color-grayscale: var(--demo-hover);
      --wb-alternate-row-color: var(--demo-subtle);
      --wb-alternate-row-color-hover: var(--demo-hover);
    }

    .cmd {
      background: var(--demo-surface);
    }

    .cmd img,
    .wb-icon,
    .wb-expander {
      filter: var(--demo-icon-filter, none);
    }

    #input {
      color: var(--demo-text);
      background: var(--demo-surface);
      border: 1px solid var(--demo-input-border);
    }

    /* The upstream outline toolbar uses inline colors. */
    #input + div {
      background: var(--demo-subtle) !important;
      border-color: var(--demo-border) !important;
      fill: var(--demo-text);
    }
  `;
DebugView.style.insertRule('table tr:nth-child(even) { background: var(--demo-subtle); }', DebugView.style.cssRules.length);
