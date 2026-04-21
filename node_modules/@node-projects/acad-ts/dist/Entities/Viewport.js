import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { LightingType } from './LightingType.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
export class Viewport extends Entity {
    ambientLightColor = null;
    backClipPlane = 0;
    boundary = null;
    brightness = 0;
    center = new XYZ(0, 0, 0);
    circleZoomPercent = 0;
    contrast = 0;
    defaultLightingType = LightingType.OneDistantLight;
    displayUcsIcon = false;
    elevation = 0;
    frontClipPlane = 0;
    frozenLayers = [];
    gridSpacing = new XY(0, 0);
    height = 0;
    get id() {
        if (this._id !== 0) {
            return this._id;
        }
        const entities = this.owner?.entities;
        if (entities == null) {
            return 0;
        }
        let viewportIndex = 0;
        for (const entity of entities) {
            if (entity instanceof Viewport) {
                viewportIndex++;
                if (entity === this) {
                    return viewportIndex;
                }
            }
        }
        return 0;
    }
    set id(value) {
        this._id = value;
    }
    lensLength = 0;
    majorGridLineFrequency = 0;
    get objectName() {
        return DxfFileToken.entityViewport;
    }
    get objectType() {
        return ObjectType.VIEWPORT;
    }
    renderMode = 0;
    get representsPaper() {
        return this.id === Viewport.paperViewId;
    }
    scale = null;
    get scaleFactor() {
        if (this.height === 0)
            return 1;
        return 1 / (this.viewHeight / this.height);
    }
    shadePlotMode = 0;
    snapAngle = 0;
    snapBase = new XY(0, 0);
    snapSpacing = new XY(0, 0);
    status = 0;
    styleSheetName = '';
    get subclassMarker() {
        return DxfSubclassMarker.viewport;
    }
    twistAngle = 0;
    ucsOrigin = new XYZ(0, 0, 0);
    ucsOrthographicType = 0;
    ucsPerViewport = false;
    ucsXAxis = new XYZ(1, 0, 0);
    ucsYAxis = new XYZ(0, 1, 0);
    useDefaultLighting = false;
    viewCenter = new XY(0, 0);
    viewDirection = new XYZ(0, 0, 1);
    viewHeight = 0;
    viewTarget = new XYZ(0, 0, 0);
    get viewWidth() {
        if (this.height === 0)
            return 0;
        return this.viewHeight / this.height * this.width;
    }
    visualStyle = null;
    width = 0;
    static asdk_xrec_annotation_scale_info = 'ASDK_XREC_ANNOTATION_SCALE_INFO';
    static paperViewId = 1;
    applyTransform(transform) {
        if (this.boundary != null) {
            this.boundary.applyTransform(transform);
            const bounds = this.boundary.getBoundingBox();
            if (bounds != null) {
                this.center = bounds.center;
                this.width = bounds.width;
                this.height = bounds.height;
            }
        }
        else {
            const bounds = this.getBoundingBox();
            const corners = [
                new XYZ(bounds.min.x, bounds.min.y, bounds.min.z),
                new XYZ(bounds.min.x, bounds.max.y, bounds.min.z),
                new XYZ(bounds.max.x, bounds.min.y, bounds.min.z),
                new XYZ(bounds.max.x, bounds.max.y, bounds.min.z),
            ].map((corner) => this.applyTransformToPoint(transform, corner));
            const transformedBounds = BoundingBox.fromPoints(corners);
            this.center = transformedBounds.center;
            this.width = transformedBounds.width;
            this.height = transformedBounds.height;
        }
        this.viewTarget = this.applyTransformToPoint(transform, this.viewTarget);
        this.viewDirection = this.applyTransformToVector(transform, this.viewDirection);
        this.ucsOrigin = this.applyTransformToPoint(transform, this.ucsOrigin);
        this.ucsXAxis = this.applyTransformToVector(transform, this.ucsXAxis);
        this.ucsYAxis = this.applyTransformToVector(transform, this.ucsYAxis);
    }
    clone() {
        const clone = super.clone();
        clone.boundary = this.boundary?.clone() ?? null;
        clone.visualStyle = this.visualStyle?.clone() ?? null;
        clone.scale = this.scale?.clone() ?? null;
        clone.frozenLayers = this.frozenLayers.map(l => l.clone());
        return clone;
    }
    getBoundingBox() {
        return new BoundingBox(new XYZ(this.center.x - this.width / 2, this.center.y - this.height / 2, this.center.z), new XYZ(this.center.x + this.width / 2, this.center.y + this.height / 2, this.center.z));
    }
    getModelBoundingBox() {
        return new BoundingBox(new XYZ(this.viewCenter.x - this.viewWidth / 2, this.viewCenter.y - this.viewHeight / 2, 0), new XYZ(this.viewCenter.x + this.viewWidth / 2, this.viewCenter.y + this.viewHeight / 2, 0));
    }
    selectEntities(includePartial = true) {
        if (this.document == null) {
            throw new Error('Viewport needs to be assigned to a document.');
        }
        const viewBounds = this.getModelBoundingBox();
        const overlaps = (candidate) => candidate.max.x >= viewBounds.min.x &&
            candidate.min.x <= viewBounds.max.x &&
            candidate.max.y >= viewBounds.min.y &&
            candidate.min.y <= viewBounds.max.y;
        const contains = (candidate) => candidate.min.x >= viewBounds.min.x &&
            candidate.max.x <= viewBounds.max.x &&
            candidate.min.y >= viewBounds.min.y &&
            candidate.max.y <= viewBounds.max.y;
        const selected = [];
        for (const entity of this.document.entities ?? []) {
            if (entity === this) {
                continue;
            }
            const bounds = entity.getBoundingBox();
            if (bounds == null) {
                continue;
            }
            if (includePartial ? overlaps(bounds) : contains(bounds)) {
                selected.push(entity);
            }
        }
        return selected;
    }
    /** @internal */
    assignDocument(doc) {
        super.assignDocument(doc);
    }
    /** @internal */
    unassignDocument() {
        super.unassignDocument();
        this.scale = this.scale?.clone() ?? null;
    }
    _id = 0;
}
export { ViewportStatusFlags } from './ViewportStatusFlags.js';
//# sourceMappingURL=Viewport.js.map