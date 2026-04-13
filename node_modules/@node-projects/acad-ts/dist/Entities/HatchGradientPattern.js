export class HatchGradientPattern {
    enabled = false;
    reserved = 0;
    angle = 0;
    shift = 0;
    isSingleColorGradient = false;
    colorTint = 0;
    colors = [];
    name = '';
    constructor(name) {
        if (name) {
            this.name = name;
        }
    }
    clone() {
        const c = new HatchGradientPattern();
        c.enabled = this.enabled;
        c.reserved = this.reserved;
        c.angle = this.angle;
        c.shift = this.shift;
        c.isSingleColorGradient = this.isSingleColorGradient;
        c.colorTint = this.colorTint;
        c.name = this.name;
        c.colors = this.colors.map(gc => gc.clone());
        return c;
    }
}
//# sourceMappingURL=HatchGradientPattern.js.map