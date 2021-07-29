const slotElementObserver = Symbol('slotElementObserver');
const startObserving = Symbol('startObserving');
const slotContentIsPresent = Symbol('slotContentIsPresent');
export function ObserveSlotPresence(constructor, lightDomSelector) {
    var _a;
    const lightDomSelectors = Array.isArray(lightDomSelector)
        ? lightDomSelector
        : [lightDomSelector];
    class SlotPresenceObservingElement extends constructor {
        constructor() {
            super(...arguments);
            this[_a] = new Map();
            this.managePresenceObservedSlot = () => {
                lightDomSelectors.forEach((selector) => {
                    this[slotContentIsPresent].set(selector, !!this.querySelector(selector));
                });
                this.requestUpdate();
            };
        }
        /**
         *  @private
         */
        get slotContentIsPresent() {
            if (lightDomSelectors.length === 1) {
                return (this[slotContentIsPresent].get(lightDomSelectors[0]) ||
                    false);
            }
            else {
                throw new Error('Multiple selectors provided to `ObserveSlotPresence` use `getSlotContentPresence(selector: string)` instead.');
            }
        }
        getSlotContentPresence(selector) {
            if (this[slotContentIsPresent].has(selector)) {
                return this[slotContentIsPresent].get(selector) || false;
            }
            throw new Error(`The provided selector \`\` is not being observed.`);
        }
        [(_a = slotContentIsPresent, startObserving)]() {
            const config = { childList: true, subtree: true };
            if (!this[slotElementObserver]) {
                this[slotElementObserver] = new MutationObserver(this.managePresenceObservedSlot);
            }
            this[slotElementObserver].observe(this, config);
            this.managePresenceObservedSlot();
        }
        connectedCallback() {
            super.connectedCallback();
            this[startObserving]();
        }
        disconnectedCallback() {
            this[slotElementObserver].disconnect();
            super.disconnectedCallback();
        }
    }
    return SlotPresenceObservingElement;
}
//# sourceMappingURL=observe-slot-presence.js.map