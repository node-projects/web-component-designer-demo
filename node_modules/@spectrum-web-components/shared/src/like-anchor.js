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
import { property, html, ifDefined, } from '@spectrum-web-components/base';
export function LikeAnchor(constructor) {
    class LikeAnchorElement extends constructor {
        renderAnchor({ id, className, ariaHidden, 
        // prettier-ignore
        anchorContent = html `<slot></slot>`, }) {
            // prettier-ignore
            return html `<a
                    id=${id}
                    class=${ifDefined(className)}
                    href=${ifDefined(this.href)}
                    download=${ifDefined(this.download)}
                    target=${ifDefined(this.target)}
                    aria-label=${ifDefined(this.label)}
                    aria-hidden=${ifDefined(ariaHidden ? 'true' : undefined)}
                    rel=${ifDefined(this.rel)}
                >${anchorContent}</a>`;
        }
    }
    __decorate([
        property({ reflect: true })
    ], LikeAnchorElement.prototype, "download", void 0);
    __decorate([
        property()
    ], LikeAnchorElement.prototype, "label", void 0);
    __decorate([
        property({ reflect: true })
    ], LikeAnchorElement.prototype, "href", void 0);
    __decorate([
        property({ reflect: true })
    ], LikeAnchorElement.prototype, "target", void 0);
    __decorate([
        property({ reflect: true })
    ], LikeAnchorElement.prototype, "rel", void 0);
    return LikeAnchorElement;
}
//# sourceMappingURL=like-anchor.js.map