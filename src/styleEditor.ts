import { BaseCustomWebComponentConstructorAppend, css, html } from "@node-projects/base-custom-webcomponent";
import type * as monacoType from 'monaco-editor'

export class StyleEditor extends BaseCustomWebComponentConstructorAppend {

    static readonly style = css`
        :host {
            display: block;
            height: 100%;
            width: 100%;
        }

        .errorDecoration {
            background-color: red !important;
        }
    `;

    static readonly template = html`
        <div id="container" style="width: 100%; height: 100%; position: absolute;"></div>
    `;

    private static _monaco: { editor: typeof monacoType.editor, Range: typeof monacoType.Range };
    private static _monacoStyle: CSSStyleSheet;
    private static async _getMonacoLib() {
        if (StyleEditor._monaco) {
            return StyleEditor._monaco;
        }
        const monaco = await import('monaco-editor');
        StyleEditor._monaco = monaco;
        //@ts-ignore
        StyleEditor._monacoStyle = (await import("monaco-editor/min/vs/editor/editor.main.css", { with: { type: 'css' } })).default;
        return monaco;
    }

    public async createModel(text: string) {
        const monaco = await StyleEditor._getMonacoLib();
        return monaco.editor.createModel(text, 'css');
    }
    private _model: monacoType.editor.ITextModel;
    public get model() {
        return this._model;
    }
    public set model(value: monacoType.editor.ITextModel) {
        this._model = value;
        if (this._editor)
            this._editor.setModel(value);
    }

    public readOnly: boolean;

    static readonly properties = {
        text: String,
        readOnly: Boolean
    }

    private _container: HTMLDivElement;
    private _editor: monacoType.editor.IStandaloneCodeEditor;

    constructor() {
        super();
        this._restoreCachedInititalValues();
    }

    async ready() {
        this._parseAttributesToProperties();

        const monaco = await StyleEditor._getMonacoLib();
        //@ts-ignore
        this.shadowRoot.adoptedStyleSheets = [StyleEditor._monacoStyle, this.constructor.style];

        this._container = this._getDomElement<HTMLDivElement>('container')

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
        this._editor.trigger('', 'undo', null)
    }

    redo() {
        this._editor.trigger('', 'redo', null)
    }

    copy() {
        this._editor.trigger('', 'editor.action.clipboardCopyAction', null)
    }

    paste() {
        this._editor.trigger('', 'editor.action.clipboardPasteAction', null)
    }

    cut() {
        this._editor.trigger('', 'editor.action.clipboardCutAction', null)
    }

    delete() {
        this._editor.trigger('', 'editor.action.clipboardDeleteAction', null)
    }

    public showLine(line: number, column: number, lineEnd: number, columnEnd: number) {
        this._editor.setSelection({ startLineNumber: line, startColumn: column, endLineNumber: lineEnd, endColumn: columnEnd });
        StyleEditor._getMonacoLib().then(monaco => {
            this._editor.revealRangeAtTop(new monaco.Range(line, column, lineEnd, columnEnd), 1);
        });
    }
}

customElements.define('node-projects-style-editor', StyleEditor);