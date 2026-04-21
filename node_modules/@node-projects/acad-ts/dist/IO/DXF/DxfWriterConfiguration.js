import { CadWriterConfiguration } from '../CadWriterConfiguration.js';
import { CadHeader } from '../../Header/CadHeader.js';
export class DxfWriterConfiguration extends CadWriterConfiguration {
    static variables = [
        "$ACADVER",
        "$DWGCODEPAGE",
        "$LASTSAVEDBY",
        "$HANDSEED",
        "$ANGBASE",
        "$ANGDIR",
        "$ATTMODE",
        "$AUNITS",
        "$AUPREC",
        "$CECOLOR",
        "$CELTSCALE",
        "$CELTYPE",
        "$CELWEIGHT",
        "$CLAYER",
        "$CMLJUST",
        "$CMLSCALE",
        "$CMLSTYLE",
        "$DIMSTYLE",
        "$TEXTSIZE",
        "$TEXTSTYLE",
        "$LUNITS",
        "$LUPREC",
        "$MIRRTEXT",
        "$EXTNAMES",
        "$INSBASE",
        "$INSUNITS",
        "$LTSCALE",
        "$LWDISPLAY",
        "$PDMODE",
        "$PDSIZE",
        "$PLINEGEN",
        "$PSLTSCALE",
        "$SPLINESEGS",
        "$SURFU",
        "$SURFV",
        "$TDCREATE",
        "$TDUCREATE",
        "$TDUPDATE",
        "$TDUUPDATE",
        "$TDINDWG",
    ];
    writeAllHeaderVariables = false;
    writeOptionalValues = true;
    get headerVariables() {
        return this._headerVariables;
    }
    _headerVariables;
    constructor() {
        super();
        this._headerVariables = new Set(DxfWriterConfiguration.variables);
    }
    addHeaderVariable(name) {
        const map = CadHeader.getHeaderMap();
        if (!map.has(name)) {
            throw new Error(`The variable ${name} does not exist in the header`);
        }
        this._headerVariables.add(name);
    }
    removeHeaderVariable(name) {
        if (DxfWriterConfiguration.variables.map(v => v.toLowerCase()).includes(name.toLowerCase())) {
            throw new Error(`The variable ${name} cannot be removed from the set`);
        }
        return this._headerVariables.delete(name);
    }
}
//# sourceMappingURL=DxfWriterConfiguration.js.map