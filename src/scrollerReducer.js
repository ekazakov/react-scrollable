export default function scrollerReducer(params) {
    const {rowHeight, size, scrollTop, offsetTopIndex:topIndex} = params;
    const {floor, abs, min} = Math;

    const offsetTopIndex = min(floor(scrollTop / rowHeight), size);
    const isDown = abs(topIndex) - abs(offsetTopIndex) < 0;

    return {
        offsetTopIndex,
        isDown
    };
};