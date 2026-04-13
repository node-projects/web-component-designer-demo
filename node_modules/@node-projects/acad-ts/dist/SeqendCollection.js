import { CadObjectCollection } from './CadObjectCollection.js';
import { CollectionChangedEventArgs } from './CollectionChangedEventArgs.js';
import { Seqend } from './Entities/Seqend.js';
export class SeqendCollection extends CadObjectCollection {
    onSeqendAdded = null;
    onSeqendRemoved = null;
    get seqend() {
        if (this._entries.size > 0)
            return this._seqend;
        return null;
    }
    set seqend(value) {
        this._seqend = value;
        this._seqend.owner = this.owner;
    }
    _seqend;
    constructor(owner) {
        super(owner);
        this._seqend = new Seqend(owner);
    }
    add(item) {
        let addSeqend = false;
        if (this._entries.size === 0) {
            addSeqend = true;
        }
        super.add(item);
        if (addSeqend && this._entries.size > 0) {
            this.onSeqendAdded?.(this, new CollectionChangedEventArgs(this._seqend));
        }
    }
    remove(item) {
        const e = super.remove(item);
        if (e != null) {
            this.onSeqendRemoved?.(this, new CollectionChangedEventArgs(this._seqend));
        }
        return e;
    }
    [Symbol.iterator]() {
        return this._entries[Symbol.iterator]();
    }
}
//# sourceMappingURL=SeqendCollection.js.map