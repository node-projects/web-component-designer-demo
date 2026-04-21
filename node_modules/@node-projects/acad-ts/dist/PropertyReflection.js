import { getClassPropertyMetadata, getSystemVariableMetadata } from './Metadata/MetadataStore.js';
export class PropertyExpression {
    cache = new Map();
    _keySelector;
    constructor(keySelector) {
        this._keySelector = keySelector;
    }
    getProperty(propName) {
        return this.cache.get(propName);
    }
    registerProperty(propertyName, attribute) {
        const prop = new PropertyExpression.Prop();
        prop.propertyName = propertyName;
        prop.attribute = attribute;
        prop.getter = (instance) => instance[propertyName];
        prop.setter = (instance, value) => {
            instance[propertyName] = value;
        };
        this.cache.set(this._keySelector(propertyName, attribute), prop);
    }
    static fromClassProperties(type, keySelector) {
        const expression = new PropertyExpression(keySelector);
        for (const metadata of getClassPropertyMetadata(type)) {
            expression.registerProperty(metadata.propertyName, metadata);
        }
        return expression;
    }
    static fromSystemVariables(type, keySelector) {
        const expression = new PropertyExpression(keySelector);
        for (const metadata of getSystemVariableMetadata(type)) {
            expression.registerProperty(metadata.propertyName, metadata);
        }
        return expression;
    }
}
(function (PropertyExpression) {
    class Prop {
        getter = null;
        setter = null;
        attribute = null;
        propertyName = "";
    }
    PropertyExpression.Prop = Prop;
})(PropertyExpression || (PropertyExpression = {}));
//# sourceMappingURL=PropertyReflection.js.map