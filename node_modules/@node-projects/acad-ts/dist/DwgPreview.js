export class DwgPreview {
    code;
    rawHeader;
    rawImage;
    constructor(code, rawHeader, rawImage) {
        this.code = code ?? DwgPreview.PreviewType.Unknown;
        this.rawHeader = rawHeader ?? new Uint8Array(0);
        this.rawImage = rawImage ?? new Uint8Array(0);
    }
    toBytes() {
        let writeHeader = false;
        switch (this.code) {
            case DwgPreview.PreviewType.Bmp:
            case DwgPreview.PreviewType.Wmf:
            case DwgPreview.PreviewType.Png:
                writeHeader = false;
                break;
            case DwgPreview.PreviewType.Unknown:
            default:
                throw new Error(`Preview with code ${this.code} not supported.`);
        }
        if (writeHeader && this.rawHeader.length > 0) {
            const data = new Uint8Array(this.rawHeader.length + this.rawImage.length);
            data.set(this.rawHeader);
            data.set(this.rawImage, this.rawHeader.length);
            return data;
        }
        return this.rawImage.slice();
    }
}
(function (DwgPreview) {
    let PreviewType;
    (function (PreviewType) {
        PreviewType[PreviewType["Unknown"] = 0] = "Unknown";
        PreviewType[PreviewType["Bmp"] = 2] = "Bmp";
        PreviewType[PreviewType["Wmf"] = 3] = "Wmf";
        PreviewType[PreviewType["Png"] = 6] = "Png";
    })(PreviewType = DwgPreview.PreviewType || (DwgPreview.PreviewType = {}));
})(DwgPreview || (DwgPreview = {}));
//# sourceMappingURL=DwgPreview.js.map