import { BaseCustomWebcomponentBindingsService, JsonFileElementsService, TreeView, TreeViewExtended, PaletteView, PropertyGrid, DocumentContainer, NodeHtmlParserService, ListPropertiesService, PaletteTreeView, CodeViewMonaco, BindableObjectsBrowser, ExtensionType, EditTextWithStyloExtensionProvider, WebcomponentManifestElementsService, WebcomponentManifestPropertiesService } from '@node-projects/web-component-designer';
import createDefaultServiceContainer from '@node-projects/web-component-designer/dist/elements/services/DefaultServiceBootstrap';

let serviceContainer = createDefaultServiceContainer();
serviceContainer.register("bindingService", new BaseCustomWebcomponentBindingsService());
let rootDir = "/web-component-designer-demo";
if (window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1')
  rootDir = '';
serviceContainer.register("htmlParserService", new NodeHtmlParserService(rootDir + '/node_modules/@node-projects/node-html-parser-esm/dist/index.js'));
serviceContainer.config.codeViewWidget = CodeViewMonaco;
serviceContainer.designerExtensions.set(ExtensionType.Doubleclick, [new EditTextWithStyloExtensionProvider()]);

LazyLoader.LoadText('./dist/custom-element-properties.json').then(data => serviceContainer.register("propertyService", new ListPropertiesService(JSON.parse(data))));

import { DockSpawnTsWebcomponent } from 'dock-spawn-ts/lib/js/webcomponent/DockSpawnTsWebcomponent';
import { DockManager } from 'dock-spawn-ts/lib/js/DockManager';
import { BaseCustomWebComponentConstructorAppend, css, Disposable, html, LazyLoader } from '@node-projects/base-custom-webcomponent';
import { CommandHandling } from './CommandHandling'
import { StyleEditor } from './styleEditor.js';
import './styleEditor.js';
import { CustomBindableObjectsService } from './services/CustomBindableObjectsService';
import { CustomBindableObjectDragDropService } from './services/CustomBindableObjectDragDropService';

DockSpawnTsWebcomponent.cssRootDirectory = "./node_modules/dock-spawn-ts/lib/css/";

export class AppShell extends BaseCustomWebComponentConstructorAppend {
  activeElement: HTMLElement;
  mainPage = 'designer';

  private _documentNumber: number = 0;
  private _dock: DockSpawnTsWebcomponent;
  private _dockManager: DockManager;
  _paletteView: PaletteView;
  _paletteTree: PaletteTreeView;
  _bindableObjectsBrowser: BindableObjectsBrowser
  _propertyGrid: PropertyGrid;
  _treeView: TreeView;
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
            style="overflow: hidden; width: 100%; height: 100%; display: flex; flex-direction: column;">
            <node-projects-palette-tree-view name="paletteTree" id="paletteTree" style="height: calc(100% - 44px);"></node-projects-palette-tree-view>
            <div style="height: 28px;">
              <div style="display: flex; height: 100%;">
                <input list="npmInputList" id="npmInput" title="NPM Package Name" placeholder="npm-package" type="text" style="height: 100%; border: solid black 1px; box-sizing: border-box; width: 100%">
                <datalist id="npmInputList">
                  <option value="@patternfly/pfe-clipboard@next"></option>
                  <option value="@patternfly/pfe-card@next"></option>
                  <option value="@patternfly/pfe-button@next"></option>
                  <option value="@christianliebel/paint"></option>
                  <option value="wired-elements"></option>
                  <option value="@spectrum-web-components/button"></option>
                  <!--<option value="@shoelace-style/shoelace"></option>-->
                  <!--<option value="@thepassle/generic-components"></option>-->
                </datalist>
                <button id="getNpm">get</button>
              </div>
            </div>
            <div style="height: 16px; font-size: 10px; white-space: nowrap;" id="npmStatus">none</div>
          </div>
      
          <!--
          <div id="treeUpper2" title="Tree" dock-spawn-dock-to="treeUpper"
            style="overflow: hidden; width: 100%;">
            <node-projects-tree-view name="tree" id="treeView"></node-projects-tree-view>
          </div>

          <div id="upper3" title="Bind" dock-spawn-dock-to="treeUpper"
            style="overflow: hidden; width: 100%;">
            <node-projects-bindable-objects-browser id="bindableObjectsBrowser"></node-projects-bindable-objects-browser>
          </div>
          -->

          <div title="TreeExtended" dock-spawn-dock-type="down" dock-spawn-dock-to="treeUpper" dock-spawn-dock-ratio="0.5"
            style="overflow: hidden; width: 100%;">
            <node-projects-tree-view-extended name="tree" id="treeViewExtended"></node-projects-tree-view-extended>
          </div>
      
          <div id="attributeDock" title="Properties" dock-spawn-dock-type="right" dock-spawn-dock-ratio="0.2">
            <node-projects-property-grid-with-header id="propertyGrid"></node-projects-property-grid-with-header>
          </div>

          <!--
          <div id="p" title="Elements" dock-spawn-dock-type="down" dock-spawn-dock-to="attributeDock"
            dock-spawn-dock-ratio="0.4">
            <node-projects-palette-view id="paletteView"></node-projects-palette-view>
          </div>
          -->

          <div id="lower" title="style" dock-spawn-dock-type="down" dock-spawn-dock-ratio="0.25" style="overflow: hidden; width: 100%;">
            <node-projects-style-editor id="styleEditor"></node-projects-style-editor>
          </div>
        </dock-spawn-ts>
      </div>
    `;
  private _styleChangedCb: Disposable;
  private _npmInput: HTMLInputElement;
  private _npmStatus: HTMLDivElement;
  private _getNpm: HTMLButtonElement;

  async ready() {
    this._dock = this._getDomElement('dock');
    //this._paletteView = this._getDomElement<PaletteView>('paletteView');
    this._paletteTree = this._getDomElement<PaletteTreeView>('paletteTree');
    //this._bindableObjectsBrowser = this._getDomElement<BindableObjectsBrowser>('bindableObjectsBrowser');
    //this._treeView = this._getDomElement<TreeView>('treeView');
    this._treeViewExtended = this._getDomElement<TreeViewExtended>('treeViewExtended');
    this._propertyGrid = this._getDomElement<PropertyGrid>('propertyGrid');
    this._styleEditor = this._getDomElement<StyleEditor>('styleEditor');

    this._npmInput = this._getDomElement<HTMLInputElement>('npmInput');
    this._npmStatus = this._getDomElement<HTMLDivElement>('npmStatus');
    this._getNpm = this._getDomElement<HTMLButtonElement>('getNpm');
    this._npmInput.onkeydown = (e) => {
      if (e.key == 'Enter') {
        this.loadNpmPackage(this._npmInput.value);
        this._npmInput.value = '';
      }
    }
    this._getNpm.onclick = (e) => {
      this.loadNpmPackage(this._npmInput.value);
      this._npmInput.value = '';
    }


    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "./assets/dockspawn.css";
    this._dock.shadowRoot.appendChild(linkElement);

    this._dockManager = this._dock.dockManager;
    new CommandHandling(this._dockManager, this, serviceContainer);

    this._dockManager.addLayoutListener({
      onActiveDocumentChange: (manager, panel) => {
        //await this._waitForChildrenReady();
        if (panel) {
          let element = this._dock.getElementInSlot((<HTMLSlotElement><any>panel.elementContent));
          if (element && element instanceof DocumentContainer) {
            let sampleDocument = element as DocumentContainer;
            if (this._styleChangedCb)
              this._styleChangedCb.dispose();
            this._styleEditor.text = sampleDocument.additionalStyleString ?? '';
            this._propertyGrid.instanceServiceContainer = sampleDocument.instanceServiceContainer;
            this._treeViewExtended.instanceServiceContainer = sampleDocument.instanceServiceContainer;
            //this._treeView.instanceServiceContainer = sampleDocument.instanceServiceContainer;
            this._styleChangedCb = this._styleEditor.onTextChanged.single(() => {
              sampleDocument.additionalStyleString = this._styleEditor.text;
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

    let customElementsRegistry = window.customElements;
    const registry: any = {};
    registry.define = function (name, constructor, options) {
      try {
        customElementsRegistry.define(name, constructor, options);
      }
      catch (err) {
        console.error(err);
      }
    }
    registry.get = function (name) {
      return customElementsRegistry.get(name);
    }
    registry.upgrade = function (node) {
      return customElementsRegistry.upgrade(node);
    }
    registry.whenDefined = function (name) {
      return customElementsRegistry.whenDefined(name);
    }

    Object.defineProperty(window, "customElements", {
      get() {
        return registry
      }
    });

    await this._setupServiceContainer();
    this.newDocument(false);
  }

  _dependecies = new Map<string, boolean>()

  private async loadNpmPackage(pkg: string) {
    const baseUrl = window.location.protocol + '//unpkg.com/' + pkg + '/';

    const packageJsonUrl = baseUrl + 'package.json';
    this._npmStatus.innerText = "loading package.json";
    const packageJson = await fetch(packageJsonUrl);
    const packageJsonObj = await packageJson.json();

    const depPromises: Promise<void>[] = []
    if (packageJsonObj.dependencies) {
      for (let d in packageJsonObj.dependencies) {
        depPromises.push(this.loadDependency(d, packageJsonObj.dependencies[d]));
      }
    }
    await Promise.all(depPromises)
    let customElementsUrl = baseUrl + 'customElements.json';
    if (packageJsonObj.customElements) {
      customElementsUrl = baseUrl + packageJsonObj.customElements;
    }
    this._npmStatus.innerText = "loading custom-elements.json";
    const customElementsJson = await fetch(customElementsUrl);
    if (customElementsJson.ok) {
      const customElementsJsonObj = await customElementsJson.json();

      let elements = new WebcomponentManifestElementsService(packageJsonObj.name, baseUrl, customElementsJsonObj);
      serviceContainer.register('elementsService', elements);
      let properties = new WebcomponentManifestPropertiesService(packageJsonObj.name, customElementsJsonObj);
      serviceContainer.register('propertyService', properties);

      this._paletteTree.loadControls(serviceContainer, serviceContainer.elementsServices);
    }
    else {
      console.warn('npm package: ' + pkg + ' - no custom-elements.json found, only loading javascript module');
      if (packageJsonObj.module) {
        //@ts-ignore
        await importShim(baseUrl + packageJsonObj.module)
      }
    }
    this._npmStatus.innerText = "none";
  }

  async loadDependency(dependency: string, version) {
    if (this._dependecies.has(dependency))
      return;

    this._dependecies.set(dependency, true);

    if (dependency.startsWith('@types')) {
      console.warn('ignoring wrong dependency: ', dependency);
      return;
    }
    this._npmStatus.innerText = "loading dependency: " + dependency;
    const baseUrl = window.location.protocol + '//unpkg.com/' + dependency + '/';

    const packageJsonUrl = baseUrl + 'package.json';
    const packageJson = await fetch(packageJsonUrl);
    const packageJsonObj = await packageJson.json();

    const depPromises: Promise<void>[] = []
    if (packageJsonObj.dependencies) {
      for (let d in packageJsonObj.dependencies) {
        depPromises.push(this.loadDependency(d, packageJsonObj.dependencies[d]));
      }
    }
    await Promise.all(depPromises)

    //console.log('package.json', dependency, packageJsonObj);
    //todo - use exports of package.json for importMap
    const importMap = { imports: {}, scopes: {} };
    let mainImport = packageJsonObj.main;
    if (packageJsonObj.module)
      mainImport = packageJsonObj.module;
    importMap.imports[dependency] = baseUrl + mainImport;
    importMap.imports[dependency + '/'] = baseUrl;
    //console.log('importMap:', importMap);

    //@ts-ignore
    importShim.addImportMap(importMap);
  }

  private async _setupServiceContainer() {
    serviceContainer.register('elementsService', new JsonFileElementsService('demo', './dist/elements-demo.json'));
    /*
    serviceContainer.registerMultiple(['elementsService', 'propertyService'], new WebcomponentManifestParserService('qing-button', rootDir + '/node_modules/qing-button/custom-elements.json'));
    serviceContainer.register('elementsService', new JsonFileElementsService('wired', './dist/elements-wired.json'));
    serviceContainer.register('elementsService', new JsonFileElementsService('elix', './dist/elements-elix.json'));
    serviceContainer.register('elementsService', new JsonFileElementsService('patternfly', './dist/elements-pfe.json'));
    serviceContainer.register('elementsService', new JsonFileElementsService('mwc', './dist/elements-mwc.json'));
    */
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

    //this._paletteView.loadControls(serviceContainer, serviceContainer.elementsServices);
    this._paletteTree.loadControls(serviceContainer, serviceContainer.elementsServices);
    //this._bindableObjectsBrowser.initialize(serviceContainer);
    this._propertyGrid.serviceContainer = serviceContainer;
  }

  public newDocument(fixedWidth: boolean) {
    this._documentNumber++;
    let sampleDocument = new DocumentContainer(serviceContainer);
    sampleDocument.setAttribute('dock-spawn-panel-type', 'document');
    sampleDocument.title = "document-" + this._documentNumber;
    sampleDocument.additionalStyleString = `* { 
    font-size: 20px;
}`;
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
  }
}

window.customElements.define('node-projects-app-shell', AppShell);