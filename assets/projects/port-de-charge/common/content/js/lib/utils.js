(function(window, document) {
    /* #####################################################################################
	########################################################################################
	################################# PROMISE POLYFILL #####################################
	########################################################################################
	###################################################################################### */

    (function(t) {
        function z() {
            for (var a = 0; a < g.length; a++) g[a][0](g[a][1]);
            g = [];
            m = !1;
        }

        function n(a, b) {
            g.push([a, b]);
            m || ((m = !0), A(z, 0));
        }

        function B(a, b) {
            function c(a) {
                p(b, a);
            }

            function h(a) {
                k(b, a);
            }
            try {
                a(c, h);
            } catch (d) {
                h(d);
            }
        }

        function u(a) {
            var b = a.owner,
                c = b.state_,
                b = b.data_,
                h = a[c];
            a = a.then;
            if ('function' === typeof h) {
                c = l;
                try {
                    b = h(b);
                } catch (d) {
                    k(a, d);
                }
            }
            v(a, b) || (c === l && p(a, b), c === q && k(a, b));
        }

        function v(a, b) {
            var c;
            try {
                if (a === b) throw new TypeError('A promises callback cannot return that same promise.');
                if (b && ('function' === typeof b || 'object' === typeof b)) {
                    var h = b.then;
                    if ('function' === typeof h)
                        return (
                            h.call(
                                b,
                                function(d) {
                                    c || ((c = !0), b !== d ? p(a, d) : w(a, d));
                                },
                                function(b) {
                                    c || ((c = !0), k(a, b));
                                }
                            ),
                            !0
                        );
                }
            } catch (d) {
                return c || k(a, d), !0;
            }
            return !1;
        }

        function p(a, b) {
            (a !== b && v(a, b)) || w(a, b);
        }

        function w(a, b) {
            a.state_ === r && ((a.state_ = x), (a.data_ = b), n(C, a));
        }

        function k(a, b) {
            a.state_ === r && ((a.state_ = x), (a.data_ = b), n(D, a));
        }

        function y(a) {
            var b = a.then_;
            a.then_ = void 0;
            for (a = 0; a < b.length; a++) u(b[a]);
        }

        function C(a) {
            a.state_ = l;
            y(a);
        }

        function D(a) {
            a.state_ = q;
            y(a);
        }

        function e(a) {
            if ('function' !== typeof a) throw new TypeError('Promise constructor takes a function argument');
            if (!1 === this instanceof e) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
            this.then_ = [];
            B(a, this);
        }
        var f = t.Promise,
            s =
                f &&
                'resolve' in f &&
                'reject' in f &&
                'all' in f &&
                'race' in f &&
                (function() {
                    var a;
                    new f(function(b) {
                        a = b;
                    });
                    return 'function' === typeof a;
                })();
        'undefined' !== typeof exports && exports
            ? ((exports.Promise = s ? f : e), (exports.Polyfill = e))
            : 'function' == typeof define && define.amd
            ? define(function() {
                  return s ? f : e;
              })
            : s || (t.Promise = e);
        var r = 'pending',
            x = 'sealed',
            l = 'fulfilled',
            q = 'rejected',
            E = function() {},
            A = 'undefined' !== typeof setImmediate ? setImmediate : setTimeout,
            g = [],
            m;
        e.prototype = {
            constructor: e,
            state_: r,
            then_: null,
            data_: void 0,
            then: function(a, b) {
                var c = { owner: this, then: new this.constructor(E), fulfilled: a, rejected: b };
                this.state_ === l || this.state_ === q ? n(u, c) : this.then_.push(c);
                return c.then;
            },
            catch: function(a) {
                return this.then(null, a);
            },
        };
        e.all = function(a) {
            if ('[object Array]' !== Object.prototype.toString.call(a)) throw new TypeError('You must pass an array to Promise.all().');
            return new this(function(b, c) {
                function h(a) {
                    e++;
                    return function(c) {
                        d[a] = c;
                        --e || b(d);
                    };
                }
                for (var d = [], e = 0, f = 0, g; f < a.length; f++) (g = a[f]) && 'function' === typeof g.then ? g.then(h(f), c) : (d[f] = g);
                e || b(d);
            });
        };
        e.race = function(a) {
            if ('[object Array]' !== Object.prototype.toString.call(a)) throw new TypeError('You must pass an array to Promise.race().');
            return new this(function(b, c) {
                for (var e = 0, d; e < a.length; e++) (d = a[e]) && 'function' === typeof d.then ? d.then(b, c) : b(d);
            });
        };
        e.resolve = function(a) {
            return a && 'object' === typeof a && a.constructor === this
                ? a
                : new this(function(b) {
                      b(a);
                  });
        };
        e.reject = function(a) {
            return new this(function(b, c) {
                c(a);
            });
        };
    })(window);

    ///////////      IE FIX PROMISE SONS       /////////////////
    var playPromise = document.createElement('audio').play();
    if (!playPromise) {
        var originalPlay = HTMLAudioElement.prototype.play;
        HTMLAudioElement.prototype.play = function() {
            var audio = this;
            return new Promise(function(resolve, reject) {
                audio.onplaying = resolve;
                audio.onerror = reject;
                originalPlay.call(audio);
            });
        };
    }
    ////////////////////////////////////////////////////////////

    // Inject polyfill if classList not supported for SVG elements.
    if (!('classList' in SVGElement.prototype)) {
        Object.defineProperty(SVGElement.prototype, 'classList', {
            get: function get() {
                var _this = this;

                return {
                    contains: function contains(className) {
                        return _this.className.baseVal.split(' ').indexOf(className) !== -1;
                    },
                    add: function add(className) {
                        return _this.setAttribute('class', _this.getAttribute('class') + ' ' + className);
                    },
                    remove: function remove(className) {
                        var removedClass = _this.getAttribute('class').replace(new RegExp('(\\s|^)'.concat(className, '(\\s|$)'), 'g'), '$2');

                        if (_this.classList.contains(className)) {
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

    // REQUESTANIMATIONFRAME

    var requestAnimationFrame = (function() {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            }
        );
    })();

    // CANCELANIMATIONFRAME

    var cancelAnimationFrame = (function() {
        return (
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function(id) {
                return window.clearTimeout(id);
            }
        );
    })();

    /**
     * Objet window possèdant la déclaration d'une instance de `ConcepteursUtils` sous 3 noms différents
     *
     * @typedef {Object} Window
     * @property {ConcepteursUtils} concepteurUtils - Instance de ConcepteursUtils
     * @property {ConcepteursUtils} cUtils - Instance de ConcepteursUtils
     * @property {ConcepteursUtils} cUts - Instance de ConcepteursUtils
     * @example
     *
     * // Quelques exemples de l'utilisation de la librairie
     *
     * cUts.t.isString(3);
     * // => false
     * cUts.r.escape("o");
     * // => 'o'
     * cUts.a.clone([1,2,3]);
     * // => [1,2,3]
     * cUts.m.getCurrentTime();
     * // => 195465485
     * cUts.o.assign({},{1,2,3});
     * // => {1,2,3}
     */

    /* #####################################################################################
	########################################################################################
	################################### MAIN UTILS #########################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe de gestion des utils
     * @class
     * @version 1.0.0
     * @property {TypeUtils} type
     * @property {TypeUtils} t
     * @property {RegExpUtils} regex
     * @property {RegExpUtils} r
     * @property {ArrayUtils} array
     * @property {ArrayUtils} a
     * @property {MiscUtils} misc
     * @property {MiscUtils} m
     * @property {ObjectUtils} object
     * @property {ObjectUtils} o
     * @property {NumberUtils} number
     * @property {NumberUtils} n
     * @property {StringUtils} string
     * @property {StringUtils} s
     * @property {DOMUtils} dom
     * @property {DOMUtils} d
     * @property {TrigoUtils} trigo
     * @property {TrigoUtils} tr
     * @property {PointsUtils} point
     * @property {PointsUtils} p
     */

    function ConcepteursUtils() {
        this.version = '1.0.0';
        this.type = this.t = new TypeUtils();
        this.regex = this.r = new RegExpUtils();
        this.array = this.a = new ArrayUtils();
        this.misc = this.m = new MiscUtils();
        this.object = this.o = new ObjectUtils();
        this.number = this.n = new NumberUtils();
        this.string = this.s = new StringUtils();
        this.dom = this.d = new DOMUtils();
        this.trigo = this.tr = new TrigoUtils();
        this.point = this.p = new PointsUtils();
    }

    /* #####################################################################################
	########################################################################################
	###################################### TYPE ############################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe permettant de gérer les types
     * @class
     * @version 1.0.0
     */
    function TypeUtils() {
        this.name = 'Concepteur type utils';
        this.description = 'Utils permettant de gérer la détection des types';
        this.version = '1.0.0';
    }

    /**
     *	Permet de getter n'importe quel type, ne pas utiliser si une autre détection de TypeUtils existe déjà afin d'optimiser les performances
     *	@memberof TypeUtils
     *	@param {*} value - Argument de n'importe quel type
     *	@return {string} - String en miniscule contenant le type correspondant (exemple : string, number, etc...)
     *
     */
    TypeUtils.prototype.getType = function(value) {
        return Object.prototype.toString.call(value).slice(8, -1);
    };

    /**
     *	Permet de savoir si l'argument transmit est un tableau
     *	@memberof TypeUtils
     *	@param {*} value - Argument de n'importe quel type
     *	@return {boolean}
     *
     */
    TypeUtils.prototype.isArray = function(value) {
        return Array.isArray != null ? Array.isArray(value) : this.getType(value) === 'Array';
    };

    /**
     *	Permet de savoir si l'argument transmit est une chaine de caractère
     *	@memberof TypeUtils
     *	@param {*} value - Argument de n'importe quel type
     *	@return {boolean}
     *
     */
    TypeUtils.prototype.isString = function(value) {
        return typeof value === 'string';
    };

    /**
     *	Permet de savoir si l'argument transmit est un objet
     *	@memberof TypeUtils
     *	@param {*} value - Argument de n'importe quel type
     *	@return {boolean}
     *
     */
    TypeUtils.prototype.isObject = function(value) {
        return typeof value === 'object' && this.getType(value) === 'Object';
    };

    /**
     *	Permet de savoir si l'argument transmit est une fonction
     *	@memberof TypeUtils
     *	@param {*} value - Argument de n'importe quel type
     *	@return {boolean}
     *
     */
    TypeUtils.prototype.isFunction = function(value) {
        return typeof value === 'function';
    };

    /**
     *	Permet de savoir si l'argument transmit est un nombre
     *	@memberof TypeUtils
     *	@param {*} value - Argument de n'importe quel type
     *	@return {boolean}
     *
     */
    TypeUtils.prototype.isNumber = function(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    };

    /**
     *	Permet de savoir si l'argument transmit est une regex
     *	@memberof TypeUtils
     *	@param {*} value - Argument de n'importe quel type
     *	@return {boolean}
     *
     */
    TypeUtils.prototype.isRegExp = function(value) {
        return value instanceof RegExp;
    };

    /**
     *	Permet de savoir si l'argument transmit est un booléen
     *	@memberof TypeUtils
     *	@param {*} value - Argument de n'importe quel type
     *	@return {boolean}
     *
     */
    TypeUtils.prototype.isBoolean = function(value) {
        return typeof value === 'boolean';
    };

    /* #####################################################################################
	########################################################################################
	###################################### MISC ############################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe contenant les outils divers
     * @class
     * @version 1.0.0
     */
    function MiscUtils() {
        this.name = 'Concepteur misc utils';
        this.description = 'Utils ayant des fonctions diverses';
        this.version = '1.0.0';
    }

    /**
     *	Permet de savoir si on est sur mobile ou non
     *	@memberof MiscUtils
     *	@return {boolean}
     *
     */
    MiscUtils.prototype.onMobile = function() {
        return /android|touch|ip[ao]d|mobi(?:le)?|blackberry|webos|opera mini|phone/i.test(navigator.userAgent);
    };

    /**
     *	Permet de générer un uuidv4 (exemple : 0f8ed349-8a34-4abf-8116-5927f5e2ef65)
     *	@memberof MiscUtils
     *	@return {string} - Chaine contenant l'UUID
     *
     */
    MiscUtils.prototype.uuidv4 = function() {
        return s() + s() + '-' + s() + '-' + s() + '-' + s() + '-' + s() + s() + s();
    };

    /**
     *  Retourne le temps actuel en millisecondes
     *	@memberof MiscUtils
     *  @returns {Number} Retour du temps en cours
     */
    MiscUtils.prototype.getCurrentTime =
        Date.now ||
        function() {
            return new Date().getTime();
        };

    function s() {
        return (((1 + Math.random()) * 65536) | 0).toString(16).slice(1, 5);
    }

    /* #####################################################################################
	########################################################################################
	###################################### OBJECT ##########################################
	########################################################################################
	###################################################################################### */
    /**
     * Classe contenant les outils de manipulation des objets
     * @class
     * @version 1.0.0
     * @extends TypeUtils
     */
    function ObjectUtils() {
        this.name = 'Concepteur object utils';
        this.description = 'Utils permettant de gérer les objets';
        this.version = '1.0.0';
        this._array = new ArrayUtils();
    }

    ObjectUtils.prototype = Object.create(TypeUtils.prototype);

    /**
     *  Permet de merger n objets dans le premier objet passé en argument
     *	@memberof ObjectUtils
     *	@param {object} objetSource - Objet source
     *	@param {...object} arguments - Objets passées en arguments
     *  @returns {object} Retour de l'objet mergé
     */
    ObjectUtils.prototype.assign = function() {
        if (!Object.assign) {
            return function assign(target) {
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }

                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }

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
            }.apply(Object, arguments);
        } else {
            return Object.assign.apply(Object, arguments);
        }
    };

    /**
     *  Permet de merger un objet dans l'objet source en profondeur (si par exemple l'objet possède des propriétés étant elles même des objets)
     *	@memberof ObjectUtils
     *	@param {object} target - Objet source
     *	@param {object} source - Objet qui va être mergé au premier
     *  @returns {object} Retour de l'objet mergé
     */
    ObjectUtils.prototype.deepMerge = function(target, source) {
        if (!this.isObject(target) || !this.isObject(source)) {
            var tL = target.length;
            for (var i = 0; i < tL; i++) {
                var tValue = target[i];
                var sValue = source[i];

                if (this.isArray(tValue) && this.isArray(sValue)) {
                    target[i] = this.deepMerge(this._array.clone(tValue), sValue);
                } else if (isObject(tValue) && isObject(sValue)) {
                    target[i] = this.deepMerge(this.assign({}, tValue), sValue);
                } else {
                    target[i] = sValue;
                }
            }
        } else {
            var keys = Object.keys(source);
            var kL = keys.length;
            for (var i = 0; i < kL; i++) {
                var key = keys[i];
                var tValue = target[key];
                var sValue = source[key];

                if (this.isArray(tValue) && this.isArray(sValue)) {
                    target[key] = this.deepMerge(this._array.clone(tValue), sValue);
                } else if (this.isObject(tValue) && this.isObject(sValue)) {
                    target[key] = this.deepMerge(this.assign({}, tValue), sValue);
                } else {
                    target[key] = sValue;
                }
            }
        }

        return target;
    };

    /**
     *  Permet de cloner un objet
     *	@memberof ObjectUtils
     *	@param {object} obj - Objet source
     *  @returns {object} Retour de l'objet cloné
     */
    ObjectUtils.prototype.clone = function(obj) {
        return this.assign({}, obj);
    };

    /**
     *  Permet de parcourir un objet
     *	@memberof ObjectUtils
     *	@param {object} obj - Objet source
     *	@param {ObjectUtils~foreachCallback} fn - fonction de callback
     *  @returns {object} Retour de l'objet source
     */
    ObjectUtils.prototype.forEach = function(obj, fn) {
        if (!this.isObject(obj) || this.isFunction(obj)) {
            return obj;
        }
        var keys = Object.keys(obj);
        var kL = keys.length;
        for (var i = 0; i < kL; i++) {
            var key = keys[i];
            fn(obj[key], key, obj);
        }
        return obj;
    };

    /**
     *  Permet de savoir si l'objet possède la propriété demandé
     *	@memberof ObjectUtils
     *	@param {object} obj - Objet source
     *	@param {string} key - Nom de la propriété
     *  @returns {boolean}
     */
    ObjectUtils.prototype.has = function(obj, key) {
        if (!this.isString(key) || !this.isObject(obj)) {
            return false;
        }
        var got = obj[key] || (obj.prototype != null ? obj.prototype[key] : null);
        return got != null;
    };

    /**
     *  Permet d'échanger les propriétés et les valeurs de l'objet (n'effectue l'echange que si la valeur est un number ou un string)
     *	@memberof ObjectUtils
     *	@param {object} obj - Objet source
     *  @returns {Object} Objet avec les propriétés echangées
     */
    ObjectUtils.prototype.swap = function(obj) {
        if (!this.isObject(obj)) {
            return obj;
        }
        var ret = {};

        var keys = Object.keys(obj);
        var kL = keys.length;
        for (var i = 0; i < kL; i++) {
            var key = keys[i];
            var value = obj[key];
            if (this.isString(value) || this.isNumber(value)) {
                ret[value] = key;
            } else {
                ret[key] = value;
            }
        }

        return ret;
    };

    /**
     *  Permet de supprimer une propriété de l'objet
     *	@memberof ObjectUtils
     *	@param {object} obj - Objet source
     *	@param {object} sKey - Nom de la propriété
     *  @returns {Object} Objet avec la propriétés supprimées
     */
    ObjectUtils.prototype.remove = function(obj, sKey) {
        if (!this.isString(sKey) || !this.isObject(obj)) {
            return false;
        }

        delete obj[sKey];

        return obj;
    };

    /**
     *  Permet de récupérer la taille de l'objet
     *	@memberof ObjectUtils
     *	@param {object} obj - Objet source
     *  @returns {Number} Taille de l'objet
     */
    ObjectUtils.prototype.size = function(obj) {
        if (!this.isObject(obj)) {
            return 0;
        }
        var keys = Object.keys(obj);
        return keys.length;
    };

    /**
     *  Permet de récupérer un tableau avec les valeurs de chaque propriétés de l'objet
     *	@memberof ObjectUtils
     *	@param {object} obj - Objet source
     *  @returns {number[]} Valeurs de l'objet
     */
    ObjectUtils.prototype.values = function(obj) {
        if (!this.isObject(obj)) {
            return [];
        }
        var values = [];
        var keys = Object.keys(obj);
        var kL = keys.length;

        for (var i = 0; i < kL; i++) {
            var key = keys[i];
            values.push(obj[key]);
        }

        return values;
    };

    /**
     * Callback appellé au forEach de ObjectUtils
     * @callback ObjectUtils~foreachCallback
     * @param {*} value - Valeur de la propriété parcourue
     * @param {string} key - Nom de la propriété parcourue
     * @param {object} objet - objet source
     */

    /* #####################################################################################
	########################################################################################
	####################################### DOM ############################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe contenant les outils de manipulation des éléments DOM (https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model)
     * @class
     * @version 1.0.0
     * @extends TypeUtils
     */
    function DOMUtils() {
        this.name = 'Concepteur DOM utils';
        this.description = 'Utils permettant de gérer les élément DOM';
        this.version = '1.0.0';
        this._array = new ArrayUtils();
        this._misc = new MiscUtils();
        this._obj = new ObjectUtils();
        this.computerEvents = ['mousedown', 'mouseup', 'mousemove', 'contextmenu', 'click', 'clicknomove'];
        this.mobileEvents = ['touchstart', 'touchend', 'touchmove'];
        this.eventSwapTable = {
            mousedown: 'touchstart',
            mouseup: 'touchend',
            mousemove: 'touchmove',
            contextmenu: 'touchend',
            click: /*'touchend'*/ 'click',
            clicknomove: /*'touchend'*/ 'clicknomove',
            touchstart: 'mousedown',
            touchend: 'mouseup',
            touchmove: 'mousemove',
        };
    }

    DOMUtils.prototype = Object.create(TypeUtils.prototype);

    /**
     *  Permet de récupérer les éléments DOM selon un selecteur
     *	@memberof DOMUtils
     *	@param {string} selector - selecteur (exemple : #ecran_1 (pour un id), .ecran (pour une classe), etc..)
     *	@param {DOMUtils~getElementsCallback} fn - callback de l'élément ou des élément trouvés
     *	@param {HTMLDocument|HTMLElement} doc - document ou element DOM servant de parent
     *  @returns {HTMLElement[]} Les élément trouvés dans un tableau
     */
    DOMUtils.prototype.getElements = function(selector, fn, doc) {
        if (doc == null) {
            doc = document;
        }

        var matches = this._array.from(doc.querySelectorAll(selector));

        if (matches == null) {
            return [];
        }

        var mL = matches.length;

        if (this.isFunction(fn)) {
            for (var i = 0; i < mL; i++) {
                if (matches[i] != null) {
                    fn(matches[i], i, matches);
                }
            }
        }
        return matches;
    };

    /**
     *  Permet de récupérer l'élément DOM selon un selecteur
     *	@memberof DOMUtils
     *	@param {string} selector - selecteur (exemple : #ecran_1 (pour un id), .ecran (pour une classe), etc..)
     *	@param {DOMUtils~getElementCallback} fn - callback de l'élément ou des élément trouvés
     *	@param {HTMLDocument|HTMLElement} doc - document ou element DOM servant de parent
     *  @returns {HTMLElement} L'élément trouvé
     */
    DOMUtils.prototype.getElement = function(selector, fn, doc) {
        if (doc == null) {
            doc = document;
        }

        var match = doc.querySelector(selector);

        if (this.isFunction(fn)) {
            if (match != null) {
                fn(match);
            }
        }
        return match;
    };

    /**
     *  Permet de supprimer un élément DOM
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément à supprimer
     *  @returns {boolean} true indique une suppression réussi, false une supression échouée
     */
    DOMUtils.prototype.remove = function(el) {
        if (el == null) {
            return false;
        }
        var parent = el.parentNode;

        if (parent == null) {
            return false;
        }

        parent.removeChild(el);

        return true;
    };

    /**
     *  Permet d'insérer un élément après l'élément de référence
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément à insérer
     *	@param {HTMLElement} refNode - Élément de référence
     *  @returns {boolean} true indique qu'une insertion est réussie, false une insertion échouée
     */
    DOMUtils.prototype.insertAfter = function(el, refNode) {
        if (refNode == null) {
            return false;
        }
        var parent = refNode.parentNode;

        if (parent == null) {
            return false;
        }

        var next = refNode.nextSibling;

        if (next == null) {
            parent.appendChild(el);
        } else {
            parent.insertBefore(el, next);
        }

        return true;
    };

    /**
     *  Permet d'insérer un élément avant l'élément de référence
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément à insérer
     *	@param {HTMLElement} refNode - Élément de référence
     *  @returns {boolean} true indique qu'une insertion est réussie, false une insertion échouée
     */
    DOMUtils.prototype.insertBefore = function(el, refNode) {
        if (refNode == null) {
            return false;
        }
        var parent = refNode.parentNode;

        if (parent == null) {
            return false;
        }

        parent.insertBefore(el, refNode);

        return true;
    };

    /**
     *  Permet d'insérer un élément dans l'élément de référence après tous ses enfants
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément à insérer
     *	@param {HTMLElement} refNode - Élément de référence
     *  @returns {boolean} true indique qu'une insertion est réussie, false une insertion échouée
     */
    DOMUtils.prototype.append = function(el, refNode) {
        if (refNode == null) {
            return false;
        }

        refNode.appendChild(el);

        return true;
    };

    /**
     *  Permet d'insérer un élément dans l'élément de référence avant tous ses enfants
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément à insérer
     *	@param {HTMLElement} refNode - Élément de référence
     *  @returns {boolean} true indique qu'une insertion est réussie, false une insertion échouée
     */
    DOMUtils.prototype.prepend = function(el, refNode) {
        if (refNode == null) {
            return false;
        }
        var firstChild = refNode.childNodes[0];

        if (firstChild == null) {
            refNode.appendChild(el);
        } else {
            refNode.insertBefore(el, firstChild);
        }

        return true;
    };

    /**
     *  Permet de vérifier si l'élément possède la classe ou les classes demandées
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément a inspecter
     *	@param {string|string[]} classN - nom de la classe ou des classes
     *  @returns {boolean} true indique que l'élément possède la ou les classes demandées, false qu'une classe est manquante
     */
    DOMUtils.prototype.hasClass = function(el, classN) {
        if (el == null) {
            return false;
        }

        var ret = true;

        function classExist(className) {
            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        }

        if (this.isArray(classN)) {
            var classNL = classN.length;
            for (var i = 0; i < classNL; i++) {
                var value = classN[i];
                if (!this.isString(value) || !classExist(value)) {
                    return false;
                }
            }
        } else if (this.isString(classN)) {
            ret = classExist(classN);
        } else {
            ret = false;
        }

        return ret;
    };

    /**
     *  Permet d'ajouter à l'élément la classe ou les classes demandées
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément cible
     *	@param {string|string[]} classN - nom de la classe ou des classes
     *  @returns {boolean} true indique que la ou les classes demandées ont été ajoutées, false que ce n'est pas le cas
     */
    DOMUtils.prototype.addClass = function(el, classN) {
        if (el == null) {
            return false;
        }

        var self = this;

        function add(className) {
            if (self.hasClass(el, className)) {
                return false;
            }
            if (el.classList) {
                el.classList.add(className);
            } else {
                if (el.className == null) {
                    el.className = '';
                }
                var space = el.className != '' ? ' ' : '';
                el.className += space + className;
            }
        }

        if (this.isArray(classN)) {
            var classNL = classN.length;
            for (var i = 0; i < classNL; i++) {
                var value = classN[i];
                if (!this.isString(value)) {
                    continue;
                }
                add(value);
            }
        } else if (this.isString(classN)) {
            add(classN);
        }

        return true;
    };

    /**
     *  Permet de supprimer à l'élément la classe ou les classes demandées
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément cible
     *	@param {string|string[]} classN - nom de la classe ou des classes
     *  @returns {boolean} true indique que la ou les classes demandées ont été supprimées, false que ce n'est pas le cas
     */
    DOMUtils.prototype.removeClass = function(el, classN) {
        if (el == null) {
            return false;
        }
        var self = this;

        function remove(className) {
            if (!self.hasClass(el, className)) {
                return false;
            }

            if (el.classList) {
                el.classList.remove(className);
            } else {
                el.className = el.className.replace(new RegExp('(?:\\s+|^)' + className + '(?:\\s+|$)', 'g'), ' ').trim();
            }
        }

        if (this.isArray(classN)) {
            var classNL = classN.length;
            for (var i = 0; i < classNL; i++) {
                var value = classN[i];
                if (!this.isString(value)) {
                    continue;
                }
                remove(value);
            }
        } else if (this.isString(classN)) {
            remove(classN);
        }

        return true;
    };

    function setVendor(element, property, value) {
        var prop = property[0].toUpperCase() + property.slice(1);
        element.style[property] = value;
        element.style['webkit' + prop] = value;
        element.style['moz' + prop] = value;
        element.style['ms' + prop] = value;
        element.style['o' + prop] = value;
    }

    /**
     *  Permet d'ajouter à l'élément cible les styles demandés
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément cible
     *	@param {Object} styles - Objet contenant les styles à appliquer
     *  @returns {boolean} true indique que les styles ont été appliqués, false que ce n'est pas le cas
     */
    DOMUtils.prototype.css = function(el, styles) {
        if (el == null || !this.isObject(styles)) {
            return false;
        }

        var keys = Object.keys(styles);
        var kL = keys.length;

        for (var i = 0; i < kL; i++) {
            var key = keys[i];
            var property = styles[key];
            if (el.style == null) {
                return false;
            }
            setVendor(el, key, property);
        }

        return true;
    };

    DOMUtils.prototype.swapEvType = function(type) {
        if (!this.isString(type)) {
            return false;
        }

        if (this._misc.onMobile()) {
            if (this.computerEvents.indexOf(type) != -1) {
                return this.eventSwapTable[type];
            }
        } else {
            if (this.mobileEvents.indexOf(type) != -1) {
                return this.eventSwapTable[type];
            }
        }

        return type;
    };

    function clickStart() {
        this.clicked = true;
        if (this.clicknomove) {
            this.eventUtils.addEvent(this, 'mousemove', clickMove);
        }
        this.eventUtils.addEvent(this, 'mouseup', clickEnd);
    }

    function clickEnd(e) {
        if (e.type == 'click') {
            this.clicked = true;
        }

        if (this.clicknomove) {
            this.eventUtils.removeEvent(this, 'mousemove', clickMove);
        }

        this.eventUtils.removeEvent(this, 'mouseup', clickEnd);

        if (this.clicked) {
            this.clickHand(e);
        }
    }

    function clickMove() {
        this.clicked = false;

        this.eventUtils.removeEvent(this, 'mousemove', clickMove);
        this.eventUtils.removeEvent(this, 'mouseup', clickEnd);
    }
    /**
     *  Permet d'ajouter à l'élément cible un event. En cas d'un callback anonyme alors un objet contenant l'id requis pour supprimer l'event de l'élément sera retourné
     *  Si l'utilisateur est sur mobile et que le type de l'event est mousedown avec ce sera automatiquement convertit en touchstart, fonctionnel pour l'event "click"
     *	l'event clicknomove est disponible, il rempli la même fonction que le click mais en prenant en compte si l'utilisateur a bougé ou non (ce qui annule le click).
     *
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément cible
     *	@param {string} type - type de l'event demandé
     *	@param {function} handler - fonction en callback de l'application de l'event
     *	@param {boolean} anonHandler - si la fonction est anonyme ou non
     *	@param {boolean} attachSuffix - permet d'ajouter le suffixe on devant le type de l'event ou non, est à true par défaut
     *  @returns {boolean|object} retourne un boolean si il n'y a pas de fonction anonyme correspondant au succès de l'application de l'event, sinon retour l'objet contenant l'id de la fonction anonyme
     */
    DOMUtils.prototype.addEvent = function(el, type, handler, anonHandler, attachSuffix) {
        if (el == null) {
            return false;
        }

        type = this.swapEvType(type);

        var aSuffix = attachSuffix !== false ? 'on' : '';

        if (type == 'click' || type == 'clicknomove') {
            el.eventUtils = this;
            el.clickHand = handler;
            el.clicknomove = type == 'clicknomove';
            this.addEvent(el, 'mousedown', clickStart);
        } else {
            if (!el.addEventListener) {
                type = aSuffix + type;
                el.attachEvent(type, handler);
            } else {
                el.addEventListener(type, handler);
            }
        }

        if (anonHandler != null && anonHandler === true) {
            var storeHandler = { id: this._misc.uuidv4() + '_' + this._misc.getCurrentTime(), handler: handler, event: type };
            if (window.storedHandler == null) {
                window.storedHandler = [];
            }
            window.storedHandler.push(storeHandler);
            return storeHandler;
        }
        return true;
    };

    /**
     *  Permet de supprimer à l'élément cible un event. Dans le cas ou la fonction était anonyme à la déclaration de l'event, seul le passage de l'argument anonId est requis
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément cible
     *	@param {string} type - type de l'event demandé
     *	@param {function} handler - fonction de callback ayant été utilisé pour déclarer l'event
     *	@param {string} anonId - si la fonction d'ajout était anonyme alors passer l'id de la fonction anonyme ici
     *	@param {boolean} attachSuffix - permet d'ajouter le suffixe on devant le type de l'event ou non, est à true par défaut
     *  @returns {boolean} retourne true si l'event a bien été supprimé sinon retourne false
     */
    DOMUtils.prototype.removeEvent = function(el, type, handler, anonId, attachSuffix) {
        if (el == null) {
            return false;
        }

        type = this.swapEvType(type);

        var aSuffix = attachSuffix !== false ? 'on' : '';

        if (anonId != null && this.isString(anonId)) {
            if (window.storedHandler == null) {
                return false;
            }
            var stored = null, indexStored = null;
            var storedHandlerLength = window.storedHandler.length;

            for (var i = 0; i < storedHandlerLength; i++) {
                if (window.storedHandler[i].id === anonId) {
                    indexStored = i;
                    stored = window.storedHandler[i];
                }
            }

            if (stored != null) {
                type = stored.event;
                handler = stored.handler;
                window.storedHandler.splice(indexStored,1);
            } else {
                return false;
            }
        }

        if (type == 'click') {
            this.removeEvent(el, 'mousedown', clickStart);
            el.eventUtils = null;
            el.clickHand = null;
            el.clicknomove = null;
        } else {
            if (!el.removeEventListener) {
                type = aSuffix + type;
                el.detachEvent(type, handler);
            } else {
                el.removeEventListener(type, handler);
            }
        }

        return true;
    };

    /**
     *  Permet de transmettre un événement avec le type souhaité à l'élément cible
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - Élément cible
     *	@param {string} type - type de l'event a transmettre
     *  @returns {boolean} retourne true si l'event a bien été transmis sinon retourne false
     */
    DOMUtils.prototype.trigger = function(el, type) {
        if (el == null) {
            return false;
        }

        type = this.swapEvType(type);

        if ('createEvent' in document) {
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        } else {
            var e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }

        return true;
    };

    /**
     *  Permet de récupérer la transform value sous forme d'objet (exemple : "scale(1) translateX(-600)")
     *	@memberof DOMUtils
     *	@param {string} tranform - tranform de base
     *  @returns {object} les transformations sous forme d'objet
     */
    DOMUtils.prototype.getTransformValue = function(tranform) {
        if (tranform == null || tranform == '') {
            return {};
        }

        var propertyList = tranform.split(' ');
        var ret = {};

        for (var i = 0, pL = propertyList.length; i < pL; i++) {
            var value = propertyList[i];
            propertyList[i] = value.split('(');
            value = propertyList[i];
            propertyList[i][1] = propertyList[i][1].replace(')', '').split(', ');
            ret[propertyList[i][0]] = propertyList[i][1];
        }
        return ret;
    };

    /**
     *  Permet de transformer un objet contenant des transforme value en chaine css
     *	@memberof DOMUtils
     *	@param {object} values - tranform values
     *  @returns {string} objet de transform value convertit en chaine css pour la propriété transform
     */
    DOMUtils.prototype.setTransformValue = function(values) {
        if (!this.isObject(values)) {
            return '';
        }

        var ret = [];
        var keys = Object.keys(values);
        var kL = keys.length;

        for (var i = 0; i < kL; i++) {
            var key = keys[i];
            var value = values[key];
            var joinValues = value.join(', ');
            var prop = key + '(' + joinValues + ')';
            if (joinValues.length != 0) {
                ret.push(prop);
            }
        }

        return ret.join(' ');
    };

    /**
     *  Permet de récuperer les transform value d'un élément dans un objet
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - élément cible
     *  @returns {object}  les transformations sous forme d'objet
     */
    DOMUtils.prototype.getTransform = function(el) {
        if (el == null) {
            return false;
        }

        var transform = el.style.transform;

        return this.getTransformValue(transform);
    };

    /**
     *  Permet d'assigner des valeurs de transformation à l'élément
     *	@memberof DOMUtils
     *	@param {HTMLElement} el - élément cible
     *	@param {object} values - valeur de transformation
     *  @returns {string}  retourne le transform appliqué à l'élément
     */
    DOMUtils.prototype.setTransform = function(el, values) {
        if (el == null || !this.isObject(values)) {
            return false;
        }

        var transform = this.setTransformValue(this._obj.assign(this.getTransform(el), values));

        el.style.transform = transform;

        return transform;
    };

    /**
     *  Permet de charger un script JS
     *	@memberof DOMUtils
     *	@param {string} url - url cible
     *  @returns {Promise}  retourne une promise concernant le chargement du script
     */
    DOMUtils.prototype.loadScript = function(url) {
        if (!this.isString(url) || url == '') {
            return Promise.reject('Bad URL.');
        }
        var head = document.getElementsByTagName('head');

        if (head == null) {
            return Promise.reject('No Head.');
        }
        head = head[0];

        var headChildren = this._array.from(head.children);
        var hCL = headChildren.length;

        for (var i = 0; i < hCL; i++) {
            var headChild = headChildren[i];
            if (headChild.src == null) {
                continue;
            }
            if (headChild.src.indexOf(url) != -1) {
                return Promise.reject('Already exist.');
            }
        }

        var script = document.createElement('script');
        var self = this;
        script.type = 'text/javascript';
        script.src = url;

        var scriptProm = new Promise(function(resolve, reject) {
            script.onload = function() {
                resolve();
            };
            script.onerror = function() {
                self.remove(this);
                reject('Error while loading file');
            };
        });

        head.appendChild(script);

        return scriptProm;
    };

    /**
     *  Permet de detecter si l'audio est jouable ou si il manque une interaction pour lire l'audio
     *	@memberof DOMUtils
     *  @returns {Promise}  retourne une promise remontant l'etat de l'audio, then signifie que l'audio est jouable et catch qu'il ne l'est pas
     */
    DOMUtils.prototype.audioIsAllowedToPlay = function() {
        var elem = document.createElement('audio');

        return new Promise(function(resolve, reject) {
            function play() {
                elem.play()
                    .then(function() {
                        resolve();
                        document.body.removeChild(elem);
                    })
                    .catch(function(err) {
                        reject(err);
                        document.body.removeChild(elem);
                    });
            }
            elem.autoplay = true;
            elem.preload = 'auto';

            elem.src =
                'data:audio/mpeg;base64,SUQzAwAAAAAAFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/83BQAAAAAS4AAAAAAKgCXKwAAAD+AAC0BLEAABKaAABU/////////////////////////////////////////////////////////////////////gAA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zcFCUBmABLgAAAAAAqAJcrAAAAP/////////////////////////////////////////////////////////////////////////////////////+AAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NwUP8TwAEuAAAAAACoAlysAAAA//////////////////////////////////////////////////////////////////////////////////////4AAP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////83BQ/xPAAS4AAAAAAKgCXKwAAAD//////////////////////////////////////////////////////////////////////////////////////gAA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zcFD/E8ABLgAAAAAAqAJcrAAAAP/////////////////////////////////////////////////////////////////////////////////////+AAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NwUP8TwAEuAAAAAACoAlysAAAA//////////////////////////////////////////////////////////////////////////////////////4AAP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////83BQ/xPAAS4AAAAAAKgCXKwAAAD//////////////////////////////////////////////////////////////////////////////////////gAA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zcFD/E8ABLgAAAAAAqAJcrAAAAP/////////////////////////////////////////////////////////////////////////////////////+AAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NwUP8TwAEuAAAAAACoAlysAAAA//////////////////////////////////////////////////////////////////////////////////////4AAP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////83BQ/xPAAS4AAAAAAKgCXKwAAAD//////////////////////////////////////////////////////////////////////////////////////gAA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zcFD/E8ABLgAAAAAAqAJcrAAAAP/////////////////////////////////////////////////////////////////////////////////////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NwUP8TwAEuAAAAAACoAlysAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

            document.body.appendChild(elem);
            elem.load();

            if (elem.readyState >= 1) {
                play();
            } else {
                elem.addEventListener('canplaythrough', function(e) {
                    play();
                });
            }
        });
    };
    /**
     * Callback appellé lors du parcours des éléments de getElements
     * @callback DOMUtils~getElementsCallback
     * @param {HTMLElement} value - retourne l'élément trouvé en cours
     * @param {number} key - retourne l'index de l'élément trouvé
     * @param {HTMLElement[]} matches - retourne les éléments trouvés
     */

    /**
     * Callback appellé lors de la recherche de l'élément via getElement
     * @callback DOMUtils~getElementCallback
     * @param {HTMLElement} match - retourne l'élément trouvé
     */
    /* #####################################################################################
	########################################################################################
	###################################### ARRAY ##########################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe contenant les outils de manipulation des tableaux
     * @class
     * @version 1.0.0
     * @extends TypeUtils
     */
    function ArrayUtils() {
        this.name = 'Concepteur array utils';
        this.description = 'Utils permettant de gérer les tableaux';
        this.version = '1.0.0';
    }

    ArrayUtils.prototype = Object.create(TypeUtils.prototype);

    /**
     *  Permet de cloner un tableau
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *  @returns {array}  retourne une copie du tableau
     */
    ArrayUtils.prototype.clone = function(arr) {
        if (!this.isArray(arr)) {
            return [];
        }
        var ret = [];
        for (var i = 0, aL = arr.length; i < aL; i++) {
            ret[i] = arr[i];
        }
        return ret;
    };

    /**
     *  Permet de purger un tableau en supprimant les valeurs vides, null, ou NaN (ne purge pas les valeurs empty)
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *  @returns {array}  retourne le tableau purgé
     */
    ArrayUtils.prototype.purge = function(arr) {
        if (!this.isArray(arr)) {
            return [];
        }
        var self = this;
        return arr.filter(function(v) {
            return v != null && (self.getType(v) == 'Number' ? !isNaN(v) : true) && v !== '';
        });
    };

    /**
     *  Permet de compter combien de fois une valeur fait son apparition dans le tableau
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *	@param {string|number} valueToCount - valeur
     *  @returns {number}  retourne nombre de valeur trouvées
     */
    ArrayUtils.prototype.count = function(arr, valueToCount) {
        if (!this.isArray(arr)) {
            return [];
        }

        var counts = {};

        for (var i = 0; i < arr.length; i++) {
            var num = arr[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        return counts[valueToCount] || 0;
    };

    /**
     *  Permet de transformer une valeur d'un autre type en tableau
     *	@memberof ArrayUtils
     *	@param {*} value - valeur à convertir
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.from = function(value) {
        if (!Array.from) {
            return (function(object) {
                var slice = [].slice != null ? [].slice : Array.prototype.slice;
                return object == null ? [] : slice.call(object);
            })(value);
        } else {
            return value == null ? [] : Array.from(value);
        }
    };

    /**
     *  Permet l'ajout d'une ou plusieurs valeurs à un index donné (ou en bout de tableau si il n'y a pas d'index indiqué)
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *	@param {*|*[]} valueToAdd - valeur(s) à ajouter
     *	@param {number} index - index de l'insertion
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.add = function(arr, valueToAdd, index) {
        if (this.isArray(arr)) {
            arr = [];
        }
        var ret = [];
        var aL = arr.length;

        if (index != null && this.isNumber(index) && index < aL) {
            var countAdd = 0;
            for (var i = 0; i < aL; i++) {
                if (i == index) {
                    if (this.isArray(valueToAdd)) {
                        for (var j = 0, vL = valueToAdd.length; j < vL; j++) {
                            ret.push(valueToAdd[j]);
                            countAdd++;
                        }
                    } else {
                        ret.push(valueToAdd);
                        countAdd++;
                    }
                    ret.push(arr[i]);
                } else {
                    ret[i + countAdd] = arr[i];
                }
            }
        } else {
            ret = this.clone(arr);
            if (this.isArray(valueToAdd)) {
                for (var k = 0, vL2 = valueToAdd.length; k < vL2; k++) {
                    ret.push(valueToAdd[k]);
                }
            } else {
                ret.push(valueToAdd);
            }
        }

        return ret;
    };

    /**
     *  Retourne le tableau donné avec les duplicatas supprimés
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.uniq = function(arr) {
        if (!this.isArray(arr)) {
            return [];
        }
        return arr.filter(function(value, index, self) {
            return self.indexOf(value) === index;
        });
    };

    /**
     *  Retourne un tableau avec uniquement les valeurs communes des deux tableaux
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *	@param {array} arr2 - tableau a comparer
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.intersect = function(arr, arr2) {
        var ret = [];
        if (!this.isArray(arr) || !this.isArray(arr2)) {
            return ret;
        }
        for (var i = 0, arrL = arr.length; i < arrL; i++) {
            if (arr2.indexOf(arr[i]) > -1) {
                ret.push(arr[i]);
            }
        }
        return this.uniq(ret);
    };

    /**
     *  Retourne un tableau avec uniquement les valeurs non communes des deux tableaux
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *	@param {array} arr2 - tableau a comparer
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.diff = function(arr, arr2) {
        if (!this.isArray(arr) || !this.isArray(arr2)) {
            return [];
        }
        return this.uniq(
            arr.filter(function(v) {
                return arr2.indexOf(v) == -1;
            })
        );
    };

    /**
     *  Retourne un tableau avec les deux tableau fusionnés sans doublons
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *	@param {array} arr2 - tableau a comparer
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.union = function(arr, arr2) {
        if (!this.isArray(arr) || !this.isArray(arr2)) {
            return [];
        }
        return this.uniq(arr.concat(arr2));
    };

    /**
     *  Retourne un tableau mélangé en fonction du tableau donné
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.shuffle = function(arr) {
        if (!this.isArray(arr)) {
            return [];
        }
        var ret = this.clone(arr);

        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * i);
            var temp = ret[i];
            ret[i] = ret[j];
            ret[j] = temp;
        }
        return ret;
    };

    /**
     *  Retourne la plus grande valeur présente dans le tableau, si un string ou un array est présent dans le tableau sa length sera prise pour valeur, les valeurs d'un autre type sans propriété length son ignorés
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.max = function(arr) {
        if (!this.isArray(arr)) {
            return [];
        }

        var max = -Infinity;

        for (var i = 0, aL = arr.length; i < aL; i++) {
            var n = Number(arr[i]);

            if (this.isNumber(arr[i]) || !isNaN(n)) {
                if (n > max) {
                    max = n;
                }
            } else if (arr[i].length != null) {
                if (arr[i].length > max) {
                    max = arr[i].length;
                }
            }
        }

        return max;
    };

    /**
     *  Retourne la plus petite valeur présente dans le tableau, si un string ou un array est présent dans le tableau sa length sera prise pour valeur, les valeurs d'un autre type sans propriété length son ignorés
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.min = function(arr) {
        if (!this.isArray(arr)) {
            return [];
        }

        var min = +Infinity;

        for (var i = 0, aL = arr.length; i < aL; i++) {
            var n = Number(arr[i]);

            if (this.isNumber(arr[i]) || !isNaN(n)) {
                if (n < min) {
                    min = n;
                }
            } else if (arr[i].length != null) {
                if (arr[i].length < min) {
                    min = arr[i].length;
                }
            }
        }

        return min;
    };

    /**
     *  Permet de remplir le tableau https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/fill
     *	@memberof ArrayUtils
     *	@param {array} arr - tableau cible
     *	@param {*} value - Valeur avec laquelle remplir le tableau.
     *	@param {number} start - Index de début, la valeur par défaut est 0. (facultatif)
     *	@param {number} end - Index de fin, la valeur par défaut est this.length. (facultatif)
     *  @returns {array}  retourne le resultat
     */
    ArrayUtils.prototype.fill = function(arr, value, start, end) {
        if (!this.isArray(arr)) {
            return [];
        }
        if (!Array.prototype.fill) {
            return (function(arr, value) {
                var O = Object(arr);
                var len = O.length >>> 0;
                var start = arguments[2];
                var relativeStart = start >> 0;
                var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
                var end = arguments[3];
                var relativeEnd = end === undefined ? len : end >> 0;
                var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

                while (k < final) {
                    O[k] = value;
                    k++;
                }

                return O;
            })(arr, value, start, end);
        } else {
            return arr.fill(value);
        }
    };

    /* #####################################################################################
	########################################################################################
	###################################### REGEXP ##########################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe contenant les outils de manipulation des regex
     * @class
     * @version 1.0.0
     * @extends TypeUtils
     */
    function RegExpUtils() {
        this.name = 'Concepteur regex utils';
        this.description = 'Utils permettant de gérer les regex';
        this.version = '1.0.0';
    }

    RegExpUtils.prototype = Object.create(TypeUtils.prototype);

    /**
     *  Permet d'escaper les caractères interpretés dans une regex présent d'une string pour qu'elle puisse devenir une chaine de regex valide (exemple "Ca va ?" devient "Ca va \?")
     *	@memberof RegExpUtils
     *	@param {string} str - string source
     *  @returns {string}  chaine escapée
     */
    RegExpUtils.prototype.escape = function(str) {
        if (!this.isString(str)) return '';
        return str.replace(/([\\\/\'*+?|()\[\]{}.^$-])/g, '\\$1');
    };

    /**
     *  Permet de retourner la regex avec les flags demandés en overridant les autres https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/RegExp#Syntaxe (flags = marqueurs)
     *	@memberof RegExpUtils
     *	@param {regexp} r - regex source
     *	@param {string} flags - string contenant les flags
     *  @returns {regexp} regex modifiée
     */
    RegExpUtils.prototype.setFlags = function(r, flags) {
        return RegExp(r.source, flags);
    };

    /**
     *  Permet d'ajouter les flags demandés à la regex https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/RegExp#Syntaxe (flags = marqueurs)
     *	@memberof RegExpUtils
     *	@param {regexp} r - regex source
     *	@param {string} flags - string contenant les flags
     *  @returns {regexp} regex modifiée
     */
    RegExpUtils.prototype.addFlags = function(r, flags) {
        return RegExp(r.source, getRegExpFlags(r, flags));
    };

    /**
     *  Permet de supprimer les flags demandés à la regex https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/RegExp#Syntaxe (flags = marqueurs)
     *	@memberof RegExpUtils
     *	@param {regexp} r - regex source
     *	@param {string} flags - string contenant les flags
     *  @returns {regexp} regex modifiée
     */
    RegExpUtils.prototype.removeFlags = function(r, flags) {
        var reg = allCharsReg(flags);
        return RegExp(r.source, getRegExpFlags(r).replace(reg, ''));
    };

    /**
     *  Permet de récupérer les flags de la regex https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/RegExp#Syntaxe (flags = marqueurs)
     *	@memberof RegExpUtils
     *	@param {regexp} r - regex source
     *  @returns {string} flags récupérés
     */
    RegExpUtils.prototype.getFlags = function(r) {
        return getRegExpFlags(r);
    };

    function getRegExpFlags(reg, add) {
        var flags = '';
        add = add || '';

        function checkFlag(prop, flag) {
            if (prop || add.indexOf(flag) > -1) {
                flags += flag;
            }
        }

        checkFlag(reg.global, 'g');
        checkFlag(reg.ignoreCase, 'i');
        checkFlag(reg.multiline, 'm');
        checkFlag(reg.sticky, 'y');
        return flags;
    }

    /* #####################################################################################
	########################################################################################
	###################################### Points #########################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe contenant les outils de manipulation des points
     * @class
     * @version 1.0.0
     * @extends TypeUtils
     */
    function PointsUtils() {
        this.name = 'Concepteur points utils';
        this.description = 'Utils permettant de gérer les points';
        this.version = '1.0.0';
        this._trigo = new TrigoUtils();
    }

    PointsUtils.prototype = Object.create(TypeUtils.prototype);

    /**
     *  Permet de detecter si la valeur en argument est un point
     *	@memberof PointsUtils
     *	@param {*} point - valeur source
     */
    PointsUtils.prototype.isPoint = function(point) {
        if (!this.isObject(point)) {
            return false;
        }
        return this.isNumber(point.x) && this.isNumber(point.y);
    };

    /**
     *  Permet de créer un point
     *	@memberof PointsUtils
     *	@param {number} x - Coordonnée en X
     *	@param {number} y - Coordonnée en Y
     *	@return {Point} Retourne un objet de type point
     */
    PointsUtils.prototype.create = function(x, y) {
        if (!this.isNumber(x) || !this.isNumber(y)) {
            return -1;
        }

        return {
            x: x,
            y: y,
        };
    };

    /**
     *  Permet de cloner un point
     *	@memberof PointsUtils
     *	@param {Point} point - Point source
     *	@return {Point} Point cloné
     */
    PointsUtils.prototype.clone = function(point) {
        if (!this.isPoint(a)) {
            return { x: 0, y: 0 };
        }

        return {
            x: point.x,
            y: point.y,
        };
    };

    /**
     *  Permet de calculer la distance entre deux points
     *	@memberof PointsUtils
     *	@param {Point} a - Point 1
     *	@param {Point} b - Point 2
     *	@return {number} retourne la distance entre les deux points
     */
    PointsUtils.prototype.distance = function(a, b) {
        if (!this.isPoint(a) || !this.isPoint(b)) {
            return -1;
        }
        var dX = b.x - a.x;
        var dY = b.y - a.y;
        return Math.sqrt(dX * dX + dY * dY);
    };

    /**
     *  Permet d'effectuer une additon de deux points
     *	@memberof PointsUtils
     *	@param {Point} a - Point 1
     *	@param {Point} b - Point 2
     *	@return {Point} retourne le point final
     */
    PointsUtils.prototype.add = function(a, b) {
        if (!this.isPoint(a) || !this.isPoint(b)) {
            return this.create(0.0, 0.0);
        }
        return this.create(a.x + b.x, a.y + b.y);
    };

    /**
     *  Permet d'effectuer une soustration de deux points
     *	@memberof PointsUtils
     *	@param {Point} a - Point 1
     *	@param {Point} b - Point 2
     *	@return {Point} retourne le point final
     */
    PointsUtils.prototype.subtract = function(a, b) {
        if (!this.isPoint(a) || !this.isPoint(b)) {
            return this.create(0.0, 0.0);
        }
        return this.create(a.x - b.x, a.y - b.y);
    };

    /**
     *  Permet de retourner la taille d'un point
     *	@memberof PointsUtils
     *	@param {Point} point - Point source
     *	@return {number} retourne la taille du point
     */
    PointsUtils.prototype.length = PointsUtils.prototype.magnitude = function(point) {
        return this.distance(point, this.create(0.0, 0.0));
    };

    /**
     *  Permet de calculer l'angle entre 2 points
     *	@memberof PointsUtils
     *	@param {Point} a - Point 1
     *	@param {Point} b - Point 2
     *	@return {number} retourne l'angle entre les 2 points
     */
    PointsUtils.prototype.angle2 = function(a, b) {
        if (!this.isPoint(a) || !this.isPoint(b)) {
            return 0;
        }
        return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    };

    /**
     *  Permet de calculer l'angle entre 3 points
     *	@memberof PointsUtils
     *	@param {Point} a - Point 1
     *	@param {Point} b - Point 2
     *	@param {Point} c - Point 3
     *	@return {number} retourne l'angle entre les 3 points
     */
    PointsUtils.prototype.angle3 = function(a, b, c) {
        if (!this.isPoint(a) || !this.isPoint(b) || !this.isPoint(c)) {
            return 0;
        }

        var a2 = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        var a3 = Math.sqrt(Math.pow(a.x - c.x, 2) + Math.pow(a.y - c.y, 2));
        var b3 = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2));

        return (Math.acos((Math.pow(a2, 2) + Math.pow(a3, 2) - Math.pow(b3, 2)) / (2 * a2 * a3)) * 180) / Math.PI;
    };

    /**
     *  Permet de déplacer un point selon une distance et un angle
     *	@memberof PointsUtils
     *	@param {Point} point - Point source
     *	@param {number} distance - distance à parcourir
     *	@param {number} angle - angle à prendre en compte
     *	@return {Point} retourne le point déplacé
     */
    PointsUtils.prototype.project = function(point, distance, angle) {
        if (!this.isPoint(point)) {
            return this.create(0.0, 0.0);
        }
        var x = point.x + distance * this._trigo.cosDeg(angle);
        var y = point.y + distance * this._trigo.sinDeg(angle);

        return this.create(x, y);
    };

    /**
     *  Permet de faire une rotation d'un point selon un angle en fonction d'un point pivot
     *	@memberof PointsUtils
     *	@param {Point} point - Point source
     *	@param {number} angle - angle à prendre en compte
     *	@param {Point} pivot - point pivot
     *	@return {Point} retourne le point déplacé
     */
    PointsUtils.prototype.rotate = function(point, angle, pivot) {
        var pointPivot = pivot || this.create(0.0, 0.0);
        var pointRel = this.subtract(point, pointPivot);

        var angleCos = this._trigo.cosDeg(angle);
        var angleSin = this._trigo.sinDeg(angle);

        var rotX = pointRel.x * angleCos - pointRel.y * angleSin;
        var rotY = pointRel.x * angleSin + pointRel.y * angleCos;
        var pointRot = this.create(rotX, rotY);

        var pointAbs = this.add(pointRot, pointPivot);

        return pointAbs;
    };

    /**
     * Objet représentant un point
     * @typedef {Object} Point
     * @property {number} x - Coordonnées en X
     * @property {number} y - Coordonnées en Y
     */

    /* #####################################################################################
	########################################################################################
	######################################## TRIGO #########################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe contenant les outils de trigonométrie
     * @class
     * @version 1.0.0
     * @extends TypeUtils
     */
    function TrigoUtils() {
        this.name = 'Concepteur trigo utils';
        this.description = 'Utils permettant de gérer la trigonométrie';
        this.version = '1.0.0';
        this.DEGTORAD = Math.PI / 180.0;
        this.RADTODEG = 180.0 / Math.PI;
    }

    TrigoUtils.prototype = Object.create(TypeUtils.prototype);

    /**
     *  Permet d'effectuer le théorème de pythagore en fonction de deux longueurs
     *	@memberof TrigoUtils
     *	@param {number} a - longueur A
     *	@param {number} b - longueur B
     *	@return {number} retourne la longueur C
     */
    TrigoUtils.prototype.pythagore = function(a, b) {
        if (!this.isNumber(a) || !this.isNumber(b)) {
            return 0;
        }
        return Math.sqrt(a * a + b * b);
    };

    /**
     *  Permet de trouver l'angle d'un
     *	@memberof TrigoUtils
     *	@param {number} a - longueur A
     *	@param {number} b - longueur B
     *	@param {number} c - longueur C
     *	@return {number} retourne l'angle thetha de AB
     */
    TrigoUtils.prototype.solveTriangleAngle = function(a, b, c) {
        if (!this.isNumber(a) || !this.isNumber(b) || !this.isNumber(c)) {
            return 0;
        }
        var temp = (a * a + b * b - c * c) / (2 * a * b);
        if (temp < -1 || temp > 1) {
            return 0;
        }
        return this.acosDeg(temp);
    };

    /**
     *  Permet de retourner l'arc-cosinus en degrés d'une valeur en radian
     *	@memberof TrigoUtils
     *	@param {number} rad - valeur cible
     *	@return {number} retourne l'acos en degrés
     */
    TrigoUtils.prototype.acosDeg = function(rad) {
        return Math.acos(rad) * this.RADTODEG;
    };

    /**
     *  Permet de retourner l'angle d'une coordonnée X et Y en degrés
     *	@memberof TrigoUtils
     *	@param {number} y - valeur cible
     *	@param {number} x - valeur cible
     *	@return {number} retourne l'angle en degrés
     */
    TrigoUtils.prototype.angleDeg = function(y, x) {
        return this.atan2Deg(y, x);
    };

    /**
     *  Permet de retourner l'angle d'une coordonnée X et Y en radian
     *	@memberof TrigoUtils
     *	@param {number} y - valeur cible
     *	@param {number} x - valeur cible
     *	@return {number} retourne l'angle en radian
     */
    TrigoUtils.prototype.angleRad = function(y, x) {
        return Math.atan2(y, x);
    };

    /**
     *  Permet de retourner l'arc-sinus en degrés d'une valeur en radian
     *	@memberof TrigoUtils
     *	@param {number} rad - valeur cible
     *	@return {number} retourne l'asin en degrés
     */
    TrigoUtils.prototype.asinDeg = function(rad) {
        return Math.asin(rad) * this.RADTODEG;
    };

    /**
     *  Permet de retourner l'arc-tangente en degrés d'une valeur en radian
     *	@memberof TrigoUtils
     *	@param {number} rad - valeur cible
     *	@return {number} retourne l'atan en degrés
     */
    TrigoUtils.prototype.atanDeg = function(rad) {
        return Math.atan(rad) * this.RADTODEG;
    };

    /**
     *  Permet de retourner l'arc-tangente2 en degrés de deux coordonnées X et Y
     *	@memberof TrigoUtils
     *	@param {number} y - valeur cible
     *	@param {number} x - valeur cible
     *	@return {number} retourne l'atan2 en degrés
     */
    TrigoUtils.prototype.atan2Deg = function(y, x) {
        return Math.atan2(y, x) * this.RADTODEG;
    };

    /**
     *  Permet de retourner le cosinus en radian d'une valeur en radian
     *	@memberof TrigoUtils
     *	@param {number} deg - valeur cible
     *	@return {number} retourne le cos en radian
     */
    TrigoUtils.prototype.cosDeg = function(deg) {
        return Math.cos(deg * this.DEGTORAD);
    };

    /**
     *  Permet de convertir des degrés en radians
     *	@memberof TrigoUtils
     *	@param {number} deg - valeur cible
     *	@return {number} retourne la valeur en radian
     */
    TrigoUtils.prototype.degToRad = function(deg) {
        return deg * this.DEGTORAD;
    };

    /**
     *  Permet de retourner l'hypothénuse de deux valeurs
     *	@memberof TrigoUtils
     *	@param {number} distanceX - valeur x
     *	@param {number} distanceY - valeur y
     *	@return {number} retourne l'hypothénuse
     */
    TrigoUtils.prototype.hypo = function(distanceX, distanceY) {
        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    };

    /**
     *  Permet de convertir des radians en degrés
     *	@memberof TrigoUtils
     *	@param {number} rad - valeur en radian
     *	@return {number} retourne le resultat en degrés
     */
    TrigoUtils.prototype.radToDeg = function(rad) {
        return rad * this.RADTODEG;
    };

    /**
     *  Permet de retourner le sinus d'une valeur en degrés en radian
     *	@memberof TrigoUtils
     *	@param {number} deg - valeur en degrés
     *	@return {number} retourne le resultat en radian
     */
    TrigoUtils.prototype.sinDeg = function(deg) {
        return Math.sin(deg * this.DEGTORAD);
    };

    /**
     *  Permet de retourner la tangente d'une valeur en degrés en radian
     *	@memberof TrigoUtils
     *	@param {number} deg - valeur en degrés
     *	@return {number} retourne le resultat en radian
     */
    TrigoUtils.prototype.tanDeg = function(deg) {
        return Math.tan(deg * this.DEGTORAD);
    };

    /* #####################################################################################
	########################################################################################
	###################################### NUMBERS #########################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe contenant les outils de manipulation des nombres
     * @class
     * @version 1.0.0
     * @extends TypeUtils
     */
    function NumberUtils() {
        this.name = 'Concepteur number utils';
        this.description = 'Utils permettant de gérer les nombres';
        this.version = '1.0.0';
        this.cToFMFactor = 9 / 5;
        this.cToFFactor = 32;
    }

    NumberUtils.prototype = Object.create(TypeUtils.prototype);

    /**
     * Retourne un nombre entier aléatoire entre `from` et `to` (inclus)
     *
     * @memberOf NumberUtils
     * @param {number} from Valeur minimum
     * @param {number} to Valeur maximum
     * @returns {number} Retourne la valeur aléatoire
     * @example
     *
     * cUts.n.getRandomInt(0,4)
     * // => Int value between 0 and 4
     */

    NumberUtils.prototype.getRandomInt = function(from, to) {
        return this.floor(Math.random() * (to + 1 - from) + from);
    };

    /**
     * Retourne un nombre flottant aléatoire entre `from` et `to` (inclus)
     *
     * @memberOf NumberUtils
     * @param {number} from Valeur minimum
     * @param {number} to Valeur maximum
     * @returns {number} Retourne la valeur aléatoire
     * @example
     *
     * cUts.n.getRandomFloat(0,4)
     * // => float value between 0 and 4
     */

    NumberUtils.prototype.getRandomFloat = function(from, to) {
        return Math.random() * (to - from) + from;
    };

    /**
     * Permet de soumettre un nombre à un minimum `lower` et un maximum `upper`, si le nombre est dans cette range alors il est retourné, si il dépasse le max alors le max est retourné et si il va en dessous du minimum alors le minimum est retourné.
     *
     * @memberOf NumberUtils
     * @param {number} number Le nombre de base.
     * @param {number} lower La valeur minimum.
     * @param {number} upper La valeur maximum.
     * @returns {number} Retourne le nombre final.
     * @example
     *
     * cUts.n.clamp(-10, -5, 5)
     * // => -5
     *
     * cUts.n.clamp(10, -5, 5)
     * // => 5
     *
     * cUts.n.clamp(2, -5, 5)
     * // => 2
     */

    NumberUtils.prototype.clamp = function(number, lower, upper) {
        number = +number;
        lower = +lower;
        upper = +upper;
        lower = lower === lower ? lower : 0;
        upper = upper === upper ? upper : 0;
        if (number === number) {
            number = number <= upper ? number : upper;
            number = number >= lower ? number : lower;
        }
        return number;
    };

    /**
     *  Permet de prendre un nombre et de l'arrondir à l'entier le plus haut
     *	@memberof NumberUtils
     *	@param {number} n - valeur à arrondir
     *	@param {number} precision - degré de précision de la valeur de retour (permet le retour d'un float)
     *	@return {number} retourne le resultat
     */
    NumberUtils.prototype.ceil = createRoundingFunction(Math.ceil);

    /**
     *  Permet de prendre un nombre et de l'arrondir à l'entier le plus proche
     *	@memberof NumberUtils
     *	@param {number} n - valeur à arrondir
     *	@param {number} precision - degré de précision de la valeur de retour (permet le retour d'un float)
     *	@return {number} retourne le resultat
     */
    NumberUtils.prototype.round = createRoundingFunction(Math.round);

    /**
     *  Permet de prendre un nombre et de l'arrondir à l'entier le plus petit
     *	@memberof NumberUtils
     *	@param {number} n - valeur à arrondir
     *	@param {number} precision - degré de précision de la valeur de retour (permet le retour d'un float)
     *	@return {number} retourne le resultat
     */
    NumberUtils.prototype.floor = createRoundingFunction(Math.floor);

    /**
     *  Permet de prendre un nombre et de renvoyer son signe, les nombres négatifs seront à -1 (sauf -0 qui sera à -0), les nombres positifs seront à 1 (sauf 0 qui sera à 0)
     *	@memberof NumberUtils
     *	@param {number} x - valeur à arrondir
     *	@return {number} retourne le resultat
     */
    NumberUtils.prototype.sign = function(x) {
        if (!Math.sign) {
            return (function(x) {
                return (x > 0) - (x < 0) || +x;
            })(x);
        } else {
            return Math.sign(x);
        }
    };

    /**
     *  Permet de prendre un nombre flottant et de renvoyer son nombre entier
     *	@memberof NumberUtils
     *	@param {number} x - valeur à arrondir
     *	@return {number} retourne le resultat
     */
    NumberUtils.prototype.trunc = function(x) {
        if (!Math.trunc) {
            return (function(v) {
                v = +v;
                if (!isFinite(v)) return v;
                return v - (v % 1) || (v < 0 ? -0 : v === 0 ? v : 0);
            })(x);
        } else {
            return Math.trunc(x);
        }
    };

    /**
     *  Permet de prendre un tableau de valeur et de calculer leur moyenne
     *	@memberof NumberUtils
     *	@param {number[]} values - tableau de valeur
     *	@return {number} retourne le resultat
     */
    NumberUtils.prototype.average = function(values) {
        if (!this.isArray(values) || values.length == 0) {
            return -1;
        }

        var sum = 0;
        var vL = values.length;
        for (var i = 0; i < vL; i++) {
            var x = values[i];
            if (!this.isNumber(x)) {
                continue;
            }
            sum += x;
        }

        return sum / vL;
    };

    /**
     *  Permet de retourner la valeur a ou b étant la plus proche du nombre donné (n)
     *	@memberof NumberUtils
     *	@param {number} n - Nombre donné
     *	@param {number | number[]} a - premier nombre, si a est un tableau de nombre alors b sera ignoré
     *	@param {number | null} b - second nombre, b est obligatoire uniquement si a n'est pas un tableau de nombre
     *	@return {number} retourne le resultat
     */
    NumberUtils.prototype.nearest = function(n, a, b) {
        if (!this.isNumber(n) || (!this.isNumber(a) && !this.isArray(a)) || (!this.isNumber(b) && !this.isArray(a))) {
            return -1;
        }
        if (this.isArray(a)) {
            var nearMin = Infinity;
            var nearN = 0;
            var aL = a.length;
            for (var i = 0; i < aL; i++) {
                var calc = Math.abs(n - a[i]);
                if (calc <= nearMin) {
                    nearMin = calc;
                    nearN = a[i];
                }
            }
            return nearN;
        } else {
            return Math.abs(n - a) <= Math.abs(n - b) ? a : b;
        }
    };

    /**
     *  Permet de déterminer si le nombre donné est de type flottant
     *	@memberof NumberUtils
     *	@param {number} n - Nombre donné
     *	@return {boolean} retourne le resultat
     */
    NumberUtils.prototype.isFloat = function(n) {
        if (!this.isNumber(n)) {
            return false;
        }

        return n % 1 !== 0;
    };

    /**
     *  Permet de déterminer si le nombre donné est un nombre premier https://fr.wikipedia.org/wiki/Nombre_premier
     *	@memberof NumberUtils
     *	@param {number} n - Nombre donné
     *	@return {boolean} retourne le resultat
     */
    NumberUtils.prototype.isPrime = function(n) {
        if (n <= 0 || this.isFloat(n)) {
            return false;
        }
        if (n === 1) {
            return false;
        } else if (n === 2) {
            return true;
        } else if (n % 2 === 0) {
            return false;
        }
        for (var i = 3; i * i <= n; i += 2) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    };

    /**
     *  Permet de convertir une température donnée en degrés celcius au degrés Fahrenheit
     *	@memberof NumberUtils
     *	@param {number} v - Nombre donné
     *	@return {number} retourne le resultat
     */
    NumberUtils.prototype.toFahrenheit = function(v) {
        return v * this.cToFMFactor + this.cToFFactor;
    };

    /**
     *  Permet de convertir une température donnée en degrés Fahrenheit au degrés celcius
     *	@memberof NumberUtils
     *	@param {number} v - Nombre donné
     *	@return {number} retourne le resultat
     */
    NumberUtils.prototype.toCelsius = function(v) {
        return (v - this.cToFFactor) / this.cToFMFactor;
    };

    function createRoundingFunction(fn) {
        return function(n, precision) {
            return precision ? withPrecision(n, precision, fn) : fn(n);
        };
    }

    function withPrecision(val, precision, fn) {
        var multiplier = Math.pow(10, Math.abs(precision || 0));
        fn = fn || round;
        if (precision < 0) multiplier = 1 / multiplier;
        return fn(val * multiplier) / multiplier;
    }

    /* #####################################################################################
	########################################################################################
	###################################### STRINGS #########################################
	########################################################################################
	###################################################################################### */

    /**
     * Classe contenant les outils de manipulation des chaines de caractère
     * @class
     * @version 1.0.0
     * @extends TypeUtils
     */
    function StringUtils() {
        this.name = 'Concepteur string utils';
        this.description = 'Utils permettant de gérer les chaînes de caractère';
        this.version = '1.0.0';
        this.reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
        this.reComboMark = /[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]/g;
        this.reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;
        this.reUnescapedHtml = /[&<>"']/g;
        this.reWordNoLatin = /[\w'’\-]/g;
        this.reHasEscapedHtml = RegExp(this.reEscapedHtml.source);
        this.reHasUnescapedHtml = RegExp(this.reUnescapedHtml.source);
        this.reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
        this.reHasRegExpChar = RegExp(this.reRegExpChar.source);
        this.reWords = RegExp(this.reWordNoLatin.source.slice(0, -1) + this.reLatin.source.slice(1) + '+', 'g');
        this.deburredLetters = {
            // Latin-1 Supplement block.
            À: 'A',
            Á: 'A',
            Â: 'A',
            Ã: 'A',
            Ä: 'A',
            Å: 'A',
            à: 'a',
            á: 'a',
            â: 'a',
            ã: 'a',
            ä: 'a',
            å: 'a',
            Ç: 'C',
            ç: 'c',
            Ð: 'D',
            ð: 'd',
            È: 'E',
            É: 'E',
            Ê: 'E',
            Ë: 'E',
            è: 'e',
            é: 'e',
            ê: 'e',
            ë: 'e',
            Ì: 'I',
            Í: 'I',
            Î: 'I',
            Ï: 'I',
            ì: 'i',
            í: 'i',
            î: 'i',
            ï: 'i',
            Ñ: 'N',
            ñ: 'n',
            Ò: 'O',
            Ó: 'O',
            Ô: 'O',
            Õ: 'O',
            Ö: 'O',
            Ø: 'O',
            ò: 'o',
            ó: 'o',
            ô: 'o',
            õ: 'o',
            ö: 'o',
            ø: 'o',
            Ù: 'U',
            Ú: 'U',
            Û: 'U',
            Ü: 'U',
            ù: 'u',
            ú: 'u',
            û: 'u',
            ü: 'u',
            Ý: 'Y',
            ý: 'y',
            ÿ: 'y',
            Æ: 'Ae',
            æ: 'ae',
            Þ: 'Th',
            þ: 'th',
            ß: 'ss',
            // Latin Extended-A block.
            Ā: 'A',
            Ă: 'A',
            Ą: 'A',
            ā: 'a',
            ă: 'a',
            ą: 'a',
            Ć: 'C',
            Ĉ: 'C',
            Ċ: 'C',
            Č: 'C',
            ć: 'c',
            ĉ: 'c',
            ċ: 'c',
            č: 'c',
            Ď: 'D',
            Đ: 'D',
            ď: 'd',
            đ: 'd',
            Ē: 'E',
            Ĕ: 'E',
            Ė: 'E',
            Ę: 'E',
            Ě: 'E',
            ē: 'e',
            ĕ: 'e',
            ė: 'e',
            ę: 'e',
            ě: 'e',
            Ĝ: 'G',
            Ğ: 'G',
            Ġ: 'G',
            Ģ: 'G',
            ĝ: 'g',
            ğ: 'g',
            ġ: 'g',
            ģ: 'g',
            Ĥ: 'H',
            Ħ: 'H',
            ĥ: 'h',
            ħ: 'h',
            Ĩ: 'I',
            Ī: 'I',
            Ĭ: 'I',
            Į: 'I',
            İ: 'I',
            ĩ: 'i',
            ī: 'i',
            ĭ: 'i',
            į: 'i',
            ı: 'i',
            Ĵ: 'J',
            ĵ: 'j',
            Ķ: 'K',
            ķ: 'k',
            ĸ: 'k',
            Ĺ: 'L',
            Ļ: 'L',
            Ľ: 'L',
            Ŀ: 'L',
            Ł: 'L',
            ĺ: 'l',
            ļ: 'l',
            ľ: 'l',
            ŀ: 'l',
            ł: 'l',
            Ń: 'N',
            Ņ: 'N',
            Ň: 'N',
            Ŋ: 'N',
            ń: 'n',
            ņ: 'n',
            ň: 'n',
            ŋ: 'n',
            Ō: 'O',
            Ŏ: 'O',
            Ő: 'O',
            ō: 'o',
            ŏ: 'o',
            ő: 'o',
            Ŕ: 'R',
            Ŗ: 'R',
            Ř: 'R',
            ŕ: 'r',
            ŗ: 'r',
            ř: 'r',
            Ś: 'S',
            Ŝ: 'S',
            Ş: 'S',
            Š: 'S',
            ś: 's',
            ŝ: 's',
            ş: 's',
            š: 's',
            Ţ: 'T',
            Ť: 'T',
            Ŧ: 'T',
            ţ: 't',
            ť: 't',
            ŧ: 't',
            Ũ: 'U',
            Ū: 'U',
            Ŭ: 'U',
            Ů: 'U',
            Ű: 'U',
            Ų: 'U',
            ũ: 'u',
            ū: 'u',
            ŭ: 'u',
            ů: 'u',
            ű: 'u',
            ų: 'u',
            Ŵ: 'W',
            ŵ: 'w',
            Ŷ: 'Y',
            ŷ: 'y',
            Ÿ: 'Y',
            Ź: 'Z',
            Ż: 'Z',
            Ž: 'Z',
            ź: 'z',
            ż: 'z',
            ž: 'z',
            Ĳ: 'IJ',
            ĳ: 'ij',
            Œ: 'Oe',
            œ: 'oe',
            ŉ: "'n",
            ſ: 's',
        };
        this.htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        this.htmlUnescapes = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
        };
    }

    StringUtils.prototype = Object.create(TypeUtils.prototype);

    /**
     *  Permet de retirer aux extrémités de la chaîne tous les whitespace, et symboles extra (-_.)
     *	@memberof StringUtils
     *	@param {string} str - Nombre donné
     *	@return {string} retourne le resultat
     *  @example
     *
     *  cUts.s.chop("_ABC_");
     *  //=> 'ABC'
     *
     *  cUts.s.chop("-ABC-");
     *  //=> 'ABC'
     *
     *  cUts.s.chop(" ABC ");
     *  //=> 'ABC'
     *
     *  cUts.s.chop(".ABC.");
     *  //=> 'ABC'
     */
    StringUtils.prototype.chop = function(str) {
        if (!this.isString(str)) return '';
        var re = /^[-_.\W\s]+|[-_.\W\s]+$/g;
        return str.trim().replace(re, '');
    };

    /**
     *  Permet de transformer la chaine en chaine sans espace et avec la lettre suivant l'espace mise en majuscule
     *	@memberof StringUtils
     *	@param {string} str - Nombre donné
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.camelcase("foo bar baz");
     * //=> 'fooBarBaz'
     *
     */
    StringUtils.prototype.camelcase = function(str) {
        if (!this.isString(str)) return '';
        if (str.length === 1) {
            return str.toLowerCase();
        }
        var re = /[-_.\W\s]+(\w|$)/g;
        return this.chop(str).replace(re, function(_, ch) {
            return ch.toUpperCase();
        });
    };

    /**
     *  Permet de remplacer les séparateurs d'une chaine en underscore
     *	@memberof StringUtils
     *	@param {string} str - Nombre donné
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.snakecase("a-b-c d_e");
     * //=> 'a_b_c_d_e'
     *
     */
    StringUtils.prototype.snakecase = function(str) {
        if (!this.isString(str)) return '';
        if (str.length === 1) {
            return str.toLowerCase();
        }
        var re = /[-_.\W\s]+(\w|$)/g;
        return this.chop(str).replace(re, function(_, ch) {
            return '_' + ch;
        });
    };

    /**
     *  Permet de remplacer les séparateurs d'une chaine en tiret
     *	@memberof StringUtils
     *	@param {string} str - Nombre donné
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.dashcase("a-b-c d_e");
     * //=> 'a-b-c-d-e'
     *
     */
    StringUtils.prototype.dashcase = function(str) {
        if (!this.isString(str)) return '';
        if (str.length === 1) {
            return str.toLowerCase();
        }
        var re = /[-_.\W\s]+(\w|$)/g;
        return this.chop(str).replace(re, function(_, ch) {
            return '-' + ch;
        });
    };

    /**
     *  Permet de retourner la chaine
     *	@memberof StringUtils
     *	@param {string} str - Nombre donné
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.reverse("abc");
     * //=> 'cba'
     *
     */
    StringUtils.prototype.reverse = function(str) {
        if (!this.isString(str)) return '';
        return str
            .split('')
            .reverse()
            .join('');
    };

    /**
     *  Permet de remplacer les séparateurs d'une chaine en slash
     *	@memberof StringUtils
     *	@param {string} str - Nombre donné
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.pathcase("a-b-c d_e");
     * //=> 'a/b/c/d/e'
     *
     */
    StringUtils.prototype.pathcase = function(str) {
        if (!this.isString(str)) return '';
        if (str.length === 1) {
            return str.toLowerCase();
        }
        var re = /[_.-\W\s]+(\w|$)/g;
        return this.chop(str).replace(re, function(_, ch) {
            return '/' + ch;
        });
    };

    /**
     *  Permet de remplacer le premier caractère de chaque mots délimité par un séparateur par une majuscule
     *	@memberof StringUtils
     *	@param {string} str - Nombre donné
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.pascalcase("foo bar baz");
     * //=> 'FooBarBaz'
     *
     */
    StringUtils.prototype.pascalcase = function(str) {
        if (!this.isString(str)) return '';
        if (str.length === 1) {
            return str.toUpperCase();
        }
        str = this.camelcase(str);
        return str[0].toUpperCase() + str.slice(1);
    };

    /**
     *  Permet de remplacer les séparateurs d'une chaine par des points
     *	@memberof StringUtils
     *	@param {string} str - Nombre donné
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.dotcase("a-b-c d_e");
     * //=> 'a.b.c.d.e'
     *
     */
    StringUtils.prototype.dotcase = function(str) {
        if (!this.isString(str)) return '';
        if (str.length === 1) {
            return str.toLowerCase();
        }
        var re = /[-_.\W\s]+(\w|$)/g;
        return this.chop(str).replace(re, function(_, ch) {
            return '.' + ch;
        });
    };

    /**
     *  Permet de compter le nombre de fois ou la chaine demandé apparait dans la chaine source
     *	@memberof StringUtils
     *	@param {string} str - string source
     *	@param {string} sub - string à compter
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.count("abcabcabc", "a");
     * //=> '3'
     *
     */
    StringUtils.prototype.count = function(str, sub) {
        if (!this.isString(str)) return '';
        return sub ? str.split(sub).length - 1 : 0;
    };

    /**
     *  Permet de transformer tous les caractères de la chaine en minuscule sauf le premier caractère
     *	@memberof StringUtils
     *	@param {string} str - string source
     *	@param {string} sub - string à compter
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.capitalize("abcabcabc");
     * //=> 'Abcabcabc'
     *
     * cUts.s.capitalize("tEsT");
     * //=> 'Test'
     *
     */
    StringUtils.prototype.capitalize = function(str) {
        if (!this.isString(str)) return '';
        var strLower = str.toLowerCase();
        return strLower[0].toUpperCase() + strLower.slice(1);
    };

    /**
     *  Permet de normaliser une chaîne de caractère en lui supprimant tout caractères listé dans les liens ci-dessous
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     *	@memberof StringUtils
     *	@param {string} str - string source
     *	@param {string} sub - string à compter
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.normalize('À notre rédemption');
     * // => A notre redemption'
     *
     */
    StringUtils.prototype.normalize = function(str) {
        if (!this.isString(str)) return '';
        var self = this;
        return str
            .replace(this.reLatin, function(k) {
                return self.deburredLetters[k];
            })
            .replace(this.reComboMark, '');
    };

    /**
     *  Permet d'indiquer si la chaine source se termine par la chaine donnée (un index peut indiquer l'index de recherche)
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@param {string} searchedStr - string à rechercher
     *	@param {number} [pos=string.length] - index ou la recherche commence
     *	@return {boolean} retourne le resultat
     *  @example
     *
     * cUts.s.endsWith('abc', 'c');
     * // => true
     *
     * cUts.s.endsWith('abc', 'b');
     * // => false
     *
     * cUts.s.endsWith('abc', 'b', 2);
     * // => true
     *
     */
    StringUtils.prototype.endsWith = function(str, searchedStr, pos) {
        if (!this.isString(str) || !this.isString(searchedStr)) return false;
        if (!String.prototype.endsWith) {
            return (function(str, searchString, position) {
                var subjectString = str;
                if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                    position = subjectString.length;
                }
                position -= searchString.length;
                var lastIndex = subjectString.lastIndexOf(searchString, position);
                return lastIndex !== -1 && lastIndex === position;
            })(str, searchedStr, pos);
        } else {
            return str.endsWith(searchedStr, pos);
        }
    };

    /**
     *  Permet d'indiquer si la chaine source commence par la chaine donnée (un index peut indiquer l'index de recherche)
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@param {string} searchedStr - string à rechercher
     *	@param {number} [pos=0] - index ou la recherche commence
     *	@return {boolean} retourne le resultat
     *  @example
     *
     * cUts.s.startsWith('abc', 'a');
     * // => true
     *
     * cUts.s.startsWith('abc', 'b');
     * // => false
     *
     * cUts.s.startsWith('abc', 'b', 1);
     * // => true
     *
     */
    StringUtils.prototype.startsWith = function(str, searchedStr, pos) {
        if (!this.isString(str) || !this.isString(searchedStr)) return false;
        if (!String.prototype.startsWith) {
            return (function(str, searchString, position) {
                var subjectString = str;
                if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                    position = 0;
                }
                var firstIndex = subjectString.indexOf(searchString, position);
                return firstIndex !== -1 && firstIndex === position;
            })(str, searchedStr, pos);
        } else {
            return str.startsWith(searchedStr, pos);
        }
    };

    /**
     * Permet d'échapper les caractère spécials pour que la chaîne soit une URI valide
     * Convertit entre autre les caractères "&", "<", ">", '"', et "'" dans `str` par
     * leurs entités HTML correspondantes.
     *
     * **Note:** Aucun autre caractère n'est échappé
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     *
     */
    StringUtils.prototype.escape = function(str) {
        if (!this.isString(str)) return '';
        var self = this;
        return str && this.reHasUnescapedHtml.test(str)
            ? str.replace(this.reUnescapedHtml, function(k) {
                  return self.htmlEscapes[k];
              })
            : str;
    };

    /**
     * Cette méthode est l'inverse `escape`
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     *
     */
    StringUtils.prototype.unescape = function(str) {
        if (!this.isString(str)) return '';
        var self = this;
        return str && reHasEscapedHtml.test(str)
            ? str.replace(reEscapedHtml, function(k) {
                  return self.unescapeHtmlChar[k];
              })
            : str;
    };

    /**
     *  Permet d'échaper les caractères spéciaux des `RegExp` : "^", "$", "\", ".", "*", "+",
     *  "?", "(", ")", "[", "]", "{", "}", and "|" dans la chaîne de caractère `str`.
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.escapeRegExp('[StringUtils](https://ofp.com/)');
     * // => '\[StringUtils\]\(https://ofp\.com/\)'
     */
    StringUtils.prototype.escapeRegExp = function(str) {
        if (!this.isString(str)) return '';
        return str && this.reHasRegExpChar.test(str) ? str.replace(this.reRegExpChar, '\\$&') : str;
    };

    /**
     * Permet une répétition de la chaine de caractère N fois
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@param {number} nb - nombre de fois à répéter
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.repeat('*', 3);
     * // => '***'
     *
     * cUts.s.repeat('abc', 2);
     * // => 'abcabc'
     *
     * cUts.s.repeat('abc', 0);
     * // => ''
     *
     */
    StringUtils.prototype.repeat = function(str, nb) {
        if (!this.isString(str)) return '';
        if (!String.prototype.repeat) {
            return (function(str, nb) {
                if (nb < 0) return '';
                var res = '';
                for (;;) {
                    if (nb & 1) res += str;
                    nb >>= 1;
                    if (nb <= 0) break;
                    str += str;
                }
                return res;
            })(str, nb);
        } else {
            return str.repeat(nb);
        }
    };

    /**
     * Permet d'effectuer un trim uniquement sur le début de la chaine https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/trimStart
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.trimStart('  abc  ');
     * // => 'abc  '
     *
     * cUts.s.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     *
     */
    StringUtils.prototype.trimStart = function(str) {
        if (!this.isString(str)) return '';
        if (!String.prototype.trimStart) {
            var trimStr = str.trim();
            var regTrim = new RegExp('(' + trimStr + '.+$)');
            return (str.match(regTrim) || ['', ''])[1];
        } else {
            return str.trimStart();
        }
    };

    /**
     * Permet d'effectuer un trim uniquement sur la fin de la chaine https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/trimEnd
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.trimEnd('  abc  ');
     * // => '  abc'
     *
     * cUts.s.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     *
     */
    StringUtils.prototype.trimEnd = function(str) {
        if (!this.isString(str)) return '';
        if (!String.prototype.trimEnd) {
            var trimStr = str.trim();
            var regTrim = new RegExp('(^.+' + trimStr + ')');
            return (str.match(regTrim) || ['', ''])[1];
        } else {
            return str.trimStart();
        }
    };

    /**
     * Permet d'effectuer une coupure à la chaine donnée selon l'index donné et la taile de la chaine de coupure
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@param {number} [length=0] - couper la chaine à cet index
     *	@param {string} [truncateStr='...'] - chaine qui va servir de coupure
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.truncate('just sittin on the dock of the bay',20);
     * // => "just sittin on th..."
     *
     * cUts.s.truncate('just sittin on the dock of the bay',20,"......");
     * // => "just sittin on......"
     *
     */
    StringUtils.prototype.truncate = function(str, length, truncateStr) {
        if (!this.isString(str)) return '';
        truncateStr = truncateStr || '...';
        truncateStrLength = truncateStr.length;
        length = ~~length - truncateStrLength;

        if (length < 0) {
            length = 0;
        }

        return str.length > length ? str.slice(0, length) + truncateStr : str;
    };

    /**
     * Permet d'effectuer un travail similaire à la fonction truncate mais sans couper les mots
     *
     *	@memberof StringUtils
     *	@param {string} [str=''] - string source
     *	@param {number} [length=0] - couper la chaine à cet index
     *	@param {string} [pruneStr='...'] - chaine qui va servir de coupure
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.truncate('just sittin on the dock of the bay',20);
     * // => "just sittin on..."
     *
     * cUts.s.truncate('just sittin on the dock of the bay',20,"......");
     * // => "just sittin on......"
     *
     * cUts.s.truncate('just sittin on the dock of the bay',20,".......");
     * // => "just sittin......."
     *
     */
    StringUtils.prototype.prune = function(str, length, pruneStr) {
        if (!this.isString(str)) return '';
        pruneStr = pruneStr != null ? String(pruneStr) : '...';
        pruneStrLength = pruneStr.length;
        length = ~~length - pruneStrLength;

        if (length < 0) {
            length = 0;
        }

        if (str.length <= length) return str;

        var tmpl = function(c) {
                return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' ';
            },
            template = str.slice(0, length + 1).replace(/.(?=\W*\w*$)/g, tmpl);

        if (template.slice(template.length - 2).match(/\w\w/)) template = template.replace(/\s*\S+$/, '');
        else template = this.trimEnd(template.slice(0, template.length - 1));

        return (template + pruneStr).length > str.length ? str : str.slice(0, template.length) + pruneStr;
    };

    /**
     * Permet de récupérer les mots présent dans la chaine sous forme de tableau, il est possible d'ajouter un pattern en regex pour detecter soi-même les mots selon des critères bien définis
     *
     *	@memberof StringUtils
     *  @param {string} [str=''] - string source
     *  @param {RegExp} [pattern] - Pattern regex
     *	@return {string} retourne le resultat
     *  @example
     *
     * cUts.s.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * cUts.s.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     *
     */
    StringUtils.prototype.words = function(str, pattern) {
        if (!this.isString(str)) {
            return [];
        }
        var pat = this.isRegExp(pattern) ? pattern : this.reWords;
        return str.match(pat) || [];
    };

    window.cUtils = window.cUts = window.concepteurUtils = new ConcepteursUtils();
})(window, document);
