import VideoPlayer from "./videoplayer.js";

const CLASSES = {
    videoPlayer: "video-player",
    videoPlayerShort: "vp",
}

export default class VideoWrapper {
    constructor(options) {
        this.options = {
            container: null,
            video: {},
            end: () => {},
            play: () => {},
            pause: () => {},
            load: () => {},
            ...CLASSES,
            ...options,
        };

        this.options.video = {
            skin: "renault",
            player: {},
            ...this.options.video,
        };

        this.options.video.player = {
            controlsTooltip: true,
            mobileClickPlayPause: true,
            controls: ["play-large", "progress", "mute", "volume", "rewind", "play", "fast-forward"],
            tooltips: { controls: false, seek: true },
            ...this.options.video.player,
        };

        this.container = this.options.container;
        this.videoPlayer = null;
        this.data = {};

        this.boundPlayCallback = this.playCallback.bind(this);
        this.boundPauseCallback = this.pauseCallback.bind(this);
        this.boundEndCallback = this.endCallback.bind(this);
        this.boundLoadCallback = this.loadCallback.bind(this);

        this.init();
    }

    init() {
        const { videoPlayer, videoPlayerShort } = this.options;
        this.container.classList.add(videoPlayer);
        this.container.classList.add(videoPlayerShort);
        this.container.tabIndex = 0;

        this.videoPlayer = new VideoPlayer(this.container, this.options.video);

        this.launch();
    }

    launch() {
        if (!this.videoPlayer.loaded) {
            this.videoPlayer.onload = this.launch.bind(this);
            return;
        }

        if (!this.videoPlayer.ready) {
            this.videoPlayer.onready = this.launch.bind(this);
            return;
        }

        this.videoPlayer.onload = null;
        this.videoPlayer.onready = null;

        this.setupHandlers();
        this.loadCallback();
    }

    setupHandlers() {
        this.videoPlayer.player.on("play", this.boundPlayCallback);
        this.videoPlayer.player.on("pause", this.boundPauseCallback);
        this.videoPlayer.player.on("ended", this.boundEndCallback);
    }

    playCallback() {
        if (typeof this.options.play !== "function") {
            return;
        }

        this.options.play();
    }

    pauseCallback() {
        if (typeof this.options.pause !== "function") {
            return;
        }

        this.options.pause();
    }

    endCallback() {
        if (this.options.video.autoplay && !this.videoPlayer.player.ended) {
            return;
        }

        if (typeof this.options.end !== "function") {
            return;
        }

        this.options.end();
    }

    loadCallback() {
        if (typeof this.options.load !== "function") {
            return;
        }

        const loadData = {
            player: this.videoPlayer.player,
            wrapper: this.videoPlayer,
        };

        if (this.options.video.autoplay) {
            const checkAutoplay = () => {
                if (this.videoPlayer.player.paused) {
                    loadData.autoPlaySuccess = false;
                    this.options.load(loadData);
                } else {
                    loadData.autoPlaySuccess = true;
                    this.options.load(loadData);
                }
            };

            checkAutoplay();
        } else {
            this.options.load(loadData);
        }
    }

    hideControls() {
        this.container.classList.add(`hide-controls`);
    }

    showControls() {
        this.container.classList.remove(`hide-controls`);
    }

    toggleControls() {
        this.container.classList.toggle(`hide-controls`);
    }

    destroyHandlers() {
        this.videoPlayer.player.off("play", this.boundPlayCallback);
        this.videoPlayer.player.off("pause", this.boundPauseCallback);
        this.videoPlayer.player.off("ended", this.boundEndCallback);
    }

    destroy() {
        this.videoPlayer.player.destroy();
        this.showControls();
    }
}
