export class MathHelper {
    static epsilon = 1e-12;
    static pi = Math.PI;
    static halfPI = Math.PI / 2;
    static twoPI = Math.PI * 2;
    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    static radToDeg(radians) {
        return radians * (180 / Math.PI);
    }
    static radToGrad(radians) {
        return radians * (200 / Math.PI);
    }
    static isZero(value) {
        return Math.abs(value) < MathHelper.epsilon;
    }
    static fixZero(value) {
        return MathHelper.isZero(value) ? 0 : value;
    }
    static sin(angle) {
        return MathHelper.fixZero(Math.sin(angle));
    }
    static cos(angle) {
        return MathHelper.fixZero(Math.cos(angle));
    }
}
//# sourceMappingURL=MathHelper.js.map