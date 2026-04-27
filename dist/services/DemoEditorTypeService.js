import { DemoColorEditor } from "./DemoColorEditor.js";
export class DemoEditorTypeService {
    getEditor(type, additional) {
        if (type === 'color') {
            const editor = new DemoColorEditor(additional.changedCallback);
            return {
                element: editor,
                getValue: () => editor.value,
                setValue: (value) => { editor.value = value; }
            };
        }
        return null;
    }
}
