export class CadNotSupportedException extends Error {
    constructor(version) {
        if (version !== undefined) {
            super(`File version not supported: ${version}`);
        }
        else {
            super('File version not recognized');
        }
        this.name = 'CadNotSupportedException';
    }
}
//# sourceMappingURL=CadNotSupportedException.js.map