import { DxfSectionWriterBase } from './DxfSectionWriterBase.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { Block } from '../../../Blocks/Block.js';
import { BlockRecord } from '../../../Tables/BlockRecord.js';
import { Seqend } from '../../../Entities/Seqend.js';
export class DxfBlocksSectionWriter extends DxfSectionWriterBase {
    get sectionName() {
        return DxfFileToken.blocksSection;
    }
    constructor(writer, document, objectHolder, configuration) {
        super(writer, document, objectHolder, configuration);
    }
    writeSection() {
        for (const b of this._document.blockRecords) {
            this._writeBlock(b.blockEntity);
            this._processEntities(b);
            this._writeBlockEnd(b.blockEnd);
        }
    }
    _writeBlock(block) {
        const map = DxfClassMap.create(Block);
        this._writer.write(DxfCode.Start, block.objectName);
        this.writeCommonObjectData(block);
        this.writeCommonEntityData(block);
        this._writer.write(DxfCode.Subclass, DxfSubclassMarker.blockBegin);
        if (block.xRefPath) {
            this._writer.write(1, block.xRefPath, map);
        }
        this._writer.write(2, block.name, map);
        this._writer.write(70, block.flags, map);
        if (this.version >= ACadVersion.AC1015 && block.isUnloaded) {
            this._writer.write(71, block.isUnloaded ? 1 : 0, map);
        }
        this._writer.writeVector(10, block.basePoint, map);
        this._writer.write(3, block.name, map);
        this._writer.write(4, block.comments, map);
    }
    _processEntities(b) {
        if (b.name === BlockRecord.modelSpaceName || b.name === BlockRecord.paperSpaceName) {
            for (const e of b.entities) {
                if (e instanceof Seqend) {
                    // skip
                }
                this.holder.entities.push(e);
            }
        }
        else {
            for (const e of b.entities) {
                this.writeEntity(e);
            }
        }
    }
    _writeBlockEnd(block) {
        this._writer.write(DxfCode.Start, block.objectName);
        this.writeCommonObjectData(block);
        this._writer.write(DxfCode.Subclass, DxfSubclassMarker.entity);
        this._writer.write(8, block.layer.name);
        this._writer.write(DxfCode.Subclass, DxfSubclassMarker.blockEnd);
    }
}
//# sourceMappingURL=DxfBlocksSectionWriter.js.map