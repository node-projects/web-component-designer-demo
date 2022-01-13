import { IProperty, IPropertiesService, IDesignItem, PropertyType } from '@node-projects/web-component-designer';
import { BindingTarget } from '@node-projects/web-component-designer/dist/elements/item/BindingTarget';
import { ValueType } from '@node-projects/web-component-designer/dist/elements/services/propertiesService/ValueType';

export class CustomPropertiesService implements IPropertiesService {
    
    getPropertyTarget(designItem: IDesignItem, property: IProperty): BindingTarget {
      return BindingTarget.property;
    }
    
    clearValue(designItems: IDesignItem[], property: IProperty) {
      // throw new Error('Method not implemented.');
    }
    isSet(designItems: IDesignItem[], property: IProperty): ValueType {
      return ValueType.none;
    }
    getUnsetValue(designItems: IDesignItem[], property: IProperty) {
      return null;
    }

    setValue(designItems: IDesignItem[], property: IProperty, value: any) {
      // throw new Error("Method not implemented.");
    }
    getValue(designItems: IDesignItem[], property: IProperty) {
      // throw new Error("Method not implemented.");
    }

    name: string = "custom";

    isHandledElement(designItem: IDesignItem): boolean {
        if (designItem.element.nodeName == "test-element")
            return true;
        return false;
    }

    getProperty(designItem: IDesignItem, name: string): IProperty {
      return this.getProperties(designItem)[name];
    }

    getProperties(designItem: IDesignItem): IProperty[] {
        let properties: IProperty[] = [];
        properties.push({ name: "Test 1", type: "string", service: this, propertyType: PropertyType.propertyAndAttribute });            
        return properties;
    }
}