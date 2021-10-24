import { JsonFileElementsService, DocumentContainer, NodeHtmlParserService, CodeViewAce, ListPropertiesService } from '/web-component-designer-demo/node_modules/@node-projects/web-component-designer/./dist/index.js';
import createDefaultServiceContainer from '/web-component-designer-demo/node_modules/@node-projects/web-component-designer/dist/elements/services/DefaultServiceBootstrap.js';
let serviceContainer = createDefaultServiceContainer();
serviceContainer.register("htmlParserService", new NodeHtmlParserService());
serviceContainer.config.codeViewWidget = CodeViewAce;
LazyLoader.LoadText('./dist/custom-element-properties.json').then(data => serviceContainer.register("propertyService", new ListPropertiesService(JSON.parse(data))));
import { DockSpawnTsWebcomponent } from '/web-component-designer-demo/node_modules/dock-spawn-ts/lib/js/webcomponent/DockSpawnTsWebcomponent.js';
import { BaseCustomWebComponentConstructorAppend, css, html, LazyLoader } from '/web-component-designer-demo/node_modules/@node-projects/base-custom-webcomponent/./dist/index.js';
import { CommandHandling } from './CommandHandling.js';
//import './loadElements.js';
DockSpawnTsWebcomponent.cssRootDirectory = "./node_modules/dock-spawn-ts/lib/css/";
export class AppShell extends BaseCustomWebComponentConstructorAppend {
    constructor() {
        super(...arguments);
        this.mainPage = 'designer';
        this._documentNumber = 0;
    }
    async ready() {
        this._dock = this._getDomElement('dock');
        this._paletteView = this._getDomElement('paletteView');
        this._paletteTree = this._getDomElement('paletteTree');
        this._treeView = this._getDomElement('treeView');
        this._treeViewExtended = this._getDomElement('treeViewExtended');
        this._propertyGrid = this._getDomElement('propertyGrid');
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = "./assets/dockspawn.css";
        this._dock.shadowRoot.appendChild(linkElement);
        this._dockManager = this._dock.dockManager;
        new CommandHandling(this._dockManager, this);
        this._dockManager.addLayoutListener({
            onActivePanelChange: (manager, panel) => {
                if (panel) {
                    let element = this._dock.getElementInSlot(panel.elementContent);
                    if (element && element instanceof DocumentContainer) {
                        let sampleDocument = element;
                        sampleDocument.instanceServiceContainer.selectionService.onSelectionChanged.on((e) => this._selectionChanged(e));
                        let selection = sampleDocument.instanceServiceContainer.selectionService.selectedElements;
                        this._propertyGrid.selectedItems = selection;
                        this._treeView.createTree(sampleDocument.instanceServiceContainer.contentService.rootDesignItem);
                        this._treeViewExtended.createTree(sampleDocument.instanceServiceContainer.contentService.rootDesignItem);
                    }
                }
            },
            onClosePanel: (manager, panel) => {
                if (panel) {
                    let element = this._dock.getElementInSlot(panel.elementContent);
                    if (element && element instanceof DocumentContainer) {
                        element.dispose();
                    }
                }
            }
        });
        await this._setupServiceContainer();
        this.newDocument(false);
    }
    _selectionChanged(e) {
        this._propertyGrid.selectedItems = e.selectedElements;
        this._treeView.selectionChanged(e);
        this._treeViewExtended.selectionChanged(e);
    }
    async _setupServiceContainer() {
        serviceContainer.register('elementsService', new JsonFileElementsService('demo', './dist/elements-demo.json'));
        serviceContainer.register('elementsService', new JsonFileElementsService('paint', './dist/elements-paint.json'));
        serviceContainer.register('elementsService', new JsonFileElementsService('wired', './dist/elements-wired.json'));
        serviceContainer.register('elementsService', new JsonFileElementsService('elix', './dist/elements-elix.json'));
        serviceContainer.register('elementsService', new JsonFileElementsService('patternfly', './dist/elements-pfe.json'));
        serviceContainer.register('elementsService', new JsonFileElementsService('mwc', './dist/elements-mwc.json'));
        serviceContainer.register('elementsService', new JsonFileElementsService('native', './node_modules/@node-projects/web-component-designer/config/elements-native.json'));
        serviceContainer.globalContext.onToolChanged.on((e) => {
            let name = [...serviceContainer.designerTools.entries()].filter(({ 1: v }) => v === e.newValue).map(([k]) => k)[0];
            if (e.newValue == null)
                name = "Pointer";
            const buttons = Array.from(document.getElementById('tools').querySelectorAll('[data-command]'));
            for (const b of buttons) {
                if (b.dataset.commandParameter == name)
                    b.style.background = "green";
                else
                    b.style.background = "";
            }
        });
        this._paletteView.loadControls(serviceContainer, serviceContainer.elementsServices);
        this._paletteTree.loadControls(serviceContainer, serviceContainer.elementsServices);
        this._propertyGrid.serviceContainer = serviceContainer;
    }
    newDocument(fixedWidth) {
        this._documentNumber++;
        let sampleDocument = new DocumentContainer(serviceContainer);
        sampleDocument.setAttribute('dock-spawn-panel-type', 'document');
        sampleDocument.title = "document-" + this._documentNumber;
        this._dock.appendChild(sampleDocument);
        if (fixedWidth) {
            sampleDocument.designerView.designerWidth = '400px';
            sampleDocument.designerView.designerHeight = '400px';
        }
    }
}
AppShell.style = css `
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
AppShell.template = html `
      <div class="app-body">
        <dock-spawn-ts id="dock" style="width: 100%; height: 100%; position: relative;">
      
          <div id="treeUpper" title="Palette" dock-spawn-dock-type="left" dock-spawn-dock-ratio="0.2"
            style="overflow: hidden; width: 100%;">
            <node-projects-palette-tree-view name="paletteTree" id="paletteTree"></node-projects-palette-tree-view>
          </div>
      
          <div id="treeUpper2" title="Tree" ock-spawn-dock-type="down" dock-spawn-dock-to="treeUpper"
            dock-spawn-dock-ratio="0.2" style="overflow: hidden; width: 100%;">
            <node-projects-tree-view name="tree" id="treeView"></node-projects-tree-view>
          </div>
      
          <div title="TreeExtended" dock-spawn-dock-type="down" dock-spawn-dock-to="treeUpper2" dock-spawn-dock-ratio="0.5"
            style="overflow: hidden; width: 100%;">
            <node-projects-tree-view-extended name="tree" id="treeViewExtended"></node-projects-tree-view-extended>
          </div>
      
          <div id="attributeDock" title="Properties" dock-spawn-dock-type="right" dock-spawn-dock-ratio="0.2">
            <node-projects-property-grid id="propertyGrid"></node-projects-property-grid>
          </div>
          <div id="p" title="Elements" dock-spawn-dock-type="down" dock-spawn-dock-to="attributeDock"
            dock-spawn-dock-ratio="0.4">
            <node-projects-palette-view id="paletteView"></node-projects-palette-view>
          </div>
        </dock-spawn-ts>
      </div>
    `;
window.customElements.define('node-projects-app-shell', AppShell);
