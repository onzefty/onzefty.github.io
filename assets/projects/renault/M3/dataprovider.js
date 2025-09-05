const currentMode = typeof CURRENT_DEV_ENV !== "undefined" ? CURRENT_DEV_ENV : "development";

export default {
    type: "module",
    title: "Sens du Commerce Proactivité & Réactivité Service",
    projet: "Renault",
    config: {
        debug: currentMode === "development",
        files: {
            preload: false,
            cacheAfterOpen: true,
            lazyLoad: false,
        },
        scorm: {
            autoCheckCompleted: false,
        },
        resize: false,
        tutor: false,
        autoHideLoader: false,
        mobileOrientation: ["landscape", "portrait"],
        lang: "fr",
    },
    files: [
        { id: 1, src: "content_0/index.html", normalized: false, type: "lesson" },
        { id: 2, src: "content_1/index.html", normalized: true, type: "lesson" },
        { id: 3, src: "content_2/index.html", normalized: true, type: "lesson" },
        { id: 4, src: "content_3/index.html", normalized: true, type: "lesson" },
        { id: 5, src: "content_4/index.html", normalized: true, type: "lesson" },
        { id: 6, src: "content_5/index.html", normalized: true, type: "lesson" },
        { id: 7, src: "content_6/index.html", normalized: true, type: "lesson" },
        { id: 8, src: "content_7/index.html", normalized: true, type: "lesson" },
    ],
    assets: [],
    scorm: {
        type: "unique",
        success: true,
        //Chaîne par défaut [ question en cours, score, temps restant]
        defaultBuildValues: [
            ["-1", "4", "1"],
            ["-1", "7", "1"],
            ["-1", "1", "1"],
            ["-1", "21", "1"],
            ["-1", "33", "1"],
            ["-1", "27", "1"],
            ["-1", "13", "1"],
            ["-1", "13", "1"]
        ],
    },
    ID: 3,
};
