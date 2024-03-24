export class EditTemplateContextMenu {
    shouldProvideContextmenu(event, designerView, designItem, initiator) {
        if (designItem?.element instanceof HTMLTemplateElement)
            return true;
        return false;
    }
    provideContextMenuItems(event, designerCanvas, designItem) {
        const items = [{
                title: 'edit Template',
                action: () => {
                    window.shell.editTemplate(designItem);
                }
            }];
        return items;
    }
}
