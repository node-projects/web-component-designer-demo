import { DemoColorPropertyEditor } from "./DemoColorPropertyEditor.js";
export class DemoPropertyEditorTypesService {
    getEditorForProperty(property) {
        if (property.createEditor)
            return property.createEditor(property);
        switch (property.type) {
            case "css-color":
            case "color":
                {
                    return new DemoColorPropertyEditor(property);
                }
        }
        return null;
    }
}
