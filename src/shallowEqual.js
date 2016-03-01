const hasOwn = Object.prototype.hasOwnProperty;

export function shallowEqual(objA, objB) {
    if (objA === objB) return true;

    const propsA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (propsA.length !== keysB.length) return false;

    for (let i = 0; i < propsA.length; i++) {
        if (!hasOwn.call(objB, propsA[i]) ||
            objA[propsA[i]] !== objB[propsA[i]]) {
            return false
        }
    }

    return true
}