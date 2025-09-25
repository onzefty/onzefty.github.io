var ofp = window.ofp || {  player: {} };
ofp.player.dataprovider = {
    courseType: 'module',
    title: 'HERMES',
    lang: "fr",

    config: {
        passationTime: 0,
        randomize: false,
        mastery_score: 0,

        normalization: {
            enabled: false,
            location: true,
            progress: false,
            completion: false,
            success: false,
            score: false,
            save: false,
            lockIfCompleted: false,
            errorAlert: false
        },

        resumeLastLocation: true,
        tutor: false,
        noTranslate: false,
        noRightClick: true,
        resize: 'none',
        center: false,
        iframeResizerPath:'../common/interface/js/lib/iframeresizer.contentwindow.js',
        autoHideLoader:false
    },

    home: '',
    end: '',
    menu: '',

    files: [
        { id: 1, src: 'home/index.html', objectiveId: null, normalized: true, title: "Bienvenue", type: 'lesson' },
        { id: 2, src: 'introduction/index.html', objectiveId: null, normalized: true, title: "Introduction", type: 'lesson' },
        { id: 3, src: 'rules/index.html', objectiveId: null, normalized: true, title: "Règles", type: 'lesson' },
        { id: 4, src: 'vm/index.html', objectiveId: null, normalized: true, title: "VM", type: 'lesson' },
        // { id: 1, src: 'vm/index.html', objectiveId: null, normalized: true, title: "VM", type: 'lesson' },
    ],

    objectives: [],
    assets: [],
    debug:true,
    scorm: {
        type: 'unique',
        progress: true,
        success:true,
        //Chaîne par défaut [Écran max vu, total des écrans, écran actuel] | 
        defaultBuildValues: [[1,5,1],[1,6,1],[1,58,1],[1,1,1,[-1,"na","na","na"]]],
        // defaultBuildValues: [[5,5,1],[6,6,1],[58,58,1],[1,1,1,[-1,"na","na","na"]]],
        // TEST PROGRESS
        // defaultBuildValues: [[1,1,1,[-1,"na","na","na"]]],
        // defaultBuildValues: [[1,1,1,[-1,-1,-1,-1]]],
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
