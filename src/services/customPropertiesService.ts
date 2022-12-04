import { IProperty, IPropertiesService, IDesignItem, PropertyType, IBinding } from '@node-projects/web-component-designer';
import { BindingTarget } from '@node-projects/web-component-designer/dist/elements/item/BindingTarget';
import { RefreshMode } from '@node-projects/web-component-designer/dist/elements/services/propertiesService/IPropertiesService';
import { ValueType } from '@node-projects/web-component-designer/dist/elements/services/propertiesService/ValueType';

export class CustomPropertiesService implements IPropertiesService {
  getRefreshMode(designItem: IDesignItem) {
    return RefreshMode.full;
  }

  getBinding(designItems: IDesignItem[], property: IProperty): IBinding {
    throw new Error('Method not implemented.');
  }

  getPropertyTarget(designItem: IDesignItem, property: IProperty): BindingTarget {
    return BindingTarget.property;
  }

  clearValue(designItems: IDesignItem[], property: IProperty) {
    // throw new Error('Method not implemented.');
  }
  isSet(designItems: IDesignItem[], property: IProperty): ValueType {
    throw new Error("Method not implemented.");
  }
  getUnsetValue(designItems: IDesignItem[], property: IProperty) {
    throw new Error("Method not implemented.");
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