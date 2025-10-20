import { IContextMenuExtension, IDesignerCanvas, IDesignItem, ContextmenuInitiator, IContextMenuItem } from "@node-projects/web-component-designer";
import { AppShell } from "../appShell.js";


export class EditTemplateContextMenu implements IContextMenuExtension {

  public shouldProvideContextmenu(event: MouseEvent, designerView: IDesignerCanvas, designItem: IDesignItem, initiator: ContextmenuInitiator) {
    if (designItem?.element instanceof HTMLTemplateElement)
      return true;
    return false;
  }

  public provideContextMenuItems(event: MouseEvent, designerCanvas: IDesignerCanvas, designItem: IDesignItem): IContextMenuItem[] {
    const items: IContextMenuItem[] = [{
      title: 'edit Template',
      action: () => {
        (<AppShell>(<any>window).shell).editTemplate(designItem);
      }
    }];

    return items;
  }
}