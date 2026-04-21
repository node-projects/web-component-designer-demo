import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { Group } from '../Group.js';
export class GroupCollection extends ObjectDictionaryCollection {
    constructor(dictionary) {
        super(dictionary);
        this._dictionary = dictionary;
    }
    add(entry) {
        if (!entry.name || !entry.name.trim()) {
            entry.name = this._createName('*A');
        }
        this._validateEntities(entry.entities);
        super.add(entry);
    }
    createGroup(entities, name = '') {
        this._validateEntities(entities);
        const group = new Group(name);
        this.add(group);
        group.addRange(entities);
        return group;
    }
    _createName(prefix) {
        let index = 0;
        while (this.containsKey(`${prefix}${index}`)) {
            index++;
        }
        return `${prefix}${index}`;
    }
    _validateEntities(entities) {
        const document = this._dictionary.document;
        if (document == null) {
            return;
        }
        for (const entity of entities) {
            if (entity.document !== document) {
                throw new Error('All group entities must belong to the same document as the group collection.');
            }
        }
    }
}
//# sourceMappingURL=GroupCollection.js.map