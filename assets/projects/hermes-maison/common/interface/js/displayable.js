function Displayable(selectorOrElement) {
    this.domElement = typeof selectorOrElement === 'string' ? document.querySelector(selectorOrElement) : selectorOrElement;
    if (!this.domElement) {
        this.domElement = document.createElement('div');
        this.originalDisplayProperty = '';
    } else {
        this.originalDisplayProperty = (window.getComputedStyle(this.domElement, null) || { getPropertyValue: function () { return ''; } }).getPropertyValue('display');
        if (this.originalDisplayProperty.indexOf('none') > -1) {
            this.originalDisplayProperty = '';
        }
    }
    this.listeners = [];
    this.datas = {};
}

Displayable.prototype.show = function () {
    this.domElement.style.display = this.originalDisplayProperty;
    return this;
};

Displayable.prototype.hide = function () {
    this.domElement.style.display = 'none';
    return this;
};

Displayable.prototype.toggle = function () {
    return this.domElement.style.display === 'none' ? this.show() : this.hide();
};


Displayable.prototype.hidden = function () {
    this.domElement.style.visibility = 'hidden';
    return this;
};

Displayable.prototype.visible = function () {
    this.domElement.style.visibility = 'visible';
    return this;
};

Displayable.prototype.toggleVisibility = function () {
    return this.domElement.style.visibility === 'hidden' ? this.visible() : this.hidden();
};


Displayable.prototype.remove = function () {
    this.domElement.parentNode.removeChild(this.domElement);
    return this;
};

Displayable.prototype.empty = function () {
    while (this.domElement.firstChild) {
        this.domElement.removeChild(this.domElement.firstChild);
    }
    return this;
};

Displayable.prototype.hasClass = function (className) {
    return this.domElement.classList
        ? this.domElement.classList.contains(className)
        : this.domElement.className.indexOf(className) > -1;
};

Displayable.prototype.addClass = function () {
    var classNames = Array.prototype.slice.call(arguments);
    classNames.forEach(function (className) {
        if (this.domElement.classList) {
            this.domElement.classList.add(className);
        } else {
            var elementClassName = this.domElement.className.trim();
            if (!elementClassName) {
                this.domElement.className = elementClassName;
            } else if (elementClassName.indexOf(className) === -1) {
                this.domElement.className = elementClassName + ' ' + className;
            }
        }
    }.bind(this));
    return this;
};

Displayable.prototype.removeClass = function () {
    var classNames = Array.prototype.slice.call(arguments);
    if (!classNames) {
        this.domElement.className = '';
        return this;
    }
    classNames.forEach(function (className) {
        if (this.domElement.classList) {
            this.domElement.classList.remove(className);
        } else {
            if (this.domElement.className.indexOf(className) > -1) {
                this.domElement.className = this.domElement.className.replace(className, '');
            }
        }
    }.bind(this));
    return this;
};

Displayable.prototype.toggleClass =  function (className, force) {
    if (Array.prototype.slice.call(arguments).length < 2) {
        var method = this.hasClass(className) ? 'removeClass' : 'addClass';
        return this[method](className);
    }
    // IE10-11 doesn't support the second parameter of `classList.toggle`
    if (force) {
        this.addClass(className);
    } else {
        this.removeClass(className);
    }
    return this;
};

Displayable.prototype.parent = function () {
    return new Displayable(this.domElement.parentNode);
};

Displayable.prototype.children = function () {
    return Array.prototype.slice.call(this.domElement.children).map(function (el) {
        return new Displayable(el);
    });
};


Displayable.prototype.find = function (selector) {
    return new Displayable(this.domElement.querySelector(selector));
};

Displayable.prototype.findAll = function (selector) {
    var nodelist = this.domElement.querySelectorAll(selector);
    return Array.prototype.slice.call(nodelist).map(function (el) {
        return new Displayable(el);
    });
};

Displayable.prototype.css = function (property, value) {
    if (!property) {
        return void 0;
    }
    if (typeof property === typeof '') {
        var prefixedProperty = Displayable.getPrefixedProperty(property);
        if (arguments.length > 1) {
            this.domElement.style[prefixedProperty] = value;
            return this;
        }
        return window.getComputedStyle(this.domElement)[prefixedProperty];
    }
    Object.keys(property).forEach(function (key) {
        this.css(key, property[key]);
    }.bind(this));
    return this;
};

Displayable.prototype.attr = function (name, value) {
    if (!name) {
        return void 0;
    }

    if (typeof name === typeof '') {
        if (value === void 0) {
            return this.domElement.getAttribute
                ? this.domElement.getAttribute(name)
                : this.domElement[name];
        }

        if (this.domElement.setAttribute) {
            this.domElement.setAttribute(name, value);
        } else {
            this.domElement[name] = value;
        }
        return this;
    }

    Object.keys(name).forEach(function (key) {
        this.attr(key, name[key]);
    }.bind(this));

    return this;
};

Displayable.prototype.removeAttr = function (name) {
    if (this.domElement.removeAttribute) {
        this.domElement.removeAttribute(name);
    } else {
        delete this.domElement[name];
    }
    return this;
};


Displayable.prototype.width = function (value) {
    if (value === void 0) {
        return this.domElement.getBoundingClientRect().width;
    }
    return this.css('width', Displayable.cssUnit(value));
};

Displayable.prototype.height = function (value) {
    if (value === void 0) {
        return this.domElement.getBoundingClientRect().height;
    }
    return this.css('height', Displayable.cssUnit(value));
};

Displayable.prototype.innerWidth = function () {
    return this.domElement.clientWidth;
};

Displayable.prototype.innerHeight = function () {
    return this.domElement.clientHeight;
};

Displayable.prototype.outerWidth = function (margins) {
    return this.domElement.offsetWidth + (margins ? Displayable.compute(this.domElement, 'marginLeft') + Displayable.compute(this.domElement, 'marginRight') : 0);
};

Displayable.prototype.outerHeight = function (margins) {
    return this.domElement.offsetHeight + (margins ? Displayable.compute(this.domElement, 'marginTop') + Displayable.compute(this.domElement, 'marginBottom') : 0);
};

Displayable.prototype.on = function (events, handler) {
    events
        .split(' ')
        .forEach(function (event) {
            this.listeners[event] = this.listeners[event] || [];
            this.listeners[event].push(handler);
            this.domElement.addEventListener(event, handler);
        }.bind(this));
    return this;
};

Displayable.prototype.once = function (events, handler) {
    var onceHandler = function (event) {
        this.off(events, handler);
        handler(event);
    }.bind(this);
    return this.on(events, onceHandler);
};

Displayable.prototype.off = function (events, handler) {
    events
        .split(' ')
        .forEach(function (event) {
            var listeners = this.listeners[event];
            if (listeners) {
                if (handler) {
                    this.domElement.removeEventListener(event, handler);
                    var index = listeners.indexOf(handler);
                    if (index >= 0) {
                        listeners.splice(index, 1);
                    }
                } else {
                    listeners.forEach(function (registeredHandler) {
                        this.domElement.removeEventListener(event, registeredHandler);
                    }.bind(this));
                    listeners = [];
                }
            }
        }.bind(this));
    return this;
};

Displayable.prototype.trigger = function (eventName, data) {
    if (document.createEvent) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, false);
        this.domElement.dispatchEvent(Object.assign(event, data));
    }
    return this;
};

Displayable.prototype.data = function (name, value) {
    if (!name) {
        return void 0;
    }
    if (typeof name === typeof '') {
        if (value === void 0) {
            return Object.prototype.hasOwnProperty.call(this.datas, name)
                ? this.datas[name]
                : void 0;
        }
        this.datas[name] = value;
        return this;
    }

    Object.keys(name).forEach(function (key) {
        this.data(key, name[key]);
    }.bind(this));

    return this;
};

Displayable.prototype.removeData = function (key) {
    if (this.datas[key]) {
        delete this.datas[key];
    }
};


Displayable.prototype.append = function () {
    var fragment = Displayable.createFragmentFrom(Array.prototype.slice.call(arguments));
    this.domElement.appendChild(fragment);
    return this;
};

Displayable.prototype.prepend = function () {
    var firstChild = this.domElement.firstChild;
    var fragment = Displayable.createFragmentFrom(Array.prototype.slice.call(arguments));
    this.domElement.insertBefore(fragment, firstChild);
    return this;
};

Displayable.prototype.before = function () {
    var fragment = Displayable.createFragmentFrom(Array.prototype.slice.call(arguments));
    if (this.domElement.parentNode) {
        this.domElement.parentNode.insertBefore(fragment, this.domElement);
    }
    return this;
};

Displayable.prototype.after = function () {
    var nextSibling = this.domElement.nextSibling;
    var fragment = Displayable.createFragmentFrom(Array.prototype.slice.call(arguments));
    if (this.domElement.parentNode) {
        this.domElement.parentNode.insertBefore(fragment, nextSibling);
    }
    return this;
};

Displayable.prototype.text = function (value) {
    if (value === void 0) {
        return this.domElement.textContent;
    }
    this.domElement.textContent = (value + '').trim();
    return this;
};


Displayable.prototype.html = function (value) {
    if (value === void 0) {
        return this.domElement.innerHtml;
    }
    this.domElement.innerHtml = (value + '').trim();
    return this;
};

Displayable.prototype.clone = function (dataAndEvents) {
    var cloneDataAndEvents = typeof dataAndEvents === 'boolean' ? dataAndEvents : false;
    var clone = new Displayable(this.domElement.cloneNode(true));
    if (cloneDataAndEvents) {
        Object.keys(this.listeners).forEach(function (eventName) {
            this.listeners[eventName].forEach(function (registeredHandler) {
                clone.on(eventName, registeredHandler);
            });
        }.bind(this));
        clone.datas = Object.assign({}, this.datas);
    }
    return clone;
};

Displayable.prototype.getDomElement = function () {
    return this.domElement;
};

Displayable.prototype.getIframeDocument = function () {
    var iframe = this.domElement.nodeName.toLowerCase() === 'iframe' ? this.domElement : this.domElement.querySelector('iframe');
    return iframe ? (iframe.contentDocument || iframe.contentWindow.document) : null;
};

Displayable.prototype.getIframeWindow = function () {
    var iframe = this.domElement.nodeName.toLowerCase() === 'iframe' ? this.domElement : this.domElement.querySelector('iframe');
    return iframe ? iframe.contentWindow : null;
};


Displayable.HTML_REGEX = /<|&#?\w+;/;

Displayable.XHTML_TAG_REGEX = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi;

// TAG_NAME_REGEX captures the name from the first start tag in a string of HTML
// https://html.spec.whatwg.org/multipage/syntax.html#tag-open-state
// https://html.spec.whatwg.org/multipage/syntax.html#tag-name-state
Displayable.TAG_NAME_REGEX = (/<([a-z][^\/\0>\x20\t\r\n\f]*)/i);

// We have to close these tags to support XHTML (#13200)
Displayable.wrappedTagMap = {
    // Support: IE <=9 only
    option: [1, "<select multiple='multiple'>", '</select>'],

    // XHTML parsers do not magically insert elements in the
    // same way that tag soup parsers do. So we cannot shorten
    // this by omitting <tbody> or other required elements.
    thead: [1, '<table>', '</table>'],
    col: [2, '<table><colgroup>', '</colgroup></table>'],
    tr: [2, '<table><tbody>', '</tbody></table>'],
    td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],

    _default: [0, '', '']
};
// Support: IE <=9 only
Displayable.wrappedTagMap.optgroup = Displayable.wrappedTagMap.option;
Displayable.wrappedTagMap.tbody = Displayable.wrappedTagMap.tfoot = Displayable.wrappedTagMap.colgroup = Displayable.wrappedTagMap.caption = Displayable.wrappedTagMap.thead;
Displayable.wrappedTagMap.th = Displayable.wrappedTagMap.td;


Displayable.createFragmentFrom = function (data, context) {
    var ctx = context || document.body;
    var fragment = Displayable.buildFragment(data, ctx.ownerDocument);
    return fragment.childNodes.length === 1 ? fragment.firstChild : fragment;
};

Displayable.buildFragment = function (elements, context) {
    var elems = Array.prototype.slice.call(elements);
    var elem; var tmp; var tag; var wrap; var j;
    var fragment = context.createDocumentFragment();
    var nodes = [];
    var i = 0;
    var l = elems.length;

    for (; i < l; i += 1) {
        elem = elems[i];

        if (elem || elem === 0) {
            // Add nodes directly
            if (Displayable.toType(elem) === 'object') {
                Displayable.erge(nodes, elem.nodeType ? [elem] : elem);

                // Convert non-html into a text node
            } else if (!Displayable.HTML_REGEX.test(elem)) {
                nodes.push(context.createTextNode(elem));

                // Convert html into DOM nodes
            } else {
                tmp = tmp || fragment.appendChild(context.createElement('div'));
                // Deserialize a standard representation
                tag = (Displayable.TAG_NAME_REGEX.exec(elem) || ['', ''])[1].toLowerCase();
                wrap = Displayable.wrappedTagMap[tag] || Displayable.wrappedTagMap._default;
                tmp.innerHTML = wrap[1] + Displayable.htmlPrefilter(elem) + wrap[2];

                // Descend through wrappers to the right content
                j = wrap[0];
                while (j) {
                    tmp = tmp.lastChild;
                    j -= 1;
                }
                Displayable.merge(nodes, tmp.childNodes);

                // Remember the top-level container
                tmp = fragment.firstChild;

                // Ensure the created nodes are orphaned (#12392)
                tmp.textContent = '';
            }
        }
    }

    // Remove wrapper from fragment
    fragment.textContent = '';

    nodes.forEach(function (node) {
        fragment.appendChild(node);
    });

    return fragment;
};


Displayable.class2type = {};
Displayable.toString = Displayable.class2type.toString;
Displayable.toType = function (obj) {
    if (obj === null) {
        return obj + '';
    }
    // Support: Android <=2.3 only (functionish RegExp)
    return typeof obj === 'object' || typeof obj === 'function'
        ? Displayable.class2type[Displayable.toString.call(obj)] || 'object'
        : typeof obj;
};

Displayable.merge = function (first, second) {
    var merged = first;
    var len = +second.length;
    var j = 0;
    var i = merged.length;
    for (; j < len; j += 1) {
        merged[i] = second[j];
        i += 1;
    }
    merged.length = i;
    return first;
};


Displayable.htmlPrefilter = function (html) {
    return html.replace(Displayable.XHTML_TAG_REGEX, '<$1></$2>');
};


Displayable.CAMEL_REGEX = /(?:^\w|[A-Z]|\b\w)/g;
Displayable.WHITESPACE_REGEX = /[\s-_]+/g;

Displayable.camelCase = function (str) {
    return str.replace(Displayable.CAMEL_REGEX, function (letter, index) {
        return letter[index === 0 ? 'toLowerCase' : 'toUpperCase']();
    }).replace(Displayable.WHITESPACE_REGEX, '');
};

Displayable.compute = function (htmlElement, property) {
    return parseInt(window.getComputedStyle(htmlElement, null)[property], 10) || 0;
};

Displayable.UNIT_REGEX = /(px|em|rem|%|vw|vh)$/;
Displayable.CUSTOM_PROP_REGEX = /^--/;

Displayable.cssUnit = function (value) {
    if (Displayable.UNIT_REGEX.test(value) || Displayable.CUSTOM_PROP_REGEX.test(value)) {
        return value;
    }
    return value + 'px';
};

Displayable.getPrefixedProperty = (function () {
    var cache = {};
    var style = document.createElement('div').style;

    return function getPrefix(property) {
        var camelCasedProperty = Displayable.camelCase(property);
        if (cache[camelCasedProperty]) {
            return cache[camelCasedProperty];
        }
        var upperCasedProperty = camelCasedProperty.charAt(0).toUpperCase() + camelCasedProperty.slice(1);
        var prefixes = 'webkit moz ms o'.split(' ');
        var propertys = (camelCasedProperty + ' ' + prefixes.join(upperCasedProperty + ' ') + upperCasedProperty).split(' ');

        propertys.forEach(function (p) {
            if (p in style) {
                cache[p] = p;
                camelCasedProperty = p;
                cache[camelCasedProperty] = p;
                return false;
            }
            return true;
        });
        return cache[camelCasedProperty];
    };
})();
