var ofp = window.ofp || {  player: {} };
ofp.player.dataprovider = {
    courseType: 'module',
    title: 'IFCAM',
    lang: "en",

    config: {
        passationTime: 0,
        randomize: false,
        mastery_score: 0,

        normalization: {
            enabled: true,
            location: true,
            progress: false,
            completion: false,
            success: false,
            score: false,
            save: false,
            lockIfCompleted: false,
            //errorAlert: "critical"
        },

        resumeLastLocation: true,
        tutor: false,
        noTranslate: false,
        noRightClick: true,
        resize: 'none',
        center: true,
        iframeResizerPath:'../common/interface/js/lib/iframeresizer.contentwindow.js',
        autoHideLoader:false
    },

    home: '',
    end: '',
    menu: '',

    files: [
        { id: 1, src: 'part-1/index.html', objectiveId: null, normalized: true, title: "Bienvenue", type: 'lesson' },
        { id: 2, src: 'part-2/index.html', objectiveId: null, normalized: true, title: "Les attentes à l’égard des institutions financières concernant les risques environnementaux", type: 'lesson' },
        { id: 3, src: 'part-3/index.html', objectiveId: null, normalized: true, title: "Prendre en compte les risques environnementaux dans notre gestion de risques", type: 'lesson' },
        { id: 4, src: 'part-4/index.html', objectiveId: null, normalized: true, title: "Le dispositif de gestion des risques : Adaptons ensemble le dispositif", type: 'lesson' },
        { id: 5, src: 'part-5/index.html', objectiveId: null, normalized: true, title: "Quiz final", type: 'lesson' },
    ],

    objectives: [],
    assets: [],
    debug:false,
    datas:{},
    scorm: {
        type: 'unique',
        progress: true,
        score: 80,
        success:true,
        //Chaîne par défaut [Écran max vu, total des écrans, écran actuel] | Quiz [Écran max vu, total des écrans, écran actuel, question en cours, score, [indexs des questions piochées]] 
        defaultBuildValues: [[1,4,1],[1,4,1],[1,27,1],[1,22,1],[1,3,1,1,0]],
        // TEST PROGRESS
        // defaultBuildValues: [[4,4,4],[4,4,4],[26,27,26],[20,22,20],[1,3,1,1,0]]
        // TEST QUIZ
        // defaultBuildValues: [[4,4,4],[4,4,4],[26,27,26],[25,22,25],[2,3,2,1,0,['8', '1', '3', '5', '7', '2', '4', '1']],"fr"]
    },
    data: {
        languageSelection:false,
        subtitles:"off",
        version:"IFCAM - 16/04/2024 - V1.1"
    },
    translations: [
        { 
            lang: 'fr',
            items: {
                'scorm-alert-no-api': 'L\'API LMS n\'a pas été trouvée',
                'scorm-alert-init-error': 'LMSInitialize() retourne la valeur false. ',
                'scorm-alert-quit-error': 'LMSFinish() retourne la valeur false. ',
                'scorm-alert-window-will-close': 'Cette fenêtre va se fermer,',
                'scorm-alert-close-window': 'Fermez cette fenêtre et',
                'scorm-alert-error': 'Une erreur est survenue. ',
                'scorm-alert-technical-error': ' faites ensuite une nouvelle tentative.\n\nErreur technique : ',
                'toast-data-loading-error-message': 'Le chargement des données n\'a pu aboutir. Veuillez fermer votre contenu et faire une nouvelle tentative ou contacter votre administrateur si cette erreur se produit fréquemment',
                'toast-commit-error-message': 'La sauvegarde intermédiaire n\'a pu aboutir. Si cette erreur se produit fréquemment veuillez fermer votre contenu et retenter plus tard ou contacter votre administrateur'
            }
        },
        { 
            lang: 'en',
            items: {
                'scorm-alert-no-api': 'LMS API not found',
                'scorm-alert-init-error': 'LMSInitialize() returns false. ',
                'scorm-alert-quit-error': 'LMSFinish() returns false. ',
                'scorm-alert-window-will-close': 'This window will close,',
                'scorm-alert-close-window': 'Close this window and',
                'scorm-alert-error': 'An error occured. ',
                'scorm-alert-technical-error': ' try again.\n\nTechnical message : ',
                'toast-data-loading-error-message': 'Data loading could not be completed. Please close your content and try again or contact your administrator if this error occurs frequently',
                'toast-commit-error-message': 'The intermediate backup could not be completed. If this error occurs frequently please close your content and try again later or contact your administrator.'
            }
        }
    ]
};
