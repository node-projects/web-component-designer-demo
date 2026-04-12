import {PickrElement} from './pickr-element.js';
import {monolithSheet} from './styles/monolith.js';

export class PickrMonolith extends PickrElement {
    static styleSheet = monolithSheet;
    static defaultSliders = 'h';
}

if (!customElements.get('pickr-monolith')) {
    customElements.define('pickr-monolith', PickrMonolith);
}
