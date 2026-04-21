import { Circle } from './Circle.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { Transform } from '../Math/Transform.js';
export class Arc extends Circle {
    endAngle = Math.PI;
    get objectName() {
        return DxfFileToken.entityArc;
    }
    get objectType() {
        return ObjectType.ARC;
    }
    startAngle = 0.0;
    get subclassMarker() {
        return DxfSubclassMarker.arc;
    }
    get sweep() {
        let start = this.startAngle;
        let end = this.endAngle;
        if (end < start) {
            end += Math.PI * 2;
        }
        return start - end;
    }
    constructor(center, radius, start, end) {
        super();
        if (center !== undefined) {
            this.center = center;
        }
        if (radius !== undefined) {
            this.radius = radius;
        }
        if (start !== undefined) {
            this.startAngle = start;
        }
        if (end !== undefined) {
            this.endAngle = end;
        }
    }
    static createFromBulge(p1, p2, bulge) {
        const { center, radius } = Arc.getCenter(p1, p2, bulge);
        let startAngle;
        let endAngle;
        if (bulge < 0) {
            startAngle = Math.atan2(p2.y - center.y, p2.x - center.x);
            endAngle = Math.atan2(p1.y - center.y, p1.x - center.x);
        }
        else {
            startAngle = Math.atan2(p1.y - center.y, p1.x - center.x);
            endAngle = Math.atan2(p2.y - center.y, p2.x - center.x);
        }
        const arc = new Arc();
        arc.center = new XYZ(center.x, center.y, 0);
        arc.radius = radius;
        arc.startAngle = startAngle;
        arc.endAngle = endAngle;
        return arc;
    }
    /** @internal */
    static getBulge(center, start, end, clockWise) {
        const ux = start.x - center.x;
        const uy = start.y - center.y;
        const u2x = -uy;
        const u2y = ux;
        const vx = end.x - center.x;
        const vy = end.y - center.y;
        let angle = Math.atan2(ux * vx + uy * vy, u2x * vx + u2y * vy);
        if (clockWise) {
            if (angle > 0) {
                angle -= Math.PI * 2.0;
            }
        }
        else if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        return Math.tan(angle / 4.0);
    }
    /** @internal */
    static getBulgeFromAngle(angle) {
        return Math.tan(angle / 4);
    }
    static getCenter(start, end, bulge) {
        const theta = 4 * Math.atan(Math.abs(bulge));
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const c = Math.sqrt(dx * dx + dy * dy) / 2.0;
        const radius = c / Math.sin(theta / 2.0);
        const gamma = (Math.PI - theta) / 2;
        const phi = Math.atan2(dy, dx) + Math.sign(bulge) * gamma;
        const center = new XY(start.x + radius * Math.cos(phi), start.y + radius * Math.sin(phi));
        return { center, radius };
    }
    applyTransform(transform) {
        if (!(transform instanceof Transform)) {
            return;
        }
        super.applyTransform(transform);
        this.startAngle += transform.eulerRotation.z;
        this.endAngle += transform.eulerRotation.z;
    }
    getBoundingBox() {
        const points = this.polygonalVertexes(64);
        return points.length > 0 ? BoundingBox.fromPoints(points) : null;
    }
    getEndVertices() {
        const start = this.polarCoordinateRelativeToCenter(this.startAngle);
        const end = this.polarCoordinateRelativeToCenter(this.endAngle);
        return { start, end };
    }
    polygonalVertexes(precision) {
        if (precision < 2) {
            throw new Error('The arc precision must be equal or greater than two.');
        }
        let start = this.startAngle;
        let end = this.endAngle;
        if (end < start) {
            end += Math.PI * 2;
        }
        const stepCount = Math.max(2, precision);
        const step = (end - start) / (stepCount - 1);
        const vertexes = [];
        for (let index = 0; index < stepCount; index++) {
            vertexes.push(this.polarCoordinateRelativeToCenter(start + step * index));
        }
        vertexes[0] = this.polarCoordinateRelativeToCenter(this.startAngle);
        vertexes[vertexes.length - 1] = this.polarCoordinateRelativeToCenter(this.endAngle);
        return vertexes;
    }
}
//# sourceMappingURL=Arc.js.map