import EmitterMixin from "../emitter/emitter-mixin.js";
import Renderer from "../render/renderer.js";
import { clamp, MIME_TYPES, isDefined, noop } from "../utils/utils.js";

function createAudio(path, name) {
    const audio = new Audio();

    if (path.includes("blob:")) {
        audio.src = path;
    } else if (audio.canPlayType(MIME_TYPES.mp3)) {
        audio.src = `${path}${name}.mp3`;
    } else {
        audio.src = `${path}${name}.ogg`;
    }

    return audio;
}

export default class Sound extends EmitterMixin {
    static get PLAY() {
        return "Sound.play";
    }

    static get PLAY_FAILED() {
        return "Sound.play.failed";
    }

    static get PAUSE() {
        return "Sound.pause";
    }

    static get STOP() {
        return "Sound.stop";
    }

    static get END() {
        return "Sound.end";
    }

    static get CAN_PLAY() {
        return "Sound.canPlay";
    }

    static get ERROR() {
        return "Sound.error";
    }

    static get TIMEUPDATE() {
        return "Sound.timeUpdate";
    }

    constructor(options) {
        super();

        this.options = {
            id: "test_sound",
            name: "official_test_sound",
            path: "",
            loop: false,
            persistent: false,
            ...options,
        };

        this.element = null;

        this.id = this.options.id;
        this.name = this.options.name;
        this.finishCallbacks = [];
        this.persistent = this.options.persistent;
        this.renderer = new Renderer();
        this.canPlay = false;
        this.pauseCalled = false;
        this.currentSmooth;
        this.smoothBaseVolume = 0;
        this.playPromise;

        this.boundHandleEndSound = this.handleEndSound.bind(this);
        this.boundHandleCanPlay = this.handleCanPlay.bind(this);
        this.boundHandleError = this.handleError.bind(this);
        this.boundHandleTimeUpdate = this.handleTimeUpdate.bind(this);

        this.init();
    }

    get destroyed() {
        return this.element === null;
    }

    get ended() {
        return this.element.ended;
    }

    get playing() {
        return !this.element.paused;
    }

    get src() {
        return this.element.src;
    }

    get volume() {
        return this.element.volume;
    }

    set volume(value) {
        if (typeof value === "number" && !this.destroyed) {
            this.element.volume = clamp(0, value, 1);
        }
    }

    init() {
        const audio = createAudio(this.options.path, this.options.name);

        this.element = audio;
        this.element.loop = this.options.loop;
        this.volume = typeof this.options.volume === "number" ? this.options.volume : 1;

        this.element.addEventListener("ended", this.boundHandleEndSound);
        this.element.addEventListener("canplay", this.boundHandleCanPlay);
        this.element.addEventListener("error", this.boundHandleError);

        audio.load();
    }

    addUpdateEvent() {
        this.element.addEventListener("timeupdate", this.boundHandleTimeUpdate);
    }

    removeUpdateEvent() {
        this.element.removeEventListener("timeupdate", this.boundHandleTimeUpdate);
    }

    play() {
        if (!this.playing && !this.destroyed) {
            if (this.currentSmooth) {
                this.renderer.remove(this.currentSmooth);
            }

            this.pauseCalled = false;
            this.playPromise = this.element.play();

            if (this.playPromise instanceof Promise) {
                this.playPromise
                    .then(() => {
                        this.emit(Sound.PLAY);
                    })
                    .catch((error) => {
                        if (!this.pauseCalled) {
                            this.emit(Sound.PLAY_FAILED);
                            console.error(error);
                        }
                    });
            } else {
                this.emit(Sound.PLAY);
            }
        }
    }

    smoothPlay(duration) {
        if (!this.playing && !this.destroyed) {
            this.play();

            if (this.volume !== 0) {
                this.smoothBaseVolume = this.volume;
            }

            this.volume = 0;

            this.smoothSetVolume(this.smoothBaseVolume, duration, (data) => {
                if (!data.cancelled) {
                    this.volume = this.smoothBaseVolume;
                }
            });
        }
    }

    pause() {
        if (this.playing && !this.persistent && !this.destroyed) {
            if (this.currentSmooth) {
                this.renderer.remove(this.currentSmooth);
            }

            this.pauseCalled = true;
            this.element.pause();

            this.emit(Sound.PAUSE);
        }
    }

    smoothPause(duration) {
        if (this.playing && !this.persistent && !this.destroyed) {
            this.smoothSetVolume(0, duration, (data) => {
                if (!data.cancelled) {
                    this.pause();
                }

                this.volume = data.volume;
            });
        }
    }

    pausePersistent() {
        if (this.playing && this.persistent && !this.destroyed) {
            if (this.currentSmooth) {
                this.renderer.remove(this.currentSmooth);
            }

            this.pauseCalled = true;
            this.element.pause();

            this.emit(Sound.PAUSE);
        }
    }

    smoothPausePersistent(duration) {
        if (this.playing && this.persistent && !this.destroyed) {
            this.smoothSetVolume(0, duration, (data) => {
                if (!data.cancelled) {
                    this.pausePersistent();
                }

                this.volume = data.volume;
            });
        }
    }

    stop() {
        if (this.playing && !this.persistent && !this.destroyed) {
            if (this.currentSmooth) {
                this.renderer.remove(this.currentSmooth);
            }

            this.pauseCalled = true;
            this.element.pause();

            if (!Number.isNaN(this.element.duration)) {
                this.element.currentTime = 0;
            }

            this.emit(Sound.STOP);
        }
    }

    smoothStop(duration) {
        if (this.playing && !this.persistent && !this.destroyed) {
            this.smoothSetVolume(0, duration, (data) => {
                if (!data.cancelled) {
                    this.stop();
                }

                this.volume = data.volume;
            });
        }
    }

    stopPersistent() {
        if (this.playing && this.persistent && !this.destroyed) {
            if (this.currentSmooth) {
                this.renderer.remove(this.currentSmooth);
            }

            this.pauseCalled = true;
            this.element.pause();

            if (!Number.isNaN(this.element.duration)) {
                this.element.currentTime = 0;
            }

            this.emit(Sound.STOP);
        }
    }

    smoothStopPersistent(duration) {
        if (this.playing && this.persistent && !this.destroyed) {
            this.smoothSetVolume(0, duration, (data) => {
                if (!data.cancelled) {
                    this.stopPersistent();
                }

                this.volume = data.volume;
            });
        }
    }

    smoothSetVolume(volume, duration, callback) {
        if (typeof volume !== "number") {
            return Promise.resolve();
        }

        if (typeof duration !== "number" || Number.isNaN(duration)) {
            duration = 1000;
        }

        if (typeof callback !== "function") {
            callback = noop;
        }

        if (this.currentSmooth) {
            this.renderer.remove(this.currentSmooth);
        }

        const baseVolume = this.volume;
        const targetVolume = clamp(0, volume, 1);

        this.currentSmooth = this.renderer.add({
            fct: (data) => {
                const { time, name } = data;
                const progress = clamp(0, time.localElapsed / duration, 1);

                let newVolume = baseVolume;

                if (targetVolume > baseVolume) {
                    newVolume = baseVolume + targetVolume * progress;
                } else {
                    newVolume = baseVolume - (1 - targetVolume) * progress;
                }

                this.volume = newVolume;

                if (progress === 1) {
                    callback.call(this, {
                        cancelled: false,
                        volume: this.smoothBaseVolume,
                    });

                    this.renderer.removeByName(name);
                }
            },
            removeCallback: () => {
                callback.call(this, {
                    cancelled: true,
                    volume: this.smoothBaseVolume,
                });
            },
            context: this,
        });
    }

    handleEndSound() {
        for (let i = 0; i < this.finishCallbacks.length; i++) {
            const finishCallback = this.finishCallbacks[i];
            finishCallback();
        }

        this.finishCallbacks.length = 0;

        this.emit(Sound.END);
    }

    handleCanPlay() {
        this.canPlay = true;
        this.emit(Sound.CAN_PLAY);
    }

    handleError() {
        console.warn(`An error occurred with sound named "${this.options.name}".`);

        this.canPlay = true;
        this.emit(Sound.ERROR);
    }

    handleTimeUpdate(event) {
        this.emit(Sound.TIMEUPDATE, {
            event,
        });
    }

    addFinishCallback(callback) {
        if (typeof callback === "function" && !this.finishCallbacks.includes(callback)) {
            this.finishCallbacks.push(callback);
        }
    }

    removeFinishCallback(callback) {
        const callbackIndex = this.finishCallbacks.indexOf(callback);

        if (callbackIndex > -1) {
            this.finishCallbacks.splice(callbackIndex, 1);
        }
    }

    getData() {
        return {
            id: this.id,
            volume: this.volume,
            loop: this.element.loop,
        };
    }

    setData(datas) {
        const { id, volume, loop } = datas;

        if (isDefined(id)) {
            this.id = id;
        }

        if (isDefined(volume)) {
            this.volume = volume;
        }

        if (isDefined(id)) {
            this.element.loop = loop;
        }
    }

    destroy() {
        this.off();

        if (this.currentSmooth) {
            this.renderer.remove(this.currentSmooth);
        }

        this.removeUpdateEvent();
        
        this.element.removeEventListener("ended", this.boundHandleEndSound);
        this.element.removeEventListener("canplay", this.boundHandleCanPlay);
        this.element.removeEventListener("error", this.boundHandleError);

        this.stop();
        this.stopPersistent();

        this.element = null;
    }
}
