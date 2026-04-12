import {PickrElement} from './pickr-element.js';
import {nanoSheet} from './styles/nano.js';

export class PickrNano extends PickrElement {
    static styleSheet = nanoSheet;
    static defaultSliders = 'h';
}

if (!customElements.get('pickr-nano')) {
    customElements.define('pickr-nano', PickrNano);
}
