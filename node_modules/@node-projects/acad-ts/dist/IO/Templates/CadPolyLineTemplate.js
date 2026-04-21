import { Polyline2D } from '../../Entities/Polyline2D.js';
import { Polyline3D } from '../../Entities/Polyline3D.js';
import { PolyfaceMesh } from '../../Entities/PolyfaceMesh.js';
import { PolygonMesh } from '../../Entities/PolygonMesh.js';
import { Seqend } from '../../Entities/Seqend.js';
import { VertexFaceMesh } from '../../Entities/VertexFaceMesh.js';
import { VertexFaceRecord } from '../../Entities/VertexFaceRecord.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { Polyline } from '../../Entities/Polyline.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadPolyLineTemplate extends CadEntityTemplate {
    firstVertexHandle = null;
    lastVertexHandle = null;
    seqendHandle = null;
    ownedObjectsHandlers = new Set();
    constructor(entity) {
        super(entity ? entity : new PolyLinePlaceholder());
    }
    setPolyLineObject(polyLine) {
        polyLine.handle = this.cadObject.handle;
        polyLine.color = this.cadObject.color;
        polyLine.lineWeight = this.cadObject.lineWeight;
        polyLine.lineTypeScale = this.cadObject.lineTypeScale;
        polyLine.isInvisible = this.cadObject.isInvisible;
        polyLine.transparency = this.cadObject.transparency;
        this.cadObject = polyLine;
    }
    addVertices(builder, ...vertices) {
        const obj = this.cadObject;
        if (obj instanceof Polyline2D) {
            for (const v of vertices) {
                obj.vertices.push(v);
                v.owner = obj;
            }
        }
        else if (obj instanceof Polyline3D) {
            for (const v of vertices) {
                obj.vertices.push(v);
                v.owner = obj;
            }
        }
        else if (obj instanceof PolyfaceMesh) {
            for (const item of vertices) {
                this._addPolyfaceMeshVertex(builder, obj, item);
            }
        }
        else if (obj instanceof PolygonMesh) {
            for (const v of vertices) {
                obj.vertices.push(v);
                v.owner = obj;
            }
        }
        else {
            builder.notify(`Unknown polyline type ${this.cadObject.subclassMarker}`, NotificationType.Warning);
        }
    }
    _build(builder) {
        super._build(builder);
        const seqend = builder.tryGetCadObject(this.seqendHandle);
        if (seqend) {
            this.setSeqend(builder, seqend);
        }
        if (this.firstVertexHandle != null) {
            const vertices = Array.from(this.getEntitiesCollection(builder, this.firstVertexHandle, this.lastVertexHandle));
            this.addVertices(builder, ...vertices);
        }
        else {
            if (this.cadObject instanceof PolyfaceMesh) {
                this._buildPolyfaceMesh(this.cadObject, builder);
            }
            else {
                for (const handle of this.ownedObjectsHandlers) {
                    const v = builder.tryGetCadObject(handle);
                    if (v) {
                        this.addVertices(builder, v);
                    }
                    else {
                        const s = builder.tryGetCadObject(handle);
                        if (s) {
                            this.setSeqend(builder, s);
                        }
                        else {
                            builder.notify(`Vertex ${handle} not found for polyline ${this.cadObject.handle}`, NotificationType.Warning);
                        }
                    }
                }
            }
        }
    }
    setSeqend(builder, seqend) {
        const obj = this.cadObject;
        seqend.owner = obj;
        if (obj instanceof Polyline2D) {
            obj.vertices.seqend = seqend;
        }
        else if (obj instanceof Polyline3D) {
            obj.vertices.seqend = seqend;
        }
        else if (obj instanceof PolyfaceMesh) {
            obj.vertices.seqend = seqend;
        }
        else if (obj instanceof PolygonMesh) {
            obj.vertices.seqend = seqend;
        }
        else {
            builder.notify(`Unknown polyline type ${this.cadObject.subclassMarker}`, NotificationType.Warning);
        }
    }
    _buildPolyfaceMesh(polyfaceMesh, builder) {
        for (const handle of this.ownedObjectsHandlers) {
            const e = builder.tryGetCadObject(handle);
            if (e) {
                this._addPolyfaceMeshVertex(builder, polyfaceMesh, e);
            }
        }
    }
    _addPolyfaceMeshVertex(builder, polyfaceMesh, e) {
        if (e instanceof VertexFaceMesh) {
            polyfaceMesh.vertices.push(e);
            e.owner = polyfaceMesh;
        }
        else if (e instanceof VertexFaceRecord) {
            polyfaceMesh.faces.push(e);
            e.owner = polyfaceMesh;
        }
        else if (e instanceof Seqend) {
            polyfaceMesh.vertices.seqend = e;
            e.owner = polyfaceMesh;
        }
        else {
            builder.notify(`Unidentified type for PolyfaceMesh ${e.constructor.name}`);
        }
    }
}
class PolyLinePlaceholder extends Polyline {
    get objectType() { return ObjectType.INVALID; }
    get subclassMarker() { return 'PolyLinePlaceholder'; }
    getBoundingBox() { return null; }
}
//# sourceMappingURL=CadPolyLineTemplate.js.map