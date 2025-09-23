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
                            fill: ["rgba(192,192,192,0.00)"],
                            stroke: [0,"rgba(0,0,0,1)","none"],
                            c: [
                            {
                                id: 'e1_patterns',
                                type: 'image',
                                rect: ['0px', '0px', '1600px', '717px', 'auto', 'auto'],
                                fill: ["rgba(0,0,0,0)",im+"e1_patterns.png",'0px','0px']
                            },
                            {
                                id: 'section-1',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(173,113,113,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e1_button',
                                    type: 'rect',
                                    rect: ['753px', '578px', '94px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btNext pulseBrown",
                                    c: [
                                    {
                                        id: 'e1_buttonContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text',
                                            type: 'text',
                                            rect: ['26', '20', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Go</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [24, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_introTxts',
                                    type: 'rect',
                                    rect: ['0px', '112px', '100%', '466px', 'auto', 'auto'],
                                    fill: ["rgba(0,93,81,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "flexYStartCol col",
                                    c: [
                                    {
                                        id: 'e1_icon',
                                        type: 'image',
                                        rect: ['805', '380', '80px', '83px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_icon.svg",'0px','0px'],
                                        userClass: "static marginBottom30"
                                    },
                                    {
                                        id: 'e1_txt_1',
                                        type: 'text',
                                        rect: ['725px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">Évaluation</p>",
                                        align: "center",
                                        userClass: "static marginBottom30",
                                        font: ['poppins-bold', [35, "px"], "rgba(181,140,106,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                        textStyle: ["", "", "30px", "", ""]
                                    },
                                    {
                                        id: 'e1_sep',
                                        type: 'rect',
                                        rect: ['767px', '197px', '66px', '5px', 'auto', 'auto'],
                                        fill: ["rgba(22,25,42,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "static marginBottom30"
                                    },
                                    {
                                        id: 'e1_txt_2',
                                        type: 'text',
                                        rect: ['581px', '50px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">Vous allez à présent vous évaluer</p><p style=\"margin: 0px;\">sur les connaissances acquises dans ce module.​</p>",
                                        align: "center",
                                        userClass: "static marginBottom50",
                                        font: ['poppins-regular', [23, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                        textStyle: ["", "", "30px", "", ""]
                                    },
                                    {
                                        id: 'e1_txt_3',
                                        type: 'text',
                                        rect: ['528px', '150px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">Vous devez obtenir un <span style=\"font-family: poppins-semibold-italic; color: rgb(181, 140, 106);\">score de 80%</span> au minimum</p><p style=\"margin: 0px;\">pour <span style=\"font-family: poppins-semibold-italic;\">obtenir votre attestation de fin de formation</span>.</p><p style=\"margin: 0px;\">Répondez sereinement et prenez votre temps.​</p>",
                                        align: "center",
                                        userClass: "static",
                                        font: ['poppins-italic', [23, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                        textStyle: ["", "", "30px", "", ""]
                                    }]
                                }]
                            },
                            {
                                id: 'section-2',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(173,113,113,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'gauge-wrap',
                                    type: 'rect',
                                    rect: ['0px', '679px', '1600px', '112px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "flexYStart cMarginRight5",
                                    c: [
                                    {
                                        id: 'gauge_dot_1',
                                        type: 'ellipse',
                                        rect: ['678px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    },
                                    {
                                        id: 'gauge_dot_2',
                                        type: 'ellipse',
                                        rect: ['699px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    },
                                    {
                                        id: 'gauge_dot_3',
                                        type: 'ellipse',
                                        rect: ['720px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    },
                                    {
                                        id: 'gauge_dot_4',
                                        type: 'ellipse',
                                        rect: ['741px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    },
                                    {
                                        id: 'gauge_dot_5',
                                        type: 'ellipse',
                                        rect: ['762px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    },
                                    {
                                        id: 'gauge_dot_6',
                                        type: 'ellipse',
                                        rect: ['678px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    },
                                    {
                                        id: 'gauge_dot_7',
                                        type: 'ellipse',
                                        rect: ['699px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    },
                                    {
                                        id: 'gauge_dot_8',
                                        type: 'ellipse',
                                        rect: ['720px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    },
                                    {
                                        id: 'gauge_dot_9',
                                        type: 'ellipse',
                                        rect: ['741px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    },
                                    {
                                        id: 'gauge_dot_10',
                                        type: 'ellipse',
                                        rect: ['762px', '20px', '8px', '8px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(0,93,81,0.00)"],
                                        stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                        userClass: "gauge-dot boxSizingInitial static"
                                    }]
                                },
                                {
                                    id: 'choices-wrap',
                                    type: 'rect',
                                    rect: ['0px', '232px', '1600px', '327px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "hidden",
                                    c: [
                                    {
                                        id: 'choices-flexwrap',
                                        type: 'rect',
                                        rect: ['15%', '0px', '70%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(192,192,192,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter choiceFlexWrap",
                                        c: [
                                        {
                                            id: 'btChoice_1',
                                            type: 'rect',
                                            rect: ['620px', '150px', '140px', '50px', 'auto', 'auto'],
                                            cursor: 'pointer',
                                            borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                            fill: ["rgba(181,140,106,1.00)"],
                                            stroke: [0,"rgba(238,238,238,1.00)","none"],
                                            userClass: "btChoice flexCenter",
                                            c: [
                                            {
                                                id: 'Text2Copy21',
                                                type: 'text',
                                                rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Vrai</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "28px", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'btChoice_2',
                                            type: 'rect',
                                            rect: ['840px', '150px', '140px', '50px', 'auto', 'auto'],
                                            cursor: 'pointer',
                                            borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                            fill: ["rgba(181,140,106,1.00)"],
                                            stroke: [0,"rgba(238,238,238,1.00)","none"],
                                            userClass: "btChoice flexCenter",
                                            c: [
                                            {
                                                id: 'Text2Copy20',
                                                type: 'text',
                                                rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Faux​</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "28px", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'btChoice_3',
                                            type: 'rect',
                                            rect: ['620px', '150px', '140px', '50px', 'auto', 'auto'],
                                            cursor: 'pointer',
                                            borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                            fill: ["rgba(181,140,106,1.00)"],
                                            stroke: [0,"rgba(238,238,238,1.00)","none"],
                                            userClass: "btChoice flexCenter",
                                            c: [
                                            {
                                                id: 'Text2Copy',
                                                type: 'text',
                                                rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Vrai</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "28px", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'btChoice_4',
                                            type: 'rect',
                                            rect: ['840px', '150px', '140px', '50px', 'auto', 'auto'],
                                            cursor: 'pointer',
                                            borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                            fill: ["rgba(181,140,106,1.00)"],
                                            stroke: [0,"rgba(238,238,238,1.00)","none"],
                                            userClass: "btChoice flexCenter",
                                            c: [
                                            {
                                                id: 'Text2',
                                                type: 'text',
                                                rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Faux​</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "28px", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'btChoice_5',
                                            type: 'rect',
                                            rect: ['620px', '150px', '140px', '50px', 'auto', 'auto'],
                                            cursor: 'pointer',
                                            borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                            fill: ["rgba(181,140,106,1.00)"],
                                            stroke: [0,"rgba(238,238,238,1.00)","none"],
                                            userClass: "btChoice flexCenter",
                                            c: [
                                            {
                                                id: 'Text2Copy3',
                                                type: 'text',
                                                rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Vrai</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "28px", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'btChoice_6',
                                            type: 'rect',
                                            rect: ['840px', '150px', '140px', '50px', 'auto', 'auto'],
                                            cursor: 'pointer',
                                            borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                            fill: ["rgba(181,140,106,1.00)"],
                                            stroke: [0,"rgba(238,238,238,1.00)","none"],
                                            userClass: "btChoice flexCenter",
                                            c: [
                                            {
                                                id: 'Text2Copy2',
                                                type: 'text',
                                                rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Faux​</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "28px", "", "none"]
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap-1',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q1_circle-1',
                                        type: 'ellipse',
                                        rect: ['1230px', '509px', '499px', '499px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    },
                                    {
                                        id: 'q1_circle-2',
                                        type: 'ellipse',
                                        rect: ['-192px', '-385px', '495px', '495px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","solid"]
                                    },
                                    {
                                        id: 'Rectangle2',
                                        type: 'rect',
                                        rect: ['0px', '629px', '1600px', '283px', 'auto', 'auto'],
                                        fill: ["rgba(51,51,51,0.20)"],
                                        stroke: [0,"rgb(181, 140, 106)","none"]
                                    },
                                    {
                                        id: 'q1_img-1',
                                        type: 'image',
                                        rect: ['0px', '323px', '286px', '468px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q1_img-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'q1_img-2',
                                        type: 'image',
                                        rect: ['1253px', '278px', '427px', '516px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q1_img-2.png",'0px','0px']
                                    },
                                    {
                                        id: 'q1_content',
                                        type: 'rect',
                                        rect: ['302px', '329px', '993px', '67px', 'auto', 'auto'],
                                        borderRadius: ["35px", "35px", "35px", "35px 35px"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [2,"rgb(181, 140, 106)","solid"],
                                        userClass: "boxSizingInitial",
                                        c: [
                                        {
                                            id: 'q1_level-wrap',
                                            type: 'rect',
                                            rect: ['10px', '4px', '973px', '60px', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["35px", "35px", "35px", "35px 35px"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(181, 140, 106)","none"],
                                            c: [
                                            {
                                                id: 'q1_level',
                                                type: 'rect',
                                                rect: ['0px', '0px', '0%', '60px', 'auto', 'auto'],
                                                overflow: 'hidden',
                                                borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(181, 140, 106)","none"],
                                                userClass: "level"
                                            }]
                                        },
                                        {
                                            id: 'Ellipse2',
                                            type: 'ellipse',
                                            rect: ['99px', '62px', '14px', '14px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(51,51,51,1.00)"],
                                            stroke: [0,"rgb(181, 140, 106)","none"],
                                            c: [
                                            {
                                                id: 'Text5',
                                                type: 'text',
                                                rect: ['-28px', '-37px', '71px', '35px', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​10 %</p>",
                                                align: "center",
                                                font: ['poppins-light', [20, "px"], "rgba(51,51,51,1.00)", "400", "none", "normal", "break-word", ""],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'Ellipse2Copy',
                                            type: 'ellipse',
                                            rect: ['294px', '62px', '14px', '14px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(51,51,51,1.00)"],
                                            stroke: [0,"rgb(181, 140, 106)","none"],
                                            c: [
                                            {
                                                id: 'Text5Copy',
                                                type: 'text',
                                                rect: ['-28px', '-37px', '71px', '35px', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">30 %</p>",
                                                align: "center",
                                                font: ['poppins-light', [20, "px"], "rgba(51,51,51,1.00)", "400", "none", "normal", "break-word", ""],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'Ellipse2Copy2',
                                            type: 'ellipse',
                                            rect: ['490px', '62px', '14px', '14px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(51,51,51,1.00)"],
                                            stroke: [0,"rgb(181, 140, 106)","none"],
                                            c: [
                                            {
                                                id: 'Text5Copy2',
                                                type: 'text',
                                                rect: ['-28px', '-37px', '71px', '35px', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">50 %</p>",
                                                align: "center",
                                                font: ['poppins-light', [20, "px"], "rgba(51,51,51,1.00)", "400", "none", "normal", "break-word", ""],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'Ellipse2Copy3',
                                            type: 'ellipse',
                                            rect: ['683px', '62px', '14px', '14px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(51,51,51,1.00)"],
                                            stroke: [0,"rgb(181, 140, 106)","none"],
                                            c: [
                                            {
                                                id: 'Text5Copy3',
                                                type: 'text',
                                                rect: ['-28px', '-37px', '71px', '35px', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">70 %</p>",
                                                align: "center",
                                                font: ['poppins-light', [20, "px"], "rgba(51,51,51,1.00)", "400", "none", "normal", "break-word", ""],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'Ellipse2Copy4',
                                            type: 'ellipse',
                                            rect: ['878px', '62px', '14px', '14px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(51,51,51,1.00)"],
                                            stroke: [0,"rgb(181, 140, 106)","none"],
                                            c: [
                                            {
                                                id: 'Text5Copy4',
                                                type: 'text',
                                                rect: ['-28px', '-37px', '71px', '35px', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​90 %</p>",
                                                align: "center",
                                                font: ['poppins-light', [20, "px"], "rgba(51,51,51,1.00)", "400", "none", "normal", "break-word", ""],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'q1_cursor',
                                        type: 'ellipse',
                                        rect: ['297px', '381px', '36px', '36px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                        userClass: "btCursor boxSizingInitial",
                                        c: [
                                        {
                                            id: 'q1_cursorContent',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0.00)"],
                                            stroke: [2,"rgba(255,255,255,1.00)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'edgeIcon',
                                                type: 'image',
                                                rect: ['11px', '8px', '13px', '19px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"edgeIcon.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap-2',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q2_circle-1',
                                        type: 'ellipse',
                                        rect: ['-231px', '509px', '499px', '499px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    },
                                    {
                                        id: 'q2_circle-2',
                                        type: 'ellipse',
                                        rect: ['1306px', '-385px', '495px', '495px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","solid"]
                                    },
                                    {
                                        id: 'q2_links',
                                        type: 'image',
                                        rect: ['476px', '288px', '625px', '212px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q2_links.png",'0px','0px']
                                    },
                                    {
                                        id: 'q2_img-1',
                                        type: 'image',
                                        rect: ['630px', '237px', '341px', '339px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q2_img-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'e1_dot-1',
                                        type: 'ellipse',
                                        rect: ['853px', '334px', '19px', '19px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(234,31,41,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "wave-container",
                                        c: [
                                        {
                                            id: 'e1_dot-1Copy3',
                                            type: 'ellipse',
                                            rect: ['4px', '5px', '6px', '6px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy2',
                                            type: 'ellipse',
                                            rect: ['4px', '5px', '6px', '6px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy',
                                            type: 'ellipse',
                                            rect: ['4px', '5px', '6px', '6px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        }]
                                    },
                                    {
                                        id: 'q2_btChoice-1',
                                        type: 'rect',
                                        rect: ['312px', '266px', '225px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy4',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q2_btChoice-2',
                                        type: 'rect',
                                        rect: ['1064px', '266px', '225px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy5',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q2_btChoice-3',
                                        type: 'rect',
                                        rect: ['312px', '367px', '225px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy7',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q2_btChoice-4',
                                        type: 'rect',
                                        rect: ['1064px', '367px', '225px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy6',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q2_btChoice-5',
                                        type: 'rect',
                                        rect: ['312px', '467px', '225px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy17',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q2_btChoice-6',
                                        type: 'rect',
                                        rect: ['1064px', '467px', '225px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy8',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap-3',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q3_circle-2',
                                        type: 'ellipse',
                                        rect: ['1306px', '-385px', '495px', '495px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","solid"]
                                    },
                                    {
                                        id: 'q3_img-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '1600px', '789px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q3_img-2.png",'0px','0px']
                                    },
                                    {
                                        id: 'q3_btChoice-1',
                                        type: 'rect',
                                        rect: ['771px', '332px', '320px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy25',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q3_btChoice-2',
                                        type: 'rect',
                                        rect: ['814px', '437px', '320px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy24',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q3_img-1',
                                        type: 'image',
                                        rect: ['252px', '241px', '401px', '509px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q3_img-1.png",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'question-wrap-4',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q3_img-2Copy',
                                        type: 'image',
                                        rect: ['0px', '0px', '1600px', '789px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q3_img-2.png",'0px','0px']
                                    },
                                    {
                                        id: 'q3_circle-2Copy',
                                        type: 'ellipse',
                                        rect: ['1306px', '-385px', '495px', '495px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","solid"]
                                    },
                                    {
                                        id: 'q4_img-1',
                                        type: 'image',
                                        rect: ['162px', '61px', '481px', '636px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q4_img-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'q4_btChoice-1',
                                        type: 'rect',
                                        rect: ['728px', '277px', '360px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy27',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q4_btChoice-2',
                                        type: 'rect',
                                        rect: ['784px', '372px', '360px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy26',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap-5',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q5_circle-1',
                                        type: 'ellipse',
                                        rect: ['258px', '-428px', '499px', '499px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    },
                                    {
                                        id: 'q5_img-wrap-1',
                                        type: 'rect',
                                        rect: ['33px', '185px', '425px', '568px', 'auto', 'auto'],
                                        borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'RoundRect4',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                            fill: ["rgba(250,250,250,1)"],
                                            stroke: [0,"rgb(255, 255, 255)","none"],
                                            c: [
                                            {
                                                id: 'q5_img-2',
                                                type: 'image',
                                                rect: ['-25px', '0px', '450px', '798px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"q5_img-2.png",'0px','0px']
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'q5_img-wrap-2',
                                        type: 'rect',
                                        rect: ['1143px', '185px', '425px', '568px', 'auto', 'auto'],
                                        borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'RoundRect4Copy',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                            fill: ["rgba(250,250,250,1)"],
                                            stroke: [0,"rgb(255, 255, 255)","none"],
                                            c: [
                                            {
                                                id: 'q5_img-1',
                                                type: 'image',
                                                rect: ['-56px', '2px', '650px', '424px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"q5_img-1.png",'0px','0px']
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'q5_btChoice-1',
                                        type: 'rect',
                                        rect: ['541px', '336px', '280px', '70px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy29',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q5_btChoice-2',
                                        type: 'rect',
                                        rect: ['751px', '436px', '280px', '70px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy28',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap-6',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q6_circle-1',
                                        type: 'ellipse',
                                        rect: ['258px', '-428px', '499px', '499px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    },
                                    {
                                        id: 'q6_img-wrap-1',
                                        type: 'rect',
                                        rect: ['33px', '185px', '425px', '568px', 'auto', 'auto'],
                                        borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'RoundRect4Copy3',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                            fill: ["rgba(250,250,250,1)"],
                                            stroke: [0,"rgb(255, 255, 255)","none"],
                                            c: [
                                            {
                                                id: 'q6_img-2',
                                                type: 'image',
                                                rect: ['-186px', '-5px', '686px', '494px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"q6_img-2.png",'0px','0px']
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'q6_img-wrap-2',
                                        type: 'rect',
                                        rect: ['1143px', '185px', '425px', '568px', 'auto', 'auto'],
                                        borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'RoundRect4Copy2',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                            fill: ["rgba(250,250,250,1)"],
                                            stroke: [0,"rgb(255, 255, 255)","none"],
                                            c: [
                                            {
                                                id: 'q6_img-1',
                                                type: 'image',
                                                rect: ['-65px', '-7px', '746px', '494px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"q6_img-1.png",'0px','0px']
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'q6_btChoice-1',
                                        type: 'rect',
                                        rect: ['511px', '316px', '425px', '90px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy19',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q6_btChoice-2',
                                        type: 'rect',
                                        rect: ['691px', '436px', '425px', '90px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy18',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap-7',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q7_circle-1',
                                        type: 'ellipse',
                                        rect: ['1468px', '163px', '499px', '499px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    },
                                    {
                                        id: 'q7_circle-2',
                                        type: 'ellipse',
                                        rect: ['-330px', '132px', '495px', '495px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","solid"]
                                    },
                                    {
                                        id: 'q7_img-1',
                                        type: 'image',
                                        rect: ['174px', '102px', '405px', '626px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q7_img-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'Ellipse',
                                        type: 'ellipse',
                                        rect: ['623px', '225px', '46px', '46px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,1.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","dashed"],
                                        c: [
                                        {
                                            id: 'EllipseCopy',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,1.00)"],
                                            stroke: [0,"rgba(181,140,106,1.00)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text3',
                                                type: 'text',
                                                rect: ['20', '19', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​1</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'EllipseCopy2',
                                        type: 'ellipse',
                                        rect: ['623px', '285px', '46px', '46px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,1.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","dashed"],
                                        c: [
                                        {
                                            id: 'EllipseCopy3',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,1.00)"],
                                            stroke: [0,"rgba(181,140,106,1.00)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text3Copy',
                                                type: 'text',
                                                rect: ['20', '19', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">2</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'EllipseCopy6',
                                        type: 'ellipse',
                                        rect: ['623px', '345px', '46px', '46px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,1.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","dashed"],
                                        c: [
                                        {
                                            id: 'EllipseCopy7',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,1.00)"],
                                            stroke: [0,"rgba(181,140,106,1.00)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text3Copy3',
                                                type: 'text',
                                                rect: ['20', '19', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">3</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'EllipseCopy4',
                                        type: 'ellipse',
                                        rect: ['623px', '405px', '46px', '46px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,1.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","dashed"],
                                        c: [
                                        {
                                            id: 'EllipseCopy5',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,1.00)"],
                                            stroke: [0,"rgba(181,140,106,1.00)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text3Copy2',
                                                type: 'text',
                                                rect: ['20', '19', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">4​</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'EllipseCopy8',
                                        type: 'ellipse',
                                        rect: ['623px', '465px', '46px', '46px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,1.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","dashed"],
                                        c: [
                                        {
                                            id: 'EllipseCopy9',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,1.00)"],
                                            stroke: [0,"rgba(181,140,106,1.00)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text3Copy4',
                                                type: 'text',
                                                rect: ['20', '19', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">5</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [21, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'q7_order-1',
                                        type: 'rect',
                                        rect: ['702px', '225px', '400px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "order flexXStart",
                                        c: [
                                        {
                                            id: 'Text2Copy10',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Faux​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q7_order-2',
                                        type: 'rect',
                                        rect: ['702px', '285px', '400px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "order flexXStart",
                                        c: [
                                        {
                                            id: 'Text2Copy11',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Faux​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q7_order-3',
                                        type: 'rect',
                                        rect: ['702px', '345px', '400px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "order flexXStart",
                                        c: [
                                        {
                                            id: 'Text2Copy13',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Faux​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q7_order-4',
                                        type: 'rect',
                                        rect: ['702px', '405px', '400px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "order flexXStart",
                                        c: [
                                        {
                                            id: 'Text2Copy12',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Faux​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q7_order-5',
                                        type: 'rect',
                                        rect: ['702px', '465px', '400px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "order flexXStart",
                                        c: [
                                        {
                                            id: 'Text2Copy14',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Faux​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap-8',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q8_img-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q8_img-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'q8_btChoice-1',
                                        type: 'rect',
                                        rect: ['347px', '283px', '519px', '100px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy35',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q8_btChoice-2',
                                        type: 'rect',
                                        rect: ['347px', '417px', '519px', '100px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy34',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap-9',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q9_circle-2',
                                        type: 'ellipse',
                                        rect: ['-542px', '256px', '1001px', '1001px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [2,"rgba(181,140,106,1.00)","solid"]
                                    },
                                    {
                                        id: 'q9_img-1',
                                        type: 'image',
                                        rect: ['747px', '227px', '705px', '357px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q9_img-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'q9_drop-1',
                                        type: 'rect',
                                        rect: ['970px', '179px', '328px', '85px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0.20)"],
                                        stroke: [2,"rgba(193,193,193,1.00)","dashed"],
                                        userClass: "boxSizingInitial drop"
                                    },
                                    {
                                        id: 'q9_drop-2',
                                        type: 'rect',
                                        rect: ['1116px', '325px', '328px', '85px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0.20)"],
                                        stroke: [2,"rgba(193,193,193,1.00)","dashed"],
                                        userClass: "boxSizingInitial drop"
                                    },
                                    {
                                        id: 'q9_drop-3',
                                        type: 'rect',
                                        rect: ['687px', '362px', '328px', '85px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0.20)"],
                                        stroke: [2,"rgba(193,193,193,1.00)","dashed"],
                                        userClass: "boxSizingInitial drop"
                                    },
                                    {
                                        id: 'q9_drag-1',
                                        type: 'rect',
                                        rect: ['288px', '258px', '332px', '89px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "drag flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy9',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Faux​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q9_drag-2',
                                        type: 'rect',
                                        rect: ['288px', '358px', '332px', '89px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "drag flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy15',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Faux​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q9_drag-3',
                                        type: 'rect',
                                        rect: ['288px', '458px', '332px', '89px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "drag flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy16',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Faux​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap-10',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "question-wrap",
                                    c: [
                                    {
                                        id: 'q10_circle-1',
                                        type: 'ellipse',
                                        rect: ['44px', '-303px', '386px', '386px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    },
                                    {
                                        id: 'q10_circle-2',
                                        type: 'ellipse',
                                        rect: ['960px', '622px', '499px', '499px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    },
                                    {
                                        id: 'q10_img-4',
                                        type: 'image',
                                        rect: ['1331px', '41px', '466px', '259px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q10_img-4.png",'0px','0px']
                                    },
                                    {
                                        id: 'q10_img-3',
                                        type: 'image',
                                        rect: ['-101px', '-13px', '382px', '498px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q10_img-3.png",'0px','0px']
                                    },
                                    {
                                        id: 'q10_img-2',
                                        type: 'image',
                                        rect: ['-50px', '402px', '447px', '344px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q10_img-2.png",'0px','0px']
                                    },
                                    {
                                        id: 'q10_img-1',
                                        type: 'image',
                                        rect: ['1192px', '299px', '425px', '457px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"q10_img-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'q10_btChoice-1',
                                        type: 'rect',
                                        rect: ['652px', '298px', '296px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy43',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q10_btChoice-2',
                                        type: 'rect',
                                        rect: ['652px', '379px', '296px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy42',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'q10_btChoice-3',
                                        type: 'rect',
                                        rect: ['652px', '460px', '296px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(238,238,238,1.00)","none"],
                                        userClass: "btChoice flexCenter",
                                        c: [
                                        {
                                            id: 'Text2Copy41',
                                            type: 'text',
                                            rect: ['43px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [21, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'btValidate',
                                    type: 'rect',
                                    rect: ['694px', '609px', '210px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btValidate",
                                    c: [
                                    {
                                        id: 'btValidateContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'txt-validate',
                                            type: 'text',
                                            rect: ['45px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​valider</p>",
                                            align: "left",
                                            userClass: "static marginRight20",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "uppercase"]
                                        },
                                        {
                                            id: 'checkIcon',
                                            type: 'image',
                                            rect: ['149px', '29px', '21px', '15px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"checkIcon.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'question-wrap',
                                    type: 'rect',
                                    rect: ['0px', '44px', '1600px', '188px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "flexCenter",
                                    c: [
                                    {
                                        id: 'question-wrapContent',
                                        type: 'rect',
                                        rect: ['240px', '0px', '70%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(192,192,192,0.00)"],
                                        stroke: [0,"rgba(0,0,0,1)","none"],
                                        userClass: "flexCenter col static",
                                        c: [
                                        {
                                            id: 'question-1',
                                            type: 'text',
                                            rect: ['300px', '57px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static width100",
                                            font: ['poppins-bold', [24, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "30px", "", "none"]
                                        },
                                        {
                                            id: 'question-2',
                                            type: 'text',
                                            rect: ['300px', '57px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static width100",
                                            font: ['poppins-bold', [24, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "30px", "", "none"]
                                        },
                                        {
                                            id: 'question-helper',
                                            type: 'text',
                                            rect: ['300px', '57px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static marginTop10",
                                            font: ['poppins-italic', [18, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "30px", "", "none"]
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-3',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(0,76,66,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'feedbacks_bad',
                                    type: 'rect',
                                    rect: ['0px', '409px', '100%', '213px', 'auto', 'auto'],
                                    fill: ["rgba(0,93,81,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "flexYStartCol col",
                                    c: [
                                    {
                                        id: 'txt_bad_1',
                                        type: 'text',
                                        rect: ['694px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">Pas mal mais...</p>",
                                        align: "left",
                                        userClass: "static marginBottom30",
                                        font: ['poppins-bold', [35, "px"], "rgba(253,77,64,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                        textStyle: ["", "", "30px", "", ""]
                                    },
                                    {
                                        id: 'txt_bad_2',
                                        type: 'text',
                                        rect: ['385px', '80px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">\n<span style=\"font-family: poppins-bold;\">Vous ne maîtrisez pas tout à fait les notions abordées dans ce module</span>.</p><p style=\"margin: 0px;\">Nous vous conseillons de <span style=\"font-family: poppins-bold; color: rgb(181, 140, 106);\">revoir les différentes parties</span></p><p style=\"margin: 0px;\">puis de <span style=\"font-family: poppins-bold; color: rgb(181, 140, 106);\">retenter l'évaluation</span>&nbsp;pour obtenir votre attestation.​</p>",
                                        align: "center",
                                        userClass: "static",
                                        font: ['poppins-regular', [23, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                        textStyle: ["", "", "30px", "", ""]
                                    }]
                                },
                                {
                                    id: 'feedbacks_medium',
                                    type: 'rect',
                                    rect: ['0px', '409px', '100%', '213px', 'auto', 'auto'],
                                    fill: ["rgba(0,93,81,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "flexYStartCol col",
                                    c: [
                                    {
                                        id: 'txt_medium_1',
                                        type: 'text',
                                        rect: ['694px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">Presque !</p>",
                                        align: "left",
                                        userClass: "static marginBottom30",
                                        font: ['poppins-bold', [35, "px"], "rgba(181,140,106,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                        textStyle: ["", "", "30px", "", ""]
                                    },
                                    {
                                        id: 'txt_medium_2',
                                        type: 'text',
                                        rect: ['385px', '80px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">Vous avez connaissance de certaines notions abordées dans ce module</span>.</p><p style=\"margin: 0px;\">Vous pouvez <span style=\"font-family: poppins-bold; color: rgb(181, 140, 106);\">revoir les différentes parties du module</span></p><p style=\"margin: 0px;\">ou <span style=\"font-family: poppins-bold; color: rgb(181, 140, 106);\">recommencer l’évaluation</span> pour obtenir votre attestation.​</p>",
                                        align: "center",
                                        userClass: "static",
                                        font: ['poppins-regular', [23, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                        textStyle: ["", "", "30px", "", ""]
                                    }]
                                },
                                {
                                    id: 'feedbacks_good',
                                    type: 'rect',
                                    rect: ['0px', '409px', '100%', '213px', 'auto', 'auto'],
                                    fill: ["rgba(0,93,81,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "flexYStartCol col",
                                    c: [
                                    {
                                        id: 'txt_good_1',
                                        type: 'text',
                                        rect: ['694px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">Bravo !</p>",
                                        align: "left",
                                        userClass: "static marginBottom30",
                                        font: ['poppins-bold', [35, "px"], "rgba(100,215,160,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                        textStyle: ["", "", "30px", "", ""]
                                    },
                                    {
                                        id: 'txt_good_2',
                                        type: 'text',
                                        rect: ['385px', '80px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">\n<span style=\"font-family: poppins-bold;\">Vous maîtrisez les notions abordées dans ce module</span>.</p><p style=\"margin: 0px;\">Cliquez sur le bouton pour <span style=\"font-family: poppins-bold; color: rgb(181, 140, 106);\">télécharger</span></p><p style=\"margin: 0px;\">votre <span style=\"font-family: poppins-bold; color: rgb(181, 140, 106);\">attestation de fin de formation</span>.​</p>",
                                        align: "center",
                                        userClass: "static",
                                        font: ['poppins-regular', [23, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                        textStyle: ["", "", "30px", "", ""]
                                    }]
                                },
                                {
                                    id: 'svgWrap',
                                    type: 'rect',
                                    rect: ['655px', '56px', '290px', '290px', 'auto', 'auto'],
                                    fill: ["rgba(0,93,81,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"]
                                },
                                {
                                    id: 'scores',
                                    type: 'rect',
                                    rect: ['655px', '56px', '290px', '290px', 'auto', 'auto'],
                                    fill: ["rgba(0,93,81,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "flexCenter col",
                                    c: [
                                    {
                                        id: 'Rectangle6',
                                        type: 'rect',
                                        rect: ['0px', '122px', '100%', '48px', 'auto', 'auto'],
                                        fill: ["rgba(0,93,81,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "static flexCenter heightAuto",
                                        c: [
                                        {
                                            id: 'score',
                                            type: 'text',
                                            rect: ['113px', '6px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [60, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'percent',
                                            type: 'text',
                                            rect: ['113px', '6px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​%</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [50, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'Text6',
                                        type: 'text',
                                        rect: ['103', '218', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">​Votre score :</p>",
                                        align: "center",
                                        userClass: "static",
                                        font: ['poppins-regular', [25, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                        textStyle: ["", "", "", "", "none"]
                                    }]
                                },
                                {
                                    id: 'feedbackCircle',
                                    type: 'ellipse',
                                    rect: ['690px', '56px', '49px', '49px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [3,"rgba(232,232,232,1.00)","solid"],
                                    userClass: "feedbackCircle",
                                    boxShadow: ["", 0, 0, 0, 13, "rgba(230,230,230,0.51)"],
                                    c: [
                                    {
                                        id: 'Rectangle3',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(232, 232, 232)","none"],
                                        userClass: "flexCenter normalEl",
                                        c: [
                                        {
                                            id: 'e3_icon',
                                            type: 'image',
                                            rect: ['4px', '12px', '40px', '27px', 'auto', 'auto'],
                                            opacity: '0.2',
                                            fill: ["rgba(0,0,0,0)",im+"e3_icon.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    },
                                    {
                                        id: 'Rectangle3Copy',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(232, 232, 232)","none"],
                                        userClass: "flexCenter goodEl",
                                        c: [
                                        {
                                            id: 'e3_iconWhite',
                                            type: 'image',
                                            rect: ['4px', '12px', '40px', '27px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e3_iconWhite.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'buttons',
                                    type: 'rect',
                                    rect: ['0px', '619px', '100%', '63px', 'auto', 'auto'],
                                    fill: ["rgba(255,156,0,0.00)"],
                                    stroke: [3,"rgba(255,255,255,0.00)","none"],
                                    userClass: "flexYStart cMarginRight20",
                                    c: [
                                    {
                                        id: 'btSeeAgain',
                                        type: 'rect',
                                        rect: ['349px', '0px', '223px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "static marginRight30",
                                        c: [
                                        {
                                            id: 'Rectangle4',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(181,140,106,0.00)"],
                                            stroke: [0,"rgb(255, 255, 255)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text4',
                                                type: 'text',
                                                rect: ['36px', '15px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Revoir le module</p>",
                                                align: "center",
                                                userClass: "static marginRight10",
                                                font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'e3_icon3Lines',
                                                type: 'image',
                                                rect: ['169px', '14px', '21px', '13px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e3_icon3Lines.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'btRedo',
                                        type: 'rect',
                                        rect: ['605px', '0px', '325px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "static marginRight30",
                                        c: [
                                        {
                                            id: 'Rectangle5',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [0,"rgb(255, 255, 255)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text4Copy2',
                                                type: 'text',
                                                rect: ['36px', '15px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Recommencer l'évaluation​</p>",
                                                align: "center",
                                                userClass: "static marginRight10",
                                                font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'e3_reDo',
                                                type: 'image',
                                                rect: ['225', '15', '23px', '25px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e3_reDo.png",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'btDownload',
                                        type: 'rect',
                                        rect: ['925px', '0px', '296px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "static",
                                        c: [
                                        {
                                            id: 'Rectangle5Copy',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [0,"rgb(255, 255, 255)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text4Copy3',
                                                type: 'text',
                                                rect: ['36px', '15px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Attestation de formation</p>",
                                                align: "center",
                                                userClass: "static marginRight10",
                                                font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'downloadIcon',
                                                type: 'image',
                                                rect: ['222', '12', '19px', '29px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"downloadIcon.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
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
                            overflow: 'hidden',
                            fill: ["rgba(250,250,250,1.00)"]
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
})("port-de-charge-evaluation");
