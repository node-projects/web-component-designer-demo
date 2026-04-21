import { CadObject } from '../CadObject.js';
import { OnNameChangedArgs } from '../OnNameChangedArgs.js';
import { ObjectType } from '../Types/ObjectType.js';
export class NonGraphicalObject extends CadObject {
    onNameChanged = null;
    get name() { return this._name; }
    set name(value) {
        this.onNameChanged?.call(this, this, new OnNameChangedArgs(this._name, value));
        this._name = value;
    }
    get objectType() {
        return ObjectType.UNLISTED;
    }
    _name = '';
    constructor(name) {
        super();
        if (name) {
            this.name = name;
        }
    }
    clone() {
        const clone = super.clone();
        clone.onNameChanged = null;
        return clone;
    }
    toString() {
        if (!this._name) {
            return `${this.objectName}:${this.handle}`;
        }
        else {
            return `${this.objectName}:${this._name}:${this.handle}`;
        }
    }
}
//# sourceMappingURL=NonGraphicalObject.js.map