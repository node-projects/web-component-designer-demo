import { __decorate } from "tslib";
/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { queryAssignedNodes, property, } from '@spectrum-web-components/base';
const slotElementObserver = Symbol('slotElementObserver');
const assignedNodesList = Symbol('assignedNodes');
const startObserving = Symbol('startObserving');
export function ObserveSlotText(constructor, slotSelector) {
    var _a;
    class SlotTextObservingElement extends constructor {
        constructor() {
            super(...arguments);
            this.slotHasContent = false;
        }
        manageTextObservedSlot() {
            if (!this[assignedNodesList])
                return;
            const assignedNodes = [...this[assignedNodesList]].filter((node) => {
                if (node.tagName) {
                    return true;
                }
                return node.textContent ? node.textContent.trim() : false;
            });
            this.slotHasContent = assignedNodes.length > 0;
        }
        firstUpdated(changedProperties) {
            super.firstUpdated(changedProperties);
            this.manageTextObservedSlot();
        }
        [(_a = assignedNodesList, startObserving)]() {
            const config = { characterData: true, subtree: true };
            if (!this[slotElementObserver]) {
                const callback = (mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'characterData') {
                            this.manageTextObservedSlot();
                        }
                    }
                };
                this[slotElementObserver] = new MutationObserver(callback);
            }
            this[slotElementObserver].observe(this, config);
        }
        connectedCallback() {
            super.connectedCallback();
            this[startObserving]();
        }
        disconnectedCallback() {
            if (this[slotElementObserver]) {
                this[slotElementObserver].disconnect();
            }
            super.disconnectedCallback();
        }
    }
    __decorate([
        property({ type: Boolean, attribute: false })
    ], SlotTextObservingElement.prototype, "slotHasContent", void 0);
    __decorate([
        queryAssignedNodes(slotSelector, true)
    ], SlotTextObservingElement.prototype, _a, void 0);
    return SlotTextObservingElement;
}
//# sourceMappingURL=observe-slot-text.js.map