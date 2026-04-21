import { DxfReferenceType } from '../../../Types/DxfReferenceType.js';
import { GroupCodeValue, GroupCodeValueType } from '../../../GroupCodeValue.js';
import { MathHelper } from '../../../Math/MathHelper.js';
export class DxfStreamWriterBase {
    writeOptional = false;
    write(code, value, map) {
        if (value === null || value === undefined) {
            return;
        }
        const intCode = typeof code === 'number' ? code : code;
        if (map && map.dxfProperties.has(intCode)) {
            const prop = map.dxfProperties.get(intCode);
            if ((prop.referenceType & DxfReferenceType.Optional) !== 0 && !this.writeOptional) {
                return;
            }
            if ((prop.referenceType & DxfReferenceType.IsAngle) !== 0) {
                value = MathHelper.radToDeg(value);
            }
        }
        this.writeDxfCode(intCode);
        if (typeof value === 'string') {
            let s = value
                .replace(/\^/g, '^ ')
                .replace(/\n/g, '^J')
                .replace(/\r/g, '^M')
                .replace(/\t/g, '^I');
            this.writeValue(intCode, s);
        }
        else {
            this.writeValue(intCode, value);
        }
    }
    writeVector(code, value, map) {
        const intCode = typeof code === 'number' ? code : code;
        for (let i = 0; i < value.dimension; i++) {
            this.write(intCode + i * 10, value[i], map);
        }
    }
    writeCmColor(code, color, map) {
        if (GroupCodeValue.transformValue(code) === GroupCodeValueType.Int16) {
            this.write(code, color.getApproxIndex() & 0xFFFF);
        }
        else {
            const arr = new Uint8Array(4);
            if (color.isTrueColor) {
                arr[0] = color.b;
                arr[1] = color.g;
                arr[2] = color.r;
                arr[3] = 0xC2;
            }
            else {
                arr[3] = 0xC1;
                arr[0] = color.index;
            }
            const view = new DataView(arr.buffer);
            this.write(code, view.getInt32(0, true), map);
        }
    }
    writeHandle(code, value, map) {
        if (value !== null && value !== undefined) {
            this.write(code, value.handle, map);
        }
    }
    writeIfNotDefault(code, value, defaultValue, map) {
        if (value !== defaultValue) {
            this.write(code, value, map);
        }
    }
    writeName(code, value, map) {
        if (value !== null && value !== undefined) {
            this.write(code, value.name, map);
        }
    }
    writeTrueColor(code, color, map) {
        const arr = new Uint8Array(4);
        arr[0] = color.b;
        arr[1] = color.g;
        arr[2] = color.r;
        arr[3] = 0;
        const view = new DataView(arr.buffer);
        this.write(code, view.getInt32(0, true), map);
    }
}
//# sourceMappingURL=DxfStreamWriterBase.js.map