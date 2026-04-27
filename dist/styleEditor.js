import { BaseCustomWebComponentConstructorAppend, css, html } from "@node-projects/base-custom-webcomponent";
export class StyleEditor extends BaseCustomWebComponentConstructorAppend {
    static style = css `
        :host {
            display: block;
            height: 100%;
            width: 100%;
        }

        .errorDecoration {
            background-color: red !important;
        }
    `;
    static template = html `
        <div id="container" style="width: 100%; height: 100%; position: absolute;"></div>
    `;
    static _monaco;
    static _monacoStyle;
    static async _getMonacoLib() {
        if (StyleEditor._monaco) {
            return StyleEditor._monaco;
        }
        const monaco = await import('monaco-editor');
        StyleEditor._monaco = monaco;
        //@ts-ignore
        StyleEditor._monacoStyle = (await import("monaco-editor/min/vs/editor/editor.main.css", { with: { type: 'css' } })).default;
        return monaco;
    }
    async createModel(text) {
        const monaco = await StyleEditor._getMonacoLib();
        return monaco.editor.createModel(text, 'css');
    }
    _model;
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        if (this._editor)
            this._editor.setModel(value);
    }
    readOnly;
    static properties = {
        text: String,
        readOnly: Boolean
    };
    _container;
    _editor;
    constructor() {
        super();
        this._restoreCachedInititalValues();
    }
    async ready() {
        this._parseAttributesToProperties();
        const monaco = await StyleEditor._getMonacoLib();
        //@ts-ignore
        this.shadowRoot.adoptedStyleSheets = [StyleEditor._monacoStyle, this.constructor.style];
        this._container = this._getDomElement('container');
        this._editor = monaco.editor.create(this._container, {
            automaticLayout: true,
            language: 'css',
            minimap: {
                size: 'fill'
            },
            readOnly: this.readOnly,
            fixedOverflowWidgets: true
        });
        if (this._model)
            this._editor.setModel(this._model);
    }
    undo() {
        this._editor.trigger('', 'undo', null);
    }
    redo() {
        this._editor.trigger('', 'redo', null);
    }
    copy() {
        this._editor.trigger('', 'editor.action.clipboardCopyAction', null);
    }
    paste() {
        this._editor.trigger('', 'editor.action.clipboardPasteAction', null);
    }
    cut() {
        this._editor.trigger('', 'editor.action.clipboardCutAction', null);
    }
    delete() {
        this._editor.trigger('', 'editor.action.clipboardDeleteAction', null);
    }
    showLine(line, column, lineEnd, columnEnd) {
        this._editor.setSelection({ startLineNumber: line, startColumn: column, endLineNumber: lineEnd, endColumn: columnEnd });
        StyleEditor._getMonacoLib().then(monaco => {
            this._editor.revealRangeAtTop(new monaco.Range(line, column, lineEnd, columnEnd), 1);
        });
    }
}
customElements.define('node-projects-style-editor', StyleEditor);
