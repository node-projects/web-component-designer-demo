import { BaseCustomWebComponentConstructorAppend, customElement, html, property } from "@node-projects/base-custom-webcomponent";
import { DemoEnum } from './DemoEnum';
import { DemoStringEnum } from "./DemoStringEnum";
import { inDesigner } from "@node-projects/web-component-designer";

@customElement('demo-element')
export class DemoElement extends BaseCustomWebComponentConstructorAppend {

  @property(Number)
  public numberProp: number = 0;

  @property(String)
  public specialText: string = "abc";

  @property(DemoEnum)
  public enumProperty: DemoEnum = DemoEnum.value1;

  @property(DemoStringEnum)
  public enumStringProperty: DemoStringEnum = DemoStringEnum.value1;

  static readonly template = html`
  <div>
    hello
    <div>[[this.numberProp]]</div>
    <div css:background="[[this.inDesigner ? 'red' : '']]">[[this.specialText]]</div>
    <div>[[this.enumProperty]]</div>
    <div id="cnt" style="background: lightblue;">Test JS Access</div>
    <slot></slot>
  </div>`

  private _cnt: HTMLDivElement;
  private _interval: NodeJS.Timer;

  @property(Boolean)
  inDesigner: boolean;

  constructor() {
    super();

    this._parseAttributesToProperties();
    this._bindingsParse();



    this._cnt = this._getDomElement<HTMLDivElement>('cnt');
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
}