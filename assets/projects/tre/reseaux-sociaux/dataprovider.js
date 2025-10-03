const currentMode = typeof CURRENT_DEV_ENV !== "undefined" ? CURRENT_DEV_ENV : "development";

export default {
    type: "module",
    title: "Utilisation des réseaux sociaux",
    projet: "TRE",
    config: {
        debug: currentMode === "development",
        files: {
            preload: false,
            cacheAfterOpen: true,
            lazyLoad: false,
        },
        scorm: {
            resume: false,
            autoCheckCompleted: false,
        },
        resize: false,
        tutor: false,
        autoHideLoader: false,
        mobileOrientation: ["landscape", "portrait"],
        lang: "fr",
    },
    files: [
        { id: 1, src: "content_1/index.html", normalized: false, type: "lesson" },
    ],
    assets: [],
    scorm: {
        type: "unique",
        success: true,
        progress: true,
        //Chaîne par défaut [ écrans vus, nb d'écrans, écran en cours]
        defaultBuildValues: [
            ["-1", "29", "1"],
        ],
    },
    ID: 1,
};
