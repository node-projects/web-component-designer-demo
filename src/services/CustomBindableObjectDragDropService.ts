import { DesignItem, IBindableObject, IBindableObjectDragDropService, IDesignerCanvas, InsertAction } from "@node-projects/web-component-designer";

export class CustomBindableObjectDragDropService implements IBindableObjectDragDropService {

  dragEnter(designerCanvas: IDesignerCanvas, event: DragEvent) { }

  dragLeave(designerCanvas: IDesignerCanvas, event: DragEvent) { }

  dragOver(designerCanvas: IDesignerCanvas, event: DragEvent): "none" | "copy" | "link" | "move" {
    return 'copy';
  }

  drop(designerCanvas: IDesignerCanvas, event: DragEvent, bindableObject: IBindableObject<any>) {
    const position = designerCanvas.getNormalizedEventCoordinates(event);
    const input = document.createElement('input');
    const di = DesignItem.createDesignItemFromInstance(input, designerCanvas.serviceContainer, designerCanvas.instanceServiceContainer);
    const grp = di.openGroup("Insert");
    di.setAttribute('value', "[[this.objects['" + bindableObject.fullName + "']]]")
    di.setStyle('position', 'absolute');
    di.setStyle('left', position.x + 'px');
    di.setStyle('top', position.y + 'px');
    designerCanvas.instanceServiceContainer.undoService.execute(new InsertAction(designerCanvas.rootDesignItem, designerCanvas.rootDesignItem.childCount, di));
    grp.commit();
    requestAnimationFrame(() => designerCanvas.instanceServiceContainer.selectionService.setSelectedElements([di]));
  }
}