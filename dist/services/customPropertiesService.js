import { PropertyType } from '@node-projects/web-component-designer';
import { BindingTarget } from '@node-projects/web-component-designer/dist/elements/item/BindingTarget';
import { RefreshMode } from '@node-projects/web-component-designer/dist/elements/services/propertiesService/IPropertiesService';
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
