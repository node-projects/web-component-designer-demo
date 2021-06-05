var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

import { BaseCustomWebComponentConstructorAppend, customElement, html, property } from "../../node_modules/@node-projects/base-custom-webcomponent/dist/index.js";
import { DemoEnum } from "./DemoEnum.js";
import { DemoStringEnum } from "./DemoStringEnum.js";
let DemoElement = class DemoElement extends BaseCustomWebComponentConstructorAppend {
  constructor() {
    super();
    this.numberProp = 0;
    this.specialText = "abc";
    this.enumProperty = DemoEnum.value1;
    this.enumStringProperty = DemoStringEnum.value1;

    this._parseAttributesToProperties();

    this._createObservableProperties();

    this._bindingsParse();

    setInterval(() => {
      this.numberProp++;

      this._bindingsRefresh();
    }, 500);
    this._cnt = this._getDomElement('cnt');

    this._cnt.onclick = () => alert('test');
  }

};
DemoElement.template = html`
  <div>
    hello
    <div>[[this.numberProp]]</div>
    <div>[[this.specialText]]</div>
    <div>[[this.enumProperty]]</div>
    <div id="cnt" style="background: lightblue;">Test JS Access</div>
    <slot></slot>
    <!--<div>[[DemoEnum[this.enumProperty] ]]</div>-->
  </div>`;

__decorate([property(Number)], DemoElement.prototype, "numberProp", void 0);

__decorate([property(String)], DemoElement.prototype, "specialText", void 0);

__decorate([property(DemoEnum)], DemoElement.prototype, "enumProperty", void 0);

__decorate([property(DemoStringEnum)], DemoElement.prototype, "enumStringProperty", void 0);

DemoElement = __decorate([customElement('demo-element')], DemoElement);
export { DemoElement };