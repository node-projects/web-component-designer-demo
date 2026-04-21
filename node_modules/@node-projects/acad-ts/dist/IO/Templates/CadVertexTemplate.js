import { Vertex } from '../../Entities/Vertex.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
export class CadVertexTemplate extends CadEntityTemplate {
    get vertex() { return this.cadObject; }
    constructor(vertex) {
        super(vertex ?? new CadVertexTemplate.VertexPlaceholder());
    }
    setVertexObject(vertex) {
        vertex.handle = this.cadObject.handle;
        vertex.owner = this.cadObject.owner;
        vertex.xDictionary = this.cadObject.xDictionary;
        //polyLine.Reactors = this.CadObject.Reactors;
        //polyLine.ExtendedData = this.CadObject.ExtendedData;
        vertex.color = this.cadObject.color;
        vertex.lineWeight = this.cadObject.lineWeight;
        vertex.lineTypeScale = this.cadObject.lineTypeScale;
        vertex.isInvisible = this.cadObject.isInvisible;
        vertex.transparency = this.cadObject.transparency;
        const placeholder = this.cadObject;
        vertex.location = placeholder.location;
        vertex.startWidth = placeholder.startWidth;
        vertex.endWidth = placeholder.endWidth;
        vertex.bulge = placeholder.bulge;
        vertex.flags = placeholder.flags;
        vertex.curveTangent = placeholder.curveTangent;
        vertex.id = placeholder.id;
        this.cadObject = vertex;
    }
}
(function (CadVertexTemplate) {
    class VertexPlaceholder extends Vertex {
        get objectType() { return ObjectType.INVALID; }
        get subclassMarker() { return DxfSubclassMarker.polylineVertex; }
    }
    CadVertexTemplate.VertexPlaceholder = VertexPlaceholder;
})(CadVertexTemplate || (CadVertexTemplate = {}));
//# sourceMappingURL=CadVertexTemplate.js.map