import { IPropertyEditorTypesService, IProperty, IPropertyEditor } from "@node-projects/web-component-designer";
import { DemoColorPropertyEditor } from "./DemoColorPropertyEditor.js";

export class DemoPropertyEditorTypesService implements IPropertyEditorTypesService {
    getEditorForProperty(property: IProperty): IPropertyEditor | null {
        if (property.createEditor)
            return property.createEditor(property);

        switch (<string><any>property.type) {
            case "css-color":
            case "color":
                {
                    return new DemoColorPropertyEditor(property);
                }
        }
        return null;
    }
}