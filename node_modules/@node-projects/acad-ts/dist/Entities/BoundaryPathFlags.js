export var BoundaryPathFlags;
(function (BoundaryPathFlags) {
    BoundaryPathFlags[BoundaryPathFlags["Default"] = 0] = "Default";
    BoundaryPathFlags[BoundaryPathFlags["External"] = 1] = "External";
    BoundaryPathFlags[BoundaryPathFlags["Polyline"] = 2] = "Polyline";
    BoundaryPathFlags[BoundaryPathFlags["Derived"] = 4] = "Derived";
    BoundaryPathFlags[BoundaryPathFlags["Textbox"] = 8] = "Textbox";
    BoundaryPathFlags[BoundaryPathFlags["Outermost"] = 16] = "Outermost";
    BoundaryPathFlags[BoundaryPathFlags["NotClosed"] = 32] = "NotClosed";
    BoundaryPathFlags[BoundaryPathFlags["SelfIntersecting"] = 64] = "SelfIntersecting";
    BoundaryPathFlags[BoundaryPathFlags["TextIsland"] = 128] = "TextIsland";
    BoundaryPathFlags[BoundaryPathFlags["Duplicate"] = 256] = "Duplicate";
    BoundaryPathFlags[BoundaryPathFlags["IsAnnotative"] = 512] = "IsAnnotative";
    BoundaryPathFlags[BoundaryPathFlags["DoesNotSupportScale"] = 1024] = "DoesNotSupportScale";
    BoundaryPathFlags[BoundaryPathFlags["ForceAnnoAllVisible"] = 2048] = "ForceAnnoAllVisible";
    BoundaryPathFlags[BoundaryPathFlags["OrientToPaper"] = 4096] = "OrientToPaper";
    BoundaryPathFlags[BoundaryPathFlags["IsAnnotativeBlock"] = 8192] = "IsAnnotativeBlock";
})(BoundaryPathFlags || (BoundaryPathFlags = {}));
//# sourceMappingURL=BoundaryPathFlags.js.map