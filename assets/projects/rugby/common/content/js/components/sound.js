(function (win) {
    var STATICS = {
        CAN_PLAY: {
            get: function () {
                return 'Sound.canPlay';
            },
        },
        TIME_UPDATE: {
            get: function () {
                return 'Sound.timeUpdate';
            },
        },
        ERROR: {
            get: function () {
                return 'Sound.error';
            },
        },
    };

    setStatic(STATICS, Sound);

    var defaultOptions = {
        id: 'test_sound',
        name: 'official_test_sound',
        path: '',
        loop: false,
        persistent: false,
    };

    function Sound(container, options) {
        this.container = container || win.document.body;
        this.options = Object.assign({}, defaultOptions, options);

        this.element = null;
        this.source = null;

        this.id = this.options.id;
        this.finishCallbacks = [];
        this.persistent = this.options.persistent;
        this.canPlay = false;

        Object.defineProperty(this, 'ended', {
            get: function () {
                return this.element.ended;
            },
        });

        Object.defineProperty(this, 'playing', {
            get: function () {
                return !this.element.paused;
            },
        });

        Object.defineProperty(this, 'duration', {
            get: function () {
                return this.element.duration;
            },
        });

        Object.defineProperty(this, 'currentTime', {
            get: function () {
                return this.element.currentTime;
            },
        });

        Object.defineProperty(this, 'volume', {
            get: function () {
                return this.element.volume;
            },
            set: function (volume) {
                if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
                    this.element.volume = volume;
                }
            },
        });

        this.boundHandleEndSound = this.handleEndSound.bind(this);
        this.boundHandleCanPlay = this.handleCanPlay.bind(this);
        this.boundHandleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.boundHandleError = this.handleError.bind(this);

        this.init();
    }

    Sound.prototype.init = function () {
        var audioData = createAudio(this.options.path, this.options.name);
        this.element = audioData.container;
        this.source = audioData.source;
        this.element.loop = this.options.loop;
        this.element.onended = this.boundHandleEndSound;
        this.element.oncanplay = this.boundHandleCanPlay;
        this.element.ontimeupdate = this.boundHandleTimeUpdate;
        this.element.onerror = this.boundHandleError;
        this.source.onerror = this.boundHandleError;
        this.container.appendChild(this.element);
    };

    Sound.prototype.play = function () {
        if (!this.playing) {
            this.element.play();
        }
    };

    Sound.prototype.stop = function () {
        if (!this.persistent) {
            this.element.pause();
            this.element.currentTime = 0;
        }
    };

    Sound.prototype.stopPersistent = function () {
        if (this.persistent) {
            this.element.pause();
            this.element.currentTime = 0;
        }
    };

    Sound.prototype.handleEndSound = function () {
        var self = this;
        forEach(this.finishCallbacks, function (finishCallback) {
            var handleFinishCallback = finishCallback.bind(self);
            handleFinishCallback();
        });

        this.finishCallbacks.length = 0;
    };

    Sound.prototype.handleCanPlay = function () {
        this.canPlay = true;
        this.emit(Sound.CAN_PLAY);
    };

    Sound.prototype.handleTimeUpdate = function () {
        this.emit(Sound.TIME_UPDATE);
    };

    Sound.prototype.handleError = function (e) {
        this.canPlay = true;
        console.warn('An error occurred with sound ' + this.options.name + '.');
        this.emit(Sound.ERROR);
    };

    Sound.prototype.addFinishCallback = function (callback) {
        if (typeof callback === 'function') {
            this.finishCallbacks.length = 0;
        }
    };

    Sound.prototype.removeFinishCallback = function (callback) {
        var foundCallback = this.finishCallbacks.indexOf(callback);

        if (foundCallback > -1) {
            this.finishCallbacks.splice(foundCallback, 1);
        }
    };

    Sound.prototype.getData = function () {
        var id = this.id;
        var volume = this.volume;
        var loop = this.element.loop;
        var duration = this.duration;

        return {
            id: id,
            volume: volume,
            loop: loop,
            duration: duration
        };
    };

    Sound.prototype.setData = function (datas) {
        var id = datas.id;
        var volume = datas.volume;
        var loop = datas.loop;

        if (isDefined(id)) {
            this.id = id;
        }

        if (isDefined(volume)) {
            this.volume = volume;
        }

        if (isDefined(id)) {
            this.element.loop = loop;
        }
    };

    Sound.prototype.destroy = function () {
        this.element.onended = null;
        this.element.oncanplay = null;
        this.source.onerror = null;
        this.element.removeChild(this.source);
        this.container.removeChild(this.element);
        this.container = null;
        this.source = null;
        this.element = null;
    };

    function createAudio(path, name) {
        var audio = document.createElement('audio');
        var source = document.createElement('source');

        if (audio.canPlayType('audio/mp3')) {
            source.type = 'audio/mp3';
            source.src = path + name + '.mp3';
        } else {
            source.type = 'audio/ogg';
            source.src = path + name + '.ogg';
        }

        audio.id = 'sound_' + name;
        audio.style.display = 'none';

        audio.appendChild(source);

        return {
            container: audio,
            source: source,
        };
    }

    mix(Sound, EmitterMixin);

    win.Sound = Sound;
})(window);
