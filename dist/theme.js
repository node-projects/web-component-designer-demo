import { CodeViewMonaco } from '@node-projects/web-component-designer-codeview-monaco';
import { DesignerCanvas } from '@node-projects/web-component-designer';
// The editor theme must not alter native controls in authored documents.
DesignerCanvas.style.insertRule(':host { color-scheme: light; color: initial; }', DesignerCanvas.style.cssRules.length);
export const monacoTheme = () => document.documentElement.dataset.theme === 'dark' ? 'vs-dark' : 'vs';
// Monaco's theme is global, but each code view also retains its own theme option.
// Keep those options current so creating or refreshing a view preserves the choice.
export class ThemedCodeViewMonaco extends CodeViewMonaco {
    _updateTheme = () => { this.theme = monacoTheme(); };
    constructor() {
        super();
        this._updateTheme();
        window.addEventListener('demo-theme-change', this._updateTheme);
    }
    dispose() {
        window.removeEventListener('demo-theme-change', this._updateTheme);
        super.dispose();
    }
}
customElements.define('demo-themed-code-view-monaco', ThemedCodeViewMonaco);
