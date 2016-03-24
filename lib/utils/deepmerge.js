'use strict';

const deepmerge = function deepmerge(dst, src) {
    for (let key in src) {
        if (typeof src[key] !== 'object') {
            dst[key] = src[key];
        } else if (key in dst) {
            if (dst[key].constructor === Array && src[key].constructor === Array) {
                dst[key] = dst[key].concat(src[key]);
            } else {
                dst[key] = deepmerge(dst[key], src[key]);
            }
        } else {
            dst[key] = src[key];
        }
    }

    return dst;
};

/*
deepmerge.nopreserve = function (dst, src) {
    let target = {};
    deepmerge(target, dst);
    deepmerge(target, src);

    return target;
};
*/

module.exports = deepmerge;