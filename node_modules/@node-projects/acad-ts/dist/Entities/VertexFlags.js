export var VertexFlags;
(function (VertexFlags) {
    VertexFlags[VertexFlags["Default"] = 0] = "Default";
    VertexFlags[VertexFlags["CurveFittingExtraVertex"] = 1] = "CurveFittingExtraVertex";
    VertexFlags[VertexFlags["CurveFitTangent"] = 2] = "CurveFitTangent";
    VertexFlags[VertexFlags["NotUsed"] = 4] = "NotUsed";
    VertexFlags[VertexFlags["SplineVertexFromSplineFitting"] = 8] = "SplineVertexFromSplineFitting";
    VertexFlags[VertexFlags["SplineFrameControlPoint"] = 16] = "SplineFrameControlPoint";
    VertexFlags[VertexFlags["PolylineVertex3D"] = 32] = "PolylineVertex3D";
    VertexFlags[VertexFlags["PolygonMesh3D"] = 64] = "PolygonMesh3D";
    VertexFlags[VertexFlags["PolyfaceMeshVertex"] = 128] = "PolyfaceMeshVertex";
})(VertexFlags || (VertexFlags = {}));
//# sourceMappingURL=VertexFlags.js.map