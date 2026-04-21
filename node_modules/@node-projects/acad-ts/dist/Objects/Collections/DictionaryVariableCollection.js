import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { DictionaryVariable } from '../DictionaryVariable.js';
import { MultiLeaderStyle } from '../MultiLeaderStyle.js';
import { Scale } from '../Scale.js';
import { TableStyle } from '../TableStyle.js';
export class DictionaryVariableCollection extends ObjectDictionaryCollection {
    constructor(dictionary) {
        super(dictionary);
    }
    addOrUpdateVariable(name, value) {
        const v = this.tryGet(name);
        if (v) {
            v.value = value;
        }
        else {
            this.add(new DictionaryVariable(name, value));
        }
    }
    addVariable(name, value) {
        if (!this.containsKey(name)) {
            this.add(new DictionaryVariable(name, value));
        }
    }
    createDefaults() {
        this.addVariable(DictionaryVariable.currentMultiLeaderStyle, MultiLeaderStyle.defaultName);
        this.addVariable(DictionaryVariable.currentAnnotationScale, Scale.defaultName);
        this.addVariable(DictionaryVariable.currentTableStyle, TableStyle.defaultName);
        this.addVariable(DictionaryVariable.wipeoutFrame, '0');
        this.addVariable('CVIEWDETAILSTYLE', 'Metric50');
        this.addVariable('CVIEWSECTIONSTYLE', 'Metric50');
    }
    getValue(name) {
        const v = this.tryGet(name);
        return v ? v.value : null;
    }
}
//# sourceMappingURL=DictionaryVariableCollection.js.map