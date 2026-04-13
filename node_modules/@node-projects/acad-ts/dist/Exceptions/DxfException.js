export class DxfException extends Error {
    constructor(codeOrMessage, line) {
        if (typeof codeOrMessage === 'number' && line !== undefined) {
            super(`Invalid dxf code with value ${codeOrMessage}, at line ${line}.`);
        }
        else if (typeof codeOrMessage === 'string' && line !== undefined) {
            super(`${codeOrMessage}, at line ${line}.`);
        }
        else {
            super(codeOrMessage);
        }
        this.name = 'DxfException';
    }
}
//# sourceMappingURL=DxfException.js.map