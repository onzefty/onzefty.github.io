if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        },
    });
}

if (!('classList' in SVGElement.prototype)) {
    Object.defineProperty(SVGElement.prototype, 'classList', {
        get: function get() {
            var _this = this;

            return {
                contains: function contains(className) {
                    return _this.className.baseVal.split(' ').indexOf(className) !== -1;
                },
                add: function add(className) {
                    if (!this.contains(className)) {
                        _this.setAttribute('class', _this.getAttribute('class') + ' ' + className);
                    }
                },
                remove: function remove(className) {
                    var removedClass = _this
                        .getAttribute('class')
                        .replace(new RegExp('(\\s|^)'.concat(className, '(\\s|$)'), 'g'), '$2');

                    if (this.contains(className)) {
                        _this.setAttribute('class', removedClass);
                    }
                },
                toggle: function toggle(className) {
                    if (this.contains(className)) {
                        this.remove(className);
                    } else {
                        this.add(className);
                    }
                },
            };
        },
    });
}

noop = function noop() {};

function forEach(array, cb) {
    for (var i = 0; i < array.length; i++) {
        var value = cb(array[i], i, array);
        var valueIsDef = isDefined(value);

        if (valueIsDef && /forEach\.decrement/.test(value)) {
            i--;
        }

        if (valueIsDef && /forEach\.increment/.test(value)) {
            i++;
        }

        if (valueIsDef && /forEach\.continue/.test(value)) {
            continue;
        }

        if (valueIsDef && !/forEach\./.test(value)) {
            return value;
        }
    }
}

function setStatic(statics, target) {
    var staticKeys = Object.keys(statics);

    forEach(staticKeys, function (key) {
        var obj = statics[key];
        Object.defineProperty(target, key, {
            get: obj.get,
            set: obj.set,
        });
    });
}

function mix(baseClass) {
    var baseClass = arguments[0];
    var mixins = Array.prototype.slice.call(arguments).splice(1, arguments.length);
    var mixinsLength = mixins.length;

    for (var i = 0; i < mixinsLength; i++) {
        var mixin = mixins[i];
        var keys = Object.getOwnPropertyNames(mixin);
        var keysLength = keys.length;
        for (var j = 0; j < keysLength; j++) {
            var key = keys[j];

            if (key in baseClass.prototype) {
                return;
            }

            var sourceDescriptor = Object.getOwnPropertyDescriptor(mixin, key);
            sourceDescriptor.enumerable = false;

            Object.defineProperty(baseClass.prototype, key, sourceDescriptor);
        }
    }
}

function getQueryParameters(context) {
    var _context = context || window;
    var search = _context.location.search.substring(1);

    if (search) {
        var decodedURI = decodeURI(search);
        return JSON.parse(
            '{"' + decodedURI.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
        );
    } else {
        return {};
    }
}

function getElFromValue(value) {
    var element = value;

    if (!(element instanceof HTMLElement)) {
        element = undefined;
    }

    var result = element || document.createElement('div');
    return result;
}

function getElFromSel(selector, container) {
    var parent = container || document;
    var element = parent.querySelector(selector);
    var result = element || document.createElement('div');
    return result;
}

function getElsFromSel(selector, container) {
    var parent = container || document;
    var elements = parent.querySelectorAll(selector);
    var result = [];

    forEach(elements, function (element) {
        var el = element || document.createElement('div');
        result.push(el);
    });

    return result;
}

function isDefined(value) {
    return value !== null && typeof value !== 'undefined';
}

(function (win) {
    function uuidv4() {
        return s() + s() + '-' + s() + '-' + s() + '-' + s() + '-' + s() + s() + s();
    }

    function s() {
        return (((1 + Math.random()) * 65536) | 0).toString(16).slice(1, 5);
    }

    win.uuidv4 = uuidv4;
})(window);

/**
* @desc Simple animation function
* @param  {Object} values - Start values
* @param  {Number} [values.exempleValue1] - An exemple of start value
* @param  {Object} options - target values, update callback & complete callback
* @param  {Number} [options.exempleValue1] - An exemple of end value
* @param  {Number} [options.duration] - Duration of animation (in ms)
* @param  {Function} [options.onUpdate] - Callback that fires when animation frame updates
* @param  {Function} [options.ease] - easing function
* @returns {Promise} Resolved when animation completed
* @example
    var element = document.getElementById('randomElement');

    animateValues(
        { a: 0 },
        {
            a: 500,
            duration: 800,
            onUpdate: function (values) {
                element.style.transform = 'scaleX(' + values.a + ')';
            },
            ease: function (t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            },
        }
    ).then(function(){
        console.log('animation done !')
    })
*/

function animateValues(values, options) {
    var lerp = function lerp(source, target, amount) {
        return source + amount * (target - source);
    };

    var checkNum = function checkNum(n) {
        return typeof n === 'number' ? n : null;
    };

    var checkFunc = function checkFunc(f) {
        return typeof f === 'function' ? f : noop;
    };

    var duration = options.duration;
    var onUpdate = checkFunc(options.onUpdate);
    var ease = checkFunc(options.ease);

    var start = Date.now();

    var animationMap = Object.keys(values).reduce(function (map, key) {
        var from = checkNum(values[key]);
        var to = checkNum(options[key]);

        if (from !== null && to !== null) {
            map[key] = [from, to];
        }

        return map;
    }, {});

    var keys = Object.keys(animationMap);

    return new Promise(function (resolve) {
        function animation() {
            var now = Date.now();
            var t = duration > 0 ? (now - start) / duration : 1;

            keys.forEach(function (key) {
                var map = animationMap[key];
                var from = map[0];
                var to = map[1];

                var progress = ease(t, from, to, duration);

                values[key] = lerp(from, to, progress);
            });

            if (t >= 1) {
                keys.forEach(function (key) {
                    return (values[key] = options[key]);
                });
                onUpdate(values, t);
                resolve(values);
            } else {
                onUpdate(values, t);
                requestAnimationFrame(animation);
            }
        }

        animation();
    });
}
