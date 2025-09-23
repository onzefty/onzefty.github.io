(function (win) {
    var defaultOptions = {
        container: document.body,
        message: '',
        closable: true,
        closeDelay: 5000,
        closeAnimationDelay: 1000,
        status: null, // className
    };

    function Toast(options) {
        this.options = Object.assign({}, defaultOptions, options);
        this.container = this.options.container || document.body;
        this.wrapper = getElFromSel('.toast-wrapper', this.container);
        this.element = null;
        this.timerId = -1;

        this.boundHandleClose = this.close.bind(this);

        this.init();
    }

    Toast.prototype.init = function () {
        if (!this.container) {
            return false;
        }

        this.create();
        this.open();
    };

    Toast.prototype.create = function () {
        if (!this.wrapper.parentNode) {
            this.wrapper = document.createElement('div');
            this.wrapper.classList.add('toast-wrapper');

            this.container.appendChild(this.wrapper);
        }

        this.element = document.createElement('div');
        this.element.classList.add('toast');

        if (this.options.status) {
            var status = document.createElement('span');
            status.classList.add('toast-status');
            status.classList.add(this.options.status);

            this.element.appendChild(status);
        }

        var message = document.createElement('span');
        message.classList.add('toast-message');
        message.innerHTML = this.options.message;

        this.element.appendChild(message);

        if (this.options.closable) {
            var close = document.createElement('span');
            close.classList.add('toast-close');
            close.textContent = '×';

            close.addEventListener(Constants.CLICK_TOUCH, this.boundHandleClose);

            this.element.appendChild(close);
        }

        this.wrapper.appendChild(this.element);

        if (this.options.closeDelay !== false) {
            this.timerId = setTimeout(this.boundHandleClose, this.options.closeDelay);
        }
    };

    Toast.prototype.open = function () {
        var self = this;

        setTimeout(function () {
            self.element.classList.add('open');
        }, 50);
    };

    Toast.prototype.close = function () {
        var self = this;

        clearTimeout(this.timerId);

        self.element.classList.remove('open');

        setTimeout(function () {
            self.wrapper.removeChild(self.element);
        }, this.options.closeAnimationDelay);
    };

    win.Toast = Toast;
})(window);
