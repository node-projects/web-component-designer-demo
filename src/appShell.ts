import { NpmPackageLoader, BaseCustomWebcomponentBindingsService, JsonFileElementsService, TreeViewExtended, PropertyGrid, DocumentContainer, NodeHtmlParserService, ListPropertiesService, PaletteTreeView, CodeViewMonaco, BindableObjectsBrowser, ExtensionType, EditTextWithStyloExtensionProvider, CssToolsStylesheetService, CopyPasteAsJsonService, DebugView } from '@node-projects/web-component-designer';
import createDefaultServiceContainer from '@node-projects/web-component-designer/dist/elements/services/DefaultServiceBootstrap.js';
//import { BaseCustomWebcomponentParserService } from '@node-projects/web-component-designer/dist/elements/services/htmlParserService/BaseCustomWebcomponentParserService.js';

let serviceContainer = createDefaultServiceContainer();
serviceContainer.register("bindingService", new BaseCustomWebcomponentBindingsService());
let rootDir = "/web-component-designer-demo";
if (window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1')
  rootDir = '';
let nodeParserService = new NodeHtmlParserService(rootDir + '/node_modules/@node-projects/node-html-parser-esm/dist/index.js');
serviceContainer.register("htmlParserService", nodeParserService);
serviceContainer.register("copyPasteService", new CopyPasteAsJsonService());
serviceContainer.register("bindableObjectsService", new CustomBindableObjectsService());
//serviceContainer.register("htmlParserService", new BaseCustomWebcomponentParserService(nodeParserService));
//serviceContainer.config.codeViewWidget = CodeViewCodeMirror6;
serviceContainer.config.codeViewWidget = CodeViewMonaco;
serviceContainer.designerExtensions.set(ExtensionType.Doubleclick, [new EditTextWithStyloExtensionProvider()]);

//Instance Service Container Factories
serviceContainer.register("stylesheetService", designerCanvas => new CssToolsStylesheetService(designerCanvas));

LazyLoader.LoadText('./dist/custom-element-properties.json').then(data => serviceContainer.register("propertyService", new ListPropertiesService(JSON.parse(data))));

import { DockSpawnTsWebcomponent } from 'dock-spawn-ts/lib/js/webcomponent/DockSpawnTsWebcomponent.js';
import { DockManager } from 'dock-spawn-ts/lib/js/DockManager.js';
import { BaseCustomWebComponentConstructorAppend, css, Disposable, html, LazyLoader } from '@node-projects/base-custom-webcomponent';
import { CommandHandling } from './CommandHandling.js'
import { StyleEditor } from './styleEditor.js';
import './styleEditor.js';
import { CustomBindableObjectsService } from './services/CustomBindableObjectsService.js';
import { CustomBindableObjectDragDropService } from './services/CustomBindableObjectDragDropService.js';

DockSpawnTsWebcomponent.cssRootDirectory = "./node_modules/dock-spawn-ts/lib/css/";

export class AppShell extends BaseCustomWebComponentConstructorAppend {
  activeElement: HTMLElement;
  mainPage = 'designer';

  private _documentNumber: number = 0;
  private _dock: DockSpawnTsWebcomponent;
  private _dockManager: DockManager;
  _paletteTree: PaletteTreeView;
  _bindableObjectsBrowser: BindableObjectsBrowser
  _propertyGrid: PropertyGrid;
  _debugView: DebugView;
  _treeViewExtended: TreeViewExtended;
  _styleEditor: StyleEditor;

  static readonly style = css`
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

  static readonly template = html`
      <div class="app-body">
        <dock-spawn-ts id="dock" style="width: 100%; height: 100%; position: relative;">
          <div id="treeUpper" title="Palette" dock-spawn-dock-type="left" dock-spawn-dock-ratio="0.2"
            style="z-index: 1; position: relative; overflow: hidden; width: 100%; height: 100%; display: flex; flex-direction: column;">
            <node-projects-palette-tree-view name="paletteTree" id="paletteTree" style="height: calc(100% - 44px);"></node-projects-palette-tree-view>
            <div style="height: 28px;">
              <div style="display: flex; height: 100%;">
                <input list="npmInputList" id="npmInput" title="NPM Package Name" placeholder="npm-package" type="text" style="height: 100%; border: solid black 1px; box-sizing: border-box; width: 100%">
                <datalist id="npmInputList">
                  <option value="@material/web"></option>
                  <option value="@microsoft/fast-components"></option>
                  <option value="@shoelace-style/shoelace"></option>
                  <option value="@patternfly/elements"></option>
                  <option value="@christianliebel/paint"></option>
                  <option value="@node-projects/wired-elements"></option>
                  <option value="@spectrum-web-components/button"></option>
                  <option value="@node-projects/tab.webcomponent"></option>
                  <option value="@node-projects/gauge.webcomponent"></option>
                  <option value="@zooplus/zoo-web-components"></option>
                  <option value="@wokwi/elements"></option>
                  <option value="@generic-components/components"></option>
                  <option value="@visa/charts"></option>
                  <option value="@carbon/web-components"></option>
                </datalist>
                <button id="getNpm">get</button>
              </div>
            </div>
            <div style="height: 16px; font-size: 10px; white-space: nowrap;" id="npmStatus">none</div>
          </div>
      
          <div id="upper3" title="Bind" dock-spawn-dock-to="treeUpper"
            style="overflow: hidden; width: 100%;">
            <node-projects-bindable-objects-browser id="bindableObjectsBrowser"></node-projects-bindable-objects-browser>
          </div>

          <div title="TreeExtended" dock-spawn-dock-type="down" dock-spawn-dock-to="treeUpper" dock-spawn-dock-ratio="0.5"
            style="overflow: hidden; width: 100%;">
            <node-projects-tree-view-extended name="tree" id="treeViewExtended"></node-projects-tree-view-extended>
          </div>
      
          <div id="attributeDock" title="Properties" dock-spawn-dock-type="right" dock-spawn-dock-ratio="0.2">
            <node-projects-property-grid-with-header id="propertyGrid"></node-projects-property-grid-with-header>
          </div>

          <div id="debugDock" title="Debug" dock-spawn-dock-type="down" dock-spawn-dock-to="attributeDock" dock-spawn-dock-ratio="0.2">
            <node-projects-debug-view id="debugView"></node-projects-debug-view>
          </div>

          <div id="lower" title="stylesheet.css" dock-spawn-dock-type="down" dock-spawn-dock-ratio="0.25" style="overflow: hidden; width: 100%;">
            <node-projects-style-editor id="styleEditor"></node-projects-style-editor>
          </div>
        </dock-spawn-ts>
      </div>
    `;
  private _styleChangedCb: Disposable;
  private _npmInput: HTMLInputElement;
  private _npmStatus: HTMLDivElement;
  private _getNpm: HTMLButtonElement;

  private _npmPackageLoader = new NpmPackageLoader();

  async ready() {
    this._dock = this._getDomElement('dock');
    this._paletteTree = this._getDomElement<PaletteTreeView>('paletteTree');
    this._bindableObjectsBrowser = this._getDomElement<BindableObjectsBrowser>('bindableObjectsBrowser');
    this._treeViewExtended = this._getDomElement<TreeViewExtended>('treeViewExtended');
    this._propertyGrid = this._getDomElement<PropertyGrid>('propertyGrid');
    this._debugView = this._getDomElement<DebugView>('debugView');
    this._styleEditor = this._getDomElement<StyleEditor>('styleEditor');

    this._npmInput = this._getDomElement<HTMLInputElement>('npmInput');
    this._npmStatus = this._getDomElement<HTMLDivElement>('npmStatus');
    this._getNpm = this._getDomElement<HTMLButtonElement>('getNpm');

    let loadAllImports = window.location.search.includes("loadAllImports");
    this._npmInput.onkeydown = async (e) => {
      if (e.key == 'Enter') {
        let res = await this._npmPackageLoader.loadNpmPackage(this._npmInput.value, serviceContainer, this._paletteTree, loadAllImports, state => this._npmStatus.innerText = state);
        if (res.html) {
          let element = <DocumentContainer>this._dock.getElementInSlot((<HTMLSlotElement><any>this._dockManager.activeDocument.elementContent));
          element.content = res.html + element.content;
        }
        this._npmInput.value = '';
      }
    }
    this._getNpm.onclick = async (e) => {
      let res = await this._npmPackageLoader.loadNpmPackage(this._npmInput.value, serviceContainer, this._paletteTree, loadAllImports, state => this._npmStatus.innerText = state);
      if (res.html) {
        let element = <DocumentContainer>this._dock.getElementInSlot((<HTMLSlotElement><any>this._dockManager.activeDocument.elementContent));
        element.content = res.html + element.content;
      }
      this._npmInput.value = '';
    }

    let code = "";
    let style = "";

    let s = window.location.search;
    if (s.startsWith('?'))
      s = s.substring(1);
    let parts = s.split('&');
    for (let p of parts) {
      if (p.startsWith('npm='))
        this._npmPackageLoader.loadNpmPackage(p.substring(4), serviceContainer, this._paletteTree, loadAllImports, state => this._npmStatus.innerText = state);
      if (p.startsWith('html='))
        code = decodeURI(p.substring(5));
      if (p.startsWith('style='))
        style = decodeURI(p.substring(6));
    }

    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "./assets/dockspawn.css";
    this._dock.shadowRoot.appendChild(linkElement);

    this._dockManager = this._dock.dockManager;
    new CommandHandling(this._dockManager, this, serviceContainer);

    this._dockManager.addLayoutListener({
      onActiveDocumentChange: (manager, panel) => {
        if (panel) {
          let element = this._dock.getElementInSlot((<HTMLSlotElement><any>panel.elementContent));
          if (element && element instanceof DocumentContainer) {
            let sampleDocument = element as DocumentContainer;
            this._styleEditor.model = sampleDocument.additionalData.model;
            this._propertyGrid.instanceServiceContainer = sampleDocument.instanceServiceContainer;
            this._treeViewExtended.instanceServiceContainer = sampleDocument.instanceServiceContainer;
            sampleDocument.instanceServiceContainer.selectionService.onSelectionChanged.on(e => {
              this._debugView.update(e.selectedElements[0]);
            });
          }
        }
      },
      onClosePanel: (manager, panel) => {
        if (panel) {
          let element = this._dock.getElementInSlot((<HTMLSlotElement><any>panel.elementContent));
          if (element && element instanceof DocumentContainer) {
            (<DocumentContainer>element).dispose();
            if (this._styleChangedCb)
              this._styleChangedCb.dispose();
            this._styleChangedCb = null;
          }
        }
      }
    });

    await this._setupServiceContainer();
    this._bindableObjectsBrowser.initialize(serviceContainer);

    await StyleEditor.initMonacoEditor();

    this.newDocument(false, code, style);

    this.activateDockById('treeUpper');
  }

  private async _setupServiceContainer() {
    serviceContainer.register('elementsService', new JsonFileElementsService('demo', './dist/elements-demo.json'));
    serviceContainer.register('elementsService', new JsonFileElementsService('native', rootDir + '/node_modules/@node-projects/web-component-designer/config/elements-native.json'));
    serviceContainer.register('bindableObjectsService', new CustomBindableObjectsService());
    serviceContainer.register('bindableObjectDragDropService', new CustomBindableObjectDragDropService());

    serviceContainer.globalContext.onToolChanged.on((e) => {
      let name = [...serviceContainer.designerTools.entries()].filter(({ 1: v }) => v === e.newValue.tool).map(([k]) => k)[0];
      if (e.newValue == null)
        name = "Pointer"
      const buttons = Array.from<HTMLButtonElement>(document.getElementById('tools').querySelectorAll('[data-command]'));
      for (const b of buttons) {
        if (b.dataset.commandParameter == name)
          b.style.backgroundColor = "green"
        else
          b.style.backgroundColor = ""
      }
    });

    this._paletteTree.loadControls(serviceContainer, serviceContainer.elementsServices);
    this._propertyGrid.serviceContainer = serviceContainer;
  }

  public newDocument(fixedWidth: boolean, code?: string, style?: string) {
    this._documentNumber++;
    let sampleDocument = new DocumentContainer(serviceContainer);
    sampleDocument.setAttribute('dock-spawn-panel-type', 'document');
    sampleDocument.title = "document-" + this._documentNumber;
    sampleDocument.additionalStylesheets = [
      {
        name: "stylesheet.css",
        content: (style ?? '') == '' ? `* {
    font-size: 20px;
}` : style
      }
    ];
    const model = this._styleEditor.createModel(sampleDocument.additionalStylesheets[0].content);
    sampleDocument.additionalData = { model: model };

    let timer;
    let disableTextChangedEvent = false;
    model.onDidChangeContent((e) => {
      if (!disableTextChangedEvent) {
        if (timer)
          clearTimeout(timer)
        timer = setTimeout(() => {
          sampleDocument.additionalStylesheets = [
            {
              name: "stylesheet.css",
              content: model.getValue()
            }
          ];
          timer = null;
        }, 250);
      }
    });
    sampleDocument.additionalStylesheetChanged.on(() => {
      disableTextChangedEvent = true;
      if (model.getValue() !== sampleDocument.additionalStylesheets[0].content)
        model.applyEdits([{ range: model.getFullModelRange(), text: sampleDocument.additionalStylesheets[0].content, forceMoveMarkers: true }]);
      disableTextChangedEvent = false;
    });

    sampleDocument.tabIndex = 0;
    sampleDocument.addEventListener('keydown', (e) => {
      if (e.key == "Escape") {
        e.stopPropagation();
      }
    }, true);
    this._dock.appendChild(sampleDocument);
    if (fixedWidth) {
      sampleDocument.designerView.designerWidth = '400px';
      sampleDocument.designerView.designerHeight = '400px';
    }

    if (code) {
      sampleDocument.content = code;
    }
  }

  activateDockById(name: string) {
    this.activateDock(this._getDomElement(name));
  }

  activateDock(element: Element) {
    const nd = this._dockManager.getNodeByElement(element);
    nd.parent.container.setActiveChild(nd.container);
  }
}

window.customElements.define('node-projects-app-shell', AppShell);