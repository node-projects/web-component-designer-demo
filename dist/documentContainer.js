import { BaseCustomWebComponent, css, html } from "../node_modules/@node-projects/web-component-designer/dist/index.js";
export class DocumentContainer extends BaseCustomWebComponent {
  constructor(serviceContainer) {
    super();
    this._serviceContainer = serviceContainer;
  }

  static get style() {
    return css`
      div {
        height: 100%;
        display: flex;
        flex-direction: column;
      }                            
      canvas-view {
        overflow: auto;
      }`;
  }

  static get template() {
    return html`
        <div>
          <node-projects-designer-tab-control selected-index="0" id="tabControl">
            <node-projects-canvas-view title="Designer" name="designer" id="canvasView" style="height:100%">
            </node-projects-canvas-view>
            <node-projects-code-view-ace title="Code" name="code" id="codeView"></node-projects-code-view-ace>
            <node-projects-demo-view title="Preview" name="preview"></node-projects-demo-view>
          </node-projects-designer-tab-control>
        </div>`;
  }

  ready() {
    this._tabControl = this._getDomElement('tabControl');
    this._canvasView = this._getDomElement('canvasView');
    this._codeView = this._getDomElement('codeView');
    this._canvasView.serviceContainer = this._serviceContainer;

    this._tabControl.onSelectedTabChanged.on(i => {
      switch (i) {
        case 1:
          this._codeView.update(this._canvasView.getCode());

      }
    });
  }

  get instanceServiceContainer() {
    return this._canvasView.instanceServiceContainer;
  }

} //@ts-ignore

customElements.define("node-projects-document-container", DocumentContainer);