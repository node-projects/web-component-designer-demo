export var FieldStateFlags;
(function (FieldStateFlags) {
    FieldStateFlags[FieldStateFlags["Unknown"] = 0] = "Unknown";
    FieldStateFlags[FieldStateFlags["Initialized"] = 1] = "Initialized";
    FieldStateFlags[FieldStateFlags["Compiled"] = 2] = "Compiled";
    FieldStateFlags[FieldStateFlags["Modified"] = 4] = "Modified";
    FieldStateFlags[FieldStateFlags["Evaluated"] = 8] = "Evaluated";
    FieldStateFlags[FieldStateFlags["Cached"] = 16] = "Cached";
})(FieldStateFlags || (FieldStateFlags = {}));
//# sourceMappingURL=FieldStateFlags.js.map