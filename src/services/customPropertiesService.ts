import { IProperty, IDesignItem, PropertyType, IBinding, AbstractPropertiesService } from '@node-projects/web-component-designer';
import { BindingTarget } from '@node-projects/web-component-designer/dist/elements/item/BindingTarget';
import { RefreshMode } from '@node-projects/web-component-designer/dist/elements/services/propertiesService/IPropertiesService';
import { ValueType } from '@node-projects/web-component-designer/dist/elements/services/propertiesService/ValueType';

export class CustomPropertiesService extends AbstractPropertiesService {
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

  async setValue(designItems: IDesignItem[], property: IProperty, value: any) {
    // throw new Error("Method not implemented.");
  }
  getValue(designItems: IDesignItem[], property: IProperty) {
    // throw new Error("Method not implemented.");
    return null;
  }

  name: string = "custom";

  isHandledElement(designItem: IDesignItem): boolean {
    if (designItem.element.nodeName == "test-element")
      return true;
    return false;
  }

  async getProperty(designItem: IDesignItem, name: string): Promise<IProperty> {
    return this.getProperties(designItem)[name];
  }

  async getProperties(designItem: IDesignItem): Promise<IProperty[]> {
    let properties: IProperty[] = [];
    properties.push({ name: "Test 1", type: "string", service: this, propertyType: PropertyType.propertyAndAttribute });
    return properties;
  }
}