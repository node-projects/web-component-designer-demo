import { IBindableObjectsService, IBindableObject, BindableObjectType } from "@node-projects/web-component-designer";

export class CustomBindableObjectsService implements IBindableObjectsService {

  name = 'custom';

  async getBindableObject(fullName: string): Promise<IBindableObject<void>> {
    let objs = await this.getBindableObjects();
    let parts = fullName.split('.');
    let result: IBindableObject<void> = null;
    for (let p of parts) {
      result = objs.find(x => x.name == p);
      objs = <IBindableObject<void>[]>result.children
    }
    return result;
  }

  async getBindableObjects(parent?: IBindableObject<void>): Promise<IBindableObject<void>[]> {
    return [
      {
        name: 'DemoData', fullName: 'DemoData', type: BindableObjectType.folder, children: [
          { name: 'value1', fullName: 'DemoData.value1', type: BindableObjectType.number, children: false },
          { name: 'value2', fullName: 'DemoData.value2', type: BindableObjectType.string, children: false }
        ]
      }
    ]
  }
}