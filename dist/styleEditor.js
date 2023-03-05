import { BaseCustomWebComponentConstructorAppend, css, html } from '/web-component-designer-demo/node_modules/@node-projects/base-custom-webcomponent/./dist/index.js';
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
    createModel(text) {
        //@ts-ignore
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
    static _initPromise;
    static initMonacoEditor() {
        this._initPromise = new Promise(async (resolve) => {
            //@ts-ignore
            require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs', 'vs/css': { disabled: true } } });
            //@ts-ignore
            require(['vs/editor/editor.main'], () => {
                resolve(undefined);
            });
        });
        return StyleEditor._initPromise;
    }
    async ready() {
        this._parseAttributesToProperties();
        //@ts-ignore
        const style = await importShim("monaco-editor/min/vs/editor/editor.main.css", { assert: { type: 'css' } });
        //@ts-ignore
        this.shadowRoot.adoptedStyleSheets = [style.default, this.constructor.style];
        this._container = this._getDomElement('container');
        await StyleEditor.initMonacoEditor();
        //@ts-ignore
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
}
customElements.define('node-projects-style-editor', StyleEditor);
