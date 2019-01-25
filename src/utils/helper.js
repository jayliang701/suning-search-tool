import _get from 'lodash/get';
import _set from 'lodash/set';

export const dotProp = {
    get: _get,
    set: _set
};

export const extend = () => {

    // window.NP = NP;

    global.__defineGetter__('cdn', () => {
        return (path) => {
            return window.Setting.cdn + path;
        };
    });
    
    Promise.prototype.finally = function(cb) {
        const res = () => this;
        const fin = () => Promise.resolve(cb()).then(res);
        return this.then(fin, fin);
    };

    Array.prototype.without = function(filter, func) {
        var copy = [];
        this.forEach((element) => {
            for (var i = 0; i < filter.length; i++) {
                if (func(element, filter[i])) {
                    return;
                }
            }
            copy.push(element);
        });
        return copy;
    }
}