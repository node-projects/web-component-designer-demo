export class DwgSectionDefinition {
    static acDbObjects = 'AcDb:AcDbObjects';
    static appInfo = 'AcDb:AppInfo';
    static auxHeader = 'AcDb:AuxHeader';
    static classes = 'AcDb:Classes';
    static fileDepList = 'AcDb:FileDepList';
    static handles = 'AcDb:Handles';
    static header = 'AcDb:Header';
    static objFreeSpace = 'AcDb:ObjFreeSpace';
    static preview = 'AcDb:Preview';
    static revHistory = 'AcDb:RevHistory';
    static summaryInfo = 'AcDb:SummaryInfo';
    static template = 'AcDb:Template';
    static endSentinels = new Map([
        [DwgSectionDefinition.header, new Uint8Array([0x30, 0x84, 0xE0, 0xDC, 0x02, 0x21, 0xC7, 0x56, 0xA0, 0x83, 0x97, 0x47, 0xB1, 0x92, 0xCC, 0xA0])],
        [DwgSectionDefinition.classes, new Uint8Array([0x72, 0x5E, 0x3B, 0x47, 0x3B, 0x56, 0x07, 0x3A, 0x3F, 0x23, 0x0B, 0xA0, 0x18, 0x30, 0x49, 0x75])],
        [DwgSectionDefinition.preview, new Uint8Array([0xE0, 0xDA, 0x92, 0xF8, 0x2B, 0xC9, 0xD7, 0xD7, 0x62, 0xA8, 0x35, 0xC0, 0x62, 0xBB, 0xEF, 0xD4])],
    ]);
    static startSentinels = new Map([
        [DwgSectionDefinition.header, new Uint8Array([0xCF, 0x7B, 0x1F, 0x23, 0xFD, 0xDE, 0x38, 0xA9, 0x5F, 0x7C, 0x68, 0xB8, 0x4E, 0x6D, 0x33, 0x5F])],
        [DwgSectionDefinition.classes, new Uint8Array([0x8D, 0xA1, 0xC4, 0xB8, 0xC4, 0xA9, 0xF8, 0xC5, 0xC0, 0xDC, 0xF4, 0x5F, 0xE7, 0xCF, 0xB6, 0x8A])],
        [DwgSectionDefinition.preview, new Uint8Array([0x1F, 0x25, 0x6D, 0x07, 0xD4, 0x36, 0x28, 0x28, 0x9D, 0x57, 0xCA, 0x3F, 0x9D, 0x44, 0x10, 0x2B])],
    ]);
    static getSectionLocatorByName(name) {
        switch (name) {
            case DwgSectionDefinition.header:
                return 0;
            case DwgSectionDefinition.classes:
                return 1;
            case DwgSectionDefinition.handles:
                return 2;
            case DwgSectionDefinition.objFreeSpace:
                return 3;
            case DwgSectionDefinition.template:
                return 4;
            case DwgSectionDefinition.auxHeader:
                return 5;
            default:
                return null;
        }
    }
}
//# sourceMappingURL=DwgSectionDefinition.js.map