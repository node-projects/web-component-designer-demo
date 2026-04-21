import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { LeaderContentType } from './LeaderContentType.js';
import { LeaderDrawOrderType } from './LeaderDrawOrderType.js';
import { MultiLeaderDrawOrderType } from './MultiLeaderDrawOrderType.js';
import { XYZ } from '../Math/XYZ.js';
export class MultiLeaderStyle extends NonGraphicalObject {
    static get default_() { return new MultiLeaderStyle(MultiLeaderStyle.defaultName); }
    alignSpace = 0.0;
    _arrowhead = null;
    get arrowhead() { return this._arrowhead; }
    set arrowhead(value) {
        this._arrowhead = CadObject.updateCollectionStatic(value, this.document?.blockRecords ?? null);
    }
    arrowheadSize = 0.18;
    _blockContent = null;
    get blockContent() { return this._blockContent; }
    set blockContent(value) {
        this._blockContent = CadObject.updateCollectionStatic(value, this.document?.blockRecords ?? null);
    }
    blockContentColor = Color.byBlock;
    blockContentConnection = 0;
    blockContentRotation = 0.0;
    _blockContentScale = new XYZ(1, 1, 1);
    get blockContentScale() { return this._blockContentScale; }
    set blockContentScale(value) { this._blockContentScale = value; }
    get blockContentScaleX() { return this._blockContentScale.x; }
    set blockContentScaleX(value) { this._blockContentScale.x = value; }
    get blockContentScaleY() { return this._blockContentScale.y; }
    set blockContentScaleY(value) { this._blockContentScale.y = value; }
    get blockContentScaleZ() { return this._blockContentScale.z; }
    set blockContentScaleZ(value) { this._blockContentScale.z = value; }
    breakGapSize = 0.125;
    contentType = LeaderContentType.MText;
    defaultTextContents = '';
    description = '';
    enableBlockContentRotation = false;
    enableBlockContentScale = false;
    enableDogleg = true;
    enableLanding = true;
    firstSegmentAngleConstraint = 0;
    isAnnotative = false;
    landingDistance = 0.36;
    landingGap = 0.09;
    leaderDrawOrder = LeaderDrawOrderType.LeaderHeadFirst;
    _leaderLineType = null;
    get leaderLineType() { return this._leaderLineType; }
    set leaderLineType(value) {
        if (value == null)
            throw new Error('value cannot be null');
        this._leaderLineType = CadObject.updateCollectionStatic(value, this.document?.lineTypes ?? null);
    }
    leaderLineWeight = 0;
    lineColor = Color.byLayer;
    maxLeaderSegmentsPoints = 2;
    multiLeaderDrawOrder = MultiLeaderDrawOrderType.ContentFirst;
    get objectName() { return DxfFileToken.objectMLeaderStyle; }
    get objectType() { return ObjectType.UNLISTED; }
    overwritePropertyValue = false;
    pathType = 0;
    scaleFactor = 1;
    secondSegmentAngleConstraint = 0;
    get subclassMarker() { return DxfSubclassMarker.mLeaderStyle; }
    textAlignAlwaysLeft = false;
    textAlignment = 0;
    textAngle = 0;
    textAttachmentDirection = 0;
    textBottomAttachment = 0;
    textColor = Color.byBlock;
    textFrame = false;
    textHeight = 0.18;
    textLeftAttachment = 0;
    textRightAttachment = 0;
    _textStyle = null;
    get textStyle() { return this._textStyle; }
    set textStyle(value) {
        if (value == null)
            throw new Error('value cannot be null');
        this._textStyle = CadObject.updateCollectionStatic(value, this.document?.textStyles ?? null);
    }
    textTopAttachment = 0;
    unknownFlag298 = false;
    static defaultName = 'Standard';
    constructor(name = '') {
        super(name);
    }
    clone() {
        const clone = super.clone();
        clone._textStyle = this._textStyle?.clone() ?? null;
        clone._leaderLineType = this._leaderLineType?.clone() ?? null;
        clone._arrowhead = this._arrowhead?.clone() ?? null;
        clone._blockContent = this._blockContent?.clone() ?? null;
        return clone;
    }
    assignDocument(doc) {
        super.assignDocument(doc);
        this._arrowhead = CadObject.updateCollectionStatic(this._arrowhead, doc.blockRecords);
        this._blockContent = CadObject.updateCollectionStatic(this._blockContent, doc.blockRecords);
        this._leaderLineType = CadObject.updateCollectionStatic(this._leaderLineType, doc.lineTypes);
        this._textStyle = CadObject.updateCollectionStatic(this._textStyle, doc.textStyles);
    }
    unassignDocument() {
        super.unassignDocument();
        this._arrowhead = this._arrowhead?.clone() ?? null;
        this._blockContent = this._blockContent?.clone() ?? null;
        this._leaderLineType = this._leaderLineType?.clone() ?? null;
        this._textStyle = this._textStyle?.clone() ?? null;
    }
}
export { MultiLeaderDrawOrderType } from './MultiLeaderDrawOrderType.js';
export { LeaderDrawOrderType } from './LeaderDrawOrderType.js';
//# sourceMappingURL=MultiLeaderStyle.js.map