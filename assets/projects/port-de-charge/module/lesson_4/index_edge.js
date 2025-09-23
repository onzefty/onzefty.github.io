/*jslint */
/*global AdobeEdge: false, window: false, document: false, console:false, alert: false */
(function (compId) {

    "use strict";
    var im='images/',
        aud='media/',
        vid='media/',
        js='js/',
        fonts = {
            'poppins-regular': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-bold': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-bold-italic': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-extra-bold': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-extra-bold-italic': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-extra-light': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-extra-light-italic': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-italic': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-light': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-light-italic': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-medium': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-medium-italic': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-semibold-italic': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-thin': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'poppins-thin-italic': '<link rel=\"stylesheet\" type=\"text/css\" href=\"../../common/content/css/fonts.css\">',
            'pt-sans, sans-serif': '<script src=\"http://use.edgefonts.net/pt-sans:n4,i4,n7,i7:all.js\"></script>'        },
        opts = {
            'gAudioPreloadPreference': 'auto',
            'gVideoPreloadPreference': 'auto'
        },
        resources = [
        ],
        scripts = [
        ],
        symbols = {
            "stage": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            id: 'main',
                            type: 'rect',
                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                            overflow: 'visible',
                            fill: ["rgba(192,192,192,0.00)"],
                            stroke: [0,"rgba(0,0,0,1)","none"],
                            c: [
                            {
                                id: 'section-1',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(250,250,250,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e1_video-container',
                                    type: 'rect',
                                    rect: ['482px', '27px', '1200px', '674px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: 'video-brightness'
                                },
                                {
                                    id: 'e2_dot-2',
                                    type: 'ellipse',
                                    rect: ['1245px', '316px', '7px', '7px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(234, 31, 41)","none"]
                                },
                                {
                                    id: 'e2_link-1',
                                    type: 'rect',
                                    rect: ['1058px', '318px', '180px', '0px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [1,"rgba(255,255,255,1.00)","dashed"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e2_dot-1',
                                    type: 'ellipse',
                                    rect: ['1047px', '316px', '7px', '7px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(234, 31, 41)","none"]
                                },
                                {
                                    id: 'e2_group-circle',
                                    type: 'group',
                                    rect: ['845', '54', '554', '554', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e2_circle',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '550px', '550px', 'auto', 'auto'],
                                        clip: 'rect(345px 236px 554px 0px)',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,0,0,0.00)"],
                                        stroke: [2,"rgb(0, 0, 0)","dashed"],
                                        userClass: "boxSizingInitial"
                                    },
                                    {
                                        id: 'e2_triangle',
                                        type: 'image',
                                        rect: ['6px', '338px', '7px', '11px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"triangle-grey.svg",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e1_link',
                                    type: 'rect',
                                    rect: ['254px', '295px', '180px', '2px', 'auto', 'auto'],
                                    fill: ["rgba(224,224,224,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "origin0-50"
                                },
                                {
                                    id: 'e2_link',
                                    type: 'rect',
                                    rect: ['255px', '294px', '81px', '4px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "origin0-50"
                                },
                                {
                                    id: 'e3_link',
                                    type: 'rect',
                                    rect: ['350px', '294px', '81px', '4px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "origin0-50"
                                },
                                {
                                    id: 'e1_dot-1',
                                    type: 'ellipse',
                                    rect: ['241px', '289px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [2,"rgba(5,5,5,1.00)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e1_dot-2',
                                    type: 'ellipse',
                                    rect: ['336px', '289px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgba(5,5,5,1.00)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e1_dot-3',
                                    type: 'ellipse',
                                    rect: ['431px', '289px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgba(5,5,5,1.00)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e1_title',
                                    type: 'text',
                                    rect: ['241px', '151px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">La position</p><p style=\"margin: 0px;\">​du balancier</p>",
                                    align: "left",
                                    font: ['poppins-bold', [45, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "55px", "", "none"]
                                },
                                {
                                    id: 'e1_textsWrap',
                                    type: 'rect',
                                    rect: ['241px', '351px', '533px', '259px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e1_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flex col",
                                        c: [
                                        {
                                            id: 'e1_txt-1',
                                            type: 'text',
                                            rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Ce mouvement vous permet</p><p style=\"margin: 0px;\">​de <span style=\"font-family: poppins-bold;\">réduire la sollicitation</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​de vos membres inférieurs</span></p><p style=\"margin: 0px;\">​tout en préservant votre dos.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'e2_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flex col",
                                        c: [
                                        {
                                            id: 'e2_txt-1',
                                            type: 'text',
                                            rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">Prenez appui sur une jambe</span></p><p style=\"margin: 0px;\">​à proximité de l'objet.</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        },
                                        {
                                            id: 'e2_txt-2',
                                            type: 'text',
                                            rect: ['0px', '52px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">L'autre jambe fait contrepoids</span></p><p style=\"margin: 0px;\">​et solage ainsi les contraintes</p><p style=\"margin: 0px;\">​sur votre dos.</p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        },
                                        {
                                            id: 'e2_txt-3',
                                            type: 'text',
                                            rect: ['0px', '152px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">N'oubliez pas de garder</p><p style=\"margin: 0px;\">​votre dos bien droit.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [25, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "31px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'e3_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flex col",
                                        c: [
                                        {
                                            id: 'e3_txt-1',
                                            type: 'text',
                                            rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">Gardez la charge le plus proche</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​possible de votre corps </span>durant</p><p style=\"margin: 0px;\">​la remontée.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_txt-click',
                                    type: 'text',
                                    rect: ['351px', '629px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold-italic;\">Cliquez </span>pour lancer la simulation.</p>",
                                    align: "left",
                                    font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "", "", "none"]
                                },
                                {
                                    id: 'e1_button',
                                    type: 'rect',
                                    rect: ['241px', '616px', '94px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btNext",
                                    c: [
                                    {
                                        id: 'e6_btSliderNextContentCopy2',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy13',
                                            type: 'image',
                                            rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-end',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(23,23,23,0.85)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'end-bloc',
                                    type: 'rect',
                                    rect: ['486px', '206px', '628px', '319px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'end-pattern',
                                        type: 'image',
                                        rect: ['0px', '0px', '628px', '319px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"end-pattern.png",'0px','0px']
                                    },
                                    {
                                        id: 'end-bloc-content',
                                        type: 'rect',
                                        rect: ['160px', '0px', '468px', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexXStartCol col",
                                        c: [
                                        {
                                            id: 'end-txt-1',
                                            type: 'text',
                                            rect: ['156px', '40px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Vous avez terminé la partie</p><p style=\"margin: 0px;\">« <span style=\"font-family: poppins-bold;\">La manutention régulière</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">de charges légères</span>&nbsp;».</p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        },
                                        {
                                            id: 'end-txt-2',
                                            type: 'text',
                                            rect: ['156px', '170px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Vérifions vos acquis avec</p><p style=\"margin: 0px;\">« l'<span style=\"font-size: 25px; font-family: poppins-bold; color: rgb(181, 140, 106);\">Évaluation</span>&nbsp;».​</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        }]
                                    }]
                                }]
                            }]
                        }
                    ],
                    style: {
                        '${Stage}': {
                            isStage: true,
                            rect: ['null', 'null', '1600px', '791px', 'auto', 'auto'],
                            overflow: 'visible',
                            fill: ["rgba(255,255,255,1.00)"]
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: false,
                    data: [

                    ]
                }
            }
        };

    AdobeEdge.registerCompositionDefn(compId, symbols, fonts, scripts, resources, opts);

    if (!window.edge_authoring_mode) AdobeEdge.getComposition(compId).load("index_edgeActions.js");
})("manutention-reguliere-charges-legeres");
