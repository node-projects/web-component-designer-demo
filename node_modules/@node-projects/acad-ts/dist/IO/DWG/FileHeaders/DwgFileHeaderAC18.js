import { DwgFileHeaderAC15 } from './DwgFileHeaderAC15.js';
import { DwgSectionDescriptor } from './DwgSectionDescriptor.js';
export class DwgFileHeaderAC18 extends DwgFileHeaderAC15 {
    dwgVersion = 0;
    appReleaseVersion = 0;
    summaryInfoAddr = 0;
    securityType = 0;
    vbaProjectAddr = 0;
    rootTreeNodeGap = 0;
    gapArraySize = 0;
    crcSeed = 0;
    lastPageId = 0;
    lastSectionAddr = 0;
    secondHeaderAddr = 0;
    gapAmount = 0;
    sectionAmount = 0;
    sectionPageMapId = 0;
    pageMapAddress = 0;
    sectionMapId = 0;
    sectionArrayPageSize = 0;
    rigthGap = 0;
    leftGap = 0;
    descriptors = new Map();
    constructor(version) {
        super(version);
    }
    addSection(name) {
        this.descriptors.set(name, new DwgSectionDescriptor(name));
    }
    addSectionDescriptor(descriptor) {
        this.descriptors.set(descriptor.name, descriptor);
    }
    getDescriptor(name) {
        return this.descriptors.get(name);
    }
}
//# sourceMappingURL=DwgFileHeaderAC18.js.map