import Plyr from "./libs/plyr/plyr.js";

const scriptPath = new URL(import.meta.url).pathname.split("/").slice(0, -1).join("/") + "/";

/**
 * VideoPlayer default supported options
 * @typedef {Object} VideoPlayerOptions
 *
 * @param {Boolean} [debug = false]
 * @param {Number} [startTime = -1]
 * @param {Number} [endTime = -1]
 * @param {Boolean} [loop = false]
 * @param {Boolean} [muted = false]
 * @param {Boolean} [autoplay = false]
 * @param {Boolean} [resetOnEnd = false]
 * @param {Boolean} [speed = false]
 * @param {Boolean} [invertTime = false]
 * @param {Boolean} [fullscreen = false]
 * @param {Boolean} [keyboard = false]
 * @param {Boolean} [seekForward = true]
 * @param {Boolean} [controlsTooltip = true]
 * @param {String} [title = ""]
 * @param {PlyrOptions} [player = {}]
 * @param {String} [fileName = ""]
 * @param {String} [filePath = ""]
 * @param {String} [defaultQuality = "auto"]
 * @param {String} [qualityPrefix = "_"]
 * @param {Number[]} [quality = [1080, 480]]
 * @param {String[]} [formats = ["mp4", "webm"]]
 * @param {String} [posterUrl = ""]
 * @param {String[]} [captions = []]
 * @param {String[]} [previewThumbnails = []]
 * @param {String} [fileUrl = ""]
 * @param {String} [provider = ""]
 * @param {String} [skin = "none"]
 *
 */

const defaultOptions = {
    /* General options */
    debug: false,
    startTime: -1,
    endTime: -1,
    playedTime: -1,
    loop: false,
    muted: false,
    autoplay: false,
    resetOnEnd: false,
    speed: false,
    invertTime: false, // Reverse current time notation to decrease instead of increasing
    fullscreen: false,
    keyboard: false, // Allow user to use keyboard shortcuts
    seek: true, // Allow user to seek video progression
    seekForward: true, // Allow user to forward video progression
    controlsTooltip: true, // Enable tooltips on controls
    title: "", // Title of video
    player: {}, // Player documentation : https://github.com/sampotts/plyr
    drm: {},
    /* Non embeded options */
    fileName: "",
    filePath: "",
    defaultQuality: "auto",
    qualityPrefix: "_", // Used to load video dynamically, e.g. "test{qualityPrefix}{quality}"
    qualitySuffix: "p", // Used to load video dynamically, e.g. "test{quality}{qualitySuffix}"
    quality: [1080, 480],
    formats: ["mp4", "webm"],
    posterUrl: "", // Image displayed at currentTime === 0 (Used as pre-play thumbnail)
    captions: [], // Subtitles to apply to the video
    previewThumbnails: [], // Thumbnails shown as preview while hovering progress bar
    /* Embedded options */
    fileUrl: "",
    provider: "", // Embedded provider name (youtube or vimeo)
    skin: "none",
    lang: false,
};

const defaultDRMOptions = {
    enabled: false,
    systems: [],
    headers: {},
};

const defaultDRMSystems = {
    name: "",
    licenseURL: "",
    serverCertificateURL: "",
};

const defaultDRMRequestHeaders = {
    name: "",
    value: "",
};

let bandwidth = null;
let bandwidthRunningTest = null;

/**
 * VideoPlayer class which allows you to play videos.
 * @param {HTMLElement} container
 * @param {VideoPlayerOptions} options
 * @class
 */
export default class VideoPlayer {
    constructor(container, options) {
        this.container = typeof container === "string" ? document.querySelector(container) : container;

        if (!container) {
            throw new Error(`Specified container doesn't exist : ${container}`);
        }

        this.options = { ...defaultOptions, ...options };
        this.setDRMOptions(this.options);
        this.options.filePath = normalizePath(this.options.filePath);
        this.player = null;
        this.streamInstance = null;
        this.playerUIListeners = {};
        this.playerListeners = {};
        this.baseVideoElement = null;
        this.onload = () => {};
        this.onready = () => {};
        this.loaded = false;
        this.ready = false;

        this.setOptionsFromAttributes();
        this.init();
    }

    setDRMOptions(options) {
        options.drm = { ...defaultDRMOptions, ...options.drm };
        options.drm.systems = options.drm.systems.map((system) => ({ ...defaultDRMSystems, ...system }));

        const headerKeys = Object.keys(options.drm.headers);

        headerKeys.forEach((key) => {
            let values = options.drm.headers[key];

            if (!Array.isArray(values)) {
                options.drm.headers[key] = [];
                values = options.drm.headers[key];
            }

            options.drm.headers[key] = values.map((header) => ({
                ...defaultDRMRequestHeaders,
                ...header,
            }));
        });
    }

    setOptionsFromAttributes() {
        const attributes = Array.from(this.container.attributes);
        const excludeAttrNames = ["class", "id", "style"];
        const options = {};
        const attributeNameDict = {
            "reset-on-end": "resetOnEnd",
            "file-name": "fileName",
            "file-path": "filePath",
            "file-url": "fileUrl",
            "poster-url": "posterUrl",
            "quality-prefix": "qualityPrefix",
            "quality-suffix": "qualitySuffix",
            "preview-thumbnails": "previewThumbnails",
            "start-time": "startTime",
            "end-time": "endTime",
            "invert-time": "invertTime",
            "default-quality": "defaultQuality",
            "seek-forward": "seekForward",
            "controls-tooltip": "controlsTooltip",
        };

        attributes.forEach((attribute) => {
            const attributeName = attribute.name;

            if (excludeAttrNames.includes(attributeName)) {
                return;
            }

            const optionName = attributeNameDict[attributeName] || attributeName;
            let value = stringToTyped(attribute.value);

            if (typeof value === "string") {
                const isObjectArray = /^{.+},\s*{/g.test(value);

                if (!isObjectArray && value.includes(",")) {
                    value = value.split(",");
                }

                if (isObjectArray) {
                    value = value.split(/(?!})\s*,\s*(?={)/);
                }

                if (Array.isArray(value)) {
                    value = value.map((val) => stringToTyped(val.trim()));
                }
            }

            if (optionName === "filePath") {
                value = normalizePath(value);
            }

            if (Array.isArray(defaultOptions[optionName]) && !Array.isArray(value)) {
                value = [value];
            }

            options[optionName] = value;

            this.container.removeAttribute(attributeName);
        });

        this.options = { ...this.options, ...options };
    }

    async init() {
        const {
            debug,
            fileUrl,
            provider,
            posterUrl,
            previewThumbnails,
            autoplay,
            seekForward,
            seek: seekPlayer,
        } = this.options;

        this.playedTime =
            this.options.playedTime !== -1
                ? this.options.playedTime
                : this.options.startTime !== -1
                ? this.options.startTime
                : 0;

        const isStream =
            this.options.formats.includes("m3u8") ||
            this.options.formats.includes("mpd") ||
            ["hls", "dash"].includes(this.options.provider);

        if (fileUrl.length > 0) {
            this.options.quality = false;
        }

        if (this.options.quality && this.options.quality.length > 0) {
            if (this.options.defaultQuality === "auto") {
                if (bandwidth === null) {
                    try {
                        const results = await testBandwidth();
                        bandwidth = results;
                    } catch (error) {
                        bandwidth = "failed";
                    }
                }
            }

            this.setDefaultQuality();
        }

        const videoElement = createVideo(this.options);

        this.baseVideoElement = videoElement;

        this.container.innerHTML = "";
        this.container.appendChild(videoElement);

        const playerOptions = mergeDeep(
            {},
            Plyr.defaults,
            {
                debug,
                title: this.options.title,
                iconUrl: scriptPath + "skins/default/icons.svg",
                muted: this.options.muted,
                quality: {
                    default: this.options.defaultQuality,
                },
                loop: {
                    active: false,
                },
                tooltips: { controls: this.options.controlsTooltip },
                controls: [
                    "play-large",
                    "play",
                    "current-time",
                    "progress",
                    "duration",
                    "mute",
                    "volume",
                    "captions",
                    "settings",
                    "fullscreen",
                ],
                captions: { active: true, language: this.options.lang, update: true },
                keyboard: { focused: this.options.keyboard },
                fullscreen: { enabled: this.options.fullscreen },
                storage: { enabled: false },
                autoplay,
                invertTime: this.options.invertTime,
                listeners: {
                    seek: (event) => {
                        if (!seekPlayer) {
                            return false;
                        }

                        const timeInfo = this.getTimeInfo();
                        const seek = event.currentTarget;
                        const seekTo = seek.getAttribute("seek-value") || seek.value;
                        const time = (seekTo / seek.max) * this.player.duration;
                        let clampTime = clamp(timeInfo.start, timeInfo.end, time);

                        if (!seekForward && clampTime > this.playedTime) {
                            clampTime = this.playedTime;
                        }

                        seek.removeAttribute("seek-value");
                        this.player.currentTime = clampTime;

                        return false;
                    },
                    restart: () => {
                        const timeInfo = this.getTimeInfo();

                        this.player.currentTime = clamp(timeInfo.start, timeInfo.end, 0);

                        return false;
                    },
                    rewind: () => {
                        if (!seekPlayer) {
                            return false;
                        }

                        const timeInfo = this.getTimeInfo();
                        const time = timeInfo.current - this.player.config.seekTime;

                        this.player.currentTime = clamp(timeInfo.start, timeInfo.end, time);

                        return false;
                    },
                    fastForward: () => {
                        if (!seekPlayer) {
                            return false;
                        }

                        const timeInfo = this.getTimeInfo();
                        const time = timeInfo.current + this.player.config.seekTime;
                        let clampTime = clamp(timeInfo.start, timeInfo.end, time);

                        if (!seekForward && clampTime > this.playedTime) {
                            clampTime = Math.min(clampTime, this.playedTime);
                        }

                        this.player.currentTime = clampTime;

                        return false;
                    },
                },
                i18n: {
                    restart: "Relancer",
                    rewind: "Reculer de {seektime}s",
                    play: "Lire",
                    pause: "Pause",
                    fastForward: "Avancer de {seektime}s",
                    volume: "Volume",
                    mute: "Désactiver le son",
                    unmute: "Activer le son",
                    enableCaptions: "Activer les sous-titres",
                    disableCaptions: "Désactiver les sous-titres",
                    download: "Télécharger",
                    enterFullscreen: "Plein écran",
                    exitFullscreen: "Quitter le plein écran",
                    captions: "Sous-titres",
                    settings: "Paramètres",
                    pip: "Lecteur réduit",
                    speed: "Vitesse",
                    normal: "Normal",
                    quality: "Qualité",
                    loop: "Lire en boucle",
                    start: "Début",
                    end: "Fin",
                    all: "Tout",
                    reset: "Réinitialiser",
                    disabled: "Désactiver",
                    enabled: "Activer",
                    advertisement: "Pub",
                },
            },
            this.options.player
        );

        if (this.options.skin !== "none") {
            playerOptions.iconUrl = scriptPath + "skins/" + this.options.skin + "/" + "icons.svg";
        }

        if (!this.options.speed) {
            const speedIndex = playerOptions.settings.indexOf("speed");
            playerOptions.settings = [...playerOptions.settings];
            playerOptions.settings.splice(speedIndex, 1);
        }

        if (isStream) {
            let source = "";

            if (this.options.fileUrl) {
                source = this.options.fileUrl;
            } else {
                source = this.options.filePath + this.options.fileName + "." + "{{format}}";
            }

            const initStreamingSources = async (format) => {
                const videoSrc = format ? source.replace("{{format}}", format) : source;
                const isHLS = format ? format === "m3u8" : this.options.provider === "hls";
                const isDash = format ? format === "mpd" : this.options.provider === "dash";

                const initLiveStream = (isLive) => {
                    const player = this.player;

                    if (!player) return;
                    if (!isLive) return true;

                    const container = player.elements.container;
                    const liveIcon = document.createElement("div");
                    const playBtn = container.querySelector(".plyr__control[data-plyr=play]");
                    const duration = container.querySelector(".plyr__time--duration");

                    container.classList.add("plyr--live");

                    liveIcon.classList.add("plyr__live__icon", "plyr__control");
                    liveIcon.setAttribute("aria-label", "Live");

                    playBtn.after(liveIcon);

                    if (duration) {
                        duration.hidden = true;
                    }

                    return true;
                };

                if (isHLS) {
                    await import("./libs/hls/hls.min.js");

                    if (typeof Hls === "undefined") {
                        console.warn("Hls.js is required to play m3u8 files");
                        return;
                    }

                    if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
                        videoElement.src = videoSrc;
                    } else if (Hls.isSupported()) {
                        await new Promise((resolve) => {
                            const hlsConfig = {
                                startPosition: 0,
                            };

                            if (this.options.drm.enabled) {
                                const drmSystems = this.options.drm.systems;
                                const drmHeaders = this.options.drm.headers;
                                const drmHeadersKeys = Object.keys(drmHeaders);

                                if (drmSystems.length > 0) {
                                    hlsConfig.emeEnabled = true;

                                    hlsConfig.drmSystems = {};

                                    drmSystems.forEach((system) => {
                                        const systemConf = {};

                                        if (system.licenseURL) {
                                            systemConf.licenseUrl = system.licenseURL;
                                        }

                                        if (system.serverCertificateURL) {
                                            systemConf.serverCertificateUrl = system.serverCertificateURL;
                                        }

                                        hlsConfig.drmSystems[system.name] = systemConf;
                                        hlsConfig.widevineLicenseUrl = system.licenseURL;
                                    });

                                    hlsConfig.drmSystemOptions = {
                                        audioRobustness: "SW_SECURE_CRYPTO",
                                        videoRobustness: "SW_SECURE_CRYPTO",
                                    };

                                    if (drmHeadersKeys.length > 0) {
                                        hlsConfig.licenseXhrSetup = (xhr, _, keyContext) => {
                                            const keySystem = keyContext.keySystem;
                                            const keyHeaders = drmHeaders[keySystem];

                                            if (keyHeaders && keyHeaders.length > 0) {
                                                keyHeaders.forEach((header) => {
                                                    xhr.setRequestHeader(header.name, header.value);
                                                });
                                            }
                                        };
                                    }
                                }
                            }

                            this.streamInstance = new Hls(hlsConfig);

                            const updateQuality = (quality) => {
                                if (quality === 0) {
                                    this.streamInstance.currentLevel = -1; //Enable AUTO quality if option.value = 0
                                } else {
                                    this.streamInstance.levels.forEach((level, levelIndex) => {
                                        if (level.height === quality) {
                                            this.streamInstance.currentLevel = levelIndex;
                                        }
                                    });
                                }
                            };

                            const initializing = (_, data) => {
                                this.streamInstance.off(Hls.Events.MANIFEST_PARSED, initializing);

                                const availableLangs = [];
                                const availableQualities = Array.from(
                                    new Set([0, ...this.streamInstance.levels.map((l) => l.height)])
                                );

                                if (data.subtitleTracks) {
                                    data.subtitleTracks.forEach((track, index) => {
                                        const langNormalized = track.lang.slice(0, 2);

                                        if (availableLangs.includes(langNormalized)) {
                                            data.subtitleTracks.splice(index, 1);
                                            return;
                                        }

                                        if (track.lang !== langNormalized) {
                                            data.subtitleTracks[index].lang = langNormalized;
                                        }

                                        availableLangs.push(langNormalized);
                                    });
                                }

                                if (availableQualities.filter((q) => q > 0).length > 1) {
                                    playerOptions.quality = {
                                        default: 0, // Auto
                                        options: availableQualities,
                                        forced: true,
                                        onChange: (e) => updateQuality(e),
                                    };

                                    playerOptions.i18n.qualityLabel = {
                                        0: "Auto",
                                    };
                                }

                                const checkLive = (_, data) => {
                                    const isLive = data.details.live;

                                    if (!this.player) {
                                        if (isLive) {
                                            playerOptions.duration = Infinity;
                                        }

                                        this.player = new Plyr(videoElement, playerOptions);
                                        this.streamInstance.attachMedia(videoElement);

                                        this.streamInstance.subtitleDisplay = false;

                                        this.addPlayerListener("languagechange", () => {
                                            this.streamInstance.subtitleTrack = this.player.captions.currentTrack;
                                        });
                                    }

                                    const success = initLiveStream(isLive);

                                    if (success) {
                                        this.streamInstance.off(Hls.Events.LEVEL_LOADED, checkLive);
                                        resolve();
                                    }
                                };

                                this.streamInstance.on(Hls.Events.LEVEL_LOADED, checkLive);
                            };

                            this.streamInstance.on(Hls.Events.MANIFEST_PARSED, initializing);

                            this.streamInstance.loadSource(videoSrc);
                        });
                    } else {
                        console.warn("Your browser doesn't support m3u8 files");
                    }

                    return;
                }

                if (isDash) {
                    await import("./libs/dashjs/dash.all.min.js");

                    if (typeof dashjs === "undefined") {
                        console.warn("dash.js is required to play mpd files");
                        return;
                    }

                    const protectionData = {};

                    if (this.options.drm.enabled) {
                        const drmSystems = this.options.drm.systems;
                        const drmHeaders = this.options.drm.headers;

                        if (drmSystems.length > 0) {
                            drmSystems.forEach((system) => {
                                const systemConf = {};
                                const headers = drmHeaders[system.name];

                                if (system.licenseURL) {
                                    systemConf.serverURL = system.licenseURL;
                                }

                                systemConf.audioRobustness = "SW_SECURE_CRYPTO";
                                systemConf.videoRobustness = "SW_SECURE_CRYPTO";

                                if (headers && headers.length > 0) {
                                    systemConf.httpRequestHeaders = {};

                                    headers.forEach((header) => {
                                        systemConf.httpRequestHeaders[header.name] = header.value;
                                    });
                                }

                                protectionData[system.name] = systemConf;
                            });
                        }
                    }

                    const updateQuality = (quality) => {
                        if (quality === 0) {
                            this.streamInstance.getSettings().streaming.abr.autoSwitchBitrate.video = true;
                        } else {
                            this.streamInstance.getSettings().streaming.abr.autoSwitchBitrate.video = false;

                            const bitrates = this.streamInstance.getBitrateInfoListFor("video");

                            for (let i = 0; i < bitrates.length; i++) {
                                const bitrate = bitrates[i];

                                if (bitrate.height === quality) {
                                    this.streamInstance.setQualityFor("video", bitrate.qualityIndex);
                                    return;
                                }
                            }
                        }
                    };

                    const instanciateDash = (videoElement, source) => {
                        this.streamInstance = dashjs.MediaPlayer().create();
                        this.streamInstance.initialize(videoElement, source || videoSrc, autoplay);
                        this.streamInstance.setProtectionData(protectionData);
                        this.streamInstance.preload();
                    };

                    // Preload the video to get the manifest
                    instanciateDash();

                    await new Promise((resolve) => {
                        let isLive = false;
                        let parsedManifest = {};

                        const initializing = (mediaData) => {
                            const mediaInfo = mediaData.mediaInfo;

                            if (mediaInfo.type !== "video") return;

                            this.streamInstance.off(dashjs.MediaPlayer.events.STREAM_INITIALIZING, initializing);

                            const bitrateList = mediaInfo.bitrateList;
                            const availableQualities = Array.from(new Set([0, ...bitrateList.map((b) => b.height)]));

                            if (availableQualities.filter((q) => q > 0).length > 1) {
                                playerOptions.quality = {
                                    default: 0, // Auto
                                    options: availableQualities,
                                    forced: true,
                                    onChange: (e) => updateQuality(e),
                                };

                                playerOptions.i18n.qualityLabel = {
                                    0: "Auto",
                                };
                            }

                            if (isLive) {
                                playerOptions.duration = Infinity;
                            }

                            this.player = new Plyr(videoElement, playerOptions);

                            instanciateDash(videoElement, parsedManifest);

                            this.addPlayerListener("languagechange", () => {
                                const currentLang = this.player.captions.language;
                                const tracks = this.streamInstance.getTracksFor("text");
                                const trackId = tracks.findIndex((track) => track.lang === currentLang);

                                this.streamInstance.setTextTrack(trackId);
                            });

                            initLiveStream(isLive);

                            resolve();
                        };

                        const manistedLoaded = (event) => {
                            isLive = event.data.type === "dynamic";

                            parsedManifest = event.data;

                            this.streamInstance.off(dashjs.MediaPlayer.events.MANIFEST_LOADED, manistedLoaded);
                            this.streamInstance.on(dashjs.MediaPlayer.events.STREAM_INITIALIZING, initializing);
                        };

                        this.streamInstance.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, manistedLoaded);
                    });

                    return;
                }
            };

            if (this.options.fileUrl) {
                await initStreamingSources();
            } else {
                for (const format of this.options.formats) {
                    await initStreamingSources(format);
                }
            }
        }

        if (!this.player) {
            this.player = new Plyr(videoElement, playerOptions);
        }

        if (fileUrl.length > 0 && !isStream) {
            const source = {
                src: fileUrl,
            };

            if (provider) {
                source.provider = provider;
            } else {
                const extSplit = fileUrl.split(".");

                if (extSplit.length > 1) {
                    const fileExtension = extSplit.pop();
                    const mimeType = getMimeByExtension(fileExtension);

                    if (mimeType) {
                        source.type = mimeType;
                    }
                }
            }

            this.player.source = {
                type: "video",
                sources: [source],
            };
        }

        if (!seekForward) {
            this.player._forward = this.player.forward;

            this.player.forward = function (seekTime) {
                const addTime = typeof seekTime === "number" ? seekTime : this.config.seekTime;
                const time = this.player.currentTime + addTime;

                if (!seekForward && time > this.playedTime) {
                    this.currentTime = Math.min(time, this.playedTime);
                    return false;
                }

                this._forward.call(this, arguments);
            };
        }

        if (posterUrl.length > 0) {
            this.player.poster = posterUrl;
        }

        if (previewThumbnails.length > 0) {
            this.player.setPreviewThumbnails({
                enabled: true,
                src: previewThumbnails,
            });
        }

        if (this.options.startTime !== -1) {
            const handleStartTime = () => {
                const timeInfo = this.getTimeInfo();
                this.updateMute();

                if (timeInfo.current < timeInfo.start) {
                    this.player.currentTime = timeInfo.start;
                }
            };

            this.player.once("ready", handleStartTime);
            this.player.once("loadedmetadata", handleStartTime);
        }

        if (this.options.skin !== "none") {
            this.player.elements.container.classList.add(`plyr-skin-${this.options.skin}`);
        }

        this.loaded = true;

        if (this.destroyPlaned) {
            this.destroy();
            return;
        } else {
            this.onload();
        }

        if (this.player.elements.inputs.seek) {
            // Custom input event to support seekForward system and start, end time system
            this.addPlayerUIListener(this.player.elements.inputs.seek, "input", () => {
                const seekInputs = this.player.elements.inputs.seek;
                const seekTooltip = this.player.elements.display.seekTooltip;
                const currentTimeEl = this.player.elements.display.currentTime;

                if (!seekInputs) {
                    return;
                }

                const timeInfo = this.getTimeInfo();
                const start = (timeInfo.start / parseFloat(this.player.duration)) * 100;
                const end = (timeInfo.end / parseFloat(this.player.duration)) * 100;
                const current = (this.playedTime / parseFloat(this.player.duration)) * 100;
                const value = parseFloat(seekInputs.value);

                if (!seekPlayer) {
                    seekInputs.value = (this.player.currentTime / this.player.duration) * 100;
                    seekInputs.style.setProperty("--value", `${seekInputs.value}%`);
                    return false;
                }

                if (!seekForward && value > current) {
                    seekInputs.value = current;
                    seekInputs.style.setProperty("--value", `${seekInputs.value}%`);

                    seekTooltip.style.left = `${current}%`;
                    seekTooltip.textContent = currentTimeEl.textContent;

                    return false;
                }

                if (value < start) {
                    seekInputs.value = start;

                    seekTooltip.style.left = `${start}%`;
                    seekTooltip.textContent = currentTimeEl.textContent;
                }

                if (value > end) {
                    seekInputs.value = end;

                    seekTooltip.style.left = `${end}%`;
                    seekTooltip.textContent = currentTimeEl.textContent;
                }

                seekInputs.style.setProperty("--value", `${seekInputs.value}%`);
            });

            this.addPlayerUIListener(this.player.elements.inputs.seek, "mousedown", () => {
                const seekInputs = this.player.elements.inputs.seek;
                const seekTooltip = this.player.elements.display.seekTooltip;

                if (!seekTooltip) return;

                if (!seekPlayer) {
                    if (seekTooltip) {
                        this.player.config.tooltips.seek = false;
                        seekTooltip.classList.remove(`${this.player.config.classNames.tooltip}--visible`);
                    }

                    if (seekInputs.hasAttribute("play-on-seeked")) {
                        this.player.play();
                    }

                    return false;
                }
            });

            this.addPlayerUIListener(this.player.elements.inputs.seek, "mouseup", () => {
                const seekTooltip = this.player.elements.display.seekTooltip;

                if (!seekTooltip) return;

                if (!seekPlayer) {
                    this.player.config.tooltips.seek = true;
                    seekTooltip.classList.add(`${this.player.config.classNames.tooltip}--visible`);
                } else {
                    this.player.config.tooltips.seek = true;
                }
            });
        }

        this.addPlayerListener("play", () => {
            const timeInfo = this.getTimeInfo();
            this.updateMute();

            if (timeInfo.current >= timeInfo.end) {
                this.player.currentTime = timeInfo.start;
            }
        });

        this.addPlayerListener("ended", () => {
            const timeInfo = this.getTimeInfo();

            if (!this.options.loop) {
                if (this.options.resetOnEnd) {
                    this.player.currentTime = timeInfo.start;
                }

                this.player.pause();
            } else {
                this.player.currentTime = timeInfo.start;
                this.player.play();
            }
        });

        this.addPlayerListener("timeupdate", () => {
            const timeInfo = this.getTimeInfo();

            if (isNaN(timeInfo.current)) return;

            if (this.player.currentTime < timeInfo.start) {
                this.player.currentTime = Math.max(timeInfo.start, this.player.currentTime);
            }

            this.playedTime = Math.max(this.player.currentTime, this.playedTime);

            if (timeInfo.current >= timeInfo.end) {
                if (this.options.loop) {
                    this.player.currentTime = timeInfo.start;
                    return;
                }

                this.player.pause();
            }
        });

        let metadataLoaded = false;
        let canplayFired = false;

        const checkReady = () => {
            if (metadataLoaded && canplayFired) {
                this.ready = true;

                if (this.destroyPlaned) {
                    this.destroy();
                } else {
                    this.onready();
                }
            }
        };

        if (this.player.media.readyState >= 1) {
            metadataLoaded = true;
        } else {
            this.player.once("loadedmetadata", () => {
                metadataLoaded = true;
                checkReady();
            });
        }

        if (this.player.media.readyState >= 3) {
            canplayFired = true;
        } else {
            this.player.once("canplay", () => {
                canplayFired = true;
                checkReady();
            });
        }

        checkReady();
    }

    updateMute() {
        const playerEmbed = this.player.embed;

        if (this.player.isEmbed && playerEmbed) {
            if (this.player.muted) {
                if (typeof playerEmbed.mute === "function") {
                    playerEmbed.mute();
                }

                if (typeof playerEmbed.setMuted === "function") {
                    playerEmbed.setMuted(true);
                }
            } else {
                if (typeof playerEmbed.unMute === "function") {
                    playerEmbed.unMute();
                }

                if (typeof playerEmbed.setMuted === "function") {
                    playerEmbed.setMuted(false);
                }
            }
        }
    }

    onLoad(callback) {
        if (typeof callback === "function") {
            this.onload = callback;
        }

        if (this.loaded) {
            this.onload();
        }
    }

    onReady(callback) {
        if (typeof callback === "function") {
            this.onready = callback;
        }

        if (this.ready) {
            this.onready();
        }
    }

    getTimeInfo() {
        const { startTime, endTime } = this.options;
        const start = startTime === -1 ? 0 : startTime;
        const end = endTime === -1 ? this.player.duration : endTime;

        return {
            start,
            end,
            current: this.player.currentTime,
        };
    }

    setDefaultQuality() {
        const quality = this.options.quality;
        const defaultQuality = this.options.defaultQuality;

        if (bandwidth === "failed") {
            console.warn("Failed to detect user bandwidth, switching to lowest quality");
            this.options.defaultQuality = Math.min(...quality);
        } else if (bandwidth) {
            let optimalQuality;

            if (bandwidth.mbps >= 50) {
                optimalQuality = 4320; // 8K UHD
            } else if (bandwidth.mbps >= 35 && bandwidth.mbps < 50) {
                optimalQuality = 2160; // 4K UHD
            } else if (bandwidth.mbps >= 25 && bandwidth.mbps < 35) {
                optimalQuality = 1440; // 2K QHD
            } else if (bandwidth.mbps >= 15 && bandwidth.mbps < 25) {
                optimalQuality = 1080; // Full HD
            } else if (bandwidth.mbps >= 6 && bandwidth.mbps < 15) {
                optimalQuality = 720; // HD
            } else if (bandwidth.mbps >= 3 && bandwidth.mbps < 6) {
                optimalQuality = 576; // Standard Definition (SD)
            } else if (bandwidth.mbps >= 2 && bandwidth.mbps < 3) {
                optimalQuality = 480; // Lower SD
            } else if (bandwidth.mbps >= 1.5 && bandwidth.mbps < 2) {
                optimalQuality = 360; // Low quality
            } else {
                optimalQuality = 240; // Very low quality
            }

            this.options.defaultQuality = closest(quality, optimalQuality);
        } else {
            if (!quality.includes(defaultQuality)) {
                console.warn("Given defaultQuality is not in the current quality list : " + quality);
                console.warn("Switching to lowest quality");
                this.options.defaultQuality = Math.min(...quality);
            }
        }
    }

    addPlayerUIListener(target, event, callback) {
        if (!this.player) {
            return;
        }

        if (!this.playerUIListeners[event]) {
            this.playerUIListeners[event] = [];
        }

        this.playerUIListeners[event].push({
            target,
            callback,
        });

        target.addEventListener(event, callback);
    }

    addPlayerListener(event, callback) {
        if (!this.player) {
            return;
        }

        if (!this.playerListeners[event]) {
            this.playerListeners[event] = [];
        }

        this.playerListeners[event].push(callback);

        this.player.on(event, callback);
    }

    destroy() {
        if (!this.ready || !this.loaded) {
            this.destroyPlaned = true;
        }

        if (!this.player) {
            return;
        }

        if (this.streamInstance) {
            this.streamInstance.destroy();
        }

        for (const event in this.playerUIListeners) {
            const listeners = this.playerUIListeners[event];

            for (const listener of listeners) {
                listener.target.removeEventListener(event, listener.callback);
            }
        }

        this.playerUIListeners = {};

        for (const event in this.playerListeners) {
            const listeners = this.playerListeners[event];

            for (const listener of listeners) {
                this.player.off(event, listener);
            }
        }

        this.playerListeners = {};

        if (this.player._forward) {
            this.player.forward = this.player._forward;
            delete this.player._forward;
        }

        if (this.player.elements.original) {
            Array.from(this.player.elements.original.querySelectorAll("source, track")).forEach((el) => {
                el.remove();
            });

            const textTracks = this.player.elements.original.textTracks;

            if (textTracks && typeof textTracks[Symbol.iterator] === "function") {
                Array.from(textTracks).forEach((textTrack) => {
                    if (textTrack.cues) {
                        const cues = Array.from(textTrack.cues);

                        cues.forEach((cue) => {
                            textTrack.removeCue(cue);
                        });
                    }

                    textTrack.mode = "disabled";
                });
            }
        }

        let playerOriginal = this.player.elements.original;

        this.player.destroy(() => {
            if (playerOriginal) {
                playerOriginal.remove();
                playerOriginal = null;
            }

            this.player = null;

            if (this.baseVideoElement) {
                this.baseVideoElement.remove();
                this.baseVideoElement = null;
            }
        });

        this.ready = false;
        this.loaded = false;
    }
}

function testBandwidth() {
    const fileUrl = scriptPath + "bandwidth-test.jpg";
    const fileBits = 1070583;

    if (!bandwidthRunningTest) {
        bandwidthRunningTest = new Promise((resolve, reject) => {
            const img = new Image();
            const startTime = Date.now();

            img.onload = () => {
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;
                const bitsLoaded = fileBits * 8;
                const bps = round(bitsLoaded / duration);
                const kbps = round(bps / 1024);
                const mbps = round(kbps / 1024);
                const Ko = round(kbps / 8);
                const Mo = round(mbps / 8);

                resolve({
                    duration,
                    bitsLoaded,
                    bps,
                    kbps,
                    mbps,
                    Ko,
                    Mo,
                });
            };

            img.onerror = reject;
            img.src = fileUrl + "?t=" + startTime;
        });
    }

    return bandwidthRunningTest;
}

function createVideo(options) {
    const { filePath, fileName, qualityPrefix, qualitySuffix, quality, formats, captions, autoplay } = options;
    const availableQualities = Plyr.defaults.quality.options;
    const sourceFragment = document.createDocumentFragment();
    const tracksFragment = document.createDocumentFragment();
    const videoElement = document.createElement("video");

    if (filePath && fileName) {
        for (const format of formats) {
            for (const caption of captions) {
                const track = createTrack(caption);
                tracksFragment.appendChild(track);
            }

            if (!quality || quality.length === 0) {
                const sourcePath = filePath + fileName + "." + format;
                const source = createSource(sourcePath, null, format, autoplay);

                if (!source) continue;

                sourceFragment.appendChild(source);

                continue;
            }

            for (const qualityValue of quality) {
                if (!availableQualities.includes(qualityValue)) {
                    console.warn(qualityValue + "p quality is not available, format : " + format);
                    continue;
                }

                const sourcePath = filePath + fileName + qualityPrefix + qualityValue + qualitySuffix + "." + format;
                const source = createSource(sourcePath, qualityValue, format, autoplay);

                if (!source) continue;

                sourceFragment.appendChild(source);
            }
        }
    }

    // Iphone support
    videoElement.setAttribute("playsinline", "");

    videoElement.appendChild(sourceFragment);
    videoElement.appendChild(tracksFragment);

    return videoElement;
}

function createTrack(caption) {
    const videoTrack = document.createElement("track");

    for (const attributeName in caption) {
        videoTrack.setAttribute(attributeName, caption[attributeName]);
    }

    return videoTrack;
}

function getMimeDict() {
    return {
        flv: "video/x-flv",
        mp4: "video/mp4",
        m3u8: "application/x-mpegURL",
        mpd: "application/dash+xml",
        avi: "video/x-msvideo",
        wmv: "video/x-ms-wmv",
        mpeg: "video/mpeg",
        ogv: "video/ogg",
        webm: "video/webm",
    };
}

function getMimeByExtension(extension) {
    const mimeDict = getMimeDict();

    return mimeDict[extension];
}

function createSource(src, size, format) {
    if (format === "m3u8" || format === "mpd") {
        return;
    }

    const type = getMimeByExtension(format);

    const videoSource = document.createElement("source");
    videoSource.setAttribute("src", src);

    if (!type) {
        console.warn(`Unknown mime type for extension : ${format}`);
    }

    videoSource.setAttribute("type", type);

    if (size) {
        videoSource.setAttribute("size", size);
    }

    return videoSource;
}

function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}

function mergeDeep(target, ...sources) {
    sources.forEach((source) => {
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach((key) => {
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            });
        }
    });

    return target;
}

function stringToTyped(str) {
    try {
        const sanitizeStr = str.replace(/([a-z0-9A-Z_]+)\s*:(?![^\s'"])/g, '"$1": ');
        return JSON.parse(sanitizeStr);
    } catch (error) {
        return str;
    }
}

function normalizePath(path) {
    const normalizedPath = path.replace(/\\/g, "/");

    if (typeof path !== "string" || path.length === 0) {
        return ".";
    }

    return /\/$/.test(normalizedPath) ? normalizedPath : `${normalizedPath}/`;
}

function clamp(min, max, value) {
    return Math.min(Math.max(min, value), max);
}

function closest(array, value) {
    return array.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
}

function round(number, precision = 2) {
    const p = Math.pow(10, precision);
    return Math.round(number * p) / p;
}
