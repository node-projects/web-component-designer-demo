export var ViewportStatusFlags;
(function (ViewportStatusFlags) {
    ViewportStatusFlags[ViewportStatusFlags["PerspectiveMode"] = 1] = "PerspectiveMode";
    ViewportStatusFlags[ViewportStatusFlags["FrontClipping"] = 2] = "FrontClipping";
    ViewportStatusFlags[ViewportStatusFlags["BackClipping"] = 4] = "BackClipping";
    ViewportStatusFlags[ViewportStatusFlags["UcsFollow"] = 8] = "UcsFollow";
    ViewportStatusFlags[ViewportStatusFlags["FrontClipNotAtEye"] = 16] = "FrontClipNotAtEye";
    ViewportStatusFlags[ViewportStatusFlags["UcsIconVisibility"] = 32] = "UcsIconVisibility";
    ViewportStatusFlags[ViewportStatusFlags["UcsIconAtOrigin"] = 64] = "UcsIconAtOrigin";
    ViewportStatusFlags[ViewportStatusFlags["FastZoom"] = 128] = "FastZoom";
    ViewportStatusFlags[ViewportStatusFlags["SnapMode"] = 256] = "SnapMode";
    ViewportStatusFlags[ViewportStatusFlags["GridMode"] = 512] = "GridMode";
    ViewportStatusFlags[ViewportStatusFlags["IsometricSnapStyle"] = 1024] = "IsometricSnapStyle";
    ViewportStatusFlags[ViewportStatusFlags["HidePlotMode"] = 2048] = "HidePlotMode";
    ViewportStatusFlags[ViewportStatusFlags["IsoPairTop"] = 4096] = "IsoPairTop";
    ViewportStatusFlags[ViewportStatusFlags["IsoPairRight"] = 8192] = "IsoPairRight";
    ViewportStatusFlags[ViewportStatusFlags["ViewportZoomLocking"] = 16384] = "ViewportZoomLocking";
    ViewportStatusFlags[ViewportStatusFlags["CurrentlyAlwaysEnabled"] = 32768] = "CurrentlyAlwaysEnabled";
    ViewportStatusFlags[ViewportStatusFlags["NonRectangularClipping"] = 65536] = "NonRectangularClipping";
    ViewportStatusFlags[ViewportStatusFlags["ViewportOff"] = 131072] = "ViewportOff";
    ViewportStatusFlags[ViewportStatusFlags["DisplayGridBeyondDrawingLimits"] = 262144] = "DisplayGridBeyondDrawingLimits";
    ViewportStatusFlags[ViewportStatusFlags["AdaptiveGridDisplay"] = 524288] = "AdaptiveGridDisplay";
    ViewportStatusFlags[ViewportStatusFlags["SubdivisionGridBelowSpacing"] = 1048576] = "SubdivisionGridBelowSpacing";
})(ViewportStatusFlags || (ViewportStatusFlags = {}));
//# sourceMappingURL=ViewportStatusFlags.js.map