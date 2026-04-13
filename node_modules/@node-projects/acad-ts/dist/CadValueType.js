export var CadValueType;
(function (CadValueType) {
    CadValueType[CadValueType["Unknown"] = 0] = "Unknown";
    CadValueType[CadValueType["Long"] = 1] = "Long";
    CadValueType[CadValueType["Double"] = 2] = "Double";
    CadValueType[CadValueType["String"] = 4] = "String";
    CadValueType[CadValueType["Date"] = 8] = "Date";
    CadValueType[CadValueType["Point2D"] = 16] = "Point2D";
    CadValueType[CadValueType["Point3D"] = 32] = "Point3D";
    CadValueType[CadValueType["Handle"] = 64] = "Handle";
    CadValueType[CadValueType["Buffer"] = 128] = "Buffer";
    CadValueType[CadValueType["ResultBuffer"] = 256] = "ResultBuffer";
    CadValueType[CadValueType["General"] = 512] = "General";
})(CadValueType || (CadValueType = {}));
//# sourceMappingURL=CadValueType.js.map