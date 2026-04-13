export var LayerFlags;
(function (LayerFlags) {
    LayerFlags[LayerFlags["None"] = 0] = "None";
    LayerFlags[LayerFlags["Frozen"] = 1] = "Frozen";
    LayerFlags[LayerFlags["FrozenNewViewports"] = 2] = "FrozenNewViewports";
    LayerFlags[LayerFlags["Locked"] = 4] = "Locked";
    LayerFlags[LayerFlags["XrefDependent"] = 16] = "XrefDependent";
    LayerFlags[LayerFlags["XrefResolved"] = 32] = "XrefResolved";
    LayerFlags[LayerFlags["Referenced"] = 64] = "Referenced";
})(LayerFlags || (LayerFlags = {}));
//# sourceMappingURL=LayerFlags.js.map