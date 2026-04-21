import { Entity } from '../../../Entities/Entity.js';
import { Arc } from '../../../Entities/Arc.js';
import { AttributeEntity } from '../../../Entities/AttributeEntity.js';
import { AttributeDefinition } from '../../../Entities/AttributeDefinition.js';
import { CadBody } from '../../../Entities/CadBody.js';
import { Circle } from '../../../Entities/Circle.js';
import { Dimension } from '../../../Entities/Dimension.js';
import { DimensionLinear } from '../../../Entities/DimensionLinear.js';
import { DimensionAligned } from '../../../Entities/DimensionAligned.js';
import { DimensionDiameter } from '../../../Entities/DimensionDiameter.js';
import { DimensionAngular2Line } from '../../../Entities/DimensionAngular2Line.js';
import { DimensionAngular3Pt } from '../../../Entities/DimensionAngular3Pt.js';
import { DimensionRadius } from '../../../Entities/DimensionRadius.js';
import { DimensionOrdinate } from '../../../Entities/DimensionOrdinate.js';
import { DimensionType } from '../../../Entities/DimensionType.js';
import { Ellipse } from '../../../Entities/Ellipse.js';
import { Face3D } from '../../../Entities/Face3D.js';
import { Hatch, HatchBoundaryPathPolyline, HatchBoundaryPathLine, HatchBoundaryPathArc, HatchBoundaryPathEllipse, HatchBoundaryPathSpline, EdgeType } from '../../../Entities/Hatch.js';
import { BoundaryPathFlags } from '../../../Entities/BoundaryPathFlags.js';
import { GradientColor } from '../../../Entities/GradientColor.js';
import { Insert } from '../../../Entities/Insert.js';
import { Leader } from '../../../Entities/Leader.js';
import { Line } from '../../../Entities/Line.js';
import { LwPolyline } from '../../../Entities/LwPolyline.js';
import { Mesh } from '../../../Entities/Mesh.js';
import { MLine } from '../../../Entities/MLine.js';
import { MText } from '../../../Entities/MText.js';
import { MultiLeader } from '../../../Entities/MultiLeader.js';
import { MultiLeaderObjectContextData, LeaderRoot } from '../../../Objects/MultiLeaderObjectContextData.js';
import { Point } from '../../../Entities/Point.js';
import { Polyline2D } from '../../../Entities/Polyline2D.js';
import { Polyline3D } from '../../../Entities/Polyline3D.js';
import { PolyfaceMesh } from '../../../Entities/PolyfaceMesh.js';
import { PolygonMesh } from '../../../Entities/PolygonMesh.js';
import { PolygonMeshVertex } from '../../../Entities/PolygonMeshVertex.js';
import { PdfUnderlay } from '../../../Entities/PdfUnderlay.js';
import { Ole2Frame } from '../../../Entities/Ole2Frame.js';
import { Ray } from '../../../Entities/Ray.js';
import { RasterImage } from '../../../Entities/RasterImage.js';
import { Region } from '../../../Entities/Region.js';
import { Seqend } from '../../../Entities/Seqend.js';
import { Shape } from '../../../Entities/Shape.js';
import { Solid } from '../../../Entities/Solid.js';
import { Solid3D } from '../../../Entities/Solid3D.js';
import { Spline } from '../../../Entities/Spline.js';
import { TextEntity } from '../../../Entities/TextEntity.js';
import { TableEntity, CellContent, TableEntityRow, TableEntityColumn } from '../../../Entities/TableEntity.js';
import { Tolerance } from '../../../Entities/Tolerance.js';
import { Vertex2D } from '../../../Entities/Vertex2D.js';
import { Vertex3D } from '../../../Entities/Vertex3D.js';
import { VertexFaceMesh } from '../../../Entities/VertexFaceMesh.js';
import { VertexFaceRecord } from '../../../Entities/VertexFaceRecord.js';
import { Viewport } from '../../../Entities/Viewport.js';
import { Wipeout } from '../../../Entities/Wipeout.js';
import { XLine } from '../../../Entities/XLine.js';
import { UnknownEntity } from '../../../Entities/UnknownEntity.js';
import { CadEntityTemplate } from '../../Templates/CadEntityTemplate.js';
import { CadAttributeTemplate } from '../../Templates/CadAttributeTemplate.js';
import { CadDimensionTemplate, DimensionPlaceholder } from '../../Templates/CadDimensionTemplate.js';
import { CadHatchTemplate } from '../../Templates/CadHatchTemplate.js';
import { CadInsertTemplate } from '../../Templates/CadInsertTemplate.js';
import { CadLeaderTemplate } from '../../Templates/CadLeaderTemplate.js';
import { CadMeshTemplate } from '../../Templates/CadMeshTemplate.js';
import { CadMLineTemplate } from '../../Templates/CadMLineTemplate.js';
import { CadMLeaderTemplate } from '../../Templates/CadMLeaderTemplate.js';
import { CadMLeaderAnnotContextTemplate } from '../../Templates/CadMLeaderAnnotContextTemplate.js';
import { CadOle2FrameTemplate } from '../../Templates/CadOle2FrameTemplate.js';
import { CadPolyLineTemplate } from '../../Templates/CadPolyLineTemplate.js';
import { CadShapeTemplate } from '../../Templates/CadShapeTemplate.js';
import { CadSolid3DTemplate } from '../../Templates/CadSolid3DTemplate.js';
import { CadSplineTemplate } from '../../Templates/CadSplineTemplate.js';
import { CadTableEntityTemplate, CadTableCellContentTemplate } from '../../Templates/CadTableEntityTemplate.js';
import { CadTextEntityTemplate } from '../../Templates/CadTextEntityTemplate.js';
import { CadToleranceTemplate } from '../../Templates/CadToleranceTemplate.js';
import { CadUnderlayTemplate } from '../../Templates/CadUnderlayTemplate.js';
import { CadVertexTemplate } from '../../Templates/CadVertexTemplate.js';
import { CadViewportTemplate } from '../../Templates/CadViewportTemplate.js';
import { CadWipeoutBaseTemplate } from '../../Templates/CadWipeoutBaseTemplate.js';
import { CadUnknownEntityTemplate } from '../../Templates/CadUnknownEntityTemplate.js';
import { CadValueTemplate } from '../../Templates/CadValueTemplate.js';
import { CadValueType } from '../../../CadValueType.js';
import { Color } from '../../../Color.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfMap } from '../../../DxfMap.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { DxfReferenceType } from '../../../Types/DxfReferenceType.js';
import { ObjectType } from '../../../Types/ObjectType.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { XY } from '../../../Math/XY.js';
import { XYZ } from '../../../Math/XYZ.js';
import { MathHelper } from '../../../Math/MathHelper.js';
import { ExtendedDataString } from '../../../XData/ExtendedDataString.js';
import { ExtendedDataControlString } from '../../../XData/ExtendedDataControlString.js';
import { ExtendedDataLayer } from '../../../XData/ExtendedDataLayer.js';
import { ExtendedDataBinaryChunk } from '../../../XData/ExtendedDataBinaryChunk.js';
import { ExtendedDataHandle } from '../../../XData/ExtendedDataHandle.js';
import { ExtendedDataCoordinate } from '../../../XData/ExtendedDataCoordinate.js';
import { ExtendedDataWorldCoordinate } from '../../../XData/ExtendedDataWorldCoordinate.js';
import { ExtendedDataDisplacement } from '../../../XData/ExtendedDataDisplacement.js';
import { ExtendedDataDirection } from '../../../XData/ExtendedDataDirection.js';
import { ExtendedDataReal } from '../../../XData/ExtendedDataReal.js';
import { ExtendedDataDistance } from '../../../XData/ExtendedDataDistance.js';
import { ExtendedDataScale } from '../../../XData/ExtendedDataScale.js';
import { ExtendedDataInteger16 } from '../../../XData/ExtendedDataInteger16.js';
import { ExtendedDataInteger32 } from '../../../XData/ExtendedDataInteger32.js';
import { LwPolylineVertex } from '../../../Entities/LwPolyline.js';
import { MeshEdge } from '../../../Entities/Mesh.js';
import { HatchPatternLine } from '../../../Entities/HatchPattern.js';
export class DxfSectionReaderBase {
    _reader;
    _builder;
    lockPointer = false;
    currentSubclass = null;
    constructor(reader, builder) {
        this._reader = reader;
        this._builder = builder;
    }
    readCommonObjectData(template) {
        if (template !== undefined) {
            // Deprecated overload: reads common object data into a template
            while (this._reader.dxfCode !== DxfCode.Subclass) {
                switch (this._reader.code) {
                    case 0:
                        // object name - assert matches template
                        break;
                    case 5:
                        template.cadObject.handle = this._reader.valueAsHandle;
                        break;
                    case 102:
                        this._readDefinedGroups(template);
                        break;
                    case 330:
                        template.ownerHandle = this._reader.valueAsHandle;
                        break;
                    default:
                        this._builder.notify(`Unhandled dxf code ${this._reader.code} at line ${this._reader.position}.`, NotificationType.None);
                        break;
                }
                this._reader.readNext();
            }
            return;
        }
        const result = {
            name: null,
            handle: 0,
            ownerHandle: null,
            xdictHandle: null,
            reactors: new Set(),
        };
        if (this._reader.dxfCode === DxfCode.Start
            || this._reader.dxfCode === DxfCode.Subclass) {
            this._reader.readNext();
        }
        while (this._reader.dxfCode !== DxfCode.Start
            && this._reader.dxfCode !== DxfCode.Subclass) {
            switch (this._reader.code) {
                case 2:
                    result.name = this._reader.valueAsString;
                    break;
                case 5:
                case 105:
                    result.handle = this._reader.valueAsHandle;
                    break;
                case 102: {
                    const groups = this._readDefinedGroupsRaw();
                    result.xdictHandle = groups.xdictHandle;
                    result.reactors = groups.reactors;
                    break;
                }
                case 330:
                    result.ownerHandle = this._reader.valueAsHandle;
                    break;
                case 71:
                case 340:
                default:
                    this._builder.notify(`Unhandled dxf code ${this._reader.code} at line ${this._reader.position}.`);
                    break;
            }
            this._reader.readNext();
        }
        return result;
    }
    readCommonCodes(template, isExtendedData, map) {
        isExtendedData.value = false;
        switch (this._reader.code) {
            case 2:
                if ('name' in template.cadObject) {
                    template.cadObject.name = this._reader.valueAsString;
                    break;
                }
                this._builder.notify(`[${this.currentSubclass}] Unhandled dxf code ${this._reader.code} with value ${this._reader.valueAsString}`, NotificationType.None);
                break;
            case 5:
                template.cadObject.handle = this._reader.valueAsHandle;
                break;
            case 100:
                this.currentSubclass = this._reader.valueAsString;
                if (map && !map.subClasses.has(this._reader.valueAsString)) {
                    this._builder.notify(`[${template.cadObject.objectName}] Unidentified subclass ${this._reader.valueAsString}`, NotificationType.Warning);
                }
                break;
            case 102:
                this._readDefinedGroups(template);
                break;
            case 330:
                template.ownerHandle = this._reader.valueAsHandle;
                break;
            case 1001:
                isExtendedData.value = true;
                this.readExtendedData(template.eDataTemplateByAppName);
                break;
            default:
                this._builder.notify(`[${this.currentSubclass}] Unhandled dxf code ${this._reader.code} with value ${this._reader.valueAsString}`, NotificationType.None);
                break;
        }
    }
    readEntity() {
        this.currentSubclass = '';
        switch (this._reader.valueAsString) {
            case DxfFileToken.entityAttribute:
                return this.readEntityCodes(new CadAttributeTemplate(new AttributeEntity()), this._readAttributeDefinition.bind(this), AttributeEntity);
            case DxfFileToken.entityAttributeDefinition:
                return this.readEntityCodes(new CadAttributeTemplate(new AttributeDefinition()), this._readAttributeDefinition.bind(this), AttributeDefinition);
            case DxfFileToken.entityArc:
                return this.readEntityCodes(new CadEntityTemplate(new Arc()), this._readArc.bind(this), Arc);
            case DxfFileToken.entityBody:
                return this.readEntityCodes(new CadEntityTemplate(new CadBody()), this._readEntitySubclassMap.bind(this), CadBody);
            case DxfFileToken.entityCircle:
                return this.readEntityCodes(new CadEntityTemplate(new Circle()), this._readCircle.bind(this), Circle);
            case DxfFileToken.entityDimension: {
                const dimTemplate = this.readEntityCodes(new CadDimensionTemplate(), this._readDimension.bind(this), Dimension);
                if (dimTemplate.cadObject instanceof DimensionPlaceholder) {
                    this._builder.notify(`[${DxfFileToken.entityDimension}] No subtype found, object discarded.`, NotificationType.Warning);
                    return null;
                }
                return dimTemplate;
            }
            case DxfFileToken.entity3DFace:
                return this.readEntityCodes(new CadEntityTemplate(new Face3D()), this._readEntitySubclassMap.bind(this), Face3D);
            case DxfFileToken.entityEllipse:
                return this.readEntityCodes(new CadEntityTemplate(new Ellipse()), this._readEntitySubclassMap.bind(this), Ellipse);
            case DxfFileToken.entityLeader:
                return this.readEntityCodes(new CadLeaderTemplate(), this._readLeader.bind(this), Leader);
            case DxfFileToken.entityLine:
                return this.readEntityCodes(new CadEntityTemplate(new Line()), this._readEntitySubclassMap.bind(this), Line);
            case DxfFileToken.entityLwPolyline:
                return this.readEntityCodes(new CadEntityTemplate(new LwPolyline()), this._readLwPolyline.bind(this), LwPolyline);
            case DxfFileToken.entityMesh:
                return this.readEntityCodes(new CadMeshTemplate(), this._readMesh.bind(this), Mesh);
            case DxfFileToken.entityHatch:
                return this.readEntityCodes(new CadHatchTemplate(), this.readHatch.bind(this), Hatch);
            case DxfFileToken.entityInsert:
                return this.readEntityCodes(new CadInsertTemplate(), this._readInsert.bind(this), Insert);
            case DxfFileToken.entityMText:
                return this.readEntityCodes(new CadTextEntityTemplate(new MText()), this._readTextEntity.bind(this), MText);
            case DxfFileToken.entityMLine:
                return this.readEntityCodes(new CadMLineTemplate(), this._readMLine.bind(this), MLine);
            case DxfFileToken.entityMultiLeader:
                return this.readEntityCodes(new CadMLeaderTemplate(), this._readMLeader.bind(this), MultiLeader);
            case DxfFileToken.entityPdfUnderlay:
                return this.readEntityCodes(new CadUnderlayTemplate(new PdfUnderlay()), this._readUnderlayEntity.bind(this), PdfUnderlay);
            case DxfFileToken.entityPoint:
                return this.readEntityCodes(new CadEntityTemplate(new Point()), this._readEntitySubclassMap.bind(this), Point);
            case DxfFileToken.entityPolyline:
                return this._readPolyline();
            case DxfFileToken.entityOle2Frame:
                return this.readEntityCodes(new CadOle2FrameTemplate(), this._readOle2Frame.bind(this), Ole2Frame);
            case DxfFileToken.entityRay:
                return this.readEntityCodes(new CadEntityTemplate(new Ray()), this._readEntitySubclassMap.bind(this), Ray);
            case DxfFileToken.endSequence:
                return this.readEntityCodes(new CadEntityTemplate(new Seqend()), this._readEntitySubclassMap.bind(this), Seqend);
            case DxfFileToken.entityTrace:
            case DxfFileToken.entitySolid:
                return this.readEntityCodes(new CadEntityTemplate(new Solid()), this._readModelerGeometry.bind(this), Solid);
            case DxfFileToken.entityTable:
                return this.readEntityCodes(new CadTableEntityTemplate(), this._readTableEntity.bind(this), TableEntity);
            case DxfFileToken.entityText:
                return this.readEntityCodes(new CadTextEntityTemplate(new TextEntity()), this._readTextEntity.bind(this), TextEntity);
            case DxfFileToken.entityTolerance:
                return this.readEntityCodes(new CadToleranceTemplate(new Tolerance()), this._readTolerance.bind(this), Tolerance);
            case DxfFileToken.entityVertex:
                return this.readEntityCodes(new CadVertexTemplate(), this._readVertex.bind(this), Entity);
            case DxfFileToken.entityViewport:
                return this.readEntityCodes(new CadViewportTemplate(), this._readViewport.bind(this), Viewport);
            case DxfFileToken.entityShape:
                return this.readEntityCodes(new CadShapeTemplate(new Shape()), this._readShape.bind(this), Shape);
            case DxfFileToken.entitySpline:
                return this.readEntityCodes(new CadSplineTemplate(), this._readSpline.bind(this), Spline);
            case DxfFileToken.entity3DSolid:
                return this.readEntityCodes(new CadSolid3DTemplate(), this._readSolid3d.bind(this), Solid3D);
            case DxfFileToken.entityRegion:
                return this.readEntityCodes(new CadEntityTemplate(new Region()), this._readModelerGeometry.bind(this), Region);
            case DxfFileToken.entityImage:
                return this.readEntityCodes(new CadWipeoutBaseTemplate(new RasterImage()), this._readWipeoutBase.bind(this), RasterImage);
            case DxfFileToken.entityWipeout:
                return this.readEntityCodes(new CadWipeoutBaseTemplate(new Wipeout()), this._readWipeoutBase.bind(this), Wipeout);
            case DxfFileToken.entityXline:
                return this.readEntityCodes(new CadEntityTemplate(new XLine()), this._readEntitySubclassMap.bind(this), XLine);
            default: {
                const map = DxfMap.create(Entity);
                let unknownEntityTemplate = null;
                const dxfClass = this._builder.documentToBuild.classes.tryGetByName(this._reader.valueAsString);
                if (dxfClass) {
                    this._builder.notify(`Entity not supported read as an UnknownEntity: ${this._reader.valueAsString}`, NotificationType.NotImplemented);
                    unknownEntityTemplate = new CadUnknownEntityTemplate(new UnknownEntity(dxfClass));
                }
                else {
                    this._builder.notify(`Entity not supported: ${this._reader.valueAsString}`, NotificationType.NotImplemented);
                }
                this._reader.readNext();
                do {
                    if (unknownEntityTemplate !== null && this._builder.keepUnknownEntities) {
                        const isExtendedData = { value: false };
                        this.readCommonEntityCodes(unknownEntityTemplate, isExtendedData, map);
                        if (isExtendedData.value) {
                            continue;
                        }
                    }
                    this._reader.readNext();
                } while (this._reader.dxfCode !== DxfCode.Start);
                return unknownEntityTemplate;
            }
        }
    }
    readEntityCodes(template, readEntity, entityType) {
        this._reader.readNext();
        const map = DxfMap.create(typeof entityType === 'string' ? entityType : entityType.name);
        while (this._reader.dxfCode !== DxfCode.Start) {
            if (!readEntity(template, map)) {
                const isExtendedData = { value: false };
                this.readCommonEntityCodes(template, isExtendedData, map);
                if (isExtendedData.value) {
                    continue;
                }
            }
            if (this.lockPointer) {
                this.lockPointer = false;
                continue;
            }
            if (this._reader.code !== DxfCode.Start) {
                this._reader.readNext();
            }
        }
        return template;
    }
    readCommonEntityCodes(template, isExtendedData, map) {
        isExtendedData.value = false;
        switch (this._reader.code) {
            case 6:
                template.lineTypeName = this._reader.valueAsString;
                break;
            case 8:
                template.layerName = this._reader.valueAsString;
                break;
            case 67:
                break;
            case 92:
            case 160:
            case 310:
                break;
            case 347:
                template.materialHandle = this._reader.valueAsHandle;
                break;
            case 430:
                template.bookColorName = this._reader.valueAsString;
                break;
            default:
                if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.entity))) {
                    this.readCommonCodes(template, isExtendedData, map);
                }
                break;
        }
    }
    /** @deprecated use lockPointer instead */
    checkObjectEnd(template, map, func) {
        if (this._reader.dxfCode === DxfCode.Start) {
            return true;
        }
        else {
            return func(template, map);
        }
    }
    checkEntityEnd(template, map, subclass, func) {
        if (this._reader.dxfCode === DxfCode.Start) {
            return true;
        }
        else {
            return func(template, map, subclass);
        }
    }
    _readCircle(template, map, subclass) {
        const circle = template.cadObject;
        switch (this._reader.code) {
            case 40: {
                const radius = this._reader.valueAsDouble;
                if (radius <= 0) {
                    circle.radius = MathHelper.epsilon;
                }
                else {
                    circle.radius = radius;
                }
                return true;
            }
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.circle));
        }
    }
    _readArc(template, map, subclass) {
        switch (this._reader.code) {
            default:
                if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.arc))) {
                    return this._readCircle(template, map, DxfSubclassMarker.circle);
                }
                return true;
        }
    }
    _readAttributeDefinition(template, map, subclass) {
        const emap = map.subClasses.get(template.cadObject.subclassMarker);
        const tmp = template;
        switch (this._reader.code) {
            case 44:
            case 46:
                return true;
            case 101: {
                const att = tmp.cadObject;
                att.mText = new MText();
                const mtextTemplate = new CadTextEntityTemplate(att.mText);
                tmp.mTextTemplate = mtextTemplate;
                this.readEntityCodes(mtextTemplate, this._readTextEntity.bind(this), MText);
                return true;
            }
            default:
                if (!this.tryAssignCurrentValue(template.cadObject, emap)) {
                    return this._readTextEntity(template, map, DxfSubclassMarker.text);
                }
                return true;
        }
    }
    _readTableEntity(template, map, subclass) {
        const mapName = !subclass ? template.cadObject.subclassMarker : subclass;
        const tmp = template;
        const table = tmp.cadObject;
        switch (this._reader.code) {
            case 1: {
                let content;
                if (tmp.currentCell.content === null) {
                    content = new CellContent();
                    content.cadValue.valueType = CadValueType.String;
                    tmp.currentCell.contents.push(content);
                }
                else {
                    content = tmp.currentCell.content;
                }
                if (content.cadValue.value === null) {
                    content.cadValue.setValue(this._reader.valueAsString, CadValueType.String);
                }
                else {
                    let str = content.cadValue.value;
                    str += this._reader.valueAsString;
                    content.cadValue.setValue(str, CadValueType.String);
                }
                return true;
            }
            case 2: {
                if (this.currentSubclass !== null && this.currentSubclass.toUpperCase() === DxfSubclassMarker.tableEntity.toUpperCase()) {
                    const content = tmp.currentCell.content;
                    if (content.cadValue.value === null) {
                        content.cadValue.setValue(this._reader.valueAsString, CadValueType.String);
                    }
                    else {
                        let str = content.cadValue.value;
                        str += this._reader.valueAsString;
                        content.cadValue.setValue(str, CadValueType.String);
                    }
                }
                else {
                    tmp.blockName = this._reader.valueAsString;
                }
                return true;
            }
            case 177:
                return true;
            case 279:
                tmp.currentCell.styleOverride.topBorder.lineWeight = this._reader.valueAsShort;
                return true;
            case 275:
                tmp.currentCell.styleOverride.rightBorder.lineWeight = this._reader.valueAsShort;
                return true;
            case 276:
                tmp.currentCell.styleOverride.bottomBorder.lineWeight = this._reader.valueAsShort;
                return true;
            case 278:
                tmp.currentCell.styleOverride.leftBorder.lineWeight = this._reader.valueAsShort;
                return true;
            case 69:
                tmp.currentCell.styleOverride.topBorder.color = new Color(this._reader.valueAsShort);
                return true;
            case 65:
                tmp.currentCell.styleOverride.rightBorder.color = new Color(this._reader.valueAsShort);
                return true;
            case 66:
                tmp.currentCell.styleOverride.bottomBorder.color = new Color(this._reader.valueAsShort);
                return true;
            case 68:
                tmp.currentCell.styleOverride.leftBorder.color = new Color(this._reader.valueAsShort);
                return true;
            case 40:
                tmp.horizontalMargin = this._reader.valueAsDouble;
                return true;
            case 63:
                tmp.currentCell.styleOverride.backgroundColor = new Color(this._reader.valueAsShort);
                return true;
            case 64:
                tmp.currentCell.styleOverride.contentColor = new Color(this._reader.valueAsShort);
                return true;
            case 140:
                if (tmp.currentCellTemplate !== null) {
                    tmp.currentCellTemplate.formatTextHeight = this._reader.valueAsDouble;
                }
                return true;
            case 283:
                tmp.currentCell.styleOverride.isFillColorOn = this._reader.valueAsBool;
                return true;
            case 342:
                tmp.styleHandle = this._reader.valueAsHandle;
                return true;
            case 343:
                tmp.blockOwnerHandle = this._reader.valueAsHandle;
                return true;
            case 141: {
                const row = new TableEntityRow();
                row.height = this._reader.valueAsDouble;
                table.rows.push(row);
                return true;
            }
            case 142: {
                const col = new TableEntityColumn();
                col.width = this._reader.valueAsDouble;
                table.columns.push(col);
                return true;
            }
            case 144:
                tmp.currentCellTemplate.formatTextHeight = this._reader.valueAsDouble;
                return true;
            case 145:
                tmp.currentCell.rotation = this._reader.valueAsDouble;
                return true;
            case 170:
                return true;
            case 171:
                tmp.createCell(this._reader.valueAsInt);
                return true;
            case 172:
                tmp.currentCell.edgeFlags = this._reader.valueAsShort;
                return true;
            case 173:
                tmp.currentCell.mergedValue = this._reader.valueAsShort;
                return true;
            case 174:
                tmp.currentCell.autoFit = this._reader.valueAsBool;
                return true;
            case 175:
                tmp.currentCell.borderWidth = this._reader.valueAsInt;
                return true;
            case 176:
                tmp.currentCell.borderHeight = this._reader.valueAsInt;
                return true;
            case 178:
                tmp.currentCell.virtualEdgeFlag = this._reader.valueAsShort;
                return true;
            case 179:
                return true;
            case 301: {
                const content = new CellContent();
                const contentTemplate = new CadTableCellContentTemplate(content);
                tmp.currentCell.contents.push(content);
                const valTemplate = this.readCadValue(content.cadValue);
                contentTemplate.cadValueTemplate = valTemplate;
                return true;
            }
            case 340:
                tmp.currentCellTemplate.valueHandle = this._reader.valueAsHandle;
                return true;
            default:
                if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.insert))) {
                    return this._readEntitySubclassMap(template, map, DxfSubclassMarker.tableEntity);
                }
                return true;
        }
    }
    readCadValue(value) {
        this._reader.readNext();
        const template = new CadValueTemplate(value);
        const map = DxfClassMap.create(value.constructor, 'CadValue');
        while (this._reader.code !== 304) {
            switch (this._reader.code) {
                case 1:
                    value.setValue(this._reader.valueAsString);
                    break;
                case 2:
                    value.setValue(value.value + this._reader.valueAsString);
                    break;
                case 11: {
                    const xyz = new XYZ();
                    xyz.x = this._reader.valueAsDouble;
                    value.setValue(xyz);
                    break;
                }
                case 21: {
                    const v = value.value;
                    v[1] = this._reader.valueAsDouble;
                    value.setValue(v);
                    break;
                }
                case 31: {
                    const current = value.value;
                    const v = new XYZ(current?.x ?? 0, current?.y ?? 0, this._reader.valueAsDouble);
                    value.setValue(v);
                    break;
                }
                case 91:
                    value.setValue(this._reader.valueAsInt);
                    break;
                case 140:
                    value.setValue(this._reader.valueAsDouble);
                    break;
                case 330:
                    template.valueHandle = this._reader.valueAsHandle;
                    break;
                default:
                    if (!this.tryAssignCurrentValue(value, map)) {
                        this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readCadValue method.`, NotificationType.None);
                    }
                    break;
            }
            this._reader.readNext();
        }
        return template;
    }
    _readTextEntity(template, map, subclass) {
        const mapName = !subclass ? template.cadObject.subclassMarker : subclass;
        const tmp = template;
        switch (this._reader.code) {
            case 1:
            case 3:
                if (tmp.cadObject instanceof MText) {
                    tmp.cadObject.value += this._reader.valueAsString;
                    return true;
                }
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(mapName));
            case 50:
                if (tmp.cadObject instanceof MText) {
                    const angle = this._reader.valueAsAngle;
                    tmp.cadObject.alignmentPoint = new XYZ(Math.cos(angle), Math.sin(angle), 0.0);
                    return true;
                }
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(mapName));
            case 7:
                tmp.styleName = this._reader.valueAsString;
                return true;
            case 101:
                if (tmp.cadObject instanceof MText) {
                    this._readColumnData(tmp.cadObject);
                    this.lockPointer = true;
                    return true;
                }
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(mapName));
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(mapName));
        }
    }
    _readColumnData(mtext) {
        this._reader.readNext();
        while (this._reader.dxfCode !== DxfCode.Start) {
            switch (this._reader.code) {
                case 70:
                    break;
                case 71:
                    mtext.columnData.columnType = this._reader.valueAsShort;
                    break;
                case 72:
                    mtext.columnData.columnCount = this._reader.valueAsInt;
                    break;
                case 10:
                case 20:
                case 30:
                case 11:
                case 21:
                case 31:
                case 40:
                case 41:
                case 42:
                case 43:
                    break;
                case 44:
                    mtext.columnData.width = this._reader.valueAsDouble;
                    break;
                case 45:
                    mtext.columnData.gutter = this._reader.valueAsDouble;
                    break;
                case 46:
                    mtext.columnData.heights.push(this._reader.valueAsDouble);
                    break;
                case 73:
                    mtext.columnData.autoHeight = this._reader.valueAsBool;
                    break;
                case 74:
                    mtext.columnData.flowReversed = this._reader.valueAsBool;
                    break;
                default:
                    this._builder.notify(`[MText.ColumnData] unknown dxf code ${this._reader.code}.`, NotificationType.None);
                    break;
            }
            this._reader.readNext();
        }
    }
    _readTolerance(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 3:
                tmp.dimensionStyleName = this._reader.valueAsString;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(template.cadObject.subclassMarker));
        }
    }
    _readDimension(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 2:
                tmp.blockName = this._reader.valueAsString;
                return true;
            case 3:
                tmp.styleName = this._reader.valueAsString;
                return true;
            case 50: {
                const dim = new DimensionLinear();
                tmp.setDimensionObject(dim);
                dim.rotation = this._reader.valueAsAngle;
                if (!map.subClasses.has(DxfSubclassMarker.linearDimension)) {
                    map.subClasses.set(DxfSubclassMarker.linearDimension, DxfClassMap.create(DimensionLinear));
                }
                return true;
            }
            case 70: {
                tmp.setDimensionFlags(this._reader.valueAsShort);
                if (tmp.cadObject instanceof DimensionPlaceholder && this._builder.version < ACadVersion.AC1012) {
                    const placeholder = tmp.cadObject;
                    switch (placeholder.flags) {
                        case DimensionType.Linear:
                            tmp.setDimensionObject(new DimensionLinear());
                            map.subClasses.set(DxfSubclassMarker.alignedDimension, DxfClassMap.create(DimensionAligned));
                            map.subClasses.set(DxfSubclassMarker.linearDimension, DxfClassMap.create(DimensionLinear));
                            break;
                        case DimensionType.Aligned:
                            tmp.setDimensionObject(new DimensionAligned());
                            map.subClasses.set(DxfSubclassMarker.alignedDimension, DxfClassMap.create(DimensionAligned));
                            break;
                        case DimensionType.Angular:
                            tmp.setDimensionObject(new DimensionAngular2Line());
                            map.subClasses.set(DxfSubclassMarker.angular2LineDimension, DxfClassMap.create(DimensionAngular2Line));
                            break;
                        case DimensionType.Diameter:
                            tmp.setDimensionObject(new DimensionDiameter());
                            map.subClasses.set(DxfSubclassMarker.diametricDimension, DxfClassMap.create(DimensionDiameter));
                            break;
                        case DimensionType.Radius:
                            tmp.setDimensionObject(new DimensionRadius());
                            map.subClasses.set(DxfSubclassMarker.radialDimension, DxfClassMap.create(DimensionRadius));
                            break;
                        case DimensionType.Angular3Point:
                            tmp.setDimensionObject(new DimensionAngular3Pt());
                            map.subClasses.set(DxfSubclassMarker.angular3PointDimension, DxfClassMap.create(DimensionAngular3Pt));
                            break;
                        case DimensionType.Ordinate:
                        case DimensionType.OrdinateTypeX:
                        case DimensionType.Ordinate | DimensionType.OrdinateTypeX:
                            tmp.setDimensionObject(new DimensionOrdinate());
                            map.subClasses.set(DxfSubclassMarker.ordinateDimension, DxfClassMap.create(DimensionOrdinate));
                            break;
                        case DimensionType.BlockReference:
                        case DimensionType.TextUserDefinedLocation:
                        default:
                            break;
                    }
                }
                return true;
            }
            case 42:
                return true;
            case 73:
            case 74:
            case 75:
            case 90:
            case 361:
                return true;
            case 100:
                switch (this._reader.valueAsString) {
                    case DxfSubclassMarker.dimension:
                        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.dimension));
                    case DxfSubclassMarker.alignedDimension:
                        tmp.setDimensionObject(new DimensionAligned());
                        map.subClasses.set(this._reader.valueAsString, DxfClassMap.create(DimensionAligned));
                        return true;
                    case DxfSubclassMarker.diametricDimension:
                        tmp.setDimensionObject(new DimensionDiameter());
                        map.subClasses.set(this._reader.valueAsString, DxfClassMap.create(DimensionDiameter));
                        return true;
                    case DxfSubclassMarker.angular2LineDimension:
                        tmp.setDimensionObject(new DimensionAngular2Line());
                        map.subClasses.set(this._reader.valueAsString, DxfClassMap.create(DimensionAngular2Line));
                        return true;
                    case DxfSubclassMarker.angular3PointDimension:
                        tmp.setDimensionObject(new DimensionAngular3Pt());
                        map.subClasses.set(this._reader.valueAsString, DxfClassMap.create(DimensionAngular3Pt));
                        return true;
                    case DxfSubclassMarker.radialDimension:
                        tmp.setDimensionObject(new DimensionRadius());
                        map.subClasses.set(this._reader.valueAsString, DxfClassMap.create(DimensionRadius));
                        return true;
                    case DxfSubclassMarker.ordinateDimension:
                        tmp.setDimensionObject(new DimensionOrdinate());
                        map.subClasses.set(this._reader.valueAsString, DxfClassMap.create(DimensionOrdinate));
                        return true;
                    case DxfSubclassMarker.linearDimension:
                        return true;
                    default:
                        return false;
                }
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    readHatch(template, map, subclass) {
        const tmp = template;
        const hatch = tmp.cadObject;
        let seedPoint = new XY();
        switch (this._reader.code) {
            case 2:
                hatch.pattern.name = this._reader.valueAsString;
                return true;
            case 10:
                seedPoint.x = this._reader.valueAsDouble;
                hatch.seedPoints.push(seedPoint);
                return true;
            case 20: {
                seedPoint = hatch.seedPoints[hatch.seedPoints.length - 1];
                seedPoint.y = this._reader.valueAsDouble;
                hatch.seedPoints[hatch.seedPoints.length - 1] = seedPoint;
                return true;
            }
            case 30:
                hatch.elevation = this._reader.valueAsDouble;
                return true;
            case 53:
                hatch.patternAngle = this._reader.valueAsAngle;
                return true;
            case 90:
                return true;
            case 75:
                return true;
            case 78:
                this._readPattern(hatch.pattern, this._reader.valueAsInt);
                this.lockPointer = true;
                return true;
            case 91:
                this._readLoops(tmp, this._reader.valueAsInt);
                this.lockPointer = true;
                return true;
            case 98:
                return true;
            case 450:
                hatch.gradientColor.enabled = this._reader.valueAsBool;
                return true;
            case 451:
                hatch.gradientColor.reserved = this._reader.valueAsInt;
                return true;
            case 452:
                hatch.gradientColor.isSingleColorGradient = this._reader.valueAsBool;
                return true;
            case 453:
                return true;
            case 460:
                hatch.gradientColor.angle = this._reader.valueAsDouble;
                return true;
            case 461:
                hatch.gradientColor.shift = this._reader.valueAsDouble;
                return true;
            case 462:
                hatch.gradientColor.colorTint = this._reader.valueAsDouble;
                return true;
            case 463: {
                const gradient = new GradientColor();
                gradient.value = this._reader.valueAsDouble;
                hatch.gradientColor.colors.push(gradient);
                return true;
            }
            case 63: {
                const colorByIndex = hatch.gradientColor.colors[hatch.gradientColor.colors.length - 1];
                if (colorByIndex) {
                    colorByIndex.color = new Color(this._reader.valueAsUShort);
                }
                return true;
            }
            case 421: {
                const colorByRgb = hatch.gradientColor.colors[hatch.gradientColor.colors.length - 1];
                const trueColor = this._reader.valueAsInt;
                if (colorByRgb && trueColor >= 0) {
                    colorByRgb.color = Color.fromTrueColor(trueColor);
                }
                return true;
            }
            case 470:
                hatch.gradientColor.name = this._reader.valueAsString;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(template.cadObject.subclassMarker));
        }
    }
    _readInsert(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 2:
                tmp.blockName = this._reader.valueAsString;
                return true;
            case 100:
                return true;
            case 66:
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.insert));
        }
    }
    _readPolyline() {
        if (this._builder.version === ACadVersion.Unknown
            || this._builder.version === ACadVersion.AC1009) {
            return this._readLegacyPolyline();
        }
        const template = new CadPolyLineTemplate();
        this.readEntityCodes(template, this._readPolylineCodes.bind(this), Entity);
        if (template.cadObject.objectType === ObjectType.INVALID) {
            this._builder.notify(`[${DxfFileToken.entityPolyline}] Subclass not found, entity discarded`, NotificationType.Warning);
            return null;
        }
        while (this._reader.code === 0 && this._reader.valueAsString === DxfFileToken.entityVertex) {
            const vertexTemplate = this.readEntityCodes(new CadVertexTemplate(), this._readVertex.bind(this), Entity);
            if (vertexTemplate.ownerHandle === null) {
                vertexTemplate.ownerHandle = template.cadObject.handle;
            }
            template.ownedObjectsHandlers.add(vertexTemplate.cadObject.handle);
            this._builder.addTemplate(vertexTemplate);
        }
        while (this._reader.code === 0 && this._reader.valueAsString === DxfFileToken.endSequence) {
            const seqend = new Seqend();
            const seqendTemplate = new CadEntityTemplate(seqend);
            this.readEntityCodes(seqendTemplate, this._readEntitySubclassMap.bind(this), Seqend);
            if (seqendTemplate.ownerHandle === null) {
                seqendTemplate.ownerHandle = template.cadObject.handle;
            }
            template.ownedObjectsHandlers.add(seqendTemplate.cadObject.handle);
            this._builder.addTemplate(seqendTemplate);
        }
        return template;
    }
    _readLegacyPolyline() {
        const polyline = new Polyline2D();
        const template = new CadPolyLineTemplate(polyline);
        this.readEntityCodes(template, this._readPolylineCodes.bind(this), Polyline2D);
        while (this._reader.code === 0 && this._reader.valueAsString === DxfFileToken.entityVertex) {
            const v = new Vertex2D();
            const vertexTemplate = new CadVertexTemplate(v);
            this.readEntityCodes(vertexTemplate, this._readVertex.bind(this), Vertex2D);
            if (vertexTemplate.vertex.handle === 0) {
                v.owner = polyline;
                polyline.vertices.push(v);
            }
            else {
                template.ownedObjectsHandlers.add(vertexTemplate.vertex.handle);
                this._builder.addTemplate(vertexTemplate);
            }
        }
        while (this._reader.code === 0 && this._reader.valueAsString === DxfFileToken.endSequence) {
            const seqend = new Seqend();
            const seqendTemplate = new CadEntityTemplate(seqend);
            this.readEntityCodes(seqendTemplate, this._readEntitySubclassMap.bind(this), Seqend);
            seqend.owner = polyline;
            polyline.vertices.seqend = seqend;
        }
        return template;
    }
    _readPolylineCodes(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 10:
            case 20:
            case 66:
                return true;
            case 100:
                switch (this._reader.valueAsString) {
                    case DxfSubclassMarker.polyline:
                        tmp.setPolyLineObject(new Polyline2D());
                        map.subClasses.set(DxfSubclassMarker.polyline, DxfClassMap.create(Polyline2D));
                        return true;
                    case DxfSubclassMarker.polyline3d:
                        tmp.setPolyLineObject(new Polyline3D());
                        map.subClasses.set(DxfSubclassMarker.polyline3d, DxfClassMap.create(Polyline3D));
                        return true;
                    case DxfSubclassMarker.polyfaceMesh:
                        tmp.setPolyLineObject(new PolyfaceMesh());
                        map.subClasses.set(DxfSubclassMarker.polyfaceMesh, DxfClassMap.create(PolyfaceMesh));
                        return true;
                    case DxfSubclassMarker.polygonMesh:
                        tmp.setPolyLineObject(new PolygonMesh());
                        map.subClasses.set(DxfSubclassMarker.polygonMesh, DxfClassMap.create(PolygonMesh));
                        return true;
                    default:
                        return false;
                }
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readLeader(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 3:
                tmp.dimstyleName = this._reader.valueAsString;
                return true;
            case 10:
                tmp.cadObject.vertices.push(new XYZ(this._reader.valueAsDouble, 0, 0));
                return true;
            case 20: {
                const y = tmp.cadObject.vertices[tmp.cadObject.vertices.length - 1];
                y.y = this._reader.valueAsDouble;
                tmp.cadObject.vertices[tmp.cadObject.vertices.length - 1] = y;
                return true;
            }
            case 30: {
                const z = tmp.cadObject.vertices[tmp.cadObject.vertices.length - 1];
                z.z = this._reader.valueAsDouble;
                tmp.cadObject.vertices[tmp.cadObject.vertices.length - 1] = z;
                return true;
            }
            case 340:
                tmp.annotationHandle = this._reader.valueAsHandle;
                return true;
            case 75:
            case 76:
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readLwPolyline(template, map, subclass) {
        const tmp = template;
        const lwPoly = tmp.cadObject;
        const last = lwPoly.vertices[lwPoly.vertices.length - 1] ?? null;
        switch (this._reader.code) {
            case 10:
                lwPoly.vertices.push(new LwPolylineVertex(new XY(this._reader.valueAsDouble, 0)));
                return true;
            case 20:
                if (last !== null) {
                    last.location = new XY(last.location.x, this._reader.valueAsDouble);
                }
                return true;
            case 40:
                if (last !== null) {
                    last.startWidth = this._reader.valueAsDouble;
                }
                return true;
            case 41:
                if (last !== null) {
                    last.endWidth = this._reader.valueAsDouble;
                }
                return true;
            case 42:
                if (last !== null) {
                    last.bulge = this._reader.valueAsDouble;
                }
                return true;
            case 50:
                if (last !== null) {
                    last.curveTangent = this._reader.valueAsDouble;
                }
                return true;
            case 66:
            case 90:
                return true;
            case 91:
                if (last !== null) {
                    last.id = this._reader.valueAsInt;
                }
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readMesh(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 100:
                if (this._reader.valueAsString.toUpperCase() === DxfSubclassMarker.mesh.toUpperCase()) {
                    tmp.subclassMarker = true;
                }
                return true;
            case 90:
                return true;
            case 92: {
                if (!tmp.subclassMarker) {
                    return false;
                }
                const nvertices = this._reader.valueAsInt;
                for (let i = 0; i < nvertices; i++) {
                    this._reader.readNext();
                    const x = this._reader.valueAsDouble;
                    this._reader.readNext();
                    const y = this._reader.valueAsDouble;
                    this._reader.readNext();
                    const z = this._reader.valueAsDouble;
                    tmp.cadObject.vertices.push(new XYZ(x, y, z));
                }
                return true;
            }
            case 93: {
                const size = this._reader.valueAsInt;
                this._reader.readNext();
                let indexes = 0;
                for (let i = 0; i < size; i += indexes + 1) {
                    indexes = this._reader.valueAsInt;
                    this._reader.readNext();
                    const face = new Array(indexes);
                    for (let j = 0; j < indexes; j++) {
                        face[j] = this._reader.valueAsInt;
                        if ((i + j + 2) < size) {
                            this._reader.readNext();
                        }
                    }
                    tmp.cadObject.faces.push(face);
                }
                // Debug.Assert(this._reader.Code == 90);
                return true;
            }
            case 94: {
                const numEdges = this._reader.valueAsInt;
                this._reader.readNext();
                for (let i = 0; i < numEdges; i++) {
                    const edge = new MeshEdge(0, 0);
                    edge.start = this._reader.valueAsInt;
                    this._reader.readNext();
                    edge.end = this._reader.valueAsInt;
                    if (i < numEdges - 1) {
                        this._reader.readNext();
                    }
                    tmp.cadObject.edges.push(edge);
                }
                // Debug.Assert(this._reader.Code == 90);
                return true;
            }
            case 95: {
                this._reader.readNext();
                for (let i = 0; i < tmp.cadObject.edges.length; i++) {
                    const edge = tmp.cadObject.edges[i];
                    edge.crease = this._reader.valueAsDouble;
                    tmp.cadObject.edges[i] = edge;
                    if (i < tmp.cadObject.edges.length - 1) {
                        this._reader.readNext();
                    }
                }
                // Debug.Assert(this._reader.Code == 140);
                return true;
            }
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readMLine(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 2:
                tmp.mLineStyleName = this._reader.valueAsString;
                return true;
            case 72:
                tmp.nVertex = this._reader.valueAsInt;
                return true;
            case 73:
                tmp.nElements = this._reader.valueAsInt;
                return true;
            case 340:
                tmp.mLineStyleHandle = this._reader.valueAsHandle;
                return true;
            default:
                if (!tmp.tryReadVertex(this._reader.code, this._reader.value)) {
                    return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
                }
                return true;
        }
    }
    _readMLeader(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 270:
                return true;
            case 300:
                this._readMultiLeaderObjectContextData(tmp.cadMLeaderAnnotContextTemplate);
                return true;
            case 340:
                tmp.leaderStyleHandle = this._reader.valueAsHandle;
                return true;
            case 341:
                tmp.leaderLineTypeHandle = this._reader.valueAsHandle;
                return true;
            case 343:
                tmp.mTextStyleHandle = this._reader.valueAsHandle;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readMultiLeaderObjectContextData(template) {
        this._reader.readNext();
        const map = DxfClassMap.create(MultiLeaderObjectContextData);
        const contextData = template.cadObject;
        let end = false;
        while (this._reader.dxfCode !== DxfCode.Start) {
            switch (this._reader.code) {
                case 301:
                    if (this._reader.valueAsString === '}') {
                        end = true;
                    }
                    break;
                case 302:
                    if (this._reader.valueAsString === 'LEADER{') {
                        contextData.leaderRoots.push(this._readMultiLeaderLeader(template));
                    }
                    break;
                case 340:
                    template.textStyleHandle = this._reader.valueAsHandle;
                    break;
                default:
                    if (!this.tryAssignCurrentValue(contextData, map)) {
                        this._builder.notify(`[AcDbMLeaderObjectContextData] Unhandled dxf code ${this._reader.code} with value ${this._reader.valueAsString}`, NotificationType.None);
                    }
                    break;
            }
            if (end) {
                break;
            }
            this._reader.readNext();
        }
    }
    _readMultiLeaderLeader(template) {
        const root = new LeaderRoot();
        const map = DxfClassMap.create(root.constructor, 'LeaderRoot');
        this._reader.readNext();
        let end = false;
        while (this._reader.dxfCode !== DxfCode.Start) {
            switch (this._reader.code) {
                case 303:
                    if (this._reader.valueAsString === '}') {
                        end = true;
                    }
                    break;
                case 304:
                    if (this._reader.valueAsString === 'LEADER_LINE{') {
                        const lineTemplate = new CadMLeaderAnnotContextTemplate.LeaderLineTemplate();
                        template.leaderLineTemplates.push(lineTemplate);
                        root.lines.push(this._readMultiLeaderLine(lineTemplate));
                    }
                    break;
                default:
                    if (!this.tryAssignCurrentValue(root, map)) {
                        this._builder.notify(`[LeaderRoot] Unhandled dxf code ${this._reader.code} with value ${this._reader.valueAsString}`, NotificationType.None);
                    }
                    break;
            }
            if (end) {
                break;
            }
            this._reader.readNext();
        }
        return root;
    }
    _readMultiLeaderLine(template) {
        const line = template.leaderLine;
        const map = DxfClassMap.create(line.constructor, 'LeaderLine');
        this._reader.readNext();
        let end = false;
        while (this._reader.dxfCode !== DxfCode.Start) {
            switch (this._reader.code) {
                case 10: {
                    const pt = new XYZ(this._reader.valueAsDouble, 0, 0);
                    line.points.push(pt);
                    break;
                }
                case 20: {
                    const pt = line.points[line.points.length - 1];
                    pt.y = this._reader.valueAsDouble;
                    line.points[line.points.length - 1] = pt;
                    break;
                }
                case 30: {
                    const pt = line.points[line.points.length - 1];
                    pt.z = this._reader.valueAsDouble;
                    line.points[line.points.length - 1] = pt;
                    break;
                }
                case 305:
                    if (this._reader.valueAsString === '}') {
                        end = true;
                    }
                    break;
                default:
                    if (!this.tryAssignCurrentValue(line, map)) {
                        this._builder.notify(`[LeaderLine] Unhandled dxf code ${this._reader.code} with value ${this._reader.valueAsString}`, NotificationType.None);
                    }
                    break;
            }
            if (end) {
                break;
            }
            this._reader.readNext();
        }
        return line;
    }
    _readShape(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 2:
                tmp.shapeFileName = this._reader.valueAsString;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readWipeoutBase(template, map, subclass) {
        const tmp = template;
        const wipeout = tmp.cadObject;
        switch (this._reader.code) {
            case 91: {
                const nvertices = this._reader.valueAsInt;
                for (let i = 0; i < nvertices; i++) {
                    this._reader.readNext();
                    const x = this._reader.valueAsDouble;
                    this._reader.readNext();
                    const y = this._reader.valueAsDouble;
                    wipeout.clipBoundaryVertices.push(new XY(x, y));
                }
                this._reader.readNext();
                return this.checkEntityEnd(template, map, subclass, this._readWipeoutBase.bind(this));
            }
            case 340:
                tmp.imgDefHandle = this._reader.valueAsHandle;
                return true;
            case 360:
                tmp.imgReactorHandle = this._reader.valueAsHandle;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readOle2Frame(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 1:
            case 90:
            case 73:
                return true;
            case 310:
                tmp.chunks.push(this._reader.valueAsBinaryChunk);
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readModelerGeometry(template, map, subclass) {
        const tmp = template;
        const mapName = !subclass ? template.cadObject.subclassMarker : subclass;
        const geometry = template.cadObject;
        switch (this._reader.code) {
            case 1:
            case 3:
                geometry.proprietaryData += this._reader.valueAsString + '\n';
                return true;
            case 2:
                geometry.guid = this._reader.valueAsString;
                return true;
            case 290:
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(mapName));
        }
    }
    _readSolid3d(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 350:
                tmp.historyHandle = this._reader.valueAsHandle;
                return true;
            default:
                return this._readModelerGeometry(template, map, DxfSubclassMarker.modelerGeometry);
        }
    }
    _readSpline(template, map, subclass) {
        const tmp = template;
        let controlPoint;
        let fitPoint;
        switch (this._reader.code) {
            case 10:
                controlPoint = new XYZ(this._reader.valueAsDouble, 0, 0);
                tmp.cadObject.controlPoints.push(controlPoint);
                return true;
            case 20:
                controlPoint = tmp.cadObject.controlPoints[tmp.cadObject.controlPoints.length - 1];
                controlPoint.y = this._reader.valueAsDouble;
                tmp.cadObject.controlPoints[tmp.cadObject.controlPoints.length - 1] = controlPoint;
                return true;
            case 30:
                controlPoint = tmp.cadObject.controlPoints[tmp.cadObject.controlPoints.length - 1];
                controlPoint.z = this._reader.valueAsDouble;
                tmp.cadObject.controlPoints[tmp.cadObject.controlPoints.length - 1] = controlPoint;
                return true;
            case 11:
                fitPoint = new XYZ(this._reader.valueAsDouble, 0, 0);
                tmp.cadObject.fitPoints.push(fitPoint);
                return true;
            case 21:
                fitPoint = tmp.cadObject.fitPoints[tmp.cadObject.fitPoints.length - 1];
                fitPoint.y = this._reader.valueAsDouble;
                tmp.cadObject.fitPoints[tmp.cadObject.fitPoints.length - 1] = fitPoint;
                return true;
            case 31:
                fitPoint = tmp.cadObject.fitPoints[tmp.cadObject.fitPoints.length - 1];
                fitPoint.z = this._reader.valueAsDouble;
                tmp.cadObject.fitPoints[tmp.cadObject.fitPoints.length - 1] = fitPoint;
                return true;
            case 40:
                tmp.cadObject.knots.push(this._reader.valueAsDouble);
                return true;
            case 41:
                tmp.cadObject.weights.push(this._reader.valueAsDouble);
                return true;
            case 72:
            case 73:
            case 74:
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readUnderlayEntity(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 340:
                tmp.definitionHandle = this._reader.valueAsHandle;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readVertex(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 100:
                switch (this._reader.valueAsString) {
                    case DxfSubclassMarker.vertex:
                        return true;
                    case DxfSubclassMarker.polylineVertex:
                        tmp.setVertexObject(new Vertex2D());
                        map.subClasses.set(DxfSubclassMarker.polylineVertex, DxfClassMap.create(Vertex2D));
                        return true;
                    case DxfSubclassMarker.polyline3dVertex:
                        tmp.setVertexObject(new Vertex3D());
                        map.subClasses.set(DxfSubclassMarker.polyline3dVertex, DxfClassMap.create(Vertex3D));
                        return true;
                    case DxfSubclassMarker.polyfaceMeshVertex:
                        tmp.setVertexObject(new VertexFaceMesh());
                        map.subClasses.set(DxfSubclassMarker.polyfaceMeshVertex, DxfClassMap.create(VertexFaceMesh));
                        return true;
                    case DxfSubclassMarker.polyfaceMeshFace:
                        tmp.setVertexObject(new VertexFaceRecord());
                        map.subClasses.set(DxfSubclassMarker.polyfaceMeshFace, DxfClassMap.create(VertexFaceRecord));
                        return true;
                    case DxfSubclassMarker.polygonMeshVertex:
                        tmp.setVertexObject(new PolygonMeshVertex());
                        map.subClasses.set(DxfSubclassMarker.polygonMeshVertex, DxfClassMap.create(PolygonMeshVertex));
                        return true;
                    default:
                        return false;
                }
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker));
        }
    }
    _readViewport(template, map, subclass) {
        const tmp = template;
        switch (this._reader.code) {
            case 67:
            case 68:
                return true;
            case 69:
                tmp.viewportId = this._reader.valueAsShort;
                return true;
            case 331:
                tmp.frozenLayerHandles.add(this._reader.valueAsHandle);
                return true;
            case 348:
                tmp.visualStyleHandle = this._reader.valueAsHandle;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.viewport));
        }
    }
    _readEntitySubclassMap(template, map, subclass) {
        const mapName = !subclass ? template.cadObject.subclassMarker : subclass;
        switch (this._reader.code) {
            default:
                return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(mapName));
        }
    }
    readExtendedData(edata) {
        const records = [];
        edata.set(this._reader.valueAsString, records);
        this._reader.readNext();
        while (this._reader.dxfCode >= DxfCode.ExtendedDataAsciiString) {
            if (this._reader.dxfCode === DxfCode.ExtendedDataRegAppName) {
                this.readExtendedData(edata);
                break;
            }
            let record = null;
            let x = 0;
            let y = 0;
            let z = 0;
            switch (this._reader.dxfCode) {
                case DxfCode.ExtendedDataAsciiString:
                    record = new ExtendedDataString(this._reader.valueAsString);
                    break;
                case DxfCode.ExtendedDataControlString:
                    record = new ExtendedDataControlString(this._reader.valueAsString === '}');
                    break;
                case DxfCode.ExtendedDataLayerName: {
                    const layer = this._builder.layers.get(this._reader.valueAsString);
                    if (layer) {
                        record = new ExtendedDataLayer(layer.handle);
                    }
                    else {
                        this._builder.notify(`[XData] Could not found the linked Layer ${this._reader.valueAsString}.`, NotificationType.Warning);
                    }
                    break;
                }
                case DxfCode.ExtendedDataBinaryChunk:
                    record = new ExtendedDataBinaryChunk(this._reader.valueAsBinaryChunk);
                    break;
                case DxfCode.ExtendedDataHandle:
                    record = new ExtendedDataHandle(this._reader.valueAsHandle);
                    break;
                case DxfCode.ExtendedDataXCoordinate:
                    x = this._reader.valueAsDouble;
                    this._reader.readNext();
                    y = this._reader.valueAsDouble;
                    this._reader.readNext();
                    z = this._reader.valueAsDouble;
                    record = new ExtendedDataCoordinate(new XYZ(x, y, z));
                    break;
                case DxfCode.ExtendedDataWorldXCoordinate:
                    x = this._reader.valueAsDouble;
                    this._reader.readNext();
                    y = this._reader.valueAsDouble;
                    this._reader.readNext();
                    z = this._reader.valueAsDouble;
                    record = new ExtendedDataWorldCoordinate(new XYZ(x, y, z));
                    break;
                case DxfCode.ExtendedDataWorldXDisp:
                    x = this._reader.valueAsDouble;
                    this._reader.readNext();
                    y = this._reader.valueAsDouble;
                    this._reader.readNext();
                    z = this._reader.valueAsDouble;
                    record = new ExtendedDataDisplacement(new XYZ(x, y, z));
                    break;
                case DxfCode.ExtendedDataWorldXDir:
                    x = this._reader.valueAsDouble;
                    this._reader.readNext();
                    y = this._reader.valueAsDouble;
                    this._reader.readNext();
                    z = this._reader.valueAsDouble;
                    record = new ExtendedDataDirection(new XYZ(x, y, z));
                    break;
                case DxfCode.ExtendedDataReal:
                    record = new ExtendedDataReal(this._reader.valueAsDouble);
                    break;
                case DxfCode.ExtendedDataDist:
                    record = new ExtendedDataDistance(this._reader.valueAsDouble);
                    break;
                case DxfCode.ExtendedDataScale:
                    record = new ExtendedDataScale(this._reader.valueAsDouble);
                    break;
                case DxfCode.ExtendedDataInteger16:
                    record = new ExtendedDataInteger16(this._reader.valueAsShort);
                    break;
                case DxfCode.ExtendedDataInteger32:
                    record = new ExtendedDataInteger32(this._reader.valueAsInt);
                    break;
                default:
                    this._builder.notify(`Unknown code for extended data: ${this._reader.dxfCode}`, NotificationType.Warning);
                    break;
            }
            if (record !== null) {
                records.push(record);
            }
            this._reader.readNext();
        }
    }
    _readPattern(pattern, nlines) {
        this._reader.readNext();
        for (let i = 0; i < nlines; i++) {
            const line = new HatchPatternLine();
            let basePoint = new XY();
            let offset = new XY();
            let end = false;
            const codes = new Set();
            while (!end) {
                if (codes.has(this._reader.code)) {
                    break;
                }
                else {
                    codes.add(this._reader.code);
                }
                switch (this._reader.code) {
                    case 53:
                        line.angle = this._reader.valueAsAngle;
                        break;
                    case 43:
                        basePoint.x = this._reader.valueAsDouble;
                        break;
                    case 44:
                        basePoint.y = this._reader.valueAsDouble;
                        line.basePoint = basePoint;
                        break;
                    case 45:
                        offset.x = this._reader.valueAsDouble;
                        line.offset = offset;
                        break;
                    case 46:
                        offset.y = this._reader.valueAsDouble;
                        line.offset = offset;
                        break;
                    case 79: {
                        const ndash = this._reader.valueAsInt;
                        for (let j = 0; j < ndash; j++) {
                            this._reader.readNext();
                            line.dashLengths.push(this._reader.valueAsDouble);
                        }
                        break;
                    }
                    case 49:
                        line.dashLengths.push(this._reader.valueAsDouble);
                        break;
                    default:
                        end = true;
                        break;
                }
                this._reader.readNext();
            }
            pattern.lines.push(line);
        }
    }
    _readLoops(template, count) {
        if (this._reader.code === 91) {
            this._reader.readNext();
        }
        for (let i = 0; i < count; i++) {
            if (this._reader.code !== 92) {
                this._builder.notify(`Boundary path should start with code 92 but was ${this._reader.code}`);
                break;
            }
            const path = this._readLoop();
            if (path !== null) {
                template.pathTemplates.push(path);
            }
        }
    }
    _readLoop() {
        const template = new CadHatchTemplate.CadBoundaryPathTemplate();
        const flags = this._reader.valueAsInt;
        template.path.flags = flags;
        if ((flags & BoundaryPathFlags.Polyline) !== 0) {
            const pl = this._readPolylineBoundary();
            if (pl) {
                template.path.edges.push(pl);
            }
        }
        else {
            this._reader.readNext();
            if (this._reader.code !== 93) {
                this._builder.notify(`Edge Boundary path should start with code 93 but was ${this._reader.code}`);
                return null;
            }
            const edges = this._reader.valueAsInt;
            this._reader.readNext();
            for (let i = 0; i < edges; i++) {
                const edge = this._readEdge();
                if (edge !== null) {
                    template.path.edges.push(edge);
                }
            }
        }
        let end = false;
        while (!end) {
            switch (this._reader.code) {
                case 97:
                    break;
                case 330:
                    template.handles.add(this._reader.valueAsHandle);
                    break;
                default:
                    end = true;
                    continue;
            }
            this._reader.readNext();
        }
        return template;
    }
    _readPolylineBoundary() {
        const boundary = new HatchBoundaryPathPolyline();
        this._reader.readNext();
        if (this._reader.code !== 72) {
            this._builder.notify(`Polyline Boundary path should start with code 72 but was ${this._reader.code}`);
            return null;
        }
        let end = false;
        let hasBulge = false;
        while (!end) {
            switch (this._reader.code) {
                case 72:
                    hasBulge = this._reader.valueAsBool;
                    break;
                case 73:
                    boundary.isClosed = this._reader.valueAsBool;
                    break;
                case 93: {
                    const nvertices = this._reader.valueAsInt;
                    this._reader.readNext();
                    for (let i = 0; i < nvertices; i++) {
                        let bulge = 0.0;
                        const x = this._reader.valueAsDouble;
                        this._reader.readNext();
                        const y = this._reader.valueAsDouble;
                        this._reader.readNext();
                        if (hasBulge) {
                            bulge = this._reader.valueAsDouble;
                            this._reader.readNext();
                        }
                        boundary.vertices.push(new XYZ(x, y, bulge));
                    }
                    continue;
                }
                default:
                    end = true;
                    continue;
            }
            this._reader.readNext();
        }
        return boundary;
    }
    _readEdge() {
        if (this._reader.code !== 72) {
            this._builder.notify(`Edge Boundary path should define the type with code 72 but was ${this._reader.code}`);
            return null;
        }
        const type = this._reader.valueAsInt;
        this._reader.readNext();
        switch (type) {
            case EdgeType.Line: {
                const line = new HatchBoundaryPathLine();
                while (true) {
                    switch (this._reader.code) {
                        case 10:
                            line.start = new XY(this._reader.valueAsDouble, line.start.y);
                            break;
                        case 20:
                            line.start = new XY(line.start.x, this._reader.valueAsDouble);
                            break;
                        case 11:
                            line.end = new XY(this._reader.valueAsDouble, line.end.y);
                            break;
                        case 21:
                            line.end = new XY(line.end.x, this._reader.valueAsDouble);
                            break;
                        default:
                            return line;
                    }
                    this._reader.readNext();
                }
            }
            case EdgeType.CircularArc: {
                const arc = new HatchBoundaryPathArc();
                while (true) {
                    switch (this._reader.code) {
                        case 10:
                            arc.center = new XY(this._reader.valueAsDouble, arc.center.y);
                            break;
                        case 20:
                            arc.center = new XY(arc.center.x, this._reader.valueAsDouble);
                            break;
                        case 40:
                            arc.radius = this._reader.valueAsDouble;
                            break;
                        case 50:
                            arc.startAngle = MathHelper.degToRad(this._reader.valueAsDouble);
                            break;
                        case 51:
                            arc.endAngle = MathHelper.degToRad(this._reader.valueAsDouble);
                            break;
                        case 73:
                            arc.counterClockWise = this._reader.valueAsBool;
                            break;
                        default:
                            return arc;
                    }
                    this._reader.readNext();
                }
            }
            case EdgeType.EllipticArc: {
                const ellipse = new HatchBoundaryPathEllipse();
                while (true) {
                    switch (this._reader.code) {
                        case 10:
                            ellipse.center = new XY(this._reader.valueAsDouble, ellipse.center.y);
                            break;
                        case 20:
                            ellipse.center = new XY(ellipse.center.x, this._reader.valueAsDouble);
                            break;
                        case 11:
                            ellipse.majorAxisEndPoint = new XY(this._reader.valueAsDouble, ellipse.center.y);
                            break;
                        case 21:
                            ellipse.majorAxisEndPoint = new XY(ellipse.center.x, this._reader.valueAsDouble);
                            break;
                        case 40:
                            ellipse.minorToMajorRatio = this._reader.valueAsDouble;
                            break;
                        case 50:
                            ellipse.startAngle = MathHelper.degToRad(this._reader.valueAsDouble);
                            break;
                        case 51:
                            ellipse.endAngle = MathHelper.degToRad(this._reader.valueAsDouble);
                            break;
                        case 73:
                            ellipse.counterClockWise = this._reader.valueAsBool;
                            break;
                        default:
                            return ellipse;
                    }
                    this._reader.readNext();
                }
            }
            case EdgeType.Spline: {
                const spline = new HatchBoundaryPathSpline();
                let nKnots = 0;
                let nCtrlPoints = 0;
                let nFitPoints = 0;
                let controlPoint = new XYZ();
                let fitPoint = new XY();
                while (true) {
                    switch (this._reader.code) {
                        case 10:
                            controlPoint = new XYZ(this._reader.valueAsDouble, 0, 1);
                            break;
                        case 20:
                            controlPoint = new XYZ(controlPoint.x, this._reader.valueAsDouble, controlPoint.z);
                            spline.controlPoints.push(controlPoint);
                            break;
                        case 11:
                            fitPoint = new XY(this._reader.valueAsDouble, 0);
                            break;
                        case 21:
                            fitPoint = new XY(fitPoint.x, this._reader.valueAsDouble);
                            spline.fitPoints.push(fitPoint);
                            break;
                        case 42: {
                            const last = spline.controlPoints[spline.controlPoints.length - 1];
                            spline.controlPoints[spline.controlPoints.length - 1] = new XYZ(last.x, last.y, this._reader.valueAsDouble);
                            break;
                        }
                        case 12:
                            spline.startTangent = new XY(this._reader.valueAsDouble, spline.startTangent.y);
                            break;
                        case 22:
                            spline.startTangent = new XY(spline.startTangent.x, this._reader.valueAsDouble);
                            break;
                        case 13:
                            spline.endTangent = new XY(this._reader.valueAsDouble, spline.endTangent.y);
                            break;
                        case 23:
                            spline.endTangent = new XY(spline.endTangent.x, this._reader.valueAsDouble);
                            break;
                        case 94:
                            spline.degree = this._reader.valueAsInt;
                            break;
                        case 73:
                            spline.isRational = this._reader.valueAsBool;
                            break;
                        case 74:
                            spline.isPeriodic = this._reader.valueAsBool;
                            break;
                        case 95:
                            nKnots = this._reader.valueAsInt;
                            break;
                        case 96:
                            nCtrlPoints = this._reader.valueAsInt;
                            break;
                        case 97:
                            nFitPoints = this._reader.valueAsInt;
                            break;
                        case 40:
                            spline.knots.push(this._reader.valueAsDouble);
                            break;
                        default:
                            return spline;
                    }
                    this._reader.readNext();
                }
            }
        }
        return null;
    }
    _readDefinedGroups(template) {
        if (template !== undefined) {
            const { xdictHandle, reactors } = this._readDefinedGroupsRaw();
            if (xdictHandle !== null) {
                template.xDictHandle = xdictHandle;
            }
            reactors.forEach(r => template.reactorsHandles.add(r));
        }
    }
    _readDefinedGroupsRaw() {
        let xdictHandle = null;
        let reactors = new Set();
        switch (this._reader.valueAsString) {
            case DxfFileToken.dictionaryToken:
                this._reader.readNext();
                xdictHandle = this._reader.valueAsHandle;
                this._reader.readNext();
                // Debug.Assert(this._reader.DxfCode == DxfCode.ControlString);
                return { xdictHandle, reactors };
            case DxfFileToken.reactorsToken:
                reactors = this._readReactors();
                break;
            case DxfFileToken.blkRefToken:
            default:
                do {
                    this._reader.readNext();
                } while (this._reader.dxfCode !== DxfCode.ControlString);
                return { xdictHandle, reactors };
        }
        return { xdictHandle, reactors };
    }
    _readReactors() {
        const reactors = new Set();
        this._reader.readNext();
        while (this._reader.dxfCode !== DxfCode.ControlString) {
            reactors.add(this._reader.valueAsHandle);
            this._reader.readNext();
        }
        return reactors;
    }
    tryAssignCurrentValue(cadObject, map) {
        if (map instanceof DxfMap) {
            if (!this.currentSubclass) {
                return false;
            }
            const subClass = map.subClasses.get(this.currentSubclass);
            if (subClass) {
                return this.tryAssignCurrentValue(cadObject, subClass);
            }
            else {
                return false;
            }
        }
        try {
            const dxfProperty = map.dxfProperties.get(this._reader.code);
            if (dxfProperty) {
                if ((dxfProperty.referenceType & DxfReferenceType.Count) !== 0) {
                    return true;
                }
                if ((dxfProperty.referenceType & DxfReferenceType.Handle) !== 0
                    || (dxfProperty.referenceType & DxfReferenceType.Name) !== 0) {
                    return false;
                }
                let value = this._reader.value;
                if ((dxfProperty.referenceType & DxfReferenceType.IsAngle) !== 0) {
                    value = MathHelper.degToRad(value);
                }
                dxfProperty.setValue(this._reader.code, cadObject, value);
                return true;
            }
        }
        catch (ex) {
            if (!this._builder.configuration.failsafe) {
                throw ex;
            }
            else {
                this._builder.notify('An error occurred while assigning a property using mapper', NotificationType.Error, ex instanceof Error ? ex : null);
            }
        }
        return false;
    }
}
//# sourceMappingURL=DxfSectionReaderBase.js.map