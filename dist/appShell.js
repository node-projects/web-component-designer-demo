import { createDefaultServiceContainer, NpmPackageLoader, BaseCustomWebcomponentBindingsService, JsonFileElementsService, DocumentContainer, CopyPasteAsJsonService, UnkownElementsPropertiesService, sleep, BindingsRefactorService, TextRefactorService, SeperatorContextMenu, DomConverter, ValueType, ObservedCustomElementsRegistry, PreDefinedElementsService, ContextMenu, CommandType, showPopup } from '@node-projects/web-component-designer';
import { NodeHtmlParserService } from '@node-projects/web-component-designer-htmlparserservice-nodehtmlparser';
import { CodeViewMonaco } from '@node-projects/web-component-designer-codeview-monaco';
import { CssParserStylesheetService } from '@node-projects/web-component-designer-stylesheetservice-css-parser';
import '@node-projects/web-component-designer-widgets-wunderbaum';
import { ExpandCollapseContextMenu } from '@node-projects/web-component-designer-widgets-wunderbaum';
import { DemoEditorTypesService } from './services/DemoEditorTypesService.js';
let serviceContainer = createDefaultServiceContainer();
import { defaultWebRtcTabCollaborationSignalingChannels, setupCollaborationService, WebRtcTabCollaborationTransport } from '@node-projects/web-component-designer-collaboration-service';
setupCollaborationService(serviceContainer);
serviceContainer.register("bindingService", new BaseCustomWebcomponentBindingsService());
let rootDir = "/web-component-designer-demo";
if (window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1')
    rootDir = '';
serviceContainer.register("htmlParserService", new NodeHtmlParserService());
serviceContainer.register("copyPasteService", new CopyPasteAsJsonService());
serviceContainer.register("bindableObjectsService", new CustomBindableObjectsService());
serviceContainer.registerLast("propertyService", new UnkownElementsPropertiesService());
serviceContainer.register("refactorService", new BindingsRefactorService());
serviceContainer.register("refactorService", new TextRefactorService());
serviceContainer.register("editorTypesService", new DemoEditorTypesService());
/*
globalThis.MonacoEnvironment = {
  getWorker: (_moduleId, label) => {
    switch (label) {
      case 'json':
        return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url), { type: 'module' });
      case 'css':
      case 'scss':
      case 'less':
        return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url), { type: 'module' });
      case 'html':
      case 'handlebars':
      case 'razor':
        return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url), { type: 'module' });
      case 'typescript':
      case 'javascript':
        return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url), { type: 'module' });
      default:
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url), { type: 'module' });
    }
  }
};
*/
serviceContainer.config.codeViewWidget = CodeViewMonaco;
serviceContainer.designerContextMenuExtensions.push(new ExpandCollapseContextMenu());
serviceContainer.designerContextMenuExtensions.push(new SeperatorContextMenu(), new EditTemplateContextMenu());
//Instance Service Container Factories
serviceContainer.register("stylesheetService", designerCanvas => new CssParserStylesheetService(designerCanvas));
function createRandomId() {
    return globalThis.crypto?.randomUUID?.() ?? `peer-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
function getOrCreateCollaborationPeerBaseId() {
    const key = 'wcd-demo-collaboration-peer-base-id';
    let id = sessionStorage.getItem(key);
    if (!id) {
        id = createRandomId();
        sessionStorage.setItem(key, id);
    }
    return id;
}
function isCollaborationSignalingChannelKind(value) {
    return value === 'broadcast-channel' || value === 'manual';
}
function readCollaborationSignalingChannels() {
    const storageKey = 'wcd-demo-collaboration-signaling-channels';
    try {
        const serializedValue = localStorage.getItem(storageKey);
        if (!serializedValue)
            return [...defaultWebRtcTabCollaborationSignalingChannels];
        const parsedValue = JSON.parse(serializedValue);
        const channels = Array.isArray(parsedValue)
            ? parsedValue.filter(isCollaborationSignalingChannelKind)
            : [];
        return channels.length > 0 ? channels : [...defaultWebRtcTabCollaborationSignalingChannels];
    }
    catch {
        return [...defaultWebRtcTabCollaborationSignalingChannels];
    }
}
function writeCollaborationSignalingChannels(channels) {
    const storageKey = 'wcd-demo-collaboration-signaling-channels';
    try {
        localStorage.setItem(storageKey, JSON.stringify(channels));
    }
    catch {
    }
}
const defaultCollaborationRtcConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
const meteredTurnRtcConfiguration = {
    iceServers: [
        {
            urls: 'stun:stun.relay.metered.ca:80'
        },
        {
            urls: 'turn:global.relay.metered.ca:80',
            username: 'c5fd09b5e3d0ceb675a2de34',
            credential: 'n16K4cA2vy8wSHbY'
        },
        {
            urls: 'turn:global.relay.metered.ca:80?transport=tcp',
            username: 'c5fd09b5e3d0ceb675a2de34',
            credential: 'n16K4cA2vy8wSHbY'
        },
        {
            urls: 'turn:global.relay.metered.ca:443',
            username: 'c5fd09b5e3d0ceb675a2de34',
            credential: 'n16K4cA2vy8wSHbY'
        },
        {
            urls: 'turns:global.relay.metered.ca:443?transport=tcp',
            username: 'c5fd09b5e3d0ceb675a2de34',
            credential: 'n16K4cA2vy8wSHbY'
        }
    ]
};
const collaborationRtcConfigurationStorageKey = 'wcd-demo-collaboration-rtc-configuration';
const cloudflareTurnDocsUrl = 'https://developers.cloudflare.com/realtime/turn/generate-credentials/';
const openRelayProjectUrl = 'https://www.metered.ca/tools/openrelay/';
function cloneCollaborationRtcConfiguration(configuration) {
    if (!configuration)
        return undefined;
    return {
        ...configuration,
        iceServers: configuration.iceServers?.map(server => ({
            ...server,
            urls: Array.isArray(server.urls) ? [...server.urls] : server.urls,
        })),
    };
}
function normalizeCollaborationRtcConfiguration(configuration) {
    if (Array.isArray(configuration))
        return { iceServers: configuration };
    if (!configuration || typeof configuration !== 'object')
        throw new Error('RTC configuration must be a JSON object, an iceServers array, or a single ICE server entry.');
    const record = configuration;
    if (Array.isArray(record.iceServers))
        return configuration;
    if (typeof record.urls === 'string' || Array.isArray(record.urls))
        return { iceServers: [configuration] };
    throw new Error('RTC configuration must be a JSON object, an iceServers array, or a single ICE server entry.');
}
function parseCollaborationRtcConfiguration(serializedConfiguration) {
    return normalizeCollaborationRtcConfiguration(JSON.parse(serializedConfiguration));
}
function filterRtcConfigurationForBrowser(configuration) {
    const filteredIceServers = configuration.iceServers
        ?.map(server => {
        const urls = (Array.isArray(server.urls) ? server.urls : [server.urls])
            .filter((url) => typeof url === 'string' && !!url.trim())
            .filter(url => !/:53(?:\?|$)/.test(url));
        if (urls.length === 0)
            return null;
        return {
            ...server,
            urls: Array.isArray(server.urls) ? urls : urls[0]
        };
    })
        .filter((server) => server != null);
    return {
        ...configuration,
        iceServers: filteredIceServers
    };
}
function summarizeCollaborationRtcConfiguration(configuration) {
    const urls = configuration?.iceServers
        ?.flatMap(server => Array.isArray(server.urls) ? server.urls : [server.urls])
        .filter((url) => typeof url === 'string' && !!url.trim()) ?? [];
    if (urls.length === 0)
        return 'custom RTC config';
    if (urls.length === 1)
        return urls[0];
    return `${urls[0]} +${urls.length - 1}`;
}
function readCollaborationRtcConfiguration() {
    const params = new URLSearchParams(window.location.search);
    const serializedConfiguration = params.get('collabRtcConfiguration');
    if (serializedConfiguration) {
        try {
            return cloneCollaborationRtcConfiguration(parseCollaborationRtcConfiguration(serializedConfiguration));
        }
        catch {
        }
    }
    const iceServerUrls = params.getAll('collabIceServer')
        .map(value => value.trim())
        .filter(Boolean);
    if (iceServerUrls.length > 0) {
        return {
            iceServers: iceServerUrls.map(url => ({ urls: url }))
        };
    }
    try {
        const storedConfiguration = localStorage.getItem(collaborationRtcConfigurationStorageKey);
        if (storedConfiguration)
            return cloneCollaborationRtcConfiguration(parseCollaborationRtcConfiguration(storedConfiguration));
    }
    catch {
    }
    return cloneCollaborationRtcConfiguration(defaultCollaborationRtcConfiguration);
}
function writeCollaborationRtcConfiguration(configuration) {
    try {
        localStorage.setItem(collaborationRtcConfigurationStorageKey, JSON.stringify(configuration));
    }
    catch {
    }
}
import { BaseCustomWebComponentConstructorAppend, css, html, LazyLoader } from '@node-projects/base-custom-webcomponent';
import { CommandHandling } from './CommandHandling.js';
import './styleEditor.js';
import { CustomBindableObjectsService } from './services/CustomBindableObjectsService.js';
import { CustomBindableObjectDragDropService } from './services/CustomBindableObjectDragDropService.js';
import { EditTemplateContextMenu } from './services/EditTemplateContextMenu.js';
import { saveData } from './file.js';
export class AppShell extends BaseCustomWebComponentConstructorAppend {
    activeElement;
    mainPage = 'designer';
    _documentNumber = 0;
    _dock;
    _dockManager;
    _paletteTree;
    _bindableObjectsBrowser;
    _propertyGrid;
    _debugView;
    _treeViewExtended;
    _styleEditor;
    static style = css `
    :host {
      display: block;
      box-sizing: border-box;
      position: relative;

      /* Default colour scheme */
      --canvas-background: white;
      --almost-black: #141720;
      --dark-grey: #232733;
      --medium-grey: rgb(44, 46, 53);
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
    static template = html `
      <div class="app-body">
        <dock-spawn-ts id="dock" style="width: 100%; height: 100%; position: relative;">
          <div id="treeUpper" dock-spawn-title="Palette" dock-spawn-dock-type="left" dock-spawn-dock-ratio="0.2"
            style="z-index: 1; position: relative; overflow: hidden; width: 100%; height: 100%; display: flex; flex-direction: column;">
            <node-projects-palette-tree-view name="paletteTree" id="paletteTree" style="height: calc(100% - 44px);"></node-projects-palette-tree-view>
            <div style="height: 28px;">
              <div style="display: flex; height: 100%;">
                <input list="npmInputList" id="npmInput" dock-spawn-title="NPM Package Name" placeholder="npm-package" type="text" style="height: 100%; border: solid black 1px; box-sizing: border-box; width: 100%">
                <datalist id="npmInputList">
                  <option value="@christianliebel/paint"></option>
                  <option value="@vanillawc/wc-marquee"></option>
                  <option value="@vanillawc/wc-blink"></option>
                  <option value="vanilla-colorful"></option>
                  <option value="@material/web"></option>
                  <option value="@microsoft/fast-components"></option>
                  <option value="@shoelace-style/shoelace"></option>
                  <option value="@patternfly/elements"></option>
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
      
          <div id="upper3" dock-spawn-title="Bind" dock-spawn-dock-to="treeUpper"
            style="overflow: hidden; width: 100%;">
            <node-projects-bindable-objects-browser id="bindableObjectsBrowser"></node-projects-bindable-objects-browser>
          </div>

          <div dock-spawn-title="TreeExtended" dock-spawn-dock-type="down" dock-spawn-dock-to="treeUpper" dock-spawn-dock-ratio="0.5"
            style="overflow: hidden; width: 100%;">
            <node-projects-tree-view-extended name="tree" id="treeViewExtended"></node-projects-tree-view-extended>
          </div>
      
          <div id="miniatureDock" dock-spawn-title="Miniature" dock-spawn-dock-type="right" dock-spawn-dock-ratio="0.2">
            <node-projects-web-component-designer-miniature-view id="miniature"></node-projects-web-component-designer-miniature-view>
          </div>

          <div id="attributeDock" dock-spawn-dock-to="miniatureDock" dock-spawn-title="Properties" dock-spawn-dock-type="down" dock-spawn-dock-ratio="0.7">
            <node-projects-web-component-designer-property-grid-with-header id="propertyGrid"></node-projects-web-component-designer-property-grid-with-header>
          </div>

          <div id="debugDock" dock-spawn-title="Debug" dock-spawn-dock-type="down" dock-spawn-dock-to="attributeDock" dock-spawn-dock-ratio="0.2">
            <node-projects-debug-view id="debugView"></node-projects-debug-view>
          </div>

          <div id="refactorDock" dock-spawn-title="Refactor" dock-spawn-dock-type="down" dock-spawn-dock-to="attributeDock" dock-spawn-dock-ratio="0.2">
            <node-projects-refactor-view id="refactorView"></node-projects-refactor-view>
          </div>

          <div id="lower" dock-spawn-title="stylesheet.css" dock-spawn-dock-type="down" dock-spawn-dock-ratio="0.25" style="overflow: hidden; width: 100%;">
            <node-projects-style-editor id="styleEditor"></node-projects-style-editor>
          </div>

          <div id="lower2" dock-spawn-title="LLM" dock-spawn-dock-to="lower" style="overflow: hidden; width: 100%;">
            <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">
              <div id="llmOutput" style="width: 100%;height: 100%;padding: 0; display: flex; flex-direction: column; overflow-y: auto;">
                <button style="margin: auto" id="llmEnable">Enable LLM</button>
              </div>
              <textarea id="llmInput" style="height: 100%;margin: 10px;resize: none;" placeholder="Ask a question to the LLM here..."></textarea>
            </div>
          </div>

        </dock-spawn-ts>
      </div>
    `;
    _styleChangedCb;
    _npmInput;
    _npmStatus;
    _getNpm;
    _refactorView;
    _miniatureView;
    _npmPackageLoader = new NpmPackageLoader();
    _collaborationPeerBaseId = getOrCreateCollaborationPeerBaseId();
    _collaborationSignalingChannels = readCollaborationSignalingChannels();
    _collaborationRtcConfiguration = readCollaborationRtcConfiguration();
    _collaborationSessionOverrides = new WeakMap();
    _collaborationTransports = new WeakMap();
    _closeCollaborationHelpPopup;
    async ready() {
        this._dock = this._getDomElement('dock');
        this._paletteTree = this._getDomElement('paletteTree');
        this._bindableObjectsBrowser = this._getDomElement('bindableObjectsBrowser');
        this._treeViewExtended = this._getDomElement('treeViewExtended');
        this._refactorView = this._getDomElement('refactorView');
        this._propertyGrid = this._getDomElement('propertyGrid');
        this._debugView = this._getDomElement('debugView');
        this._styleEditor = this._getDomElement('styleEditor');
        this._miniatureView = this._getDomElement('miniature');
        this._npmInput = this._getDomElement('npmInput');
        this._npmStatus = this._getDomElement('npmStatus');
        this._getNpm = this._getDomElement('getNpm');
        let loadAllImports = window.location.search.includes("loadAllImports");
        const loadPkg = async () => {
            const pkgName = this._npmInput.value;
            if (pkgName.startsWith('http://') || pkgName.startsWith('https://')) {
                const observedCustomElementsRegistry = new ObservedCustomElementsRegistry();
                try {
                    await import(pkgName);
                }
                catch (error) {
                    console.error("Error loading url with import, trying with script tag.", error);
                    try {
                        await LazyLoader.LoadJavascript(pkgName);
                    }
                    catch (error) {
                        console.error("Error loading url with script tag.", error);
                    }
                }
                await sleep(500);
                const newElements = observedCustomElementsRegistry.getNewElements();
                if (newElements.length > 0 && serviceContainer && this._paletteTree) {
                    const elementsCfg = {
                        elements: newElements
                    };
                    let elService = new PreDefinedElementsService(pkgName, elementsCfg);
                    serviceContainer.register('elementsService', elService);
                    this._paletteTree.loadControls(serviceContainer, serviceContainer.elementsServices);
                }
                observedCustomElementsRegistry.dispose();
            }
            else {
                let res = await this._npmPackageLoader.loadNpmPackage(pkgName, serviceContainer, this._paletteTree, loadAllImports, state => this._npmStatus.innerText = state);
                if (res.html) {
                    let element = this._dock.getElementInSlot(this._dockManager.activeDocument.elementContent);
                    element.content = res.html + element.content;
                }
            }
            this._npmInput.value = '';
        };
        this._npmInput.onkeydown = (event) => {
            if (event.key === 'Enter') {
                loadPkg();
            }
        };
        this._getNpm.onclick = loadPkg;
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
                code = decodeURIComponent(p.substring(5));
            if (p.startsWith('style='))
                style = decodeURIComponent(p.substring(6));
            if (p.startsWith('demo=')) {
                const d = decodeURIComponent(p.substring(5));
                code = '';
                if (d == '1') {
                    for (let i = 0; i < 300; i++) {
                        let l = 20 + (80 * (i % 10));
                        let t = 30 + (30 * Math.round(i / 10));
                        code += '<button style="width:80px;height:30px;position:absolute;left:' + l + 'px;top:' + t + 'px;">Button</button>';
                    }
                }
            }
        }
        await customElements.whenDefined('dock-spawn-ts');
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = "./assets/dockspawn.css";
        this._dock.shadowRoot.appendChild(linkElement);
        this._dockManager = this._dock.dockManager;
        new CommandHandling(this._dockManager, this, serviceContainer);
        this._dockManager.addLayoutListener({
            onActiveDocumentChange: async (manager, panel) => {
                if (panel) {
                    let element = this._dock.getElementInSlot(panel.elementContent);
                    if (element && element instanceof DocumentContainer) {
                        let sampleDocument = element;
                        this._styleEditor.model = sampleDocument.additionalData?.model;
                        this._propertyGrid.instanceServiceContainer = sampleDocument.instanceServiceContainer;
                        this._treeViewExtended.instanceServiceContainer = sampleDocument.instanceServiceContainer;
                        this._refactorView.instanceServiceContainer = sampleDocument.instanceServiceContainer;
                        this._miniatureView.instanceServiceContainer = sampleDocument.instanceServiceContainer;
                        sampleDocument.instanceServiceContainer.selectionService.onSelectionChanged.on(e => {
                            this._debugView.update(e.selectedElements[0]);
                        });
                    }
                }
            },
            onClosePanel: (manager, panel) => {
                if (panel) {
                    let element = this._dock.getElementInSlot(panel.elementContent);
                    if (element && element instanceof DocumentContainer) {
                        element.dispose();
                        if (this._styleChangedCb)
                            this._styleChangedCb.dispose();
                        this._styleChangedCb = null;
                    }
                }
            }
        });
        await this._setupServiceContainer();
        this._bindableObjectsBrowser.initialize(serviceContainer, null, 'itemsView');
        //@ts-ignore
        this._propertyGrid.propertyGrid.propertyGroupHover = (group) => group.properties?.[0]?.styleDeclaration;
        this._propertyGrid.propertyGrid.propertyContextMenuProvider = (designItems, property) => {
            const ctxMenuItems = property.service.getContextMenu(designItems, property);
            if (property.service.isSet(designItems, property) == ValueType.fromStylesheet) {
                ctxMenuItems.push(...[
                    { title: '-' },
                    {
                        title: 'jump to declaration', action: () => {
                            //@ts-ignore
                            let styleDeclaration = property.styleDeclaration;
                            if (!styleDeclaration)
                                styleDeclaration = designItems[0].getAllStyles().filter(x => x.selector != null).flatMap(x => x.declarations).find(x => x.name == property.name);
                            if (styleDeclaration)
                                //@ts-ignore
                                this.jumpToCss(styleDeclaration.ast, styleDeclaration.stylesheet);
                        }
                    }
                ]);
            }
            ;
            return ctxMenuItems;
        };
        this._propertyGrid.propertyGrid.propertyGroupClick = (group, mode) => {
            //@ts-ignore
            if (group.properties?.[0]?.styleDeclaration?.ast?.parent)
                //@ts-ignore
                this.jumpToCss(group.properties?.[0]?.styleDeclaration?.ast?.parent, group.properties?.[0]?.styleDeclaration?.stylesheet);
            //}
        };
        this.newDocument(false, code, style);
        await sleep(200);
        this.activateDockById('treeUpper');
        this.activateDockById('lower');
        this.LLM();
    }
    jumpToCss(styleDeclaration, stylesheet) {
        //@ts-ignore
        const line = styleDeclaration.position?.start?.line;
        //@ts-ignore
        const column = styleDeclaration.position?.start?.column;
        //@ts-ignore
        const lineEnd = styleDeclaration.position?.end?.line;
        //@ts-ignore
        const columnEnd = styleDeclaration.position?.end?.column;
        //@ts-ignore
        if (stylesheet?.designItem) {
            //@ts-ignore
            const di = stylesheet?.designItem;
            let switched = false;
            if (di.instanceServiceContainer.documentContainer.currentView != 'code' &&
                di.instanceServiceContainer.documentContainer.currentView != 'split') {
                switched = true;
                di.instanceServiceContainer.documentContainer.currentView = 'split';
            }
            setTimeout(() => {
                let startPos = column;
                let endPos = columnEnd;
                //@ts-ignore
                const cssCode = stylesheet?.content;
                const lines = cssCode.split('\n');
                for (let n = 0; n < lineEnd - 1; n++) {
                    if (n < line - 1)
                        startPos += lines[n].length + 1;
                    endPos += lines[n].length + 1;
                }
                const selectionPosition = di.instanceServiceContainer.designItemDocumentPositionService.getPosition(di);
                //TODO: style tag could contain attributes
                const styleLength = '<style>'.length;
                di.instanceServiceContainer.documentContainer.codeView.setSelection({ start: startPos + styleLength + selectionPosition.start - 1, length: endPos - startPos });
            }, switched ? 250 : 0);
        }
        else {
            this._styleEditor.showLine(line, column, lineEnd, columnEnd);
        }
    }
    async _setupServiceContainer() {
        serviceContainer.register('elementsService', new JsonFileElementsService('demo', './dist/elements-demo.json'));
        serviceContainer.register('elementsService', new JsonFileElementsService('native', rootDir + '/node_modules/@node-projects/web-component-designer/config/elements-native.json'));
        serviceContainer.register('bindableObjectsService', new CustomBindableObjectsService());
        serviceContainer.register('bindableObjectDragDropService', new CustomBindableObjectDragDropService());
        this._paletteTree.loadControls(serviceContainer, serviceContainer.elementsServices);
        this._propertyGrid.serviceContainer = serviceContainer;
    }
    newDocument(fixedWidth, code, style) {
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
                    clearTimeout(timer);
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
        requestAnimationFrame(() => this._initializeCollaboration(sampleDocument));
    }
    _getCollaborationDisplayName() {
        const params = new URLSearchParams(window.location.search);
        return params.get('peerName') ?? `tab-${this._collaborationPeerBaseId.substring(0, 4)}`;
    }
    _getCollaborationPeerId(documentContainer) {
        return `${this._collaborationPeerBaseId}:${documentContainer.title}`;
    }
    _getCollaborationSessionId(documentContainer) {
        const params = new URLSearchParams(window.location.search);
        return this._collaborationSessionOverrides.get(documentContainer) ?? params.get('collabSession') ?? documentContainer.title;
    }
    _getOrCreateCollaborationTransport(documentContainer) {
        let transport = this._collaborationTransports.get(documentContainer);
        if (!transport) {
            transport = new WebRtcTabCollaborationTransport({
                enabledSignalingChannels: this._collaborationSignalingChannels,
                rtcConfiguration: this._collaborationRtcConfiguration,
            });
            this._collaborationTransports.set(documentContainer, transport);
        }
        else {
            transport.setEnabledSignalingChannels(this._collaborationSignalingChannels);
            transport.setRtcConfiguration?.(this._collaborationRtcConfiguration);
        }
        return transport;
    }
    _getActiveDocumentContainer() {
        return this._dockManager?.activeDocument?.resolvedElementContent;
    }
    _setCollaborationSignalingChannels(channels) {
        const normalizedChannels = [...new Set(channels.filter(isCollaborationSignalingChannelKind))];
        if (normalizedChannels.length === 0) {
            alert('At least one collaboration signaling channel must stay enabled.');
            return;
        }
        this._collaborationSignalingChannels = normalizedChannels;
        writeCollaborationSignalingChannels(this._collaborationSignalingChannels);
        const documents = Array.from(this._dock.querySelectorAll('node-projects-document-container'));
        for (const documentContainer of documents)
            this._collaborationTransports.get(documentContainer)?.setEnabledSignalingChannels(this._collaborationSignalingChannels);
    }
    _toggleCollaborationSignalingChannel(channel) {
        const nextChannels = this._collaborationSignalingChannels.includes(channel)
            ? this._collaborationSignalingChannels.filter(x => x !== channel)
            : [...this._collaborationSignalingChannels, channel];
        this._setCollaborationSignalingChannels(nextChannels);
    }
    _setCollaborationRtcConfiguration(configuration) {
        const nextConfiguration = cloneCollaborationRtcConfiguration(configuration) ?? cloneCollaborationRtcConfiguration(defaultCollaborationRtcConfiguration);
        this._collaborationRtcConfiguration = nextConfiguration;
        writeCollaborationRtcConfiguration(nextConfiguration);
        const documents = Array.from(this._dock.querySelectorAll('node-projects-document-container'));
        for (const documentContainer of documents)
            this._reconnectCollaboration(documentContainer, true);
    }
    async _fetchCloudflareTurnConfiguration() {
        const turnKeyId = prompt('Cloudflare TURN key id', '');
        if (!turnKeyId?.trim())
            return;
        const apiToken = prompt('Cloudflare TURN API token (testing only, this stays in the browser request)', '');
        if (!apiToken?.trim())
            return;
        const ttlValue = prompt('Cloudflare TURN credential TTL in seconds', '3600');
        if (ttlValue == null)
            return;
        const ttl = Number(ttlValue.trim() || '3600');
        if (!Number.isFinite(ttl) || ttl <= 0) {
            alert('Cloudflare TURN TTL must be a positive number of seconds.');
            return;
        }
        let response;
        try {
            response = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(turnKeyId.trim())}/credentials/generate-ice-servers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken.trim()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ttl: Math.floor(ttl) })
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            alert(`Could not reach Cloudflare TURN API: ${message}`);
            return;
        }
        const responseText = await response.text();
        if (!response.ok) {
            alert(`Cloudflare TURN API returned ${response.status}: ${responseText}`);
            return;
        }
        try {
            const configuration = filterRtcConfigurationForBrowser(normalizeCollaborationRtcConfiguration(JSON.parse(responseText)));
            this._setCollaborationRtcConfiguration(configuration);
            alert('Applied Cloudflare TURN configuration.');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            alert(`Could not apply Cloudflare TURN configuration: ${message}`);
        }
    }
    _reconnectCollaboration(documentContainer, recreateTransport = false) {
        const collaborationService = documentContainer.instanceServiceContainer.collaborationService;
        if (!collaborationService)
            return;
        collaborationService.disconnect();
        if (recreateTransport)
            this._collaborationTransports.delete(documentContainer);
        const transport = this._getOrCreateCollaborationTransport(documentContainer);
        collaborationService.attachTransport(transport);
        collaborationService.connect(this._getCollaborationSessionId(documentContainer), this._getCollaborationPeerId(documentContainer), this._getCollaborationDisplayName());
    }
    async _copyTextToClipboard(text, promptTitle) {
        try {
            await navigator.clipboard.writeText(text);
            //alert(`${promptTitle} copied to the clipboard.`);
        }
        catch {
            prompt(promptTitle, text);
        }
    }
    async _readTextForPrompt(promptTitle) {
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText?.trim())
                return clipboardText;
        }
        catch {
        }
        return prompt(promptTitle, '');
    }
    _showCollaborationHelpPopup(anchorEl) {
        this._closeCollaborationHelpPopup?.();
        const popup = this.ownerDocument.createElement('div');
        popup.style.width = '360px';
        popup.style.maxWidth = 'min(360px, calc(100vw - 32px))';
        popup.style.padding = '14px 16px';
        popup.style.border = '1px solid #c7cdd4';
        popup.style.borderRadius = '8px';
        popup.style.background = '#ffffff';
        popup.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.16)';
        popup.style.color = '#1f2933';
        popup.style.font = '13px/1.45 monospace';
        popup.innerHTML = `
      <div style="font-size: 14px; font-weight: 700; margin-bottom: 10px;">Connect another client</div>
      <div style="margin-bottom: 10px;">Always use the same session id in both clients.</div>
      <div style="font-weight: 700; margin-bottom: 6px;">Same browser tabs</div>
      <ol style="margin: 0 0 12px 18px; padding: 0;">
        <li>Keep <strong>broadcast signaling</strong> enabled in both tabs.</li>
        <li>Open the same document or set the same session id.</li>
        <li>The connection should start automatically.</li>
      </ol>
      <div style="font-weight: 700; margin-bottom: 6px;">Different browsers or different machines</div>
      <ol style="margin: 0 0 12px 18px; padding: 0;">
        <li>Keep <strong>manual copy/paste signaling</strong> enabled in both clients.</li>
        <li>Copy the signaling bundle in client A and paste it in client B.</li>
        <li>Copy the new signaling bundle in client B and paste it back in client A.</li>
        <li>If a client still shows a newer bundle, copy that one back once more.</li>
      </ol>
      <div style="margin-bottom: 12px;">The demo uses Google's public STUN server by default. For TURN, use <strong>free TURN providers</strong> in the collab menu. The first option applies the hardcoded Metered/OpenRelay credentials directly. Cloudflare TURN is still available for local testing with a TURN key id and API token, which stays exposed to the browser for that path.</div>
      <div style="margin-bottom: 12px;">The paste action reads from the clipboard directly when the browser allows it.</div>
    `;
        const closeButton = this.ownerDocument.createElement('button');
        closeButton.type = 'button';
        closeButton.textContent = 'close';
        closeButton.style.border = '1px solid #c7cdd4';
        closeButton.style.background = '#f5f7fa';
        closeButton.style.borderRadius = '6px';
        closeButton.style.padding = '6px 10px';
        closeButton.style.cursor = 'pointer';
        popup.appendChild(closeButton);
        this._closeCollaborationHelpPopup = showPopup(popup, anchorEl, () => {
            this._closeCollaborationHelpPopup = undefined;
        });
        closeButton.onclick = () => {
            this._closeCollaborationHelpPopup?.();
        };
    }
    _initializeCollaboration(documentContainer) {
        const collaborationService = documentContainer.instanceServiceContainer.collaborationService;
        if (!collaborationService)
            return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('collab') === '0')
            return;
        const transport = this._getOrCreateCollaborationTransport(documentContainer);
        collaborationService.attachTransport(transport);
        collaborationService.connect(this._getCollaborationSessionId(documentContainer), this._getCollaborationPeerId(documentContainer), this._getCollaborationDisplayName());
    }
    editTemplate(templateDesignItem) {
        this._documentNumber++;
        let sampleDocument = new DocumentContainer(serviceContainer);
        sampleDocument.setAttribute('dock-spawn-panel-type', 'document');
        sampleDocument.title = "template in " + templateDesignItem.parent.name;
        sampleDocument.tabIndex = 0;
        sampleDocument.addEventListener('keydown', (e) => {
            if (e.key == "Escape") {
                e.stopPropagation();
            }
        }, true);
        this._dock.appendChild(sampleDocument);
        sampleDocument.content = templateDesignItem.innerHTML;
        sampleDocument.onContentChanged.on(() => {
            templateDesignItem.innerHTML = sampleDocument.content;
            const html = DomConverter.ConvertToString([templateDesignItem.instanceServiceContainer.designerCanvas.rootDesignItem], false);
            const div = document.createElement('div');
            div.innerHTML = html;
            requestAnimationFrame(() => {
                div.querySelectorAll('node-projects-dce').forEach(x => x.upgradeAllInstances());
            });
        });
    }
    activateDockById(name) {
        this.activateDock(this._getDomElement(name));
    }
    activateDock(element) {
        const nd = this._dockManager.getNodeByElement(element);
        nd.parent.container.setActiveChild(nd.container);
    }
    _exportOverlays = false;
    showScreenshotContextMenu(e) {
        ContextMenu.show([
            {
                title: 'export as DXF', action: async () => {
                    this.exportData('dxf');
                }
            },
            {
                title: 'export as PDF', action: async () => {
                    this.exportData('pdf');
                }
            },
            {
                title: 'export as PNG', action: async () => {
                    this.exportData('png');
                }
            },
            {
                title: 'export as SVG', action: async () => {
                    this.exportData('svg');
                }
            },
            {
                title: 'export as HTML', action: async () => {
                    this.exportData('html');
                }
            },
            {
                title: 'export as EMF', action: async () => {
                    this.exportData('emf');
                }
            },
            {
                title: 'export as DWG (acad-ts)', action: async () => {
                    this.exportData('dwg');
                }
            },
            {
                title: 'export as DXF (acad-ts)', action: async () => {
                    this.exportData('dxf-acad-ts');
                }
            },
            { title: '-' },
            {
                title: 'export overlay', checked: this._exportOverlays, checkable: true, action: () => {
                    this._exportOverlays = !this._exportOverlays;
                }
            },
            { title: '-' },
            {
                title: 'export via screen-capture-api', action: () => {
                    const doc = this._dockManager.activeDocument.resolvedElementContent;
                    doc.executeCommand({ type: CommandType.screenshot, event: e });
                }
            }
        ], e);
    }
    async exportData(format) {
        const { extractIR, renderIR, DXFWriter, PDFWriter, PNGWriter, SVGWriter, HTMLWriter, EMFWriter, DWGWriter, AcadDXFWriter } = await import("@node-projects/layout2vector");
        const doc = this._dockManager.activeDocument.resolvedElementContent;
        const source = this._exportOverlays ? [
            doc.designerView.designerCanvas.rootDesignItem.element,
            doc.designerView.designerCanvas.overlayLayer
        ] : doc.designerView.designerCanvas.rootDesignItem.element;
        const ir = await extractIR(source, {
            boxType: "border", // "border" | "content"
            includeText: true, // extract text node geometry
            includeInvisible: false, // skip display:none / visibility:hidden
            includeImages: true,
            zoom: 1 / doc.designerView.designerCanvas.zoomFactor,
            convertFormControls: true, // convert form controls (input, select, textarea) to rectangles with text
            walkIframes: true, // recursively extract iframes
            textMeasurement: 'auto' // "auto" uses pretext library when needed
        });
        if (format === 'dxf') {
            const dxfWriter = new DXFWriter(document.documentElement.scrollHeight);
            const dxfString = await renderIR(ir, dxfWriter);
            await saveData(dxfString, "dxfFile", 'dxf');
        }
        else if (format === 'pdf') {
            const pdfWriter = new PDFWriter(1000, 1000);
            const pdfDoc = await renderIR(ir, pdfWriter);
            await pdfDoc.finalize();
            const pdfBytes = pdfDoc.toBytes();
            await saveData(pdfBytes, 'pdfFile', 'pdf');
        }
        else if (format === 'png') {
            const pngWriter = new PNGWriter(document.documentElement.scrollWidth, document.documentElement.scrollHeight);
            const pngResult = await renderIR(ir, pngWriter);
            await pngResult.finalize();
            const pngBytes = pngResult.toBytes();
            await saveData(pngBytes, 'pngFile', 'png');
        }
        else if (format === 'svg') {
            const svgWriter = new SVGWriter(2000, 1000);
            const svgString = await renderIR(ir, svgWriter);
            await saveData(svgString, 'svgFile', 'svg');
        }
        else if (format === 'html') {
            const htmlWriter = new HTMLWriter(1000, 2000);
            const htmlContent = await renderIR(ir, htmlWriter);
            await saveData(htmlContent, 'htmlFile', 'html');
        }
        else if (format === 'emf') {
            const emfWriter = new EMFWriter(1000, 2000);
            const emfContent = await renderIR(ir, emfWriter);
            await saveData(emfContent, 'emfFile', 'emf');
        }
        else if (format === 'dwg') {
            const dwgWriter = new DWGWriter({});
            const dwgContent = await renderIR(ir, dwgWriter);
            await saveData(dwgContent, 'dwgFile', 'dwg');
        }
        else if (format === 'dxf-acad-ts') {
            const dxfWriter = new AcadDXFWriter({});
            const dxfContent = await renderIR(ir, dxfWriter);
            await saveData(dxfContent, 'dxfFile', 'dxf');
        }
    }
    showCollaborationContextMenu(e) {
        const documentContainer = this._getActiveDocumentContainer();
        const collaborationService = documentContainer?.instanceServiceContainer.collaborationService;
        const transport = documentContainer ? this._collaborationTransports.get(documentContainer) : null;
        const currentSessionId = documentContainer ? this._getCollaborationSessionId(documentContainer) : null;
        const manualEnabled = this._collaborationSignalingChannels.includes('manual');
        const broadcastEnabled = this._collaborationSignalingChannels.includes('broadcast-channel');
        const rtcConfigurationSummary = summarizeCollaborationRtcConfiguration(this._collaborationRtcConfiguration);
        const manualBundle = transport?.getManualSignalingBundle();
        const popupAnchor = e.currentTarget instanceof HTMLElement ? e.currentTarget : document.querySelector('[data-command="collaboration"]');
        ContextMenu.show([
            {
                title: documentContainer ? `session: ${currentSessionId}` : 'no active document',
                disabled: true
            },
            {
                title: documentContainer ? `peer: ${this._getCollaborationPeerId(documentContainer)}` : 'peer: -',
                disabled: true
            },
            { title: '-' },
            {
                title: 'change session id...',
                disabled: !documentContainer || !collaborationService,
                action: () => {
                    if (!documentContainer)
                        return;
                    const currentValue = this._getCollaborationSessionId(documentContainer);
                    const nextValue = prompt('Set collaboration session id (leave empty to use the document title)', currentValue);
                    if (nextValue == null)
                        return;
                    const trimmedValue = nextValue.trim();
                    if (trimmedValue)
                        this._collaborationSessionOverrides.set(documentContainer, trimmedValue);
                    else
                        this._collaborationSessionOverrides.delete(documentContainer);
                    this._reconnectCollaboration(documentContainer);
                }
            },
            {
                title: 'copy session id',
                disabled: !documentContainer,
                action: () => {
                    if (!currentSessionId)
                        return;
                    void this._copyTextToClipboard(currentSessionId, 'Collaboration session id');
                }
            },
            {
                title: 'how to connect clients...',
                disabled: !popupAnchor,
                action: () => {
                    if (popupAnchor)
                        this._showCollaborationHelpPopup(popupAnchor);
                }
            },
            {
                title: `RTC: ${rtcConfigurationSummary}`,
                disabled: true
            },
            {
                title: 'edit RTC configuration...',
                action: () => {
                    const currentValue = JSON.stringify(this._collaborationRtcConfiguration ?? defaultCollaborationRtcConfiguration, null, 2);
                    const nextValue = prompt('Set RTC configuration JSON (leave empty to restore the default Google STUN server)', currentValue);
                    if (nextValue == null)
                        return;
                    const trimmedValue = nextValue.trim();
                    if (!trimmedValue) {
                        this._setCollaborationRtcConfiguration(defaultCollaborationRtcConfiguration);
                        return;
                    }
                    try {
                        const nextConfiguration = parseCollaborationRtcConfiguration(trimmedValue);
                        this._setCollaborationRtcConfiguration(nextConfiguration);
                    }
                    catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        alert(`Could not update RTC configuration: ${message}`);
                    }
                }
            },
            {
                title: 'reset to default STUN only',
                action: () => {
                    this._setCollaborationRtcConfiguration(defaultCollaborationRtcConfiguration);
                }
            },
            {
                title: 'free TURN providers',
                children: [
                    {
                        title: 'Metered TURN (hardcoded)',
                        children: [
                            {
                                title: 'apply hardcoded credentials now',
                                action: () => {
                                    this._setCollaborationRtcConfiguration(meteredTurnRtcConfiguration);
                                }
                            },
                            {
                                title: 'uses built-in Metered relay credentials',
                                disabled: true
                            },
                            {
                                title: 'open docs / signup',
                                action: () => {
                                    window.open(openRelayProjectUrl, '_blank', 'noopener,noreferrer');
                                }
                            },
                            {
                                title: 'paste iceServers JSON... ',
                                action: () => {
                                    const nextValue = prompt('Paste the iceServers JSON returned by your OpenRelay API call', '[\n  {\n    "urls": "stun:stun.relay.metered.ca:80"\n  },\n  {\n    "urls": ["turn:global.relay.metered.ca:80", "turn:global.relay.metered.ca:80?transport=tcp", "turn:global.relay.metered.ca:443", "turns:global.relay.metered.ca:443?transport=tcp"],\n    "username": "",\n    "credential": ""\n  }\n]');
                                    if (!nextValue?.trim())
                                        return;
                                    try {
                                        this._setCollaborationRtcConfiguration(parseCollaborationRtcConfiguration(nextValue));
                                    }
                                    catch (error) {
                                        const message = error instanceof Error ? error.message : String(error);
                                        alert(`Could not apply Metered ICE servers: ${message}`);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: 'Cloudflare TURN (official API)',
                        children: [
                            {
                                title: 'fetch credentials now... (dev/test)',
                                action: async () => {
                                    await this._fetchCloudflareTurnConfiguration();
                                }
                            },
                            {
                                title: 'requires TURN key id + API token',
                                disabled: true
                            },
                            {
                                title: 'open credential docs',
                                action: () => {
                                    window.open(cloudflareTurnDocsUrl, '_blank', 'noopener,noreferrer');
                                }
                            },
                            {
                                title: 'paste generate-ice-servers JSON...',
                                action: () => {
                                    const nextValue = prompt('Paste the JSON returned by Cloudflare generate-ice-servers', '{\n  "iceServers": [\n    {\n      "urls": ["stun:stun.cloudflare.com:3478"]\n    },\n    {\n      "urls": [\n        "turn:turn.cloudflare.com:3478?transport=udp",\n        "turn:turn.cloudflare.com:3478?transport=tcp",\n        "turns:turn.cloudflare.com:5349?transport=tcp"\n      ],\n      "username": "",\n      "credential": ""\n    }\n  ]\n}');
                                    if (!nextValue?.trim())
                                        return;
                                    try {
                                        this._setCollaborationRtcConfiguration(parseCollaborationRtcConfiguration(nextValue));
                                    }
                                    catch (error) {
                                        const message = error instanceof Error ? error.message : String(error);
                                        alert(`Could not apply Cloudflare TURN configuration: ${message}`);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: 'OpenRelay free tier (signup required)',
                        children: [
                            {
                                title: 'open docs / signup',
                                action: () => {
                                    window.open(openRelayProjectUrl, '_blank', 'noopener,noreferrer');
                                }
                            },
                            {
                                title: 'paste iceServers JSON...',
                                action: () => {
                                    const nextValue = prompt('Paste the iceServers JSON returned by your OpenRelay API call', '[\n  {\n    "urls": ["turn:yourapp.metered.live:80?transport=tcp", "turns:yourapp.metered.live:443?transport=tcp"],\n    "username": "",\n    "credential": ""\n  }\n]');
                                    if (!nextValue?.trim())
                                        return;
                                    try {
                                        this._setCollaborationRtcConfiguration(parseCollaborationRtcConfiguration(nextValue));
                                    }
                                    catch (error) {
                                        const message = error instanceof Error ? error.message : String(error);
                                        alert(`Could not apply OpenRelay ICE servers: ${message}`);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: 'legacy gist TURN hosts not added (not verified)',
                        disabled: true
                    }
                ]
            },
            { title: '-' },
            {
                title: 'broadcast signaling',
                checked: broadcastEnabled,
                checkable: true,
                disabled: !transport,
                action: () => {
                    this._toggleCollaborationSignalingChannel('broadcast-channel');
                }
            },
            {
                title: 'manual copy/paste signaling',
                checked: manualEnabled,
                checkable: true,
                disabled: !transport,
                action: () => {
                    this._toggleCollaborationSignalingChannel('manual');
                }
            },
            { title: '-' },
            {
                title: manualBundle ? `copy signaling bundle (${manualBundle.messages.length} messages)` : 'copy signaling bundle',
                disabled: !transport || !manualEnabled,
                action: async () => {
                    if (!transport)
                        return;
                    const data = transport.exportManualSignalingData();
                    if (!data) {
                        alert('No collaboration signaling data is available yet.');
                        return;
                    }
                    await this._copyTextToClipboard(data, 'Collaboration signaling data');
                }
            },
            {
                title: 'paste signaling bundle...',
                disabled: !transport || !manualEnabled,
                action: async () => {
                    if (!transport)
                        return;
                    const data = await this._readTextForPrompt('Paste collaboration signaling data');
                    if (!data?.trim())
                        return;
                    try {
                        const result = await transport.importManualSignalingData(data);
                        alert(`Imported ${result.importedCount} signaling message(s)${result.ignoredCount ? `, ignored ${result.ignoredCount}` : ''}.`);
                    }
                    catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        alert(`Could not import collaboration signaling data: ${message}`);
                    }
                }
            }
        ], e);
    }
    engine;
    async LLM() {
        let op = this._getDomElement('llmOutput');
        let btn = this._getDomElement('llmEnable');
        btn.onclick = async () => {
            op.innerHTML = "";
            this.initLLM();
        };
    }
    async initLLM() {
        const webllm = await import("@mlc-ai/web-llm");
        let op = this._getDomElement('llmOutput');
        // Initialize with a progress callback
        const initProgressCallback = (progress) => {
            op.innerText = "Model loading progress: " + Math.round(progress.progress * 100) + "%";
        };
        this.engine = await webllm.CreateMLCEngine("Llama-3.2-3B-Instruct-q4f16_1-MLC", { initProgressCallback });
        op.innerText = '';
        const ip = this._getDomElement('llmInput');
        ip.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter' && event.shiftKey) {
                event.preventDefault();
            }
            if (event.key === 'Enter' && !event.shiftKey) {
                const prompt = ip.value;
                ip.value = '';
                let sp = document.createElement('span');
                sp.innerText = prompt;
                op.appendChild(sp);
                let sp2 = document.createElement('span');
                sp2.style.alignSelf = 'end';
                sp2.innerText = "Processing...";
                op.appendChild(sp2);
                event.preventDefault();
                const documentContainer = this._dock.getElementInSlot(this._dockManager.activeDocument.elementContent);
                if (documentContainer) {
                    const html = documentContainer.content;
                    const css = documentContainer.additionalStylesheets?.[0]?.content ?? '';
                    try {
                        const result = await this.editHtmlCss(prompt, html, css);
                        documentContainer.content = result.html;
                        if (documentContainer.additionalStylesheets && documentContainer.additionalStylesheets.length > 0) {
                            documentContainer.additionalStylesheets = [
                                {
                                    name: "stylesheet.css",
                                    content: result.css
                                }
                            ];
                        }
                        sp2.innerText = "Done. Explanation: " + result.answer;
                    }
                    catch (error) {
                        sp2.innerText = "Error: " + error.message;
                        console.error("Error editing HTML/CSS:", error);
                    }
                }
            }
        });
    }
    async editHtmlCss(prompt, html, css) {
        const systemPrompt = `
You are an expert HTML and CSS editor inside a visual designer tool.

Return exactly three text blocks, each marked with:
---ANSWER---
---HTML---
---CSS---

DO:
- Write your explanation in the ANSWER section.
- If you do not change the HTML or CSS, return the original content in the respective section.

DO NOT:
- wrap anything in \`\`\` or any markdown
- add explanations after CSS
- add any text outside these blocks
- The CSS block must be the final content. Do not write anything after ---CSS--- section.
`;
        const userPrompt = `
USER REQUEST:
${prompt}

CURRENT HTML:
${html}

CURRENT CSS:
${css}
`;
        const response = await this.engine.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            stop: [
                "<|start_header_id|>",
                "<|end_header_id|>",
                "</s>"
            ]
        });
        const sections = {
            answer: "",
            html: "",
            css: ""
        };
        const text = response.choices[0].message.content ?? "";
        try {
            // markers
            const markers = ["---ANSWER---", "---HTML---", "---CSS---"];
            let current = null;
            const lines = text.split(/\r?\n/);
            for (const line of lines) {
                if (markers.includes(line.trim())) {
                    current = line.trim().slice(3).toLowerCase().slice(0, -3); // "answer", "html", "css"
                    continue;
                }
                if (current) {
                    sections[current] += (sections[current] ? "\n" : "") + line;
                }
            }
            return sections;
        }
        catch {
            throw new Error("Model did not return valid JSON:\n" + text);
        }
    }
}
window.customElements.define('node-projects-app-shell', AppShell);
