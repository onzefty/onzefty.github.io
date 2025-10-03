import EmitterMixin from "../emitter/emitter-mixin.js";
import { getRandomID, doesBrowserAllowToPlay } from "../utils/utils.js";
import Sound from "./sound.js";

const privateProperties = {};

let instance = null;

export default class SoundsManager extends EmitterMixin {
    static get READY() {
        return "SoundsManager.ready";
    }

    static get PLAYING() {
        return "SoundsManager.playing";
    }

    static get STOPPED() {
        return "SoundsManager.stopped";
    }

    constructor(options) {
        if (instance) {
            return instance;
        } else {
            super();
            instance = this;
        }

        this.id = getRandomID();

        privateProperties[this.id] = {};

        this.options = {
            rootPath: "../../../",
            localPath: "./",
            directoryName: "sounds/",
            commonRelativePath: "common/content/assets/",
            localRelativePath: "",
            ...options,
        };

        this.commonPath = `${this.options.rootPath}${this.options.commonRelativePath}${this.options.directoryName}`;
        this.localPath = `${this.options.localPath}${this.options.localRelativePath}${this.options.directoryName}`;

        this.list = [];
        this.blacklist = [];
        this.fleetingList = [];
        this.ready = true;

        this.boundHandleSoundCanPlay = this.handleSoundCanPlay.bind(this);
        this.boundHandleSoundError = this.handleSoundError.bind(this);
        this.boundHandleSoundPlay = this.handleSoundPlay.bind(this);
        this.boundHandleSoundStop = this.handleSoundStop.bind(this);
    }

    get browserAllowToPlay() {
        return privateProperties[this.id].browserAllowToPlay;
    }

    get playing() {
        for (let i = 0; i < this.list.length; i++) {
            const sound = this.list[i];

            if (sound.playing) {
                return true;
            }
        }
    }

    handleSoundError(event) {
        const target = event.target;
        const targetIndex = this.list.indexOf(target);

        if (targetIndex > -1) {
            this.blacklist.push(target.name);

            this.list.splice(targetIndex, 1);
            this.handleSoundCanPlay();
        }

        target.destroy();
    }

    handleSoundCanPlay() {
        let allSoundsCanPlay = true;

        for (let i = 0; i < this.list.length; i++) {
            const sound = this.list[i];

            if (!sound.canPlay) {
                allSoundsCanPlay = false;
                break;
            }
        }

        if (allSoundsCanPlay) {
            this.ready = true;
            this.emit(SoundsManager.READY);
        }
    }

    handleSoundPlay(event) {
        const sound = event.target;

        this.emit(SoundsManager.PLAYING, {
            name: sound.name,
            id: sound.id,
            fleeting: this.fleetingList.includes(sound),
            playing: this.playing,
        });
    }

    handleSoundStop(event) {
        const sound = event.target;

        this.emit(SoundsManager.STOPPED, {
            name: sound.name,
            id: sound.id,
            fleeting: this.fleetingList.includes(sound),
            playing: this.playing,
        });
    }

    addSound(datas) {
        if (!datas) {
            return false;
        }

        if (this.blacklist.includes(datas.name) || this.getSoundById(datas.id)) {
            return false;
        }

        datas.path = this.convertPath(datas.path);
        datas.volume = (typeof this.volume === "number" ? this.volume : 1);

        const sound = new Sound(datas);

        sound.on(Sound.PLAY, this.boundHandleSoundPlay);
        sound.on(Sound.STOP, this.boundHandleSoundStop);
        sound.on(Sound.END, this.boundHandleSoundStop);
        sound.once(Sound.CAN_PLAY, this.boundHandleSoundCanPlay);
        sound.once(Sound.ERROR, this.boundHandleSoundError);

        this.list.push(sound);

        this.ready = false;
    }

    addSounds(datasList) {
        if (!datasList) {
            return false;
        }

        if (datasList.length === 0) {
            return false;
        }

        for (let i = 0; i < datasList.length; i++) {
            const datas = datasList[i];

            this.addSound(datas);
        }
    }

    removeSound(sound) {
        if (!sound) return;

        const soundIndex = this.list.indexOf(sound);

        if (soundIndex === -1) return;

        this.list.splice(soundIndex, 1);
        sound.destroy();
    }

    removeSounds(sounds) {
        if (!sounds || !Array.isArray(sounds) || sounds.length === 0) return;

        for (let i = 0; i < sounds.length; i++) {
            this.removeSound(sounds[i]);
        }
    }

    removeSoundById(soundId) {
        const sound = this.getSoundById(soundId);

        this.removeSound(sound);
    }

    removeSoundsById(soundIds) {
        if (!soundIds || !Array.isArray(soundIds) || soundIds.length === 0) return;

        for (let i = 0; i < soundIds.length; i++) {
            this.removeSoundById(soundIds[i]);
        }
    }

    playFleetingSound(soundId, options) {
        const { fleetingList, list } = this;

        for (let i = 0; i < list.length; i++) {
            const sound = list[i];

            if (sound.id === soundId) {
                const opts = {
                    id: null,
                    volume: null,
                    finishCallback: null,
                    callbackWhenStopped: true,
                    callbackOnFailed: true,
                    update: false,
                    smooth: false,
                    smoothDuration: null,
                    ...options,
                };

                const audio = new Sound({
                    ...sound.options,
                    id: opts.id || sound.id,
                });

                audio.once(Sound.END, function () {
                    const index = fleetingList.indexOf(this);

                    this.destroy();

                    fleetingList.splice(index, 1);
                });

                if (opts.volume) {
                    audio.volume = opts.volume;
                }

                if (opts.callbackWhenStopped) {
                    audio.once(Sound.STOP, function () {
                        this.handleEndSound();
                    });
                }

                if (opts.callbackOnFailed) {
                    audio.once(Sound.PLAY_FAILED, function () {
                        this.handleEndSound();
                    });
                }

                if (opts.finishCallback) {
                    audio.addFinishCallback(opts.finishCallback);
                }

                if (opts.update) {
                    audio.addUpdateEvent();
                }

                if (opts.smooth) {
                    audio.smoothPlay(opts.smoothDuration);
                } else {
                    audio.play();
                }

                fleetingList.push(audio);

                return true;
            }
        }

        return false;
    }

    play(soundId, options) {
        const sound = this.getSoundById(soundId);

        if (!sound) {
            return false;
        }

        const opts = {
            stopAll: true,
            volume: null,
            finishCallback: null,
            callbackWhenStopped: false,
            callbackOnFailed: true,
            update: false,
            smooth: false,
            smoothDuration: null,
            smoothStopDuration: null,
            ...options,
        };

        const triggerEnd = function () {
            clearEvents();

            this.handleEndSound();
        };

        const clearEvents = function () {
            sound.removeUpdateEvent();

            sound.off(Sound.STOP, triggerEnd);
            sound.off(Sound.PLAY_FAILED, triggerEnd);
            sound.off(Sound.END, clearEvents);
        };

        sound.once(Sound.END, clearEvents);

        if (!sound.playing && opts.stopAll && !sound.persistent) {
            if (opts.smooth) {
                this.smoothStopAll(opts.smoothStopDuration || opts.smoothDuration);
            } else {
                this.stopAll();
            }
        }

        if (opts.volume) {
            sound.volume = opts.volume;
        }

        if (opts.update) {
            sound.addUpdateEvent();
        }

        if (opts.callbackWhenStopped) {
            sound.on(Sound.STOP, triggerEnd);
        }

        if (opts.callbackOnFailed) {
            sound.on(Sound.PLAY_FAILED, triggerEnd);
        }

        if (opts.smooth) {
            sound.smoothPlay(opts.smoothDuration);
        } else {
            sound.play();
        }

        if (opts.finishCallback) {
            sound.addFinishCallback(opts.finishCallback);
        }

        return true;
    }

    pause(soundId) {
        const sound = this.getSoundById(soundId);

        if (!sound) {
            return false;
        }

        sound.pause();
        
        return true;
    }

    stop(soundId) {
        const sound = this.getSoundById(soundId);

        if (!sound) {
            return false;
        }

        sound.stop();

        return true;
    }

    smoothStop(soundId, duration) {
        const sound = this.getSoundById(soundId);

        if (!sound) {
            return false;
        }

        sound.smoothStop(duration);

        return true;
    }

    stopAll() {
        for (let i = 0; i < this.list.length; i++) {
            const sound = this.list[i];
            sound.stop();
        }
    }

    smoothStopAll(duration) {
        for (let i = 0; i < this.list.length; i++) {
            const sound = this.list[i];
            sound.smoothStop(duration);
        }
    }

    stopPersistent(soundId) {
        const sound = this.getSoundById(soundId);

        if (sound) {
            sound.stopPersistent();
        }
    }

    smoothStopPersistent(soundId, duration) {
        const sound = this.getSoundById(soundId);

        if (sound) {
            sound.smoothStopPersistent(duration);
        }
    }

    stopAllPersistent() {
        for (let i = 0; i < this.list.length; i++) {
            const sound = this.list[i];
            sound.stopPersistent();
        }
    }

    smoothStopAllPersistent(duration) {
        for (let i = 0; i < this.list.length; i++) {
            const sound = this.list[i];
            sound.smoothStopPersistent(duration);
        }
    }

    setVolume(soundId, volume) {
        const sound = this.getSoundById(soundId);

        if (sound) {
            sound.volume = volume;
        }
    }

    smoothSetVolume(soundId, volume, duration) {
        const sound = this.getSoundById(soundId);

        if (sound) {
            sound.smoothSetVolume(volume, duration);
        }
    }

    setAllVolume(volume) {
        for (let i = 0; i < this.list.length; i++) {
            const sound = this.list[i];
            sound.volume = volume;
        }
        this.volume = volume;
    }

    setSoundData(soundId, datas) {
        const sound = this.getSoundById(soundId);

        if (!sound) {
            return false;
        }

        sound.setData(datas);
    }

    getSoundById(id) {
        for (let i = 0; i < this.list.length; i++) {
            const sound = this.list[i];

            if (sound.id === id) {
                return sound;
            }
        }

        return null;
    }

    getSoundsById(id) {
        return this.list.filter((sound) => sound.id === id);
    }

    getFleetingSoundById(id) {
        for (let i = 0; i < this.fleetingList.length; i++) {
            const sound = this.fleetingList[i];

            if (sound.id === id) {
                return sound;
            }
        }

        return null;
    }

    getFleetingSoundsById(id) {
        return this.fleetingList.filter((sound) => sound.id === id);
    }

    convertPath(path) {
        const isCommon = path === "common";
        const isLocal = path === "local";

        return isCommon ? this.commonPath : typeof path === "string" && !isLocal ? path : this.localPath;
    }

    canPlaySounds() {
        const promise = doesBrowserAllowToPlay();

        promise
            .then(() => {
                privateProperties[this.id].browserAllowToPlay = true;
            })
            .catch(() => {
                privateProperties[this.id].browserAllowToPlay = false;
            });

        return promise;
    }
}
