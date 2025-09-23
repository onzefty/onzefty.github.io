(function (win) {
    var defaultOptions = {
        rootPath: '../../../',
        localPath: './',
        directoryName: 'sounds/',
        commonRelativePath: 'common/content/assets/',
        localRelativePath: '',
        cbTimeUpdate: null
    };

    var defaultPlayOptions = {
        stopAll: true,
        volume: null,
        finishCallback: null,
    };

    var browserAllowToPlay = null;

    var STATICS = {
        READY: {
            get: function () {
                return 'SoundsManager.ready';
            },
        },
    };

    setStatic(STATICS, SoundsManager);

    function SoundsManager(container, options) {
        this.container = container || win.document.body;
        this.options = Object.assign({}, defaultOptions, options);

        this.commonPath =
            this.options.rootPath + this.options.commonRelativePath + this.options.directoryName;
        this.localPath =
            this.options.localPath + this.options.localRelativePath + this.options.directoryName;

        this.list = [];
        this.ready = true;

        Object.defineProperty(this, 'browserAllowToPlay', {
            get: function () {
                return browserAllowToPlay;
            },
        });

        Object.defineProperty(this, 'playing', {
            get: function () {
                return forEach(this.list, function () {
                    if (sound.playing) {
                        return true;
                    }
                });
            },
        });

        this.boundHandleSoundCanPlay = this.handleSoundCanPlay.bind(this);
        this.boundHandleSoundError = this.handleSoundError.bind(this);
    }

    SoundsManager.prototype.handleSoundError = function (event) {
        var target = event.target;
        var targetIndex = this.list.indexOf(target);

        if (targetIndex > -1) {
            target.destroy();
            this.list.splice(targetIndex, 1);
            this.handleSoundCanPlay();
        }
    };

    SoundsManager.prototype.handleSoundCanPlay = function (event) {
        var allSoundsCanPlay = checkIfSoundsCanPlay(this.list);

        if (allSoundsCanPlay) {
            this.ready = true;
            this.emit(SoundsManager.READY);
        }
    };

    SoundsManager.prototype.addSound = function (datas) {
        if (!datas) {
            return false;
        }

        datas.path = this.convertPath(datas.path);
        var sound = new Sound(this.container, datas);

        sound.once(Sound.CAN_PLAY, this.boundHandleSoundCanPlay);
        sound.once(Sound.ERROR, this.boundHandleSoundError);

        this.list.push(sound);

        this.ready = false;
    };

    SoundsManager.prototype.addSounds = function (datasList) {
        if (!datasList) {
            return false;
        }

        if (datasList.length === 0) {
            return false;
        }

        var fragment = document.createDocumentFragment();

        forEach(
            datasList,
            function (datas) {
                datas.path = this.convertPath(datas.path);
                var sound = new Sound(fragment, datas);
                sound.container = this.container;
                sound.once(Sound.CAN_PLAY, this.boundHandleSoundCanPlay);
                sound.once(Sound.ERROR, this.boundHandleSoundError);
                if(typeof this.options.cbTimeUpdate == "function"){
                    sound.on(Sound.TIME_UPDATE,this.options.cbTimeUpdate);
                }
                this.list.push(sound);
            }.bind(this)
        );

        this.container.appendChild(fragment);

        this.ready = false;
    };

    SoundsManager.prototype.play = function (soundId, options) {
        var sound = this.getSoundById(soundId);

        if (!sound) {
            return false;
        }

        var options = Object.assign({}, defaultPlayOptions, options);

        if (!sound.playing && options.stopAll && !sound.persistent) {
            this.stopAll();
        }

        if (options.volume) {
            sound.volume = options.volume;
        }

        sound.play();

        if (options.finishCallback) {
            sound.addFinishCallback(options.finishCallback);
        }
    };

    SoundsManager.prototype.playQueue = function (ids) {
        var self = this;
        for(var i=1; i<=ids.length; i++){
            var id = ids[i-1],
            sound = this.getSoundById(id);
            if(sound && i<ids.length){
                sound.nextId = ids[i];
                sound.finishCallbacks = [
                    //function(){console.log(sound);self.play(sound.nextId)}.bind(sound)
                    function(e){console.log(e);console.log(this);self.play(this.nextId)}
                ];
            }
        }
        this.play(ids[0]);
    };

    SoundsManager.prototype.stop = function (soundId) {
        var sound = this.getSoundById(soundId);

        if (sound) {
            sound.stop();
        }
    };

    SoundsManager.prototype.stopAll = function () {
        forEach(this.list, function (sound) {
            sound.stop();
        });
    };

    SoundsManager.prototype.stopPersistent = function (soundId) {
        var sound = this.getSoundById(soundId);

        if (sound) {
            sound.stopPersistent();
        }
    };

    SoundsManager.prototype.stopAllPersistent = function () {
        forEach(this.list, function (sound) {
            sound.stopPersistent();
        });
    };

    SoundsManager.prototype.setVolume = function (soundId, volume) {
        var sound = this.getSoundById(soundId);

        if (sound) {
            sound.volume = volume;
        }
    };

    SoundsManager.prototype.setAllVolume = function (volume) {
        forEach(this.list, function (sound) {
            sound.volume = volume;
        });
    };

    SoundsManager.prototype.setSoundData = function (datas) {
        var sound = this.getSoundById(soundId);

        if (!sound) {
            return false;
        }

        sound.setData(datas);
    };

    SoundsManager.prototype.getSoundById = function (id) {
        return forEach(this.list, function (sound) {
            if (sound.id === id) {
                return sound;
            }
        });
    };

    SoundsManager.prototype.getSoundDuration = function (id) {
        var sound = this.getSoundById(id);
        if(sound){
            return sound.duration;
        }
    };

    SoundsManager.prototype.convertPath = function (path) {
        if (path === 'common') {
            return this.commonPath;
        } else if (path === 'local') {
            return this.localPath;
        }
        return path;
    };

    SoundsManager.prototype.canPlaySounds = function () {
        var promise = doesBrowserAllowToPlay();

        promise.then(function(){
            browserAllowToPlay = true
        }).catch(function(){
            browserAllowToPlay = false
        })

        return promise;
    };

    function checkIfSoundsCanPlay(soundList) {
        var result = true;

        forEach(soundList, function (sound) {
            if (!sound.canPlay) {
                result = false;
                return;
            }
        });

        return result;
    }

    function doesBrowserAllowToPlay() {
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
    }

    var playPromise = document.createElement('audio').play();

    if (!playPromise) {
        var originalPlay = HTMLAudioElement.prototype.play;
        HTMLAudioElement.prototype.play = function () {
            var audio = this;
            return new Promise(function (resolve, reject) {
                audio.onplaying = resolve;
                audio.onerror = reject;
                originalPlay.call(audio);
            });
        };
    }

    mix(SoundsManager, EmitterMixin);

    win.SoundsManager = SoundsManager;
})(window);
