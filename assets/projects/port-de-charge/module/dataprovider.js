var ofp = window.ofp || {  player: {} };
ofp.player.dataprovider = {
    courseType: 'module',
    title: 'Port de charge',

    config: {
        passationTime: 0,
        randomize: false,
        mastery_score: null,

        normalization: {
            enabled: true,
            location: true,
            progress: false,
            completion: true,
            success: false,
            score: false,
            save: false,
            errorAlert: false
        },

        resumeLastLocation: false,
        tutor: true,
        noTranslate: false,
        noRightClick: true,
        resize: 'none',
        center: true,
        iframeResizerPath:'../common/interface/js/lib/iframeresizer.contentwindow.js'
    },

    home: '',
    end: '',
    menu: '',

    files: [
        { id: 0, src: 'home/index.html', objectiveId: null, normalized: true, title: "", type: 'lesson' },
        { id: 1, src: 'lesson_1/index.html', objectiveId: null, normalized: true, title: "Contexte et risques", type: 'lesson' },
        { id: 2, src: 'lesson_2/index.html', objectiveId: null, normalized: true, title: "Votre dos et son fonctionnement", type: 'lesson' },
        { id: 3, src: 'lesson_3/index.html', objectiveId: null, normalized: true, title: "Les 4 règles d'or", type: 'lesson' },
        { id: 4, src: 'lesson_4/index.html', objectiveId: null, normalized: true, title: "La manutention régulière de charges légères", type: 'lesson' },
        { id: 5, src: 'evaluation/index.html', objectiveId: null, normalized: true, title: "Évaluation", type: 'lesson' },
    ],

    objectives: [],
    assets: [],
    debug:false,
    //debug:true,
    //Quiz
    randomized:false,
    sendScore:true,
    sendInteractions:false,
    completionScore:80,
    datas:{
        //Booléen pour le mot de fin dans Home si l'apprenant vient d'achever son évaluation
        justFinished:false
    },
    scorm: {
        type: 'unique',
        //Chaîne par défaut
        defaultBuildValues: [[1,8,1],[1,9,1],[1,33,1],[1,4,1],[1,3,1,[1,0]]]
        //Test progression
        //defaultBuildValues: [[8,8,8],[3,9,3],[15,33,15],[1,4,1],[1,3,1,[1,0]]]
        //Test pour démarrer évaluation
        //defaultBuildValues: [[8,8,8],[9,9,9],[33,33,33],[4,4,4],[1,3,1,[1,0]]]
        //Test pour reprise évaluation
        //defaultBuildValues: [[8,8,8],[9,9,9],[33,33,33],[4,4,4],[2,3,2,[9,5],[0,1,2,3,4,5,6,7,8,9,10]]]
        //Test module terminé
        //defaultBuildValues: [[8,8,8],[9,9,9],[33,33,33],[4,4,4],[3,3,3,[10,10],[0,1,2,3,4,5,6,7,8,9,10]]]
    },
    data: {}
};
