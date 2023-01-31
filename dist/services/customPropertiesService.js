import { PropertyType } from '/web-component-designer-demo/node_modules/@node-projects/web-component-designer/./dist/index.js';
import { BindingTarget } from '/web-component-designer-demo/node_modules/@node-projects/web-component-designer/dist/elements/item/BindingTarget.js';
import { RefreshMode } from '/web-component-designer-demo/node_modules/@node-projects/web-component-designer/dist/elements/services/propertiesService/IPropertiesService.js';
export class CustomPropertiesService {
    getRefreshMode(designItem) {
        return RefreshMode.full;
    }
    getBinding(designItems, property) {
        throw new Error('Method not implemented.');
    }
    getPropertyTarget(designItem, property) {
        return BindingTarget.property;
    }
    clearValue(designItems, property) {
        // throw new Error('Method not implemented.');
    }
    isSet(designItems, property) {
        throw new Error("Method not implemented.");
    }
    getUnsetValue(designItems, property) {
        throw new Error("Method not implemented.");
    }
    setValue(designItems, property, value) {
        // throw new Error("Method not implemented.");
    }
    getValue(designItems, property) {
        // throw new Error("Method not implemented.");
    }
    name = "custom";
    isHandledElement(designItem) {
        if (designItem.element.nodeName == "test-element")
            return true;
        return false;
    }
    getProperty(designItem, name) {
        return this.getProperties(designItem)[name];
    }
    getProperties(designItem) {
        let properties = [];
        properties.push({ name: "Test 1", type: "string", service: this, propertyType: PropertyType.propertyAndAttribute });
        return properties;
    }
}
