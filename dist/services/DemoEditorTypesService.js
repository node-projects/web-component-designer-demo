import { DemoColorPropertyEditor } from "./DemoColorPropertyEditor.js";
export class DemoEditorTypesService {
    getEditorForProperty(property) {
        if (property.createEditor)
            return property.createEditor(property);
        switch (property.type) {
            case "color":
                {
                    return new DemoColorPropertyEditor(property);
                }
        }
        return null;
    }
}
