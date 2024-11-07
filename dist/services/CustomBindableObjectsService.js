import { BindableObjectType } from "@node-projects/web-component-designer";
export class CustomBindableObjectsService {
    hasObjectsForInstanceServiceContainer(instanceServiceContainer, source) {
        return true;
    }
    name = 'custom';
    async getBindableObject(fullName) {
        let objs = await this.getBindableObjects();
        let parts = fullName.split('.');
        let result = null;
        for (let p of parts) {
            result = objs.find(x => x.name == p);
            objs = result.children;
        }
        return result;
    }
    async getBindableObjects(parent) {
        return [
            {
                name: 'DemoData', fullName: 'DemoData', type: BindableObjectType.folder, children: [
                    { name: 'value1', fullName: 'DemoData.value1', type: BindableObjectType.number, children: false },
                    { name: 'value2', fullName: 'DemoData.value2', type: BindableObjectType.string, children: false }
                ]
            }
        ];
    }
}
