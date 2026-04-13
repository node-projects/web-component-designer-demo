export class DwgException extends Error {
    innerError;
    constructor(message, inner) {
        super(message);
        this.name = 'DwgException';
        this.innerError = inner ?? null;
    }
}
//# sourceMappingURL=DwgException.js.map