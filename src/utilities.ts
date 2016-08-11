﻿/**
 * Copies all properties values from passed object to the new object literal. 
 * If any of the properties of passed object is also complex object then {@link cloneAsLiteral} will be called recursivelly. 
 * Function declarations are ignored.
 * @param value value to clone.
 * @returns resulted literal. 
 */
export function cloneAsLiteral(value: any): any {
    if (value === null) {
        return null;
    }
    if (value === undefined) {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value.map((i: any) => cloneAsLiteral(i));
    }
    if (typeof value === 'object') {
        let result = {};
        for (let index in value) {
            if (value.hasOwnProperty(index) && (typeof value[index] !== 'function')) {
                result[index] = cloneAsLiteral(value[index]);
            }
        }
        return result;
    }
    return value;
}

/**
 * Set of key-value pairs which used {@link coerceValue} method to coerce specific values. 
 */
export var coerceTypes: any = { 'true': !0, 'false': !1, 'null': null };

/**
 * Coerce type of passed value.
 * This means that passed string 'null' becomes `null`, 'true' becomes `true`, '1.0' becomes `1.0` etc.
 * If passed value is complex object or array this method will be called for each property or array item.
 * @param value to coerce.
 * @returns resulted value.
 * @see {@link coerceTypes}
 */
export function coerceValue(value: any): any {
    if (value === null) {
        return null;
    }
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === 'object' || Array.isArray(value)) {
        for (let index in value) {
            if (value.hasOwnProperty(index)) {
                value[index] = coerceValue(value[index]);
            }
        }
    } else if (value && !isNaN(value)) {
        value = +value;
    } else if (value === 'undefined') {
        value = undefined;
    } else if (coerceTypes[value] !== undefined) {
        value = coerceTypes[value];
    }
    return value;
}
/**
 * Executes clean up of passed array by calling splice function.
 * Next, each element of passed array will be checked for existance of `destroy` method and if it exists this method will be called.
 * @param collection array of elements to destroy.
 * @param async if `true` then elements iteration and destroy will be called via setTimeout (,0).
 */
export function destroyAll(collection: any[], async: boolean = true): void {
    if (!Array.isArray(collection)) {
        return;
    }
    let items = collection.splice(0, collection.length);

    if (async) {
        setTimeout(() => {
            items.forEach((item: any) => {
                if (item.destroy) {
                    item.destroy();
                }
            });
            items = null;
        }, 0);

    } else {
        items.forEach((item: any) => {
            if (item.destroy) {
                item.destroy();
            }
        });
    }
}