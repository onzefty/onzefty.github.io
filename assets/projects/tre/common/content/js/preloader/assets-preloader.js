import EmitterMixin from "../emitter/emitter-mixin.js";
import RequestXHR from "../xhr/request-xhr.js";

function preloadAsset(assetData) {
    const preloadStyle =
        "position: absolute; height:1px; top: 0; left: 0; z-index: 0; opacity: 1; pointer-events: none";

    return new Promise((resolve) => {
        const success = function () {
            if (this instanceof HTMLElement) {
                this.remove();
            }

            resolve("success");
        };

        const failed = function () {
            if (this instanceof HTMLElement) {
                this.remove();
            }

            resolve("failed");
        };

        if (assetData.type === "image") {
            const image = document.createElement("img");

            image.setAttribute("style", preloadStyle);

            image.onload = success;
            image.onerror = failed;

            image.src = assetData.url;

            document.body.appendChild(image);
        } else if (assetData.type === "audio") {
            const audio = document.createElement("audio");

            audio.setAttribute("style", preloadStyle);

            audio.oncanplay = success;
            audio.onerror = failed;

            audio.src = assetData.url;

            document.body.appendChild(audio);
        } else {
            failed();
        }
    });
}

function detectAssetType(url) {
    return new Promise((resolve) => {
        const request = new RequestXHR({
            url,
        });

        let urlExtension = url.split("/").pop().split(".").pop().split("?").shift().trim();

        if (!urlExtension || urlExtension === "") {
            urlExtension = null;
        }

        request.on(RequestXHR.SUCCESS, (event) => {
            const { data } = event;
            const [type, desc] = data.headers["Content-Type"].split("/");

            resolve({
                url: url,
                type,
                desc,
                ext: urlExtension,
                status: data.status,
            });
        });

        request.on(RequestXHR.ERROR, (event) => {
            const { data } = event;

            resolve({
                url: url,
                type: "unknown",
                desc: null,
                ext: urlExtension,
                status: data.status,
            });
        });

        request.head().send();
    });
}

export default class AssetsPreloader extends EmitterMixin {
    static get READY() {
        return "AssetsPreloader.ready";
    }

    static get PROGRESS() {
        return "AssetsPreloader.progress";
    }

    constructor(options) {
        super();

        this.options = {
            assets: [],
            ...options,
        };

        this.assets = this.options.assets;
        this.assetsData = [];
        this.assetsStatus = [];
        this.progress = 0;

        this.ready = false;
    }

    load() {
        return new Promise((resolve) => {
            const detectedAssets = [];
            let progress = 0;

            const done = (result) => {
                this.assetsStatus = result;
                this.ready = true;
                this.emit(AssetsPreloader.READY);
                resolve();
            };

            for (let i = 0; i < this.assets.length; i++) {
                const asset = this.assets[i];
                const assetProm = detectAssetType(asset.url);

                assetProm
                    .then(() => {
                        this.updateProgress(++progress);
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                detectedAssets.push(assetProm);
            }

            Promise.all(detectedAssets)
                .then((result) => {
                    const preloadedAssets = [];

                    this.assetsData = result;

                    for (let i = 0; i < this.assetsData.length; i++) {
                        const data = this.assetsData[i];
                        let preloadProm = Promise.resolve();

                        if (data.status === 200 && data.type !== "unknown") {
                            preloadProm = preloadAsset(data);
                        }

                        preloadProm
                            .then(() => {
                                this.updateProgress(++progress);
                            })
                            .catch((error) => {
                                console.error(error);
                            });

                        preloadedAssets.push(preloadProm);
                    }

                    Promise.all(preloadedAssets).then(done).catch(done);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    updateProgress(num) {
        const progress = num / (this.assets.length * 2);

        this.progress = Math.max(0, Math.min(progress * 100, 100));

        this.emit(AssetsPreloader.PROGRESS);
    }
}
