import { PropertyType, AbstractPropertiesService } from '@node-projects/web-component-designer';
import { BindingTarget } from '@node-projects/web-component-designer/dist/elements/item/BindingTarget';
import { RefreshMode } from '@node-projects/web-component-designer/dist/elements/services/propertiesService/IPropertiesService';
export class CustomPropertiesService extends AbstractPropertiesService {
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
    async setValue(designItems, property, value) {
        // throw new Error("Method not implemented.");
    }
    getValue(designItems, property) {
        // throw new Error("Method not implemented.");
        return null;
    }
    name = "custom";
    isHandledElement(designItem) {
        if (designItem.element.nodeName == "test-element")
            return true;
        return false;
    }
    async getProperty(designItem, name) {
        return (await this.getProperties(designItem))[name];
    }
    async getProperties(designItem) {
        let properties = [];
        properties.push({ name: "Test 1", type: "string", service: this, propertyType: PropertyType.propertyAndAttribute });
        return properties;
    }
}
