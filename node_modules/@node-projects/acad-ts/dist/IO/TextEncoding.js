import { CadUtils, CodePage } from '../CadUtils.js';
const DEFAULT_CODE_PAGE_NAME = 'ANSI_1252';
const DEFAULT_DECODER_ENCODING = 'windows-1252';
const REPLACEMENT_BYTE = 0x3F;
const _singleByteDecoders = new Set([
    'ascii',
    'ibm866',
    'iso-8859-1',
    'iso-8859-2',
    'iso-8859-3',
    'iso-8859-4',
    'iso-8859-5',
    'iso-8859-6',
    'iso-8859-7',
    'iso-8859-8',
    'iso-8859-9',
    'iso-8859-10',
    'iso-8859-13',
    'iso-8859-15',
    'macintosh',
    'windows-874',
    'windows-1250',
    'windows-1251',
    'windows-1252',
    'windows-1253',
    'windows-1254',
    'windows-1255',
    'windows-1256',
    'windows-1257',
    'windows-1258',
]);
const _singleByteEncoderMaps = new Map();
const _windows1252Extras = new Map([
    [0x20AC, 0x80],
    [0x201A, 0x82],
    [0x0192, 0x83],
    [0x201E, 0x84],
    [0x2026, 0x85],
    [0x2020, 0x86],
    [0x2021, 0x87],
    [0x02C6, 0x88],
    [0x2030, 0x89],
    [0x0160, 0x8A],
    [0x2039, 0x8B],
    [0x0152, 0x8C],
    [0x017D, 0x8E],
    [0x2018, 0x91],
    [0x2019, 0x92],
    [0x201C, 0x93],
    [0x201D, 0x94],
    [0x2022, 0x95],
    [0x2013, 0x96],
    [0x2014, 0x97],
    [0x02DC, 0x98],
    [0x2122, 0x99],
    [0x0161, 0x9A],
    [0x203A, 0x9B],
    [0x0153, 0x9C],
    [0x017E, 0x9E],
    [0x0178, 0x9F],
]);
export function getDocumentCodePageName(codePage) {
    const trimmed = codePage?.trim();
    return trimmed ? trimmed : DEFAULT_CODE_PAGE_NAME;
}
export function getDecoderEncodingLabel(codePage) {
    const explicit = normalizeExplicitEncodingLabel(codePage);
    if (explicit) {
        return explicit;
    }
    switch (resolveCodePage(codePage)) {
        case CodePage.Usascii:
            return 'ascii';
        case CodePage.Iso88591:
            return 'iso-8859-1';
        case CodePage.Iso88592:
            return 'iso-8859-2';
        case CodePage.Iso88593:
            return 'iso-8859-3';
        case CodePage.Iso88594:
            return 'iso-8859-4';
        case CodePage.Iso88595:
            return 'iso-8859-5';
        case CodePage.Iso88596:
            return 'iso-8859-6';
        case CodePage.Iso88597:
            return 'iso-8859-7';
        case CodePage.Iso88598:
            return 'iso-8859-8';
        case CodePage.Iso88599:
            return 'iso-8859-9';
        case CodePage.Iso885910:
            return 'iso-8859-10';
        case CodePage.Iso885913:
            return 'iso-8859-13';
        case CodePage.Iso885915:
            return 'iso-8859-15';
        case CodePage.Windows874:
            return 'windows-874';
        case CodePage.Windows1250:
            return 'windows-1250';
        case CodePage.Windows1251:
            return 'windows-1251';
        case CodePage.Windows1252:
            return 'windows-1252';
        case CodePage.Windows1253:
            return 'windows-1253';
        case CodePage.Windows1254:
            return 'windows-1254';
        case CodePage.Windows1255:
            return 'windows-1255';
        case CodePage.Windows1256:
            return 'windows-1256';
        case CodePage.Windows1257:
            return 'windows-1257';
        case CodePage.Windows1258:
            return 'windows-1258';
        case CodePage.Cp866:
            return 'ibm866';
        case CodePage.Macintosh:
        case CodePage.Xmacromanian:
            return 'macintosh';
        case CodePage.Gb2312:
            return 'gb2312';
        case CodePage.Ksc5601:
        case CodePage.Johab:
            return 'euc-kr';
        case CodePage.big5:
            return 'big5';
        case CodePage.Shift_jis:
            return 'shift_jis';
        case CodePage.Utf16:
            return 'utf-16le';
        default:
            return DEFAULT_DECODER_ENCODING;
    }
}
export function encodeCadString(value, codePage) {
    const text = value ?? '';
    const encoding = getDecoderEncodingLabel(codePage);
    if (encoding === 'utf-8') {
        return new TextEncoder().encode(text);
    }
    if (encoding === 'utf-16le') {
        return encodeUtf16Le(text);
    }
    if (_singleByteDecoders.has(encoding)) {
        return encodeSingleByte(text, encoding);
    }
    return encodeAsciiCompatible(text);
}
export function decodeCadString(bytes, codePage) {
    if (!bytes || bytes.length === 0) {
        return '';
    }
    return new TextDecoder(getDecoderEncodingLabel(codePage)).decode(bytes);
}
export function encodeUtf16Le(value) {
    const text = value ?? '';
    const bytes = new Uint8Array(text.length * 2);
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        bytes[i * 2] = code & 0xFF;
        bytes[i * 2 + 1] = (code >>> 8) & 0xFF;
    }
    return bytes;
}
function encodeSingleByte(text, encoding) {
    const encoderMap = getSingleByteEncoderMap(encoding);
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        const mapped = encoderMap.get(char);
        if (mapped !== undefined) {
            bytes[i] = mapped;
            continue;
        }
        bytes[i] = getSingleByteFallbackByte(char, encoding);
    }
    return bytes;
}
function getSingleByteEncoderMap(encoding) {
    const cached = _singleByteEncoderMaps.get(encoding);
    if (cached) {
        return cached;
    }
    const map = new Map();
    try {
        const decoder = new TextDecoder(encoding);
        for (let i = 0; i < 256; i++) {
            const char = decoder.decode(Uint8Array.of(i));
            if (char.length === 1 && char.charCodeAt(0) !== 0xFFFD && !map.has(char)) {
                map.set(char, i);
            }
        }
    }
    catch {
        // Unsupported decoder labels fall back to direct byte mappings below.
    }
    _singleByteEncoderMaps.set(encoding, map);
    return map;
}
function getSingleByteFallbackByte(char, encoding) {
    const codePoint = char.codePointAt(0) ?? REPLACEMENT_BYTE;
    if (encoding === 'ascii') {
        return codePoint <= 0x7F ? codePoint : REPLACEMENT_BYTE;
    }
    if (codePoint <= 0xFF) {
        return codePoint;
    }
    return _windows1252Extras.get(codePoint) ?? REPLACEMENT_BYTE;
}
function encodeAsciiCompatible(text) {
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        bytes[i] = code <= 0x7F ? code : REPLACEMENT_BYTE;
    }
    return bytes;
}
function resolveCodePage(codePage) {
    if (typeof codePage === 'number') {
        return codePage;
    }
    if (typeof codePage !== 'string' || !codePage.trim()) {
        return CodePage.Windows1252;
    }
    return CadUtils.getCodePage(codePage.trim());
}
function normalizeExplicitEncodingLabel(codePage) {
    if (typeof codePage !== 'string') {
        return null;
    }
    switch (codePage.trim().toLowerCase()) {
        case 'ascii':
            return 'ascii';
        case 'utf8':
        case 'utf-8':
            return 'utf-8';
        case 'utf16':
        case 'utf-16':
        case 'utf16le':
        case 'utf-16le':
            return 'utf-16le';
        case 'ansi_874':
        case 'windows-874':
            return 'windows-874';
        case 'ansi_932':
        case 'shift-jis':
        case 'shift_jis':
            return 'shift_jis';
        case 'ansi_936':
        case 'gbk':
        case 'gb2312':
            return 'gb2312';
        case 'ansi_950':
        case 'big5':
            return 'big5';
        case 'kcs5601':
        case 'euc-kr':
            return 'euc-kr';
        case 'dos866':
        case 'ibm866':
            return 'ibm866';
        case 'mac-roman':
        case 'macintosh':
            return 'macintosh';
        case 'ansi_1250':
        case 'ansi1250':
        case 'windows-1250':
            return 'windows-1250';
        case 'ansi_1251':
        case 'ansi1251':
        case 'windows-1251':
            return 'windows-1251';
        case 'ansi_1252':
        case 'ansi1252':
        case 'windows-1252':
            return 'windows-1252';
        case 'ansi_1253':
        case 'ansi1253':
        case 'windows-1253':
            return 'windows-1253';
        case 'ansi_1254':
        case 'ansi1254':
        case 'windows-1254':
            return 'windows-1254';
        case 'ansi_1255':
        case 'ansi1255':
        case 'windows-1255':
            return 'windows-1255';
        case 'ansi_1256':
        case 'ansi1256':
        case 'windows-1256':
            return 'windows-1256';
        case 'ansi_1257':
        case 'ansi1257':
        case 'windows-1257':
            return 'windows-1257';
        case 'ansi_1258':
        case 'ansi1258':
        case 'windows-1258':
            return 'windows-1258';
        case 'iso8859-1':
        case 'iso88591':
        case 'iso-8859-1':
            return 'iso-8859-1';
        case 'iso8859-2':
        case 'iso88592':
        case 'iso-8859-2':
            return 'iso-8859-2';
        case 'iso8859-3':
        case 'iso88593':
        case 'iso-8859-3':
            return 'iso-8859-3';
        case 'iso8859-4':
        case 'iso88594':
        case 'iso-8859-4':
            return 'iso-8859-4';
        case 'iso8859-5':
        case 'iso88595':
        case 'iso-8859-5':
            return 'iso-8859-5';
        case 'iso8859-6':
        case 'iso88596':
        case 'iso-8859-6':
            return 'iso-8859-6';
        case 'iso8859-7':
        case 'iso88597':
        case 'iso-8859-7':
            return 'iso-8859-7';
        case 'iso8859-8':
        case 'iso88598':
        case 'iso-8859-8':
            return 'iso-8859-8';
        case 'iso8859-9':
        case 'iso88599':
        case 'iso-8859-9':
            return 'iso-8859-9';
        case 'iso8859-10':
        case 'iso885910':
        case 'iso-8859-10':
            return 'iso-8859-10';
        case 'iso8859-13':
        case 'iso885913':
        case 'iso-8859-13':
            return 'iso-8859-13';
        case 'iso8859-15':
        case 'iso885915':
        case 'iso-8859-15':
            return 'iso-8859-15';
        default:
            return null;
    }
}
//# sourceMappingURL=TextEncoding.js.map