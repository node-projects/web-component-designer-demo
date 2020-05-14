import { BaseCustomWebComponent, html, css, JsonElementsService } from "../node_modules/@node-projects/web-component-designer/dist/index.js";
import serviceContainer from "../node_modules/@node-projects/web-component-designer/dist/elements/services/DefaultServiceBootstrap.js";
import { DockSpawnTsWebcomponent } from "../node_modules/dock-spawn-ts/lib/js/webcomponent/DockSpawnTsWebcomponent.js";
import { DocumentContainer } from "./documentContainer.js";
DockSpawnTsWebcomponent.cssRootDirectory = "./node_modules/dock-spawn-ts/lib/css/";
export class AppShell extends BaseCustomWebComponent {
  constructor() {
    super(...arguments);
    this.mainPage = 'designer';
    this._documentNumber = 0;
  }

  static get style() {
    return css`
    :host {
      display: block;
      box-sizing: border-box;
      position: relative;

      /* Default colour scheme */
      --canvas-background: white;
      --almost-black: #141720;
      --dark-grey: #232733;
      --medium-grey: #2f3545;
      --light-grey: #383f52;
      --highlight-pink: #e91e63;
      --highlight-blue: #2196f3;
      --highlight-green: #99ff33;
      --input-border-color: #596c7a;
    }

    .app-header {
      background-color: var(--almost-black);
      color: white;
      height: 60px;
      width: 100%;
      position: fixed;
      z-index: 100;
      display: flex;
      font-size: var(--app-toolbar-font-size, 20px);
      align-items: center;
      font-weight: 900;
      letter-spacing: 2px;
      padding-left: 10px;
    }

    .app-body {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      padding-top: 60px;
      height: 100%;
      overflow: hidden;
    }

    .heavy {
      font-weight: 900;
      letter-spacing: 2px;
    }
    .lite {
      font-weight: 100;
      opacity: 0.5;
      letter-spacing: normal;
    }

    dock-spawn-ts > div {
      height: 100%;
    }

    attribute-editor {
      height: 100%;
      width: 100%;
    }
    `;
  }

  static get template() {
    return html`
      <div class="app-header">
        <span class="heavy">web-component-designer <span class="lite">// a design framework for web-components using
            web-components</span></span>
        <button id="newButton" style="margin-left: 50px;">new</button>
      </div>
      
      <div class="app-body">
        <dock-spawn-ts id="dock" style="width: 100%; height: 100%; position: relative;">
      
          <div id="treeUpper" title="Tree" dock-spawn-dock-type="left" dock-spawn-dock-ratio="0.2"
            style="overflow: hidden; width: 100%;">
            <node-projects-tree-view name="tree" id="treeView"></node-projects-tree-view>
          </div>
      
          <div title="TreeExtended" dock-spawn-dock-type="down" dock-spawn-dock-to="treeUpper" dock-spawn-dock-ratio="0.5"
            style="overflow: hidden; width: 100%;">
            <node-projects-tree-view-extended name="tree" id="treeViewExtended"></node-projects-tree-view-extended>
          </div>
      
          <div id="attributeDock" title="Properties" dock-spawn-dock-type="right" dock-spawn-dock-ratio="0.2">
            <node-projects-attribute-editor id="attributeEditor"></node-projects-attribute-editor>
          </div>
          <div title="Elements" dock-spawn-dock-type="down" dock-spawn-dock-to="attributeDock" dock-spawn-dock-ratio="0.4">
            <node-projects-palette-view id="paletteView"></node-projects-palette-view>
          </div>
        </dock-spawn-ts>
      </div>
    `;
  }

  ready() {
    this._dock = this._getDomElement('dock');
    this._paletteView = this._getDomElement('paletteView');
    this._treeView = this._getDomElement('treeView');
    this._treeViewExtended = this._getDomElement('treeViewExtended');
    this._attributeEditor = this._getDomElement('attributeEditor');

    let newButton = this._getDomElement('newButton');

    newButton.onclick = () => this.newDocument();

    this._dockManager = this._dock.dockManager;

    this._dockManager.addLayoutListener({
      onActivePanelChange: (manager, panel) => {
        if (panel) {
          let element = panel.elementContent.assignedElements()[0];

          if (element && element instanceof DocumentContainer) {
            let sampleDocument = element;
            sampleDocument.instanceServiceContainer.selectionService.onSelectionChanged.on(e => this._selectionChanged(e));
            let selection = sampleDocument.instanceServiceContainer.selectionService.selectedElements;
            this._attributeEditor.selectedElements = selection;

            this._treeView.createTree(sampleDocument.instanceServiceContainer.contentService.rootDesignItem);

            this._treeViewExtended.createTree(sampleDocument.instanceServiceContainer.contentService.rootDesignItem);
          }
        }
      }
    });

    this._setupServiceContainer();

    this.newDocument();
  }

  _selectionChanged(e) {
    this._attributeEditor.selectedElements = e.selectedElements;

    this._treeView.selectionChanged(e);
  }

  _setupServiceContainer() {
    //serviceContainer.register('elementsService', new JsonElementsService('native', 'https://raw.githubusercontent.com/node-projects/web-component-designer/master/src/sample/elements-native.json'));
    //serviceContainer.register('elementsService', new JsonElementsService('samples', 'https://raw.githubusercontent.com/node-projects/web-component-designer/master/src/sample/elements-samples.json'));
    //serviceContainer.register('elementsService', new JsonElementsService('native', '../src/sample/elements-native.json'));
    serviceContainer.register('elementsService', new JsonElementsService('demo', '../src/elements-demo.json'));

    this._paletteView.loadControls(serviceContainer.elementsServices);

    this._attributeEditor.serviceContainer = serviceContainer;
  }

  newDocument() {
    this._documentNumber++;
    let sampleDocument = new DocumentContainer(serviceContainer);
    sampleDocument.title = "document-" + this._documentNumber;

    this._dock.appendChild(sampleDocument);
  }

}
window.customElements.define('node-projects-app-shell', AppShell);