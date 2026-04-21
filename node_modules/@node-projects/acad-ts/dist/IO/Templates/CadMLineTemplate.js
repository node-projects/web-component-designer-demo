import { MLine, MLineVertex, MLineSegment } from '../../Entities/MLine.js';
import { XYZ } from '../../Math/XYZ.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
export class CadMLineTemplate extends CadEntityTemplateT {
    mLineStyleHandle = null;
    mLineStyleName = null;
    nVertex = null;
    nElements = null;
    _currVertex = null;
    _currSegmentElement = null;
    constructor(mline) {
        super(mline ?? new MLine());
    }
    tryReadVertex(dxfcode, value) {
        const mline = this.cadObject;
        switch (dxfcode) {
            case 11:
                this._currVertex = new MLineVertex();
                mline.vertices.push(this._currVertex);
                this._currVertex.position = new XYZ(value, this._currVertex.position.y, this._currVertex.position.z);
                return true;
            case 21:
                if (this._currVertex) {
                    this._currVertex.position = new XYZ(this._currVertex.position.x, value, this._currVertex.position.z);
                }
                return true;
            case 31:
                if (this._currVertex) {
                    this._currVertex.position = new XYZ(this._currVertex.position.x, this._currVertex.position.y, value);
                }
                return true;
            case 12:
                if (this._currVertex) {
                    this._currVertex.direction = new XYZ(value, this._currVertex.direction.y, this._currVertex.direction.z);
                }
                return true;
            case 22:
                if (this._currVertex) {
                    this._currVertex.direction = new XYZ(this._currVertex.direction.x, value, this._currVertex.direction.z);
                }
                return true;
            case 32:
                if (this._currVertex) {
                    this._currVertex.direction = new XYZ(this._currVertex.direction.x, this._currVertex.direction.y, value);
                }
                return true;
            case 13:
                if (this._currVertex) {
                    this._currVertex.miter = new XYZ(value, this._currVertex.miter.y, this._currVertex.miter.z);
                }
                return true;
            case 23:
                if (this._currVertex) {
                    this._currVertex.miter = new XYZ(this._currVertex.miter.x, value, this._currVertex.miter.z);
                }
                return true;
            case 33:
                if (this._currVertex) {
                    this._currVertex.miter = new XYZ(this._currVertex.miter.x, this._currVertex.miter.y, value);
                }
                return true;
            case 74:
                this._currSegmentElement = new MLineSegment();
                if (this._currVertex) {
                    this._currVertex.segments.push(this._currSegmentElement);
                }
                return true;
            case 41:
                this._currSegmentElement?.parameters.push(value);
                return true;
            case 42:
                this._currSegmentElement?.areaFillParameters.push(value);
                return true;
            case 75:
                return true;
            default:
                return false;
        }
    }
    _build(builder) {
        super._build(builder);
        const mLine = this.cadObject;
        const style = builder.tryGetCadObject(this.mLineStyleHandle);
        if (style) {
            mLine.style = style;
        }
    }
}
//# sourceMappingURL=CadMLineTemplate.js.map