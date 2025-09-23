// définition de requestAnimationFrame et cancelAnimationFrame

(function (window) {
    'use strict';
    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - (typeof lastTime !== 'undefined' ? lastTime : 0)));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    window.cancelAnimationFrame = window.cancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        };
})(typeof window === 'undefined' ? this : window);

// Promise polyfill

(function (window) {
    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout ( like sinon.useFakeTimers() )
    var setTimeoutFunc = setTimeout;

    function noop() {}
    // Use polyfill for setImmediate for performance gains
    var asap = (typeof setImmediate === 'function' && setImmediate) ||
        function (fn) {
            setTimeoutFunc(fn, 1);
        };
    var onUnhandledRejection = function onUnhandledRejection(err) {
        if (typeof console !== 'undefined' && console) {
            console.warn('Possible Unhandled Promise Rejection:', err);
        }
    };
    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
        return function () {
            fn.apply(thisArg, arguments);
        };
    }

    function Promise(fn) {
        if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
        if (typeof fn !== 'function') throw new TypeError('not a function');
        this._state = 0;
        this._handled = false;
        this._value = undefined;
        this._deferreds = [];

        doResolve(fn, this);
    }

    function handle(self, deferred) {
        while (self._state === 3) {
            self = self._value;
        }
        if (self._state === 0) {
            self._deferreds.push(deferred);
            return;
        }
        self._handled = true;
        asap(function () {
            var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                return;
            }
            var ret;
            try {
                ret = cb(self._value);
            } catch (e) {
                reject(deferred.promise, e);
                return;
            }
            resolve(deferred.promise, ret);
        });
    }

    function resolve(self, newValue) {
        try {
            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (newValue instanceof Promise) {
                    self._state = 3;
                    self._value = newValue;
                    finale(self);
                    return;
                } else if (typeof then === 'function') {
                    doResolve(bind(then, newValue), self);
                    return;
                }
            }
            self._state = 1;
            self._value = newValue;
            finale(self);
        } catch (e) {
            reject(self, e);
        }
    }

    function reject(self, newValue) {
        self._state = 2;
        self._value = newValue;
        finale(self);
    }

    function finale(self) {
        if (self._state === 2 && self._deferreds.length === 0) {
            setTimeout(function () {
                if (!self._handled) {
                    onUnhandledRejection(self._value);
                }
            }, 1);
        }
        for (var i = 0, len = self._deferreds.length; i < len; i++) {
            handle(self, self._deferreds[i]);
        }
        self._deferreds = null;
    }

    function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    }
    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, self) {
        var done = false;
        try {
            fn(function (value) {
                if (done) return;
                done = true;
                resolve(self, value);
            }, function (reason) {
                if (done) return;
                done = true;
                reject(self, reason);
            });
        } catch (ex) {
            if (done) return;
            done = true;
            reject(self, ex);
        }
    }
    Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
        var prom = new Promise(noop);
        handle(this, new Handler(onFulfilled, onRejected, prom));
        return prom;
    };
    Promise.all = function (arr) {
        var args = Array.prototype.slice.call(arr);
        return new Promise(function (resolve, reject) {
            if (args.length === 0) return resolve([]);
            var remaining = args.length;

            function res(i, val) {
                try {
                    if (val && (typeof val === 'object' || typeof val === 'function')) {
                        var then = val.then;
                        if (typeof then === 'function') {
                            then.call(val, function (val) {
                                res(i, val);
                            }, reject);
                            return;
                        }
                    }
                    args[i] = val;
                    if (--remaining === 0) {
                        resolve(args);
                    }
                } catch (ex) {
                    reject(ex);
                }
            }
            for (var i = 0; i < args.length; i++) {
                res(i, args[i]);
            }
        });
    };
    Promise.resolve = function (value) {
        if (value && typeof value === 'object' && value.constructor === Promise) {
            return value;
        }

        return new Promise(function (resolve) {
            resolve(value);
        });
    };
    Promise.reject = function (value) {
        return new Promise(function (resolve, reject) {
            reject(value);
        });
    };
    Promise.race = function (values) {
        return new Promise(function (resolve, reject) {
            for (var i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject);
            }
        });
    };
    /**
     * Set the immediate function to execute callbacks
     * @param fn {function} Function to execute
     * @private
     */
    Promise._setImmediateFn = function _setImmediateFn(fn) {
        asap = fn;
    };

    Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
        onUnhandledRejection = fn;
    };
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Promise;
    } else if (!window.Promise) {
        window.Promise = Promise;
    }
})(typeof window === 'undefined' ? this : window);

// Symbol
// A modification of https://github.com/WebReflection/get-own-property-symbols
// (C) Andrea Giammarchi - MIT Licensed

(function (Object, GOPS, global) {
    var setDescriptor;
    var id = 0;
    var random = '' + Math.random();
    var prefix = '__\x01symbol:';
    var prefixLength = prefix.length;
    var internalSymbol = '__\x01symbol@@' + random;
    var DP = 'defineProperty';
    var DPies = 'defineProperties';
    var GOPN = 'getOwnPropertyNames';
    var GOPD = 'getOwnPropertyDescriptor';
    var PIE = 'propertyIsEnumerable';
    var ObjectProto = Object.prototype;
    var hOP = ObjectProto.hasOwnProperty;
    var pIE = ObjectProto[PIE];
    var toString = ObjectProto.toString;
    var concat = Array.prototype.concat;
    var cachedWindowNames = typeof window === 'object' ? Object.getOwnPropertyNames(window) : [];
    var nGOPN = Object[GOPN];
    var gOPN = function getOwnPropertyNames(obj) {
        if (toString.call(obj) === '[object Window]') {
            try {
                return nGOPN(obj);
            } catch (e) {
                // IE bug where layout engine calls userland gOPN for cross-domain `window` objects
                return concat.call([], cachedWindowNames);
            }
        }
        return nGOPN(obj);
    };
    var gOPD = Object[GOPD];
    var create = Object.create;
    var keys = Object.keys;
    var freeze = Object.freeze || Object;
    var defineProperty = Object[DP];
    var $defineProperties = Object[DPies];
    var descriptor = gOPD(Object, GOPN);
    var addInternalIfNeeded = function (o, uid, enumerable) {
        if (!hOP.call(o, internalSymbol)) {
            try {
                defineProperty(o, internalSymbol, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: {}
                });
            } catch (e) {
                o[internalSymbol] = {};
            }
        }
        o[internalSymbol]['@@' + uid] = enumerable;
    };
    var createWithSymbols = function (proto, descriptors) {
        var self = create(proto);
        gOPN(descriptors).forEach(function (key) {
            if (propertyIsEnumerable.call(descriptors, key)) {
                $defineProperty(self, key, descriptors[key]);
            }
        });
        return self;
    };
    var copyAsNonEnumerable = function (descriptor) {
        var newDescriptor = create(descriptor);
        newDescriptor.enumerable = false;
        return newDescriptor;
    };
    var get = function get() {};
    var onlyNonSymbols = function (name) {
        return name != internalSymbol &&
            !hOP.call(source, name);
    };
    var onlySymbols = function (name) {
        return name != internalSymbol &&
            hOP.call(source, name);
    };
    var propertyIsEnumerable = function propertyIsEnumerable(key) {
        var uid = '' + key;
        return onlySymbols(uid) ? (
            hOP.call(this, uid) &&
            this[internalSymbol]['@@' + uid]
        ) : pIE.call(this, key);
    };
    var setAndGetSymbol = function (uid) {
        var descriptor = {
            enumerable: false,
            configurable: true,
            get: get,
            set: function (value) {
                setDescriptor(this, uid, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: value
                });
                addInternalIfNeeded(this, uid, true);
            }
        };
        try {
            defineProperty(ObjectProto, uid, descriptor);
        } catch (e) {
            ObjectProto[uid] = descriptor.value;
        }
        return freeze(source[uid] = defineProperty(
            Object(uid),
            'constructor',
            sourceConstructor
        ));
    };
    var Symbol = function Symbol(description) {
        if (this instanceof Symbol) {
            throw new TypeError('Symbol is not a constructor');
        }
        return setAndGetSymbol(
            prefix.concat(description || '', random, ++id)
        );
    };
    var source = create(null);
    var sourceConstructor = { value: Symbol };
    var sourceMap = function (uid) {
        return source[uid];
    };
    var $defineProperty = function defineProp(o, key, descriptor) {
        var uid = '' + key;
        if (onlySymbols(uid)) {
            setDescriptor(o, uid, descriptor.enumerable ?
                copyAsNonEnumerable(descriptor) : descriptor);
            addInternalIfNeeded(o, uid, !!descriptor.enumerable);
        } else {
            defineProperty(o, key, descriptor);
        }
        return o;
    };

    var onlyInternalSymbols = function (obj) {
        return function (name) {
            return hOP.call(obj, internalSymbol) && hOP.call(obj[internalSymbol], '@@' + name);
        };
    };
    var $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
        return gOPN(o).filter(o === ObjectProto ? onlyInternalSymbols(o) : onlySymbols).map(sourceMap);
    };

    descriptor.value = $defineProperty;
    defineProperty(Object, DP, descriptor);

    descriptor.value = $getOwnPropertySymbols;
    defineProperty(Object, GOPS, descriptor);

    descriptor.value = function getOwnPropertyNames(o) {
        return gOPN(o).filter(onlyNonSymbols);
    };
    defineProperty(Object, GOPN, descriptor);

    descriptor.value = function defineProperties(o, descriptors) {
        var symbols = $getOwnPropertySymbols(descriptors);
        if (symbols.length) {
            keys(descriptors).concat(symbols).forEach(function (uid) {
                if (propertyIsEnumerable.call(descriptors, uid)) {
                    $defineProperty(o, uid, descriptors[uid]);
                }
            });
        } else {
            $defineProperties(o, descriptors);
        }
        return o;
    };
    defineProperty(Object, DPies, descriptor);

    descriptor.value = propertyIsEnumerable;
    defineProperty(ObjectProto, PIE, descriptor);

    descriptor.value = Symbol;
    defineProperty(global, 'Symbol', descriptor);

    // defining `Symbol.for(key)`
    descriptor.value = function (key) {
        var uid = prefix.concat(prefix, key, random);
        return uid in ObjectProto ? source[uid] : setAndGetSymbol(uid);
    };
    defineProperty(Symbol, 'for', descriptor);

    // defining `Symbol.keyFor(symbol)`
    descriptor.value = function (symbol) {
        if (onlyNonSymbols(symbol)) {throw new TypeError(symbol + ' is not a symbol');}
        return hOP.call(source, symbol) ?
            symbol.slice(prefixLength * 2, -random.length) :
            void 0;
    };
    defineProperty(Symbol, 'keyFor', descriptor);

    descriptor.value = function getOwnPropertyDescriptor(o, key) {
        var descriptor = gOPD(o, key);
        if (descriptor && onlySymbols(key)) {
            descriptor.enumerable = propertyIsEnumerable.call(o, key);
        }
        return descriptor;
    };
    defineProperty(Object, GOPD, descriptor);

    descriptor.value = function (proto, descriptors) {
        return arguments.length === 1 || typeof descriptors === 'undefined' ?
            create(proto) :
            createWithSymbols(proto, descriptors);
    };
    defineProperty(Object, 'create', descriptor);

    descriptor.value = function () {
        var str = toString.call(this);
        return (str === '[object String]' && onlySymbols(this)) ? '[object Symbol]' : str;
    };
    defineProperty(ObjectProto, 'toString', descriptor);


    setDescriptor = function (o, key, descriptor) {
        var protoDescriptor = gOPD(ObjectProto, key);
        delete ObjectProto[key];
        defineProperty(o, key, descriptor);
        if (o !== ObjectProto) {
            defineProperty(ObjectProto, key, protoDescriptor);
        }
    };
}(Object, 'getOwnPropertySymbols', this));

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        },
        configurable: true,
        writable: true
    });
}
if (!Array.prototype.every) {
    Array.prototype.every = function (callbackfn, thisArg) {
        'use strict';
        var T; var k;

        if (this == null) {
            throw new TypeError('this vaut null ou n est pas défini');
        }

        // 1. Soit O le résultat de l'appel à ToObject auquel on a
        // passé this comme argument
        var O = Object(this);

        // 2. Soit lenValue le résultat de l'appel de la méthode interne
        //   Get sur O avec l'argument "length".
        // 3. Soit len le résultat de ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. Si IsCallable(callbackfn) est faux, on lève une exception
        // TypeError.
        if (typeof callbackfn !== 'function') {
            throw new TypeError();
        }

        // 5. Si thisArg a été fourni : soit T cette valeur thisArg, undefined sinon.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Soit k égal à 0.
        k = 0;

        // 7. On répète tant que k < len
        while (k < len) {
            var kValue;

            // a. Soit Pk la valeur de ToString(k).
            //   (ce qui est implicite pour les opérandes gauche de in)
            // b. Soit kPresent le résultat de l'appel de la méthode
            //    interne de O avec l'argument Pk.
            //    Cette étape peut être combinée avec l'étape c
            // c. Si kPresent vaut true, alors
            if (k in O) {
                // i. Soit kValue le résultat de l'appel de la méthode
                //    interne Get de O avec l'argument Pk.
                kValue = O[k];

                // ii. Soit testResult le résultat de l'appel de la méthode
                //     interne Call de callbackfn avec T comme valeur this et
                //     la liste d'argument contenant kValue, k, et O.
                var testResult = callbackfn.call(T, kValue, k, O);

                // iii. Si ToBoolean(testResult) vaut false, on renvoie false.
                if (!testResult) {
                    return false;
                }
            }
            k++;
        }
        return true;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function (func, thisArg) {
        'use strict';
        if (!((typeof func === 'Function' || typeof func === 'function') && this)) {throw new TypeError();}

        var len = this.length >>> 0;


        var res = new Array(len);
        // preallocate array

        var t = this; var c = 0; var i = -1;
        if (thisArg === undefined) {
            while (++i !== len) {
                // checks to see if the key was set
                if (i in this) {
                    if (func(t[i], i, t)) {
                        res[c++] = t[i];
                    }
                }
            }
        } else {
            while (++i !== len) {
                // checks to see if the key was set
                if (i in this) {
                    if (func.call(thisArg, t[i], i, t)) {
                        res[c++] = t[i];
                    }
                }
            }
        }

        res.length = c; // shrink down array to proper size
        return res;
    };
}
// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
    Array.prototype.some = function (fun, thisArg) {
        'use strict';

        if (this == null) {
            throw new TypeError('Array.prototype.some called on null or undefined');
        }

        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(thisArg, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}
// Production steps / ECMA-262, Edition 5, 15.4.4.19
// Référence : https://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function (callback /* , thisArg*/) {
        var T; var A; var k;

        if (this == null) {
            throw new TypeError(' this est null ou non défini');
        }

        // 1. Soit O le résultat de l'appel ToObject avec |this|
        //    comme argument.
        var O = Object(this);

        // 2. Soit lenValue le résultat de l'appel de la méthode interne
        //    Get de O avec l'argument "length".
        // 3. Soit len égal à ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. Si IsCallable(callback) vaut false, on renvoie une TypeError
        // Voir : https://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' n est pas une fonction');
        }

        // 5. Si thisArg a été utilisé, on définit T avec thisArg
        //    sinon T vaudra undefined.
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // 6. Soit A un nouveau tableau créé tel
        //    qu'avec l'expression new Array(len)
        //    où Array est le constructeur natif standard
        A = new Array(len);

        // 7. Soit k égal à 0
        k = 0;

        // 8. On répète tant que k < len
        while (k < len) {
            var kValue; var mappedValue;

            // a. Soit Pk égal à ToString(k).
            //    (implicite pour l'opérande gauche de in)
            // b. Soit kPresent le résultat de l'appel à la méthode
            //    interne de O HasProperty appelée avec l'argument
            //     Pk.
            //    Cette étape peut être combinée avec c
            // c. Si kPresent vaut true, alors
            if (k in O) {
                // i. Soit kValue le résultat de l'appel de la méthode
                //    interne Get de O avec l'argument Pk.
                kValue = O[k];

                // ii. Soit mappedValue le résultat de l'appel de la
                //     méthode interne Call de callback avec T comme première
                //     valeur et la liste des arguments kValue, k, et O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. On appelle la méthode intnerne DefineOwnProperty de A
                // avec les arguments Pk, Property Descriptor
                // { Value: mappedValue,
                //   Writable: true,
                //   Enumerable: true,
                //   Configurable: true },
                // et false.

                // Pour les navigateurs qui supportent Object.defineProperty
                // on pourra utiliser :
                // Object.defineProperty(A, k, {
                //   value: mappedValue,
                //   writable: true,
                //   enumerable: true,
                //   configurable: true
                // });

                // Pour un meilleur support, on utilisera :
                A[k] = mappedValue;
            }
            // d. On augmente k de 1.
            k++;
        }

        // 9. On renvoie A
        return A;
    };
}
// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
if (!Array.prototype.reduce) {
    Object.defineProperty(Array.prototype, 'reduce', {
        value: function (callback /* , initialValue*/) {
            if (this === null) {
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // Steps 3, 4, 5, 6, 7
            var k = 0;
            var value;

            if (arguments.length == 2) {
                value = arguments[1];
            } else {
                while (k < len && !(k in o)) {
                    k++;
                }

                // 3. If len is 0 and initialValue is not present, throw
                // a TypeError exception.
                if (k >= len) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }
                value = o[k++];
            }

            // 8. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kPresent be ? HasProperty(O, Pk).
                // c. If kPresent is true, then
                //    i. Let kValue be ? Get(O, Pk).
                //    ii. Let accumulator be ? Call(callbackfn, undefined,
                //        « accumulator, kValue, k, O »).
                if (k in o) {
                    value = callback(value, o[k], k, o);
                }

                // d. Increase k by 1.
                k++;
            }

            // 9. Return accumulator.
            return value;
        }
    });
}
if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, 'fill', {
        value: function (value) {
            // Steps 1-2.
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }

            var O = Object(this);

            // Steps 3-5.
            var len = O.length >>> 0;

            // Steps 6-7.
            var start = arguments[1];
            var relativeStart = start >> 0;

            // Step 8.
            var k = relativeStart < 0 ?
                Math.max(len + relativeStart, 0) :
                Math.min(relativeStart, len);

            // Steps 9-10.
            var end = arguments[2];
            var relativeEnd = end === undefined ?
                len : end >> 0;

            // Step 11.
            var final = relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) :
                Math.min(relativeEnd, len);

            // Step 12.
            while (k < final) {
                O[k] = value;
                k++;
            }

            // Step 13.
            return O;
        }
    });
}

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/* global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ('document' in window.self) {
    // Full polyfill for browsers with no classList support
    // Including IE < Edge missing SVGElement.classList
    if (!('classList' in document.createElement('_'))
        || document.createElementNS && !('classList' in document.createElementNS('http://www.w3.org/2000/svg', 'g'))) {
        (function (view) {
            'use strict';

            if (!('Element' in view)) return;

            var
                classListProp = 'classList'
                ; var protoProp = 'prototype'
                ; var elemCtrProto = view.Element[protoProp]
                ; var objCtr = Object
                ; var strTrim = String[protoProp].trim || function () {
                return this.replace(/^\s+|\s+$/g, '');
            }
                ; var arrIndexOf = Array[protoProp].indexOf || function (item) {
                var
                    i = 0;


                var len = this.length
;
                for (; i < len; i++) {
                    if (i in this && this[i] === item) {
                        return i;
                    }
                }
                return -1;
            }
                // Vendors: please allow content code to instantiate DOMExceptions
                ; var DOMEx = function (type, message) {
                this.name = type;
                this.code = DOMException[type];
                this.message = message;
            }
                ; var checkTokenAndGetIndex = function (classList, token) {
                if (token === '') {
                    throw new DOMEx(
                        'SYNTAX_ERR'
                        , 'An invalid or illegal string was specified'
                    );
                }
                if (/\s/.test(token)) {
                    throw new DOMEx(
                        'INVALID_CHARACTER_ERR'
                        , 'String contains an invalid character'
                    );
                }
                return arrIndexOf.call(classList, token);
            }
                ; var ClassList = function (elem) {
                var
                    trimmedClasses = strTrim.call(elem.getAttribute('class') || '');


                var classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [];


                var i = 0;


                var len = classes.length
;
                for (; i < len; i++) {
                    this.push(classes[i]);
                }
                this._updateClassName = function () {
                    elem.setAttribute('class', this.toString());
                };
            }
                ; var classListProto = ClassList[protoProp] = []
                ; var classListGetter = function () {
                return new ClassList(this);
            }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];
            classListProto.item = function (i) {
                return this[i] || null;
            };
            classListProto.contains = function (token) {
                token += '';
                return checkTokenAndGetIndex(this, token) !== -1;
            };
            classListProto.add = function () {
                var
                    tokens = arguments;


                var i = 0;


                var l = tokens.length;


                var token;


                var updated = false
;
                do {
                    token = tokens[i] + '';
                    if (checkTokenAndGetIndex(this, token) === -1) {
                        this.push(token);
                        updated = true;
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.remove = function () {
                var
                    tokens = arguments;


                var i = 0;


                var l = tokens.length;


                var token;


                var updated = false;


                var index
;
                do {
                    token = tokens[i] + '';
                    index = checkTokenAndGetIndex(this, token);
                    while (index !== -1) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.toggle = function (token, force) {
                token += '';

                var
                    result = this.contains(token);


                var method = result ?
                    force !== true && 'remove'
                    :
                    force !== false && 'add'
;

                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                }
                return !result;
            };
            classListProto.toString = function () {
                return this.join(' ');
            };

            if (objCtr.defineProperty) {
                var classListPropDesc = {
                    get: classListGetter,
                    enumerable: true,
                    configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) { // IE 8 doesn't support enumerable:true
                    // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
                    // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
                    if (ex.number === undefined || ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }
        }(window.self));
    }

    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.

    (function () {
        'use strict';

        var testElement = document.createElement('_');

        testElement.classList.add('c1', 'c2');

        // Polyfill for IE 10/11 and Firefox <26, where classList.add and
        // classList.remove exist but support only one argument at a time.
        if (!testElement.classList.contains('c2')) {
            var createMethod = function (method) {
                var original = DOMTokenList.prototype[method];

                DOMTokenList.prototype[method] = function (token) {
                    var i; var len = arguments.length;

                    for (i = 0; i < len; i++) {
                        token = arguments[i];
                        original.call(this, token);
                    }
                };
            };
            createMethod('add');
            createMethod('remove');
        }

        testElement.classList.toggle('c3', false);

        // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
        // support the second argument.
        if (testElement.classList.contains('c3')) {
            var _toggle = DOMTokenList.prototype.toggle;

            DOMTokenList.prototype.toggle = function (token, force) {
                if (1 in arguments && !this.contains(token) === !force) {
                    return force;
                }
                return _toggle.call(this, token);
            };
        }

        testElement = null;
    }());
}

if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target === null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource !== null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}
if (Number.parseFloat === void 0) {
    Number.parseFloat = window.parseFloat;
}
if (Number.parseInt === void 0) {
    Number.parseInt = window.parseInt;
}
if (Number.isNaN === void 0) {
    Number.isNaN = window.isNaN;
}
if (Number.isFinite === void 0) {
    Number.isFinite = window.isFinite;
}
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
