import { DesignItem, InsertAction } from '/web-component-designer-demo/node_modules/@node-projects/web-component-designer/./dist/index.js';
export class CustomBindableObjectDragDropService {
    dragEnter(designerCanvas, event) { }
    dragLeave(designerCanvas, event) { }
    dragOver(designerCanvas, event) {
        return 'copy';
    }
    drop(designerCanvas, event, bindableObject) {
        const position = designerCanvas.getNormalizedEventCoordinates(event);
        const input = document.createElement('input');
        const di = DesignItem.createDesignItemFromInstance(input, designerCanvas.serviceContainer, designerCanvas.instanceServiceContainer);
        const grp = di.openGroup("Insert");
        di.setAttribute('value', "[[this.objects['" + bindableObject.fullName + "']]]");
        di.setStyle('position', 'absolute');
        di.setStyle('left', position.x + 'px');
        di.setStyle('top', position.y + 'px');
        designerCanvas.instanceServiceContainer.undoService.execute(new InsertAction(designerCanvas.rootDesignItem, designerCanvas.rootDesignItem.childCount, di));
        grp.commit();
        requestAnimationFrame(() => designerCanvas.instanceServiceContainer.selectionService.setSelectedElements([di]));
    }
}
