import { XY } from '../Math/XY.js';
export class PaperMargin {
    left;
    bottom;
    right;
    top;
    get bottomLeftCorner() { return new XY(this.left, this.bottom); }
    get topCorner() { return new XY(this.right, this.top); }
    constructor(left = 0, bottom = 0, right = 0, top = 0) {
        this.left = left;
        this.bottom = bottom;
        this.right = right;
        this.top = top;
    }
}
//# sourceMappingURL=PaperMargin.js.map