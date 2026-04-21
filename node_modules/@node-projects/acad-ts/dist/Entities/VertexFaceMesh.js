import { Vertex } from './Vertex.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
export class VertexFaceMesh extends Vertex {
    get objectType() {
        return ObjectType.VERTEX_PFACE;
    }
    get subclassMarker() {
        return DxfSubclassMarker.polyfaceMeshVertex;
    }
}
//# sourceMappingURL=VertexFaceMesh.js.map