import { BaseCustomWebComponentConstructorAppend, css, html, Disposable } from "@node-projects/base-custom-webcomponent";
import { DesignerCanvas, IMiniatureView, InstanceServiceContainer } from "@node-projects/web-component-designer";

//TODO: with click on miniature view move main view to the position of the click
//use: this._instanceServiceContainer.designerCanvas.canvasOffset = {x: ..., y: ... }

export class MiniatureView extends BaseCustomWebComponentConstructorAppend implements IMiniatureView {

  static override readonly style = css`
        :host {
          overflow:hidden;
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
        }
        #outerDiv {
          width: 100%;
          height: 100%;
        }
        #innerDiv {
          transform-origin: top left;
          height: 100%;
          width: 100%;
          image-rendering: pixelated;
        }
        #above {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: auto;
          background: transparent;
        }
        #viewRect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 1px solid black;
        }`;

  static override readonly template = html`
        <div id="outerDiv">
          <div id="innerDiv"></div> 
        </div>
        <div id="above">
          <div id="viewRect"></div>
        </div>`;

  private _innerDiv: HTMLDivElement;
  private _outerDiv: HTMLDivElement;
  private _instanceServiceContainer: InstanceServiceContainer;
  private _contentChangedHandler: Disposable;
  private _maxX = 0;
  private _maxY = 0;
  private _resizeObserver: ResizeObserver;
  private _innerShadow: ShadowRoot;
  private _zoomFactorChangedHandler: Disposable;
  private _viewRect: HTMLDivElement;
  private _minatureScaleX = 1;
  private _minatureScaleY = 1;
  private _reRenderFlag = false;
  //private _cachedMiniatureViews = new WeakMap<InstanceServiceContainer, HTMLDivElement>();

  constructor() {
    super();
    this._restoreCachedInititalValues();

    this._outerDiv = this._getDomElement<HTMLDivElement>('outerDiv');
    this._innerDiv = this._getDomElement<HTMLDivElement>('innerDiv');
    this._viewRect = this._getDomElement<HTMLDivElement>('viewRect');
    this._innerShadow = this._innerDiv.attachShadow({ mode: 'open' });

    this._resizeObserver = new ResizeObserver(() => {
      this._reSize();
    });
  }

  ready() {
    this._resizeObserver.observe(this);
  }

  private _reSize() {
    const outerRect = this._outerDiv.getBoundingClientRect();
    this._minatureScaleX = outerRect.width / this._maxX;
    this._minatureScaleY = outerRect.height / this._maxY;
    this._innerDiv.style.scale = this._minatureScaleX + ' ' + this._minatureScaleY;
  }

  private async _reRender() {
    if (this._instanceServiceContainer) {
      const designerCanvas = this._instanceServiceContainer?.designerCanvas;
      this._innerShadow.adoptedStyleSheets = [...designerCanvas.rootDesignItem.element.shadowRoot.adoptedStyleSheets];

      this._maxX = 0;
      this._maxY = 0;

      console.time('miniature render');
      let el = document.createDocumentFragment();
      for (const e of designerCanvas.rootDesignItem.children()) {
        //if (!(e.element instanceof UiMove)) { //TODO: maybe add an option to hide some elements in the miniature view
          const { x, y, width, height } = designerCanvas.getNormalizedElementCoordinates(e.element);
          this._maxX = Math.max(this._maxX, x + width);
          this._maxY = Math.max(this._maxY, y + height);
          el.appendChild(e.element.cloneNode(true));
        //}
      }
      this._innerShadow.replaceChildren(el);
      console.timeEnd('miniature render');
      this._reSize();
      this._reDrawRect();
      this._reRenderFlag = false;
    }
  }

  private _reDrawRect() {
    const designerCanvas = this._instanceServiceContainer?.designerCanvas;
    const offset = designerCanvas.canvasOffset;
    const zoom = designerCanvas.zoomFactor;

    this._viewRect.style.left = (offset.x / this._maxX * 100) + '%';
    this._viewRect.style.top = (offset.y / this._maxY * 100) + '%';
    this._viewRect.style.width = (designerCanvas.clientWidth / zoom / this._maxX * 100) + '%';
    this._viewRect.style.height = (designerCanvas.clientHeight / zoom / this._maxY * 100) + '%';
  }

  public set instanceServiceContainer(value: InstanceServiceContainer) {
    this._contentChangedHandler?.dispose()
    this._zoomFactorChangedHandler?.dispose();
    this._instanceServiceContainer = value;
    if (this._instanceServiceContainer) {
      this._zoomFactorChangedHandler = (<DesignerCanvas>this._instanceServiceContainer.designerCanvas).onZoomFactorChanged.on(() => {
        this._reDrawRect();
      });
      this._contentChangedHandler = this._instanceServiceContainer.contentService.onContentChanged.on(e => {
        if (this._reRenderFlag === false) {
          this._reRenderFlag = true;
          setTimeout(() => this._reRender(), 50);
        }
      });
      if (this._reRenderFlag === false) {
        this._reRenderFlag = true;
        setTimeout(() => this._reRender(), 50);
      }
    } else {
      this._innerShadow.innerHTML = "";
    }
  }
}

customElements.define('node-projects-web-component-designer-miniature-view', MiniatureView);