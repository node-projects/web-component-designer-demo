import { DxfSectionReaderBase } from './DxfSectionReaderBase.js';
import { CadTableTemplate } from '../../Templates/CadTableTemplate.js';
import { CadTableEntryTemplate } from '../../Templates/CadTableEntryTemplate.js';
import { CadBlockRecordTemplate } from '../../Templates/CadBlockRecordTemplate.js';
import { CadBlockCtrlObjectTemplate } from '../../Templates/CadBlockCtrlObjectTemplate.js';
import { CadDimensionStyleTemplate } from '../../Templates/CadDimensionStyleTemplate.js';
import { CadLayerTemplate } from '../../Templates/CadLayerTemplate.js';
import { CadLineTypeTemplate } from '../../Templates/CadLineTypeTemplate.js';
import { CadUcsTemplate } from '../../Templates/CadUcsTemplate.js';
import { CadViewTemplate } from '../../Templates/CadViewTemplate.js';
import { CadVPortTemplate } from '../../Templates/CadVPortTemplate.js';
import { AppId } from '../../../Tables/AppId.js';
import { BlockRecord } from '../../../Tables/BlockRecord.js';
import { TextStyle } from '../../../Tables/TextStyle.js';
import { VPort } from '../../../Tables/VPort.js';
import { AppIdsTable } from '../../../Tables/Collections/AppIdsTable.js';
import { BlockRecordsTable } from '../../../Tables/Collections/BlockRecordsTable.js';
import { VPortsTable } from '../../../Tables/Collections/VPortsTable.js';
import { LineTypesTable } from '../../../Tables/Collections/LineTypesTable.js';
import { LayersTable } from '../../../Tables/Collections/LayersTable.js';
import { TextStylesTable } from '../../../Tables/Collections/TextStylesTable.js';
import { ViewsTable } from '../../../Tables/Collections/ViewsTable.js';
import { UCSTable } from '../../../Tables/Collections/UCSTable.js';
import { DimensionStylesTable } from '../../../Tables/Collections/DimensionStylesTable.js';
import { Color } from '../../../Color.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfMap } from '../../../DxfMap.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { DxfException } from '../../../Exceptions/DxfException.js';
import { XY } from '../../../Math/XY.js';
import { MathHelper } from '../../../Math/MathHelper.js';
export class DxfTablesSectionReader extends DxfSectionReaderBase {
    constructor(reader, builder) {
        super(reader, builder);
    }
    read() {
        this._reader.readNext();
        while (this._reader.valueAsString !== DxfFileToken.endSection) {
            if (this._reader.valueAsString === DxfFileToken.tableEntry) {
                this._readTable();
            }
            else {
                throw new DxfException(`Unexpected token at the beginning of a table: ${this._reader.valueAsString}`, this._reader.position);
            }
            if (this._reader.valueAsString === DxfFileToken.endTable) {
                this._reader.readNext();
            }
            else {
                throw new DxfException(`Unexpected token at the end of a table: ${this._reader.valueAsString}`, this._reader.position);
            }
        }
    }
    _readTable() {
        // Debug.Assert(this._reader.ValueAsString == DxfFileToken.TableEntry);
        this._reader.readNext();
        let nentries = 0;
        let template = null;
        const edata = new Map();
        const commonData = this.readCommonObjectData();
        const { name, handle, ownerHandle, xdictHandle, reactors } = commonData;
        if (this._reader.dxfCode === DxfCode.Subclass) {
            while (this._reader.code !== DxfCode.Start) {
                switch (this._reader.code) {
                    case 70:
                        nentries = this._reader.valueAsInt;
                        break;
                    case 100:
                        if (this._reader.valueAsString === DxfSubclassMarker.dimensionStyleTable) {
                            while (this._reader.code !== DxfCode.Start) {
                                this._reader.readNext();
                            }
                            break;
                        }
                        // Debug.Assert(this._reader.ValueAsString == DxfSubclassMarker.Table);
                        break;
                    case 1001:
                        this.readExtendedData(edata);
                        break;
                    default:
                        this._builder.notify(`[AcDbSymbolTable] Unhandled dxf code ${this._reader.code} at line ${this._reader.position}.`);
                        break;
                }
                if (this._reader.code === DxfCode.Start) {
                    break;
                }
                this._reader.readNext();
            }
        }
        else if (this._reader.valueAsString === DxfFileToken.endTable) {
            return;
        }
        else {
            this._reader.readNext();
        }
        switch (name) {
            case DxfFileToken.tableAppId:
                template = new CadTableTemplate(new AppIdsTable());
                this._readEntries(template);
                template.cadObject.handle = handle;
                this._builder.appIds = template.cadObject;
                break;
            case DxfFileToken.tableBlockRecord:
                template = new CadBlockCtrlObjectTemplate(new BlockRecordsTable());
                this._readEntries(template);
                template.cadObject.handle = handle;
                this._builder.blockRecords = template.cadObject;
                break;
            case DxfFileToken.tableVport:
                template = new CadTableTemplate(new VPortsTable());
                this._readEntries(template);
                template.cadObject.handle = handle;
                this._builder.vPorts = template.cadObject;
                break;
            case DxfFileToken.tableLinetype:
                template = new CadTableTemplate(new LineTypesTable());
                this._readEntries(template);
                template.cadObject.handle = handle;
                this._builder.lineTypesTable = template.cadObject;
                break;
            case DxfFileToken.tableLayer:
                template = new CadTableTemplate(new LayersTable());
                this._readEntries(template);
                template.cadObject.handle = handle;
                this._builder.layers = template.cadObject;
                break;
            case DxfFileToken.tableStyle:
                template = new CadTableTemplate(new TextStylesTable());
                this._readEntries(template);
                template.cadObject.handle = handle;
                this._builder.textStyles = template.cadObject;
                break;
            case DxfFileToken.tableView:
                template = new CadTableTemplate(new ViewsTable());
                this._readEntries(template);
                template.cadObject.handle = handle;
                this._builder.views = template.cadObject;
                break;
            case DxfFileToken.tableUcs:
                template = new CadTableTemplate(new UCSTable());
                this._readEntries(template);
                template.cadObject.handle = handle;
                this._builder.ucSs = template.cadObject;
                break;
            case DxfFileToken.tableDimstyle:
                template = new CadTableTemplate(new DimensionStylesTable());
                this._readEntries(template);
                template.cadObject.handle = handle;
                this._builder.dimensionStyles = template.cadObject;
                break;
            default:
                throw new DxfException(`Unknown table name ${name}`);
        }
        // Debug.Assert(ownerHandle == null || ownerHandle === 0);
        template.ownerHandle = ownerHandle ?? null;
        template.xDictHandle = xdictHandle;
        template.reactorsHandles = reactors;
        template.eDataTemplateByAppName = edata;
        this._builder.addTemplate(template);
    }
    _readEntries(tableTemplate) {
        while (this._reader.valueAsString !== DxfFileToken.endTable) {
            this._reader.readNext();
            let template = null;
            switch (tableTemplate.cadObject.objectName) {
                case DxfFileToken.tableAppId:
                    template = this._readTableEntry(new CadTableEntryTemplate(new AppId()), this._readAppId.bind(this));
                    break;
                case DxfFileToken.tableBlockRecord: {
                    const block = new CadBlockRecordTemplate();
                    template = this._readTableEntry(block, this._readBlockRecord.bind(this));
                    if (block.cadObject.name.toUpperCase() === BlockRecord.modelSpaceName.toUpperCase()) {
                        this._builder.modelSpaceTemplate = block;
                    }
                    break;
                }
                case DxfFileToken.tableDimstyle:
                    template = this._readTableEntry(new CadDimensionStyleTemplate(), this._readDimensionStyle.bind(this));
                    break;
                case DxfFileToken.tableLayer:
                    template = this._readTableEntry(new CadLayerTemplate(), this._readLayer.bind(this));
                    break;
                case DxfFileToken.tableLinetype:
                    template = this._readTableEntry(new CadLineTypeTemplate(), this._readLineType.bind(this));
                    break;
                case DxfFileToken.tableStyle:
                    template = this._readTableEntry(new CadTableEntryTemplate(new TextStyle()), this._readTextStyle.bind(this));
                    break;
                case DxfFileToken.tableUcs:
                    template = this._readTableEntry(new CadUcsTemplate(), this._readUcs.bind(this));
                    break;
                case DxfFileToken.tableView:
                    template = this._readTableEntry(new CadViewTemplate(), this._readView.bind(this));
                    break;
                case DxfFileToken.tableVport:
                    template = this._readTableEntry(new CadVPortTemplate(), this._readVPort.bind(this));
                    break;
                default:
                    // Debug.Fail
                    break;
            }
            if (template !== null) {
                const entry = template.cadObject;
                if (tableTemplate.cadObject.contains(template.name) && this._builder.configuration.failsafe) {
                    this._builder.notify(`Duplicated entry with name ${template.name} found in ${template.cadObject.objectName}`, NotificationType.Warning);
                    tableTemplate.cadObject.remove(template.name);
                    tableTemplate.cadObject.add(entry);
                }
                else {
                    tableTemplate.cadObject.add(entry);
                }
                this._builder.addTemplate(template);
            }
        }
    }
    _readTableEntry(template, readEntry) {
        const map = DxfMap.create(template.cadObject.constructor);
        while (this._reader.dxfCode !== DxfCode.Start) {
            if (!readEntry(template, map.subClasses.get(template.cadObject.subclassMarker))) {
                const isExtendedData = { value: false };
                this._readCommonTableEntryCodes(template, isExtendedData, map);
                if (isExtendedData.value) {
                    continue;
                }
            }
            if (this._reader.code !== DxfCode.Start) {
                this._reader.readNext();
            }
        }
        return template;
    }
    _readCommonTableEntryCodes(template, isExtendedData, map) {
        isExtendedData.value = false;
        switch (this._reader.code) {
            case 2: {
                const name = this._reader.valueAsString || (template.cadObject instanceof VPort ? VPort.defaultName : '');
                template.cadObject.name = name;
                break;
            }
            case 70:
                template.cadObject.flags = this._reader.valueAsUShort;
                break;
            case 100:
                // Debug.Assert
                break;
            default:
                this.readCommonCodes(template, isExtendedData, map);
                break;
        }
    }
    _readAppId(template, map) {
        switch (this._reader.code) {
            default:
                return this.tryAssignCurrentValue(template.cadObject, map);
        }
    }
    _readBlockRecord(template, map) {
        switch (this._reader.code) {
            case 340:
                template.layoutHandle = this._reader.valueAsHandle;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map);
        }
    }
    _readDimensionStyle(template, map) {
        const dimensionStyle = template.cadObject;
        switch (this._reader.code) {
            case 3:
                dimensionStyle.postFix = this._reader.valueAsString;
                return true;
            case 4:
                dimensionStyle.alternateDimensioningSuffix = this._reader.valueAsString;
                return true;
            case 5:
                template.dimbL_Name = this._reader.valueAsString;
                return true;
            case 6:
                template.dimblK1_Name = this._reader.valueAsString;
                return true;
            case 7:
                template.dimblK2_Name = this._reader.valueAsString;
                return true;
            case 40:
                try {
                    dimensionStyle.scaleFactor = this._reader.valueAsDouble;
                }
                catch (ex) {
                    dimensionStyle.scaleFactor = MathHelper.epsilon;
                    this._builder.notify(`[${dimensionStyle.subclassMarker}] Assignation error for scaleFactor.`, NotificationType.Warning, ex instanceof Error ? ex : null);
                }
                return true;
            case 41:
                try {
                    dimensionStyle.arrowSize = this._reader.valueAsDouble;
                }
                catch (ex) {
                    this._builder.notify(`[${dimensionStyle.subclassMarker}] Assignation error for arrowSize.`, NotificationType.Warning, ex instanceof Error ? ex : null);
                }
                return true;
            case 42:
                dimensionStyle.extensionLineOffset = this._reader.valueAsDouble;
                return true;
            case 43:
                dimensionStyle.dimensionLineIncrement = this._reader.valueAsDouble;
                return true;
            case 44:
                dimensionStyle.extensionLineExtension = this._reader.valueAsDouble;
                return true;
            case 45:
                dimensionStyle.rounding = this._reader.valueAsDouble;
                return true;
            case 46:
                dimensionStyle.dimensionLineExtension = this._reader.valueAsDouble;
                return true;
            case 47:
                dimensionStyle.plusTolerance = this._reader.valueAsDouble;
                return true;
            case 48:
                dimensionStyle.minusTolerance = this._reader.valueAsDouble;
                return true;
            case 49:
                dimensionStyle.fixedExtensionLineLength = this._reader.valueAsDouble;
                return true;
            case 50:
                try {
                    dimensionStyle.joggedRadiusDimensionTransverseSegmentAngle = this._reader.valueAsAngle;
                }
                catch (ex) {
                    this._builder.notify(`[${dimensionStyle.subclassMarker}] Assignation error for joggedRadiusDimensionTransverseSegmentAngle.`, NotificationType.Warning, ex instanceof Error ? ex : null);
                }
                return true;
            case 69:
                dimensionStyle.textBackgroundFillMode = this._reader.valueAsShort;
                return true;
            case 70:
                if (!template.dxfFlagsAssigned) {
                    template.dxfFlagsAssigned = true;
                    return true;
                }
                else if (this._reader.valueAsShort >= 0) {
                    dimensionStyle.textBackgroundColor = new Color(this._reader.valueAsShort);
                }
                return true;
            case 71:
                dimensionStyle.generateTolerances = this._reader.valueAsBool;
                return true;
            case 72:
                dimensionStyle.limitsGeneration = this._reader.valueAsBool;
                return true;
            case 73:
                dimensionStyle.textInsideHorizontal = this._reader.valueAsBool;
                return true;
            case 74:
                dimensionStyle.textOutsideHorizontal = this._reader.valueAsBool;
                return true;
            case 75:
                dimensionStyle.suppressFirstExtensionLine = this._reader.valueAsBool;
                return true;
            case 76:
                dimensionStyle.suppressSecondExtensionLine = this._reader.valueAsBool;
                return true;
            case 77:
                dimensionStyle.textVerticalAlignment = this._reader.valueAsShort;
                return true;
            case 78:
                dimensionStyle.zeroHandling = this._reader.valueAsShort;
                return true;
            case 79:
                dimensionStyle.angularZeroHandling = this._reader.valueAsShort;
                return true;
            case 90:
                dimensionStyle.arcLengthSymbolPosition = this._reader.valueAsShort;
                return true;
            case 105:
                dimensionStyle.handle = this._reader.valueAsHandle;
                return true;
            case 140:
                try {
                    dimensionStyle.textHeight = this._reader.valueAsDouble;
                }
                catch (ex) {
                    this._builder.notify(`[${dimensionStyle.subclassMarker}] Assignation error for textHeight.`, NotificationType.Warning, ex instanceof Error ? ex : null);
                }
                return true;
            case 141:
                dimensionStyle.centerMarkSize = this._reader.valueAsDouble;
                return true;
            case 142:
                dimensionStyle.tickSize = this._reader.valueAsDouble;
                return true;
            case 143:
                dimensionStyle.alternateUnitScaleFactor = this._reader.valueAsDouble;
                return true;
            case 144:
                dimensionStyle.linearScaleFactor = this._reader.valueAsDouble;
                return true;
            case 145:
                dimensionStyle.textVerticalPosition = this._reader.valueAsDouble;
                return true;
            case 146:
                dimensionStyle.toleranceScaleFactor = this._reader.valueAsDouble;
                return true;
            case 147:
                dimensionStyle.dimensionLineGap = this._reader.valueAsDouble;
                return true;
            case 148:
                dimensionStyle.alternateUnitRounding = this._reader.valueAsDouble;
                return true;
            case 170:
                dimensionStyle.alternateUnitDimensioning = this._reader.valueAsBool;
                return true;
            case 171:
                dimensionStyle.alternateUnitDecimalPlaces = this._reader.valueAsShort;
                return true;
            case 172:
                dimensionStyle.textOutsideExtensions = this._reader.valueAsBool;
                return true;
            case 173:
                dimensionStyle.separateArrowBlocks = this._reader.valueAsBool;
                return true;
            case 174:
                dimensionStyle.textInsideExtensions = this._reader.valueAsBool;
                return true;
            case 175:
                dimensionStyle.suppressOutsideExtensions = this._reader.valueAsBool;
                return true;
            case 176:
                dimensionStyle.dimensionLineColor = new Color(this._reader.valueAsShort);
                return true;
            case 177:
                dimensionStyle.extensionLineColor = new Color(this._reader.valueAsShort);
                return true;
            case 178:
                dimensionStyle.textColor = new Color(this._reader.valueAsShort);
                return true;
            case 179:
                dimensionStyle.angularDecimalPlaces = this._reader.valueAsShort;
                return true;
            case 270:
                dimensionStyle.linearUnitFormat = this._reader.valueAsShort;
                return true;
            case 271:
                dimensionStyle.decimalPlaces = this._reader.valueAsShort;
                return true;
            case 272:
                dimensionStyle.toleranceDecimalPlaces = this._reader.valueAsShort;
                return true;
            case 273:
                dimensionStyle.alternateUnitFormat = this._reader.valueAsShort;
                return true;
            case 274:
                dimensionStyle.alternateUnitToleranceDecimalPlaces = this._reader.valueAsShort;
                return true;
            case 275:
                dimensionStyle.angularUnit = this._reader.valueAsShort;
                return true;
            case 276:
                dimensionStyle.fractionFormat = this._reader.valueAsShort;
                return true;
            case 277:
                dimensionStyle.linearUnitFormat = this._reader.valueAsShort;
                return true;
            case 278:
                dimensionStyle.decimalSeparator = String.fromCharCode(this._reader.valueAsShort);
                return true;
            case 279:
                dimensionStyle.textMovement = this._reader.valueAsShort;
                return true;
            case 280:
                dimensionStyle.textHorizontalAlignment = this._reader.valueAsShort;
                return true;
            case 281:
                dimensionStyle.suppressFirstDimensionLine = this._reader.valueAsBool;
                return true;
            case 282:
                dimensionStyle.suppressSecondDimensionLine = this._reader.valueAsBool;
                return true;
            case 283:
                dimensionStyle.toleranceAlignment = this._reader.valueAsShort;
                return true;
            case 284:
                dimensionStyle.toleranceZeroHandling = this._reader.valueAsShort;
                return true;
            case 285:
                dimensionStyle.alternateUnitZeroHandling = this._reader.valueAsShort;
                return true;
            case 286:
                dimensionStyle.alternateUnitToleranceZeroHandling = this._reader.valueAsShort;
                return true;
            case 287:
                dimensionStyle.dimensionFit = this._reader.valueAsShort;
                return true;
            case 288:
                dimensionStyle.cursorUpdate = this._reader.valueAsBool;
                return true;
            case 289:
                dimensionStyle.dimensionTextArrowFit = this._reader.valueAsShort;
                return true;
            case 290:
                dimensionStyle.isExtensionLineLengthFixed = this._reader.valueAsBool;
                return true;
            case 340:
                template.textStyleHandle = this._reader.valueAsHandle;
                return true;
            case 341:
                template.dimldrblk = this._reader.valueAsHandle;
                return true;
            case 342:
                template.dimblk = this._reader.valueAsHandle;
                return true;
            case 343:
                template.dimblk1 = this._reader.valueAsHandle;
                return true;
            case 344:
                template.dimblk2 = this._reader.valueAsHandle;
                return true;
            case 345:
                template.dimltype = this._reader.valueAsHandle;
                return true;
            case 346:
                template.dimltex1 = this._reader.valueAsHandle;
                return true;
            case 347:
                template.dimltex2 = this._reader.valueAsHandle;
                return true;
            case 371:
                dimensionStyle.dimensionLineWeight = this._reader.valueAsShort;
                return true;
            case 372:
                dimensionStyle.extensionLineWeight = this._reader.valueAsShort;
                return true;
            default:
                return false;
        }
    }
    _readLayer(template, map) {
        const layer = template.cadObject;
        switch (this._reader.code) {
            case 6:
                template.lineTypeName = this._reader.valueAsString;
                return true;
            case 62: {
                let index = this._reader.valueAsShort;
                if (index < 0) {
                    layer.isOn = false;
                    index = Math.abs(index);
                }
                const color = new Color(index);
                if (color.isByBlock || color.isByLayer) {
                    this._builder.notify(`Wrong index ${index} for layer ${layer.name}`, NotificationType.Warning);
                }
                else {
                    layer.color = new Color(index);
                }
                return true;
            }
            case 347:
                template.materialHandle = this._reader.valueAsHandle;
                return true;
            case 348:
                return true;
            case 390:
                layer.plotStyleName = this._reader.valueAsHandle;
                return true;
            case 430:
                template.trueColorName = this._reader.valueAsString;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map);
        }
    }
    _readLineType(template, map) {
        switch (this._reader.code) {
            case 40:
                template.totalLen = this._reader.valueAsDouble;
                return true;
            case 49:
                do {
                    template.segmentTemplates.push(this._readLineTypeSegment());
                } while (this._reader.code === 49);
                return true;
            case 73:
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map);
        }
    }
    _readLineTypeSegment() {
        const template = new CadLineTypeTemplate.SegmentTemplate();
        template.segment.length = this._reader.valueAsDouble;
        this._reader.readNext();
        while (this._reader.code !== 49 && this._reader.code !== 0) {
            switch (this._reader.code) {
                case 9:
                    template.segment.text = this._reader.valueAsString;
                    break;
                case 44:
                    template.segment.offset = new XY(this._reader.valueAsDouble, template.segment.offset.y);
                    break;
                case 45:
                    template.segment.offset = new XY(template.segment.offset.x, this._reader.valueAsDouble);
                    break;
                case 46:
                    template.segment.scale = this._reader.valueAsDouble;
                    break;
                case 50:
                    template.segment.rotation = this._reader.valueAsAngle;
                    break;
                case 74:
                    template.segment.shapeFlags = this._reader.valueAsUShort;
                    break;
                case 75:
                    template.segment.shapeNumber = this._reader.valueAsInt;
                    break;
                case 340:
                    break;
                default:
                    this._builder.notify(`[LineTypeSegment] Unhandled dxf code ${this._reader.code} with value ${this._reader.valueAsString}, position ${this._reader.position}`, NotificationType.None);
                    break;
            }
            this._reader.readNext();
        }
        return template;
    }
    _readTextStyle(template, map) {
        switch (this._reader.code) {
            case 2:
                if (this._reader.valueAsString) {
                    template.cadObject.name = this._reader.valueAsString;
                }
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map);
        }
    }
    _readUcs(template, map) {
        switch (this._reader.code) {
            default:
                return this.tryAssignCurrentValue(template.cadObject, map);
        }
    }
    _readView(template, map) {
        switch (this._reader.code) {
            case 348:
                template.visualStyleHandle = this._reader.valueAsHandle;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map);
        }
    }
    _readVPort(template, map) {
        switch (this._reader.code) {
            case 65:
            case 73:
                return true;
            case 348:
                template.styleHandle = this._reader.valueAsHandle;
                return true;
            default:
                return this.tryAssignCurrentValue(template.cadObject, map);
        }
    }
}
//# sourceMappingURL=DxfTablesSectionReader.js.map