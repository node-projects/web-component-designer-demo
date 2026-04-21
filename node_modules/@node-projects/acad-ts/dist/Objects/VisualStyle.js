import { NonGraphicalObject } from './NonGraphicalObject.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { EdgeStyleModel } from './EdgeStyleModel.js';
import { FaceColorMode } from './FaceColorMode.js';
import { FaceLightingModelType } from './FaceLightingModelType.js';
import { FaceLightingQualityType } from './FaceLightingQualityType.js';
import { FaceModifierType } from './FaceModifierType.js';
export class VisualStyle extends NonGraphicalObject {
    brightness = 0;
    color = Color.byLayer;
    description = '';
    displaySettings = 0;
    edgeApplyStyleFlag = 0;
    edgeColor = 0;
    edgeCreaseAngle = 0;
    edgeIntersectionColor = Color.byLayer;
    edgeIntersectionLineType = 0;
    edgeIsolineCount = 0;
    edgeJitter = 0;
    edgeModifiers = 0;
    edgeObscuredColor = Color.byLayer;
    edgeObscuredLineType = 0;
    edgeOverhang = 0;
    edgeSilhouetteColor = Color.byLayer;
    edgeSilhouetteWidth = 0;
    edgeStyle = 0;
    edgeStyleModel = EdgeStyleModel.NoEdges;
    edgeWidth = 0;
    faceColorMode = FaceColorMode.NoColor;
    faceLightingModel = FaceLightingModelType.Invisible;
    faceLightingQuality = FaceLightingQualityType.NoLighting;
    faceModifiers = FaceModifierType.None;
    faceOpacityLevel = 0;
    faceSpecularLevel = 0;
    faceStyleMonoColor = Color.byLayer;
    haloGap = 0;
    internalFlag = false;
    get objectName() { return DxfFileToken.objectVisualStyle; }
    get objectType() { return ObjectType.UNLISTED; }
    opacityLevel = 0;
    precisionFlag = false;
    rasterFile = '';
    shadowType = 0;
    get subclassMarker() { return DxfSubclassMarker.visualStyle; }
    type = 0;
    static defaultName = '2dWireframe';
}
//# sourceMappingURL=VisualStyle.js.map