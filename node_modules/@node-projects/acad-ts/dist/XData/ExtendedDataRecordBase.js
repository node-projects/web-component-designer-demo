export class ExtendedDataRecord {
    get code() {
        return this._code;
    }
    get rawValue() {
        return this._value;
    }
    _code;
    _value;
    constructor(code, value) {
        this._code = code;
        this._value = value;
    }
    toString() {
        return `${this.code}:${this._value}`;
    }
    static create(_groupCode, _value) {
        throw new Error('ExtendedDataRecord factory not initialized');
    }
}
export class ExtendedDataRecordT extends ExtendedDataRecord {
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
    }
    constructor(code, value) {
        super(code, value);
    }
}
//# sourceMappingURL=ExtendedDataRecordBase.js.map