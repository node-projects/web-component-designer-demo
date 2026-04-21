export class DwgHeaderHandlesCollection {
    _handles = new Map();
    get cmaterial() { return this.getHandle('CMATERIAL'); }
    set cmaterial(value) { this.setHandle('CMATERIAL', value); }
    get clayer() { return this.getHandle('CLAYER'); }
    set clayer(value) { this.setHandle('CLAYER', value); }
    get textstyle() { return this.getHandle('TEXTSTYLE'); }
    set textstyle(value) { this.setHandle('TEXTSTYLE', value); }
    get celtype() { return this.getHandle('CELTYPE'); }
    set celtype(value) { this.setHandle('CELTYPE', value); }
    get dimstyle() { return this.getHandle('DIMSTYLE'); }
    set dimstyle(value) { this.setHandle('DIMSTYLE', value); }
    get cmlstyle() { return this.getHandle('CMLSTYLE'); }
    set cmlstyle(value) { this.setHandle('CMLSTYLE', value); }
    get ucsname_pspace() { return this.getHandle('UCSNAME_PSPACE'); }
    set ucsname_pspace(value) { this.setHandle('UCSNAME_PSPACE', value); }
    get ucsname_mspace() { return this.getHandle('UCSNAME_MSPACE'); }
    set ucsname_mspace(value) { this.setHandle('UCSNAME_MSPACE', value); }
    get pucsorthoref() { return this.getHandle('PUCSORTHOREF'); }
    set pucsorthoref(value) { this.setHandle('PUCSORTHOREF', value); }
    get pucsbase() { return this.getHandle('PUCSBASE'); }
    set pucsbase(value) { this.setHandle('PUCSBASE', value); }
    get ucsorthoref() { return this.getHandle('UCSORTHOREF'); }
    set ucsorthoref(value) { this.setHandle('UCSORTHOREF', value); }
    get dimtxsty() { return this.getHandle('DIMTXSTY'); }
    set dimtxsty(value) { this.setHandle('DIMTXSTY', value); }
    get dimldrblk() { return this.getHandle('DIMLDRBLK'); }
    set dimldrblk(value) { this.setHandle('DIMLDRBLK', value); }
    get dimblk() { return this.getHandle('DIMBLK'); }
    set dimblk(value) { this.setHandle('DIMBLK', value); }
    get dimblk1() { return this.getHandle('DIMBLK1'); }
    set dimblk1(value) { this.setHandle('DIMBLK1', value); }
    get dimblk2() { return this.getHandle('DIMBLK2'); }
    set dimblk2(value) { this.setHandle('DIMBLK2', value); }
    get dictionary_layouts() { return this.getHandle('DICTIONARY_LAYOUTS'); }
    set dictionary_layouts(value) { this.setHandle('DICTIONARY_LAYOUTS', value); }
    get dictionary_plotsettings() { return this.getHandle('DICTIONARY_PLOTSETTINGS'); }
    set dictionary_plotsettings(value) { this.setHandle('DICTIONARY_PLOTSETTINGS', value); }
    get dictionary_plotstyles() { return this.getHandle('DICTIONARY_PLOTSTYLES'); }
    set dictionary_plotstyles(value) { this.setHandle('DICTIONARY_PLOTSTYLES', value); }
    get cpsnid() { return this.getHandle('CPSNID'); }
    set cpsnid(value) { this.setHandle('CPSNID', value); }
    get paper_space() { return this.getHandle('PAPER_SPACE'); }
    set paper_space(value) { this.setHandle('PAPER_SPACE', value); }
    get model_space() { return this.getHandle('MODEL_SPACE'); }
    set model_space(value) { this.setHandle('MODEL_SPACE', value); }
    get bylayer() { return this.getHandle('BYLAYER'); }
    set bylayer(value) { this.setHandle('BYLAYER', value); }
    get byblock() { return this.getHandle('BYBLOCK'); }
    set byblock(value) { this.setHandle('BYBLOCK', value); }
    get continuous() { return this.getHandle('CONTINUOUS'); }
    set continuous(value) { this.setHandle('CONTINUOUS', value); }
    get dimltype() { return this.getHandle('DIMLTYPE'); }
    set dimltype(value) { this.setHandle('DIMLTYPE', value); }
    get dimltex1() { return this.getHandle('DIMLTEX1'); }
    set dimltex1(value) { this.setHandle('DIMLTEX1', value); }
    get dimltex2() { return this.getHandle('DIMLTEX2'); }
    set dimltex2(value) { this.setHandle('DIMLTEX2', value); }
    get viewport_entity_header_control_object() { return this.getHandle('VIEWPORT_ENTITY_HEADER_CONTROL_OBJECT'); }
    set viewport_entity_header_control_object(value) { this.setHandle('VIEWPORT_ENTITY_HEADER_CONTROL_OBJECT', value); }
    get dictionary_acad_group() { return this.getHandle('DICTIONARY_ACAD_GROUP'); }
    set dictionary_acad_group(value) { this.setHandle('DICTIONARY_ACAD_GROUP', value); }
    get dictionary_acad_mlinestyle() { return this.getHandle('DICTIONARY_ACAD_MLINESTYLE'); }
    set dictionary_acad_mlinestyle(value) { this.setHandle('DICTIONARY_ACAD_MLINESTYLE', value); }
    get dictionary_named_objects() { return this.getHandle('DICTIONARY_NAMED_OBJECTS'); }
    set dictionary_named_objects(value) { this.setHandle('DICTIONARY_NAMED_OBJECTS', value); }
    get block_control_object() { return this.getHandle('BLOCK_CONTROL_OBJECT'); }
    set block_control_object(value) { this.setHandle('BLOCK_CONTROL_OBJECT', value); }
    get layer_control_object() { return this.getHandle('LAYER_CONTROL_OBJECT'); }
    set layer_control_object(value) { this.setHandle('LAYER_CONTROL_OBJECT', value); }
    get style_control_object() { return this.getHandle('STYLE_CONTROL_OBJECT'); }
    set style_control_object(value) { this.setHandle('STYLE_CONTROL_OBJECT', value); }
    get linetype_control_object() { return this.getHandle('LINETYPE_CONTROL_OBJECT'); }
    set linetype_control_object(value) { this.setHandle('LINETYPE_CONTROL_OBJECT', value); }
    get view_control_object() { return this.getHandle('VIEW_CONTROL_OBJECT'); }
    set view_control_object(value) { this.setHandle('VIEW_CONTROL_OBJECT', value); }
    get ucs_control_object() { return this.getHandle('UCS_CONTROL_OBJECT'); }
    set ucs_control_object(value) { this.setHandle('UCS_CONTROL_OBJECT', value); }
    get vport_control_object() { return this.getHandle('VPORT_CONTROL_OBJECT'); }
    set vport_control_object(value) { this.setHandle('VPORT_CONTROL_OBJECT', value); }
    get appid_control_object() { return this.getHandle('APPID_CONTROL_OBJECT'); }
    set appid_control_object(value) { this.setHandle('APPID_CONTROL_OBJECT', value); }
    get dimstyle_control_object() { return this.getHandle('DIMSTYLE_CONTROL_OBJECT'); }
    set dimstyle_control_object(value) { this.setHandle('DIMSTYLE_CONTROL_OBJECT', value); }
    get dictionary_materials() { return this.getHandle('DICTIONARY_MATERIALS'); }
    set dictionary_materials(value) { this.setHandle('DICTIONARY_MATERIALS', value); }
    get dictionary_colors() { return this.getHandle('DICTIONARY_COLORS'); }
    set dictionary_colors(value) { this.setHandle('DICTIONARY_COLORS', value); }
    get dictionary_visualstyle() { return this.getHandle('DICTIONARY_VISUALSTYLE'); }
    set dictionary_visualstyle(value) { this.setHandle('DICTIONARY_VISUALSTYLE', value); }
    get interfereobjvs() { return this.getHandle('INTERFEREOBJVS'); }
    set interfereobjvs(value) { this.setHandle('INTERFEREOBJVS', value); }
    get interferevpvs() { return this.getHandle('INTERFEREVPVS'); }
    set interferevpvs(value) { this.setHandle('INTERFEREVPVS', value); }
    get dragvs() { return this.getHandle('DRAGVS'); }
    set dragvs(value) { this.setHandle('DRAGVS', value); }
    get ucsbase() { return this.getHandle('UCSBASE'); }
    set ucsbase(value) { this.setHandle('UCSBASE', value); }
    getHandle(name) {
        return this._handles.get(name) ?? null;
    }
    setHandle(name, value) {
        this._handles.set(name, value);
    }
    getHandles() {
        return Array.from(this._handles.values());
    }
    updateHeader(header, builder) {
        let entry;
        entry = builder.tryGetCadObject(this.clayer);
        if (entry && builder.documentToBuild.layers?.tryGetValue(entry.name)) {
            header.currentLayerName = entry.name;
        }
        entry = builder.tryGetCadObject(this.celtype);
        if (entry && builder.documentToBuild.lineTypes?.tryGetValue(entry.name)) {
            header.currentLineTypeName = entry.name;
        }
        entry = builder.tryGetCadObject(this.cmlstyle);
        if (entry) {
            header.currentMLineStyleName = entry.name;
        }
        entry = builder.tryGetCadObject(this.textstyle);
        if (entry && builder.documentToBuild.textStyles?.tryGetValue(entry.name)) {
            header.currentTextStyleName = entry.name;
        }
        entry = builder.tryGetCadObject(this.dimtxsty);
        if (entry && builder.documentToBuild.textStyles?.tryGetValue(entry.name)) {
            header.dimensionTextStyleName = entry.name;
        }
        entry = builder.tryGetCadObject(this.dimstyle);
        if (entry && builder.documentToBuild.dimensionStyles?.tryGetValue(entry.name)) {
            header.currentDimensionStyleName = entry.name;
        }
        let record;
        record = builder.tryGetCadObject(this.dimblk);
        if (record) {
            header.dimensionBlockName = record.name;
        }
        record = builder.tryGetCadObject(this.dimldrblk);
        if (record) {
            header.dimensionBlockName = record.name;
        }
        record = builder.tryGetCadObject(this.dimblk1);
        if (record) {
            header.dimensionBlockNameFirst = record.name;
        }
        record = builder.tryGetCadObject(this.dimblk2);
        if (record) {
            header.dimensionBlockNameSecond = record.name;
        }
    }
}
//# sourceMappingURL=DwgHeaderHandlesCollection.js.map