(function (win) {
    var callbacks = [];
    var listening = false;

    function Message() {
        this.isLocal = window.location.protocol.toLowerCase().indexOf('file') > -1;
        this.port = window.location.port;

        var portStr = this.port !== '' ? ':' + this.port : '';
        var origin = this.isLocal ? '*' : window.location.protocol + '//' + window.document.domain;
        origin += portStr;

        this.origin = origin;

        this.boundHandleListenMessage = this.handleListenMessage.bind(this);

        Object.defineProperty(this, 'listening', {
            get: function () {
                return listening;
            },
        });
    }

    Message.prototype.sendTo = function (target, data) {
        if (!target) {
            console.warn('[Message warning] : Cancelled sendTo due invalid target.');
            return;
        }
        target.postMessage(data, this.origin);
    };

    Message.prototype.send = function (data) {
        this.sendTo(win, data);
    };

    Message.prototype.listen = function (callback) {
        if (typeof callback === 'function') {
            callbacks.push(callback);
        }

        if (listening === false) {
            win.addEventListener('message', this.boundHandleListenMessage);
            listening = true;
        }
    };

    Message.prototype.handleListenMessage = function (event) {
        var origin = event.origin;
        var data = event.data;
        var callbacksLength = callbacks.length;

        if (!this.isLocal && origin != this.origin) {
            console.warn('[Message warning] : Ignore received message due bad origin.');
            console.warn('[Message warning - details] : Expected', this.origin, 'but got', origin);
            return;
        }

        for (var i = 0; i < callbacksLength; i++) {
            var callback = callbacks[i];
            callback(data);
        }
    };

    Message.prototype.destroy = function () {
        win.removeEventListener('message', this.boundHandleListenMessage);
        callbacks.length = 0;
        listening = false;
    };

    win.Message = Message;
})(window);
