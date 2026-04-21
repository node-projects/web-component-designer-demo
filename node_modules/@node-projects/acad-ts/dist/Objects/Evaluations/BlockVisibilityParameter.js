import { Block1PtParameter } from './Block1PtParameter.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
export class BlockVisibilityState {
    name = '';
    entities = [];
    expressions = [];
    clone() {
        const clone = new BlockVisibilityState();
        clone.name = this.name;
        clone.entities = this.entities.map(e => e.clone());
        clone.expressions = this.expressions.map(e => e.clone());
        return clone;
    }
}
export class BlockVisibilityParameter extends Block1PtParameter {
    description = '';
    entities = [];
    name = '';
    get objectName() { return DxfFileToken.objectBlockVisibilityParameter; }
    _states = new Map();
    get states() {
        return this._states;
    }
    get subclassMarker() { return DxfSubclassMarker.blockVisibilityParameter; }
    value91 = false;
    addState(state) {
        this._states.set(state.name, state);
    }
    clone() {
        const clone = super.clone();
        clone.entities = this.entities.map(e => e.clone());
        clone._states = new Map();
        for (const [key, state] of this._states) {
            const clonedState = state.clone();
            clone._states.set(clonedState.name, clonedState);
        }
        return clone;
    }
}
//# sourceMappingURL=BlockVisibilityParameter.js.map