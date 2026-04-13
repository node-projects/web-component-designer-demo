export var BlockTypeFlags;
(function (BlockTypeFlags) {
    BlockTypeFlags[BlockTypeFlags["None"] = 0] = "None";
    BlockTypeFlags[BlockTypeFlags["Anonymous"] = 1] = "Anonymous";
    BlockTypeFlags[BlockTypeFlags["NonConstantAttributeDefinitions"] = 2] = "NonConstantAttributeDefinitions";
    BlockTypeFlags[BlockTypeFlags["XRef"] = 4] = "XRef";
    BlockTypeFlags[BlockTypeFlags["XRefOverlay"] = 8] = "XRefOverlay";
    BlockTypeFlags[BlockTypeFlags["XRefDependent"] = 16] = "XRefDependent";
    BlockTypeFlags[BlockTypeFlags["XRefResolved"] = 32] = "XRefResolved";
    BlockTypeFlags[BlockTypeFlags["Referenced"] = 64] = "Referenced";
})(BlockTypeFlags || (BlockTypeFlags = {}));
//# sourceMappingURL=BlockTypeFlags.js.map