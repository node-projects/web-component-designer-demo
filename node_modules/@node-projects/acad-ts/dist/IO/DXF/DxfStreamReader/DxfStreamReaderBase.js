import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { GroupCodeValue, GroupCodeValueType } from '../../../GroupCodeValue.js';
import { DxfException } from '../../../Exceptions/DxfException.js';
import { MathHelper } from '../../../Math/MathHelper.js';
import { decodeCadString, getDecoderEncodingLabel } from '../../TextEncoding.js';
export class DxfStreamReaderBase {
    encoding = getDecoderEncodingLabel('ANSI_1252');
    dxfCode = DxfCode.Invalid;
    groupCodeValue = GroupCodeValueType.None;
    get code() {
        return this.dxfCode;
    }
    value = '';
    position = 0;
    valueRaw = '';
    get valueAsString() {
        return String(this.value)
            .replace(/\^J/g, '\n')
            .replace(/\^M/g, '\r')
            .replace(/\^I/g, '\t')
            .replace(/\^ /g, '^');
    }
    get valueAsBool() {
        return Boolean(this.value);
    }
    get valueAsShort() {
        return Number(this.value) & 0xFFFF;
    }
    get valueAsUShort() {
        return (Number(this.value) & 0xFFFF) >>> 0;
    }
    get valueAsInt() {
        return Number(this.value) | 0;
    }
    get valueAsLong() {
        return Number(this.value);
    }
    get valueAsDouble() {
        return Number(this.value);
    }
    get valueAsAngle() {
        return MathHelper.degToRad(Number(this.value));
    }
    get valueAsHandle() {
        return Number(this.value);
    }
    get valueAsBinaryChunk() {
        return this.value;
    }
    readNext() {
        this.dxfCode = this.readCode();
        this.groupCodeValue = GroupCodeValue.transformValue(this.code);
        this.value = this._transformValue(this.groupCodeValue);
        if (this.dxfCode === DxfCode.Comment) {
            this.readNext();
        }
    }
    find(dxfEntry) {
        this.start();
        do {
            this.readNext();
        } while (this.valueAsString !== dxfEntry && this.valueAsString !== DxfFileToken.endOfFile);
        return this.valueAsString === dxfEntry;
    }
    expectedCode(code) {
        this.readNext();
        if (this.code !== code) {
            throw new DxfException(code, this.position);
        }
    }
    toString() {
        return `${this.code} | ${this.value}`;
    }
    start() {
        this.dxfCode = DxfCode.Invalid;
        this.value = '';
        this._streamPosition = 0;
        this.position = 0;
    }
    _streamPosition = 0;
    decodeString(bytes) {
        return decodeCadString(bytes, this.encoding);
    }
    _transformValue(code) {
        switch (code) {
            case GroupCodeValueType.String:
            case GroupCodeValueType.Comment:
            case GroupCodeValueType.ExtendedDataString:
                return this.readStringLine();
            case GroupCodeValueType.Point3D:
            case GroupCodeValueType.Double:
            case GroupCodeValueType.ExtendedDataDouble:
                return this.lineAsDouble();
            case GroupCodeValueType.Byte:
            case GroupCodeValueType.Int16:
            case GroupCodeValueType.ExtendedDataInt16:
                return this.lineAsShort();
            case GroupCodeValueType.Int32:
            case GroupCodeValueType.ExtendedDataInt32:
                return this.lineAsInt();
            case GroupCodeValueType.Int64:
                return this.lineAsLong();
            case GroupCodeValueType.Handle:
            case GroupCodeValueType.ObjectId:
            case GroupCodeValueType.ExtendedDataHandle:
                return this.lineAsHandle();
            case GroupCodeValueType.Bool:
                return this.lineAsBool();
            case GroupCodeValueType.Chunk:
            case GroupCodeValueType.ExtendedDataChunk:
                return this.lineAsBinaryChunk();
            case GroupCodeValueType.None:
            default:
                throw new DxfException(code, this.position);
        }
    }
}
//# sourceMappingURL=DxfStreamReaderBase.js.map