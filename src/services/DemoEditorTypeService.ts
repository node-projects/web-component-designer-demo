import { IEditorTypeService } from "@node-projects/web-component-designer";
import { DemoColorEditor } from "./DemoColorEditor.js";

export class DemoEditorTypeService implements IEditorTypeService {
    getEditor(type: string, additional: { changedCallback: (newValue: any) => void; }): { element: HTMLElement; getValue: () => any; setValue: (value: any) => void; } {
        if (type === 'color') {
            const editor = new DemoColorEditor(additional.changedCallback);
            return {
                element: editor,
                getValue: () => editor.value,
                setValue: (value: any) => { editor.value = value; }
            };
        }
        return null;
    }
}