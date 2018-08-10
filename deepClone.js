/**
 * DeepClone module
 * This modules creates a deep copy of a javascript object.
 * JSON.parse(JSON.stringify(obj)) works only for primitive data types but
 * fails for complex objects such as functions, date, regex etc.
 * Although the sample data set provided in question is composed of primitive
 * data but this function aims to be more generic
 * This module tries to cover as many data type as possible within the time frame
 * allowed.
 *
 * IMPORTANT: This method doesn't support cyclic objects.
*/

const CustomError = require('./CustomError');

/**
 * This helper returns string representation for object type
 * @param {Object} o object
 * @return {String}
 */
const stringRepresentation = (o) => Object
    .prototype
    .toString
    .call(o);

/**
 * This is a helper object containing functions that
 * check object against specific types
 */
const typeChecker = {
    isDate: (o) => stringRepresentation(o) === '[object Date]',
    isArray: (o) => stringRepresentation(o) === '[object Array]',
    isRegExp: (o) => stringRepresentation(o) === '[object RegExp]'
}

/**
 *
 * @param {Object} obj object to checked
 * @param {Object} type type against which object will be checked
 * @return {Boolean} result of check
 */
const isInstanceof = (obj, type) => {
    return type != null && obj instanceof type;
}
/**
 * This utility returns flags attached on regular expression object
 * @param {Object} re Regular expression object
 */
const getRegExpFlags = (re) => {
    let flags = '';
    if (re.global) 
        flags += 'g';
    if (re.ignoreCase) 
        flags += 'i';
    if (re.multiline) 
        flags += 'm';
    return flags;
}

/**
 * Deep clone creates a copy of source object
 * such that no child reference is passed from source
 * to target
 * @param {Object} sourceObject object to cloned
 * @return {Object} cloned object
 */
const deepClone = (sourceObject) => {
    /* check if input of object */
    if (typeof sourceObject !== 'object') {
        /* Primitive values don't need to be cloned */
        return sourceObject;
    }

    /* Return null if sourceType is null. This is because typeof(null) is object */
    if (sourceObject === null) {
        return null;
    }

    /* Do same for undefined */
    if (sourceObject === undefined) {
        return undefined;
    }

    let targetObject = null
    if (typeChecker.isArray(sourceObject)) {
        targetObject = [];
        /* recursively copy all children of source object */
        sourceObject.forEach(element => {
            targetObject.push(deepClone(element));
        });
    } else if (isInstanceof(sourceObject, Promise)) {
        targetObject = new Promise((resolve, reject) => {
            /* Cloned is called because input to callback needs to be cloned too */
            sourceObject.then((value) => {
                resolve(deepClone(value));
            }, (err) => {
                reject(deepClone(err));
            });
        });
    } else if (typeChecker.isRegExp(sourceObject)) {
        targetObject = new RegExp(sourceObject.source, getRegExpFlags(sourceObject));
        /* transfer last index if it exists
        ** For reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex
        */
        if (sourceObject.lastIndex) {
            targetObject.lastIndex = targetObject.lastIndex;
        }
    } else if (typeChecker.isDate(sourceObject)) {
        /* This is my favorite and the easiest :D */
        targetObject = new Date(sourceObject.getTime());
    } else {
        /** For all other types we can create target object using prototype of sourceObject
         * This can work for functions, errors etc
        */
        targetObject = Object.create(Object.getPrototypeOf(sourceObject))
    }

    /** Now we created target Object of respective types
     * It's time to clone the attributes from source to target
     * This operation is generic and applies to all object types
     * We use getOwnPropertyNames instead of Object.keys()
     * as it will return non enumerable properties too
    */
    for (let prop of Object.getOwnPropertyNames(sourceObject)) {
        const clonedVal = deepClone(sourceObject[prop])
        const descriptor = Object.getOwnPropertyDescriptor(sourceObject, prop);
        Object.defineProperty(targetObject, prop, {
            ...descriptor,
            value: clonedVal
        });
    }
    return targetObject;
}

module.exports = deepClone;