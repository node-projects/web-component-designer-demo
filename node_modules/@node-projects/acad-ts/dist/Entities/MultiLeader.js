import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Color } from '../Color.js';
import { LeaderContentType } from '../Objects/LeaderContentType.js';
import { MultiLeaderPathType } from '../MultiLeaderPathType.js';
import { TextAlignmentType } from '../TextAlignmentType.js';
import { TextAttachmentDirectionType } from '../TextAttachmentDirectionType.js';
import { TextAttachmentPointType } from '../TextAttachmentPoint.js';
import { TextAttachmentType } from '../TextAttachmentType.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { MultiLeaderObjectContextData } from '../Objects/MultiLeaderObjectContextData.js';
export class MultiLeaderBlockAttribute {
    attributeDefinition = null;
    index = 0;
    width = 0;
    text = '';
    clone() {
        const c = new MultiLeaderBlockAttribute();
        c.attributeDefinition = this.attributeDefinition;
        c.index = this.index;
        c.width = this.width;
        c.text = this.text;
        return c;
    }
}
export class MultiLeader extends Entity {
    arrowhead = null;
    arrowheadSize = 0;
    blockAttributes = [];
    blockContentColor = Color.byBlock;
    blockContentConnection = 0;
    blockContentId = null;
    blockContentRotation = 0;
    blockContentScale = new XYZ(1, 1, 1);
    contentType = LeaderContentType.MText;
    contextData = new MultiLeaderObjectContextData();
    enableAnnotationScale = false;
    enableDogleg = true;
    enableLanding = true;
    extendedToText = false;
    landingDistance = 0;
    leaderLineType = null;
    leaderLineWeight = 0;
    lineColor = Color.byBlock;
    get objectName() {
        return DxfFileToken.entityMultiLeader;
    }
    get objectType() {
        return ObjectType.UNLISTED;
    }
    pathType = MultiLeaderPathType.StraightLineSegments;
    propertyOverrideFlags = 0;
    scaleFactor = 1.0;
    style = null;
    get subclassMarker() {
        return DxfSubclassMarker.multiLeader;
    }
    textAlignment = TextAlignmentType.Left;
    textAngle = 0;
    textAttachmentDirection = TextAttachmentDirectionType.Horizontal;
    textAttachmentPoint = TextAttachmentPointType.Center;
    textBottomAttachment = TextAttachmentType.CenterOfText;
    textColor = Color.byBlock;
    textFrame = false;
    textLeftAttachment = TextAttachmentType.MiddleOfTopLine;
    textRightAttachment = TextAttachmentType.MiddleOfTopLine;
    textStyle = null;
    textTopAttachment = TextAttachmentType.CenterOfText;
    textDirectionNegative = false;
    textAligninIPE = false;
    applyTransform(transform) {
        // No-op
    }
    clone() {
        const clone = super.clone();
        clone.arrowhead = this.arrowhead?.clone() ?? null;
        clone.blockContentId = this.blockContentId?.clone() ?? null;
        clone.style = this.style?.clone() ?? null;
        clone.textStyle = this.textStyle?.clone() ?? null;
        clone.contextData = this.contextData.clone();
        clone.blockAttributes = this.blockAttributes.map(a => a.clone());
        return clone;
    }
    getBoundingBox() {
        const points = [];
        const pushPair = (pair) => {
            points.push(pair.startPoint, pair.endPoint);
        };
        const pushLeaderLine = (line) => {
            points.push(...line.points);
            for (const pair of line.startEndPoints) {
                pushPair(pair);
            }
        };
        const pushLeaderRoot = (root) => {
            points.push(root.connectionPoint, root.direction);
            for (const pair of root.breakStartEndPointsPairs) {
                pushPair(pair);
            }
            for (const line of root.lines) {
                pushLeaderLine(line);
            }
        };
        points.push(this.contextData.basePoint, this.contextData.contentBasePoint, this.contextData.textLocation);
        if (this.contextData.hasContentsBlock) {
            points.push(this.contextData.blockContentLocation);
        }
        for (const root of this.contextData.leaderRoots) {
            pushLeaderRoot(root);
        }
        return points.length > 0 ? BoundingBox.fromPoints(points) : null;
    }
}
export { MultiLeaderPropertyOverrideFlags } from './MultiLeaderPropertyOverrideFlags.js';
export { MultiLeaderPathType } from '../MultiLeaderPathType.js';
export { LeaderContentType } from '../Objects/LeaderContentType.js';
export { TextAttachmentType } from '../TextAttachmentType.js';
export { TextAlignmentType } from '../TextAlignmentType.js';
export { TextAttachmentPointType } from '../TextAttachmentPoint.js';
export { TextAttachmentDirectionType } from '../TextAttachmentDirectionType.js';
//# sourceMappingURL=MultiLeader.js.map