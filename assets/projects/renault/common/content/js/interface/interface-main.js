import InterfaceResizer from "../interface/interface-resizer.js";

function execOnLoad() {
    const promises = [];
    const wrapper = document.querySelector("#mainWrapper");
    const scaleLoader = document.querySelector("#scaleLoader");
    const frames = Array.from(document.querySelectorAll("iframe"));

    const utils = {
        showLoader: () => {
            if (scaleLoader != null) {
                scaleLoader.classList.remove("hide");
            }
        },
        hideLoader: () => {
            if (scaleLoader != null) {
                scaleLoader.classList.add("hide");
            }
        },
    };

    new InterfaceResizer(wrapper);

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];

        try {
            const frameWin = frame.contentWindow;
            const frameDoc = frame.contentDocument || frameWin.document;
            const url = frame.dataset.src;

            const checkIfLoaded = (frame) => {
                return new Promise((resolve) => {
                    frame.onload = resolve;
                    frame.onerror = resolve;
                });
            };

            if (!frame.src || frame.src === "") {
                promises.push(checkIfLoaded(frame));
            } else {
                if (frameDoc.readyState === "complete") {
                    promises.push(Promise.resolve());
                } else {
                    promises.push(checkIfLoaded(frame));
                }
            }

            if (url) {
                frame.src = "";
                frame.src = url + window.location.search;
            }
        } catch (e) {
            console.warn("Frame : ", frame, `ignored due to error : ${e}`);
            frames.splice(i--, 1);
        }
    }

    Promise.all(promises).then(() => {
        utils.hideLoader();

        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            const frameWin = frame.contentWindow;
            const loadEvent = new frameWin.CustomEvent("wrapper-ready", {
                detail: utils,
            });
            frameWin.dispatchEvent(loadEvent);
        }
    });
}

if (document.readyState === "complete") {
    execOnLoad();
} else {
    window.addEventListener("load", () => {
        execOnLoad();
    });
}
