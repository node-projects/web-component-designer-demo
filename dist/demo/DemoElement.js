var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCustomWebComponentConstructorAppend, css, customElement, html, property } from "@node-projects/base-custom-webcomponent";
import { DemoEnum } from './DemoEnum.js';
import { DemoStringEnum } from "./DemoStringEnum.js";
import { inDesigner } from "@node-projects/web-component-designer";
let DemoElement = class DemoElement extends BaseCustomWebComponentConstructorAppend {
    numberProp = 0;
    specialText = "abc";
    enumProperty = DemoEnum.value1;
    enumStringProperty = DemoStringEnum.value1;
    static style = css `
  :host {
      --aa: bb;
  }`;
    static template = html `
  <div>
    hello
    <div>[[this.numberProp]]</div>
    <div css:background="[[this.inDesigner ? 'red' : '']]">[[this.specialText]]</div>
    <div>[[this.enumProperty]]</div>
    <div id="cnt" style="background: lightblue;">Test JS Access</div>
    <slot></slot>
  </div>`;
    _cnt;
    _interval;
    inDesigner;
    constructor() {
        super();
        this._parseAttributesToProperties();
        this._bindingsParse();
        this._cnt = this._getDomElement('cnt');
        this._cnt.onclick = () => alert('test');
    }
    connectedCallback() {
        this._interval = setInterval(() => {
            this.numberProp++;
            this.inDesigner = inDesigner(this);
            this._bindingsRefresh();
        }, 500);
    }
    disconnectedCallback() {
        clearInterval(this._interval);
    }
};
__decorate([
    property(Number)
], DemoElement.prototype, "numberProp", void 0);
__decorate([
    property(String)
], DemoElement.prototype, "specialText", void 0);
__decorate([
    property(DemoEnum)
], DemoElement.prototype, "enumProperty", void 0);
__decorate([
    property(DemoStringEnum)
], DemoElement.prototype, "enumStringProperty", void 0);
__decorate([
    property(Boolean)
], DemoElement.prototype, "inDesigner", void 0);
DemoElement = __decorate([
    customElement('demo-element')
], DemoElement);
export { DemoElement };
