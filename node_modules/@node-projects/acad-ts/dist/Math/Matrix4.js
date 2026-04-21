export class Matrix4 {
    m00 = 1;
    m01 = 0;
    m02 = 0;
    m03 = 0;
    m10 = 0;
    m11 = 1;
    m12 = 0;
    m13 = 0;
    m20 = 0;
    m21 = 0;
    m22 = 1;
    m23 = 0;
    m30 = 0;
    m31 = 0;
    m32 = 0;
    m33 = 1;
    constructor(values) {
        if (!values || values.length === 0) {
            return;
        }
        if (values.length !== 16) {
            throw new Error('Matrix4 requires 16 values.');
        }
        [
            this.m00, this.m01, this.m02, this.m03,
            this.m10, this.m11, this.m12, this.m13,
            this.m20, this.m21, this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33,
        ] = values;
    }
    static identity() {
        return new Matrix4();
    }
    get(row, col) {
        const key = `m${row}${col}`;
        return this[key];
    }
    setElement(row, col, value) {
        const key = `m${row}${col}`;
        this[key] = value;
    }
}
//# sourceMappingURL=Matrix4.js.map