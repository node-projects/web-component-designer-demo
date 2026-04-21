import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionStyle } from '../Tables/DimensionStyle.js';
import { LeaderCreationType } from './LeaderCreationType.js';
import { LeaderPathType } from './LeaderPathType.js';
import { HookLineDirection } from './HookLineDirection.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
export class Leader extends Entity {
    annotationOffset = new XYZ(0, 0, 0);
    arrowHeadEnabled = false;
    associatedAnnotation = null;
    blockOffset = new XYZ(0, 0, 0);
    creationType = LeaderCreationType.CreatedWithoutAnnotation;
    get hasHookline() {
        if (this.vertices.length <= 1) {
            return false;
        }
        return this.creationType !== LeaderCreationType.CreatedWithoutAnnotation && this.horizontalDirection.getLength() > 0;
    }
    hookLineDirection = HookLineDirection.Opposite;
    horizontalDirection = new XYZ(1, 0, 0);
    normal = new XYZ(0, 0, 1);
    get objectName() {
        return DxfFileToken.entityLeader;
    }
    get objectType() {
        return ObjectType.LEADER;
    }
    pathType = LeaderPathType.StraightLineSegments;
    get style() {
        return this._style;
    }
    set style(value) {
        if (value == null) {
            throw new Error('value cannot be null');
        }
        if (this.document != null) {
            this._style = CadObject.updateCollection(value, this.document.dimensionStyles);
        }
        else {
            this._style = value;
        }
    }
    get subclassMarker() {
        return DxfSubclassMarker.leader;
    }
    textHeight = 0;
    textWidth = 0;
    vertices = [];
    _style = DimensionStyle.default;
    applyTransform(transform) {
        this.annotationOffset = this.applyTransformToVector(transform, this.annotationOffset);
        this.blockOffset = this.applyTransformToVector(transform, this.blockOffset);
        this.horizontalDirection = this.applyTransformToVector(transform, this.horizontalDirection);
        this.normal = this.transformNormal(transform, this.normal);
        this.vertices = this.vertices.map((vertex) => this.applyTransformToPoint(transform, vertex));
    }
    clone() {
        const clone = super.clone();
        clone._style = this._style?.clone();
        return clone;
    }
    getBoundingBox() {
        return BoundingBox.fromPoints(this.vertices);
    }
    /** @internal */
    assignDocument(doc) {
        super.assignDocument(doc);
        this._style = CadObject.updateCollection(this._style, doc.dimensionStyles);
    }
    /** @internal */
    unassignDocument() {
        super.unassignDocument();
        this._style = this._style.clone();
    }
    _tableOnRemove(sender, e) {
        super._tableOnRemove(sender, e);
        if (e.item === this._style) {
            this._style = this.document.dimensionStyles.get(DimensionStyle.defaultName);
        }
    }
}
export { LeaderCreationType } from './LeaderCreationType.js';
export { LeaderPathType } from './LeaderPathType.js';
export { HookLineDirection } from './HookLineDirection.js';
//# sourceMappingURL=Leader.js.map