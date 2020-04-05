"use strict";
exports.__esModule = true;
require("anux-common");
function compareElements(elementA, elementB) {
    var isAElement = React.isValidElement(elementA);
    var isBElement = React.isValidElement(elementB);
    if (!isAElement && !isBElement) {
        return;
    }
    if (elementA.type !== elementB.type || elementA.key !== elementB.key) {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return areDeepEqual(elementA.props, elementB.props);
}
function customComparer(objectA, objectB) {
    if (objectA === objectB) {
        return true;
    }
    if (objectA == null || objectB == null) {
        return false;
    }
    if (typeof (objectA) !== typeof (objectB)) {
        return false;
    }
    if (typeof (objectA) !== 'object' || objectA instanceof Array) {
        return;
    }
    var result = compareElements(objectA, objectB);
    if (result === true || result === false) {
        return result;
    }
}
function areDeepEqual(valueA, valueB) {
    return Reflect.areDeepEqual(valueA, valueB, customComparer);
}
exports.areDeepEqual = areDeepEqual;
function areShallowEqual(valueA, valueB) {
    return Reflect.areShallowEqual(valueA, valueB, customComparer);
}
exports.areShallowEqual = areShallowEqual;
