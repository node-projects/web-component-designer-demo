import { CadWriterBase } from '../CadWriterBase.js';
import { DxfWriterConfiguration } from './DxfWriterConfiguration.js';
import { DxfAsciiWriter } from './DxfStreamWriter/DxfAsciiWriter.js';
import { DxfBinaryWriter } from './DxfStreamWriter/DxfBinaryWriter.js';
import { DxfHeaderSectionWriter } from './DxfStreamWriter/DxfHeaderSectionWriter.js';
import { DxfClassesSectionWriter } from './DxfStreamWriter/DxfClassesSectionWriter.js';
import { DxfTablesSectionWriter } from './DxfStreamWriter/DxfTablesSectionWriter.js';
import { DxfBlocksSectionWriter } from './DxfStreamWriter/DxfBlocksSectionWriter.js';
import { DxfEntitiesSectionWriter } from './DxfStreamWriter/DxfEntitiesSectionWriter.js';
import { DxfObjectsSectionWriter } from './DxfStreamWriter/DxfObjectsSectionWriter.js';
import { CadObjectHolder } from './CadObjectHolder.js';
import { DxfCode } from '../../DxfCode.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { encodeCadString } from '../TextEncoding.js';
class Uint8ArrayTextOutput {
    _stream;
    _encoding;
    _position = 0;
    constructor(stream, encoding) {
        this._stream = stream;
        this._encoding = encoding;
    }
    write(value) {
        const bytes = encodeCadString(value, this._encoding);
        this._ensureCapacity(bytes.length);
        this._stream.set(bytes, this._position);
        this._position += bytes.length;
    }
    flush() { }
    close() { }
    _ensureCapacity(length) {
        if (this._position + length > this._stream.length) {
            throw new Error('DXF output buffer is too small.');
        }
    }
}
class Uint8ArrayBinaryOutput {
    _stream;
    _position = 0;
    constructor(stream) {
        this._stream = stream;
    }
    write(value) {
        this._ensureCapacity(value.length);
        this._stream.set(value, this._position);
        this._position += value.length;
    }
    flush() { }
    close() { }
    _ensureCapacity(length) {
        if (this._position + length > this._stream.length) {
            throw new Error('DXF output buffer is too small.');
        }
    }
}
export class DxfWriter extends CadWriterBase {
    isBinary;
    _writer;
    _objectHolder = new CadObjectHolder();
    constructor(stream, document, binary = false) {
        super(stream, document);
        this.isBinary = binary;
        this.configuration = new DxfWriterConfiguration();
    }
    write() {
        super.write();
        this._createStreamWriter();
        this._objectHolder.objects.push(this._document.rootDictionary);
        this._writeHeader();
        this._writeDxfClasses();
        this._writeTables();
        this._writeBlocks();
        this._writeEntities();
        this._writeObjects();
        this._writeACDSData();
        this._writer.write(DxfCode.Start, DxfFileToken.endOfFile);
        this._writer.flush();
        if (this.configuration.closeStream) {
            this._writer.close();
        }
    }
    dispose() {
        this._writer.dispose();
    }
    static writeToStream(stream, document, binary = false, configuration, notification) {
        const writer = new DxfWriter(stream, document, binary);
        if (configuration) {
            writer.configuration = configuration;
        }
        writer.onNotification = notification ?? null;
        writer.write();
        writer.dispose();
    }
    _createStreamWriter() {
        if (this.isBinary) {
            this._writer = new DxfBinaryWriter(this._createBinaryTarget(), this._encoding);
        }
        else {
            this._writer = new DxfAsciiWriter(this._createTextTarget());
        }
        this._writer.writeOptional = this.configuration.writeOptionalValues;
    }
    _createTextTarget() {
        if (this._stream instanceof Uint8Array) {
            return new Uint8ArrayTextOutput(this._stream, this._encoding);
        }
        return this._stream;
    }
    _createBinaryTarget() {
        if (this._stream instanceof Uint8Array) {
            return new Uint8ArrayBinaryOutput(this._stream);
        }
        return this._stream;
    }
    _writeHeader() {
        const writer = new DxfHeaderSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
        writer.onNotification = this.triggerNotification.bind(this);
        writer.write();
    }
    _writeDxfClasses() {
        const writer = new DxfClassesSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
        writer.onNotification = this.triggerNotification.bind(this);
        writer.write();
    }
    _writeTables() {
        const writer = new DxfTablesSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
        writer.onNotification = this.triggerNotification.bind(this);
        writer.write();
    }
    _writeBlocks() {
        const writer = new DxfBlocksSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
        writer.onNotification = this.triggerNotification.bind(this);
        writer.write();
    }
    _writeEntities() {
        const writer = new DxfEntitiesSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
        writer.onNotification = this.triggerNotification.bind(this);
        writer.write();
    }
    _writeObjects() {
        const writer = new DxfObjectsSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
        writer.onNotification = this.triggerNotification.bind(this);
        writer.write();
    }
    _writeACDSData() {
        // not implemented
    }
    createDefaultConfiguration() {
        return new DxfWriterConfiguration();
    }
}
//# sourceMappingURL=DxfWriter.js.map