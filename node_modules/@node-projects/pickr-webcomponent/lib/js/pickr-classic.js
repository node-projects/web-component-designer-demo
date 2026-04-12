import {PickrElement} from './pickr-element.js';
import {classicSheet} from './styles/classic.js';

export class PickrClassic extends PickrElement {
    static styleSheet = classicSheet;
    static defaultSliders = 'v';
}

if (!customElements.get('pickr-classic')) {
    customElements.define('pickr-classic', PickrClassic);
}
