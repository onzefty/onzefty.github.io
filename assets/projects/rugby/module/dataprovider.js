var ofp = window.ofp || { player: {} };
ofp.player.dataprovider = {
    courseType: 'module',
    title: 'Rugby - World Cup',
    lang: "fr",

    config: {
        passationTime: 0,
        randomize: false,
        mastery_score: null,

        normalization: {
            enabled: true,
            //enabled: false,
            location: true,
            progress: false,
            completion: false,
            success: false,
            score: false,
            save: false,
            lockIfCompleted: false,
            errorAlert: "none"
        },

        resumeLastLocation: true,
        tutor: false,
        noTranslate: false,
        noRightClick: true,
        resize: 'none',
        center: true,
        iframeResizerPath: '../common/interface/js/lib/iframeresizer.contentwindow.js',
        autoHideLoader: false
    },

    home: '',
    end: '',
    menu: '',

    files: [
        { id: 1, src: 'battle/index.html', objectiveId: null, normalized: true, title: "Battle", type: 'battle' },
    ],

    objectives: [],
    assets: [],
    debug: false,
    //Paramètre pour chargement progressif des images selon écran en cours
    //Faire composant
    loading: "img",
    scorm: {
        type: 'unique',
        progress: true,
        passed: true,
        score: false,
        //Chaîne par défaut [Écran max vu, total des écrans, écran actuel, points granted]
        defaultBuildValues: [ [1, 1, 1]]
    },
    data: {
        languages: ["fr"],
        languageSelection: true,
        dates: [
            "2023-06-01T12:00:00.000Z",
            "2023-07-11T13:00:00.000Z",
            "2023-07-25T12:00:00.000Z",
            "2023-08-01T12:00:00.000Z",
            "2023-08-08T12:00:00.000Z",
            "2023-08-22T12:00:00.000Z",
            "2023-07-18T12:00:00.000Z"
        ],
        dateEnd: "2023-08-27T22:00:00.000Z"
    }
};
