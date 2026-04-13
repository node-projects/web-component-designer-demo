export var ProxyFlags;
(function (ProxyFlags) {
    ProxyFlags[ProxyFlags["None"] = 0] = "None";
    ProxyFlags[ProxyFlags["EraseAllowed"] = 1] = "EraseAllowed";
    ProxyFlags[ProxyFlags["TransformAllowed"] = 2] = "TransformAllowed";
    ProxyFlags[ProxyFlags["ColorChangeAllowed"] = 4] = "ColorChangeAllowed";
    ProxyFlags[ProxyFlags["LayerChangeAllowed"] = 8] = "LayerChangeAllowed";
    ProxyFlags[ProxyFlags["LinetypeChangeAllowed"] = 16] = "LinetypeChangeAllowed";
    ProxyFlags[ProxyFlags["LinetypeScaleChangeAllowed"] = 32] = "LinetypeScaleChangeAllowed";
    ProxyFlags[ProxyFlags["VisibilityChangeAllowed"] = 64] = "VisibilityChangeAllowed";
    ProxyFlags[ProxyFlags["CloningAllowed"] = 128] = "CloningAllowed";
    ProxyFlags[ProxyFlags["LineweightChangeAllowed"] = 256] = "LineweightChangeAllowed";
    ProxyFlags[ProxyFlags["PlotStyleNameChangeAllowed"] = 512] = "PlotStyleNameChangeAllowed";
    ProxyFlags[ProxyFlags["AllOperationsExceptCloningAllowed"] = 895] = "AllOperationsExceptCloningAllowed";
    ProxyFlags[ProxyFlags["AllOperationsAllowed"] = 1023] = "AllOperationsAllowed";
    ProxyFlags[ProxyFlags["DisablesProxyWarningDialog"] = 1024] = "DisablesProxyWarningDialog";
    ProxyFlags[ProxyFlags["R13FormatProxy"] = 32768] = "R13FormatProxy";
})(ProxyFlags || (ProxyFlags = {}));
//# sourceMappingURL=ProxyFlags.js.map