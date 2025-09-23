(function (win) {
    var EmitterMixin = {
        on: function (type, handler) {
            return this.listen(type, handler);
        },

        once: function (type, handler) {
            var onceHandler = function (event) {
                event.off();
                handler.call(event.target, event);
            }.bind(this);
            return this.listen(type, onceHandler);
        },

        listen: function (type, handler) {
            if (!this._listeners) {
                this._listeners = {};
            }
            if (!this._listeners[type]) {
                this._listeners[type] = [];
            }
            if (this._listeners[type].indexOf(handler) === -1) {
                this._listeners[type].push(handler);
            }
            return this;
        },

        has: function (type, handler) {
            if (!this._listeners) {
                return false;
            }
            if (this._listeners[type]) {
                if (handler) {
                    return this._listeners[type].indexOf(handler) !== -1;
                }
                return this._listeners[type].length > 0;
            }
            return false;
        },

        off: function (type, handler) {
            if (!this._listeners) {
                return false;
            }

            if (!type && !handler) {
                var listeners = this._listeners;
                var keys = Object.keys(listeners);
                keys.map(function (value) {
                    delete listeners[value];
                });
                return this;
            }

            var listenerArray = this._listeners[type];
            if (listenerArray) {
                if (handler) {
                    var index = listenerArray.indexOf(handler);
                    if (index > -1) {
                        listenerArray.splice(index, 1);
                    }
                } else {
                    while (listenerArray.length > 0) {
                        listenerArray.pop();
                    }
                }
            }

            return this;
        },

        emit: function (type, data) {
            data = data || {};
            if (!this._listeners) {
                return false;
            }
            var listenerArray = this._listeners[type];
            if (listenerArray) {
                var target = this;
                var event = new Event(type, target, data);
                listenerArray.forEach(
                    function (handler) {
                        handler.call(event.target, event);

                        if (event.off.called) {
                            this.off(event.type, handler);
                        }
                    }.bind(this)
                );
            }
            return this;
        },
    };

    function Event(type, target, data) {
        this.type = type;
        this.target = target;
        this.data = data;
        this.off = spy();
    }

    function spy() {
        return function spy() {
            spy.called = true;
        };
    }

    win.EmitterMixin = EmitterMixin;
})(window);
