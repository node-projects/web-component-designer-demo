import { SvgConfiguration } from './SVG/SvgConfiguration.js';
import { SvgXmlWriter } from './SVG/SvgXmlWriter.js';
import { CadWriterBase } from './CadWriterBase.js';
export class SvgWriter extends CadWriterBase {
    _writer;
    constructor(stream, document) {
        super(stream, document);
    }
    createDefaultConfiguration() {
        return new SvgConfiguration();
    }
    dispose() {
        // No-op in TS
    }
    write() {
        this.writeBlock(this._document.modelSpace);
    }
    writeBlock(record) {
        this._createWriter();
        this._writer.writeBlock(record);
    }
    writeLayout(layout) {
        this._createWriter();
        this._writer.writeLayout(layout);
    }
    _createWriter() {
        this._writer = new SvgXmlWriter(this._stream, this._encoding, this.configuration);
        this._writer.onNotification = (sender, e) => this.triggerNotification(sender, e);
    }
}
//# sourceMappingURL=SvgWriter.js.map