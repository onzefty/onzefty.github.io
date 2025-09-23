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
                                fill: ["rgba(192,192,192,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e3_group',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(228,228,228,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e2_background-blurred',
                                        type: 'image',
                                        rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e2_background-blurred.png",'0px','0px']
                                    },
                                    {
                                        id: 'e3_video-container-1',
                                        type: 'rect',
                                        rect: ['306px', '0px', '1294px', '728px', 'auto', 'auto'],
                                        fill: ["rgba(192,192,192,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "video-brightness"
                                    },
                                    {
                                        id: 'e3_video-container-2',
                                        type: 'rect',
                                        rect: ['306px', '0px', '1294px', '728px', 'auto', 'auto'],
                                        fill: ["rgba(192,192,192,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "video-brightness"
                                    },
                                    {
                                        id: 'e3_video-container-3',
                                        type: 'rect',
                                        rect: ['306px', '0px', '1294px', '728px', 'auto', 'auto'],
                                        fill: ["rgba(192,192,192,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "video-brightness"
                                    },
                                    {
                                        id: 'e3_video-pause',
                                        type: 'rect',
                                        rect: ['306px', '0px', '1294px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(192,192,192,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "hidden",
                                        c: [
                                        {
                                            id: 'Rectangle8',
                                            type: 'rect',
                                            rect: ['534px', '226px', '94px', '279px', 'auto', 'auto'],
                                            fill: ["rgba(181,140,106,0.95)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"]
                                        },
                                        {
                                            id: 'Rectangle8Copy',
                                            type: 'rect',
                                            rect: ['665px', '226px', '94px', '279px', 'auto', 'auto'],
                                            fill: ["rgba(181,140,106,0.95)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"]
                                        }]
                                    },
                                    {
                                        id: 'e3_popup',
                                        type: 'rect',
                                        rect: ['616px', '228px', '673px', '226px', 'auto', 'auto'],
                                        borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                        fill: ["rgba(228,228,228,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e3_popup-content-1',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter col",
                                            c: [
                                            {
                                                id: 'Text4',
                                                type: 'text',
                                                rect: ['269', '67', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Découvrons le premier exercice</p><p style=\"margin: 0px;\">«&nbsp;<span style=\"font-family: poppins-bold-italic;\">rotation incliné vers l’avant</span> ».</p><p style=\"margin: 0px;\"></p>",
                                                align: "center",
                                                userClass: "static marginBottom10",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(67,67,67,1)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'Text4Copy',
                                                type: 'text',
                                                rect: ['269', '137px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold-italic;\">Cliquez</span> sur « <span style=\"color: rgb(23, 23, 23);\">▷</span>&nbsp;».</p><p style=\"margin: 0px;\"></p>",
                                                align: "left",
                                                userClass: "static",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'e3_popup-content-2',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter col",
                                            c: [
                                            {
                                                id: 'Text4Copy3',
                                                type: 'text',
                                                rect: ['269', '67', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Découvrons l'exercice « <span style=\"font-family: poppins-bold-italic;\">dos rond / dos plat</span> ».</p><p style=\"margin: 0px;\"></p>",
                                                align: "center",
                                                userClass: "static marginBottom10",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(67,67,67,1)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'Text4Copy2',
                                                type: 'text',
                                                rect: ['269', '137px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold-italic;\">Cliquez</span> sur « <span style=\"color: rgb(23, 23, 23);\">▷</span>&nbsp;».</p><p style=\"margin: 0px;\"></p>",
                                                align: "left",
                                                userClass: "static",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'e3_popup-content-3',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter col",
                                            c: [
                                            {
                                                id: 'Text4Copy5',
                                                type: 'text',
                                                rect: ['159px', '67', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Découvrons l'exercice « <span style=\"font-family: poppins-bold-italic;\">flexions des jambes</span> ».</p><p style=\"margin: 0px;\"></p>",
                                                align: "center",
                                                userClass: "static marginBottom10",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(67,67,67,1)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'Text4Copy4',
                                                type: 'text',
                                                rect: ['269', '137px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold-italic;\">Cliquez</span> sur « <span style=\"color: rgb(23, 23, 23);\">▷</span>&nbsp;».</p><p style=\"margin: 0px;\"></p>",
                                                align: "left",
                                                userClass: "static",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'e3_popup-content-4',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter col",
                                            c: [
                                            {
                                                id: 'Text4Copy7',
                                                type: 'text',
                                                rect: ['159px', '67', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Vous voilà échauffés et prêts à travailler !</p><p style=\"margin: 0px;\"></p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'Text4Copy6',
                                                type: 'text',
                                                rect: ['269', '137px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Voyons maintenant comment&nbsp;« <span style=\"font-family: poppins-bold;\">Analyser une situation</span> ».</p>",
                                                align: "left",
                                                userClass: "static",
                                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'e3_popup-button',
                                            type: 'ellipse',
                                            rect: ['506px', '194px', '61px', '61px', 'auto', 'auto'],
                                            cursor: 'pointer',
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,1.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "pulseBrown",
                                            c: [
                                            {
                                                id: 'e3_popup-button-content',
                                                type: 'ellipse',
                                                rect: ['0px', '0px', '61px', '61px', 'auto', 'auto'],
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(255,255,255,0.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter",
                                                c: [
                                                {
                                                    id: 'e3_icon-play',
                                                    type: 'image',
                                                    rect: ['22px', '19px', '17px', '23px', 'auto', 'auto'],
                                                    fill: ["rgba(0,0,0,0)",im+"e3_icon-play.png",'0px','0px'],
                                                    userClass: "static"
                                                }]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e3_part-left',
                                        type: 'rect',
                                        rect: ['0px', '0px', '306px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(23,23,23,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e3_circle-1',
                                            type: 'ellipse',
                                            rect: ['104px', '218px', '12px', '12px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(67,67,67,1.00)","solid"],
                                            userClass: "boxSizingInitial"
                                        },
                                        {
                                            id: 'e3_link-1',
                                            type: 'rect',
                                            rect: ['111px', '233px', '2px', '82px', 'auto', 'auto'],
                                            fill: ["rgba(67,67,67,1.00)"],
                                            stroke: [0,"rgb(67, 67, 67)","none"]
                                        },
                                        {
                                            id: 'e3_circle-2',
                                            type: 'ellipse',
                                            rect: ['104px', '315px', '12px', '12px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(67,67,67,1.00)","solid"],
                                            userClass: "boxSizingInitial"
                                        },
                                        {
                                            id: 'e3_link-2',
                                            type: 'rect',
                                            rect: ['111px', '330px', '2px', '82px', 'auto', 'auto'],
                                            fill: ["rgba(67,67,67,1.00)"],
                                            stroke: [0,"rgb(67, 67, 67)","none"]
                                        },
                                        {
                                            id: 'e3_circle-3',
                                            type: 'ellipse',
                                            rect: ['104px', '412px', '12px', '12px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(67,67,67,1.00)","solid"],
                                            userClass: "boxSizingInitial"
                                        },
                                        {
                                            id: 'e3_link-3',
                                            type: 'rect',
                                            rect: ['111px', '427px', '2px', '82px', 'auto', 'auto'],
                                            fill: ["rgba(67,67,67,1.00)"],
                                            stroke: [0,"rgb(67, 67, 67)","none"]
                                        },
                                        {
                                            id: 'e3_circle-4',
                                            type: 'ellipse',
                                            rect: ['104px', '509px', '12px', '12px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(67,67,67,1.00)","solid"],
                                            userClass: "boxSizingInitial"
                                        },
                                        {
                                            id: 'e3_duration-wrap-1',
                                            type: 'rect',
                                            rect: ['110px', '243px', '4px', '72px', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(67, 67, 67)","none"],
                                            c: [
                                            {
                                                id: 'e3_duration-1',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '0%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,1.00)"],
                                                stroke: [0,"rgb(67, 67, 67)","none"]
                                            }]
                                        },
                                        {
                                            id: 'e3_duration-wrap-2',
                                            type: 'rect',
                                            rect: ['110px', '332px', '4px', '79px', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(67, 67, 67)","none"],
                                            c: [
                                            {
                                                id: 'e3_duration-2',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '0%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,1.00)"],
                                                stroke: [0,"rgb(67, 67, 67)","none"]
                                            }]
                                        },
                                        {
                                            id: 'e3_duration-wrap-3',
                                            type: 'rect',
                                            rect: ['110px', '429px', '4px', '80px', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(67, 67, 67)","none"],
                                            c: [
                                            {
                                                id: 'e3_duration-3',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '0%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,1.00)"],
                                                stroke: [0,"rgb(67, 67, 67)","none"]
                                            }]
                                        },
                                        {
                                            id: 'e3_exo-el-1',
                                            type: 'rect',
                                            rect: ['0px', '206px', '306px', '37px', 'auto', 'auto'],
                                            fill: ["rgba(192,192,192,0.00)"],
                                            stroke: [0,"rgba(0,0,0,1)","none"],
                                            userClass: "exo-el",
                                            c: [
                                            {
                                                id: 'e3_txt-exo-1',
                                                type: 'text',
                                                rect: ['150px', '9px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Exercice 1</p>",
                                                align: "left",
                                                userClass: "txt",
                                                font: ['poppins-light', [18, "px"], "rgba(67,67,67,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'e3_button-play-1',
                                                type: 'ellipse',
                                                rect: ['94px', '0px', '37px', '37px', 'auto', 'auto'],
                                                cursor: 'pointer',
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(67, 67, 67)","none"],
                                                userClass: "button-play play",
                                                c: [
                                                {
                                                    id: 'e3_button-play-el-1',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(67, 67, 67)","none"],
                                                    userClass: "flexCenter play",
                                                    c: [
                                                    {
                                                        id: 'e3_icon-play2',
                                                        type: 'image',
                                                        rect: ['17', '14', '11px', '15px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"e3_icon-play.png",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                },
                                                {
                                                    id: 'e3_button-pause-el-1',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(67, 67, 67)","none"],
                                                    userClass: "pause",
                                                    c: [
                                                    {
                                                        id: 'Rectangle9',
                                                        type: 'rect',
                                                        rect: ['15px', '13px', '2px', '11px', 'auto', 'auto'],
                                                        fill: ["rgba(255,255,255,1.00)"],
                                                        stroke: [0,"rgb(67, 67, 67)","none"]
                                                    },
                                                    {
                                                        id: 'Rectangle9Copy',
                                                        type: 'rect',
                                                        rect: ['19px', '13px', '2px', '11px', 'auto', 'auto'],
                                                        fill: ["rgba(255,255,255,1.00)"],
                                                        stroke: [0,"rgb(67, 67, 67)","none"]
                                                    }]
                                                },
                                                {
                                                    id: 'e3_button-replay-el-1',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(67, 67, 67)","none"],
                                                    userClass: "flexCenter replay",
                                                    c: [
                                                    {
                                                        id: 'e3_icon-replay',
                                                        type: 'image',
                                                        rect: ['17', '14', '21px', '23px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"e3_icon-replay.png",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e3_exo-el-2',
                                            type: 'rect',
                                            rect: ['0px', '305px', '306px', '37px', 'auto', 'auto'],
                                            fill: ["rgba(192,192,192,0.00)"],
                                            stroke: [0,"rgba(0,0,0,1)","none"],
                                            userClass: "exo-el",
                                            c: [
                                            {
                                                id: 'e3_txt-exo-2',
                                                type: 'text',
                                                rect: ['150px', '7px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Exercice 2</p>",
                                                align: "left",
                                                userClass: "txt",
                                                font: ['poppins-light', [18, "px"], "rgba(67,67,67,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'lock-grey',
                                                type: 'image',
                                                rect: ['71px', '0px', '19px', '25px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"lock-grey.svg",'0px','0px'],
                                                userClass: "lock"
                                            },
                                            {
                                                id: 'e3_button-play-2',
                                                type: 'ellipse',
                                                rect: ['94px', '0px', '37px', '37px', 'auto', 'auto'],
                                                cursor: 'pointer',
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(67, 67, 67)","none"],
                                                userClass: "button-play play",
                                                c: [
                                                {
                                                    id: 'e3_button-play-el-2',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(67, 67, 67)","none"],
                                                    userClass: "flexCenter play",
                                                    c: [
                                                    {
                                                        id: 'e3_icon-play2Copy',
                                                        type: 'image',
                                                        rect: ['17', '14', '11px', '15px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"e3_icon-play.png",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                },
                                                {
                                                    id: 'e3_button-pause-el-2',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(67, 67, 67)","none"],
                                                    userClass: "pause",
                                                    c: [
                                                    {
                                                        id: 'Rectangle9Copy3',
                                                        type: 'rect',
                                                        rect: ['15px', '13px', '2px', '11px', 'auto', 'auto'],
                                                        fill: ["rgba(255,255,255,1.00)"],
                                                        stroke: [0,"rgb(67, 67, 67)","none"]
                                                    },
                                                    {
                                                        id: 'Rectangle9Copy2',
                                                        type: 'rect',
                                                        rect: ['19px', '13px', '2px', '11px', 'auto', 'auto'],
                                                        fill: ["rgba(255,255,255,1.00)"],
                                                        stroke: [0,"rgb(67, 67, 67)","none"]
                                                    }]
                                                },
                                                {
                                                    id: 'e3_button-replay-el-2',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(67, 67, 67)","none"],
                                                    userClass: "flexCenter replay",
                                                    c: [
                                                    {
                                                        id: 'e3_icon-replayCopy',
                                                        type: 'image',
                                                        rect: ['17', '14', '21px', '23px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"e3_icon-replay.png",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e3_exo-el-3',
                                            type: 'rect',
                                            rect: ['0px', '401px', '306px', '37px', 'auto', 'auto'],
                                            fill: ["rgba(192,192,192,0.00)"],
                                            stroke: [0,"rgba(0,0,0,1)","none"],
                                            userClass: "exo-el",
                                            c: [
                                            {
                                                id: 'e3_txt-exo-3',
                                                type: 'text',
                                                rect: ['150px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Exercice 3</p>",
                                                align: "left",
                                                userClass: "txt",
                                                font: ['poppins-light', [18, "px"], "rgba(67,67,67,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'lock-greyCopy',
                                                type: 'image',
                                                rect: ['71px', '2px', '19px', '25px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"lock-grey.svg",'0px','0px'],
                                                userClass: "lock"
                                            },
                                            {
                                                id: 'e3_button-play-3',
                                                type: 'ellipse',
                                                rect: ['94px', '0px', '37px', '37px', 'auto', 'auto'],
                                                cursor: 'pointer',
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(67, 67, 67)","none"],
                                                userClass: "button-play play",
                                                c: [
                                                {
                                                    id: 'e3_button-play-el-3',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(67, 67, 67)","none"],
                                                    userClass: "flexCenter play",
                                                    c: [
                                                    {
                                                        id: 'e3_icon-play2Copy2',
                                                        type: 'image',
                                                        rect: ['17', '14', '11px', '15px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"e3_icon-play.png",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                },
                                                {
                                                    id: 'e3_button-pause-el-3',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(67, 67, 67)","none"],
                                                    userClass: "pause",
                                                    c: [
                                                    {
                                                        id: 'Rectangle9Copy5',
                                                        type: 'rect',
                                                        rect: ['15px', '13px', '2px', '11px', 'auto', 'auto'],
                                                        fill: ["rgba(255,255,255,1.00)"],
                                                        stroke: [0,"rgb(67, 67, 67)","none"]
                                                    },
                                                    {
                                                        id: 'Rectangle9Copy4',
                                                        type: 'rect',
                                                        rect: ['19px', '13px', '2px', '11px', 'auto', 'auto'],
                                                        fill: ["rgba(255,255,255,1.00)"],
                                                        stroke: [0,"rgb(67, 67, 67)","none"]
                                                    }]
                                                },
                                                {
                                                    id: 'e3_button-replay-el-3',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(67, 67, 67)","none"],
                                                    userClass: "flexCenter replay",
                                                    c: [
                                                    {
                                                        id: 'e3_icon-replayCopy2',
                                                        type: 'image',
                                                        rect: ['17', '14', '21px', '23px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"e3_icon-replay.png",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e2_group',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e2_popup',
                                        type: 'rect',
                                        rect: ['616px', '161px', '673px', '358px', 'auto', 'auto'],
                                        borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                        fill: ["rgba(228,228,228,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e2_slider',
                                            type: 'rect',
                                            rect: ['179px', '0px', '494px', '358px', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexXStartCol col",
                                            c: [
                                            {
                                                id: 'e2_slide-1',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                                fill: ["rgba(255,255,255,0.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexXStartCol col slide",
                                                c: [
                                                {
                                                    id: 'e2_txt-slider-1',
                                                    type: 'text',
                                                    rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">​<span style=\"font-size: 22px; font-family: poppins-bold;\">Échauffer ses muscles avant le travail</span></p><p style=\"margin: 0px;\">​n'est pas chose courante, et pourtant</p><p style=\"margin: 0px;\">​c'est <span style=\"font-family: poppins-bold;\">fondamental pour préparer votre corps</span>.</p>",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                                    textStyle: ["", "", "24px", "", ""]
                                                },
                                                {
                                                    id: 'e2_txt-slider-2',
                                                    type: 'text',
                                                    rect: ['0px', '140px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Ce dernier va être fortement sollicité :</p><p style=\"margin: 0px;\">​torsion, extension et contraction,</p><p style=\"margin: 0px;\">​il doit être préparé.</p>",
                                                    userClass: "static marginTop10",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                                    textStyle: ["", "", "24px", "", ""]
                                                }]
                                            },
                                            {
                                                id: 'e2_slide-2',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                                fill: ["rgba(255,255,255,0.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexXStartCol col slide",
                                                c: [
                                                {
                                                    id: 'e2_txt-slider-3',
                                                    type: 'text',
                                                    rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Lors de votre échauffement,</p><p style=\"margin: 0px;\">​il n'est pas nécessaire de faire des activités</p><p style=\"margin: 0px;\">​physiques lourdes.</p>",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                                    textStyle: ["", "", "24px", "", ""]
                                                },
                                                {
                                                    id: 'e2_txt-slider-4',
                                                    type: 'text',
                                                    rect: ['0px', '140px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Ce n'est pas une épreuve d'endurance.​</p>",
                                                    userClass: "static marginTop10",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                                    textStyle: ["", "", "24px", "", ""]
                                                },
                                                {
                                                    id: 'e2_txt-slider-5',
                                                    type: 'text',
                                                    rect: ['0px', '200px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Il est donc important d'aller <span style=\"font-family: poppins-bold; font-size: 22px;\">doucement</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold; font-size: 22px;\">​et progressivement sans trop forcer</span>.</p>",
                                                    userClass: "static marginTop10",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                                    textStyle: ["", "", "24px", "", ""]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e2_slider-img-1',
                                            type: 'image',
                                            rect: ['-166px', '-114px', '357px', '357px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e2_slider-img-1.png",'0px','0px']
                                        },
                                        {
                                            id: 'e2_slider-img-2',
                                            type: 'image',
                                            rect: ['-271px', '103px', '357px', '357px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e2_slider-img-2.png",'0px','0px']
                                        },
                                        {
                                            id: 'e2_slider-img-3',
                                            type: 'image',
                                            rect: ['-166px', '-65px', '357px', '488px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e2_slider-img-3.png",'0px','0px']
                                        },
                                        {
                                            id: 'e2_sliderGauge',
                                            type: 'rect',
                                            rect: ['568px', '358px', '111px', '50px', 'auto', 'auto'],
                                            fill: ["rgba(181,140,106,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e2_sliderGaugeContent',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,0.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexXStart cMarginRight15",
                                                c: [
                                                {
                                                    id: 'e2_sliderCurrent-1',
                                                    type: 'ellipse',
                                                    rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(181,140,106,0)"],
                                                    stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                                    userClass: "sliderCurrent boxSizingInitial static"
                                                },
                                                {
                                                    id: 'e2_sliderCurrent-2',
                                                    type: 'ellipse',
                                                    rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(181,140,106,0)"],
                                                    stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                                    userClass: "sliderCurrent boxSizingInitial static"
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e2_btSliderPrev',
                                            type: 'rect',
                                            rect: ['457px', '358px', '94px', '50px', 'auto', 'auto'],
                                            cursor: 'pointer',
                                            fill: ["rgba(181,140,106,1)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "btSlider",
                                            c: [
                                            {
                                                id: 'e3_btSliderPrevContent',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,0.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter",
                                                c: [
                                                {
                                                    id: 'arrow-whiteCopy5',
                                                    type: 'image',
                                                    rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
                                                    fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                    userClass: "static",
                                                    transform: [[],[],[],['-1']]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e2_btSliderNext',
                                            type: 'rect',
                                            rect: ['457px', '358px', '94px', '50px', 'auto', 'auto'],
                                            cursor: 'pointer',
                                            fill: ["rgba(181,140,106,1)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "btSlider",
                                            c: [
                                            {
                                                id: 'e3_btSliderNextContent',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,0.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter",
                                                c: [
                                                {
                                                    id: 'arrow-whiteCopy4',
                                                    type: 'image',
                                                    rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
                                                    fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                    userClass: "static"
                                                }]
                                            }]
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-2',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(250,250,250,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e5_background-shadow',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(44,44,44,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"]
                                },
                                {
                                    id: 'e5_background',
                                    type: 'image',
                                    rect: ['521px', '0px', '1600px', '751px', 'auto', 'auto'],
                                    opacity: '1',
                                    fill: ["rgba(0,0,0,0)",im+"e5_background.jpg",'0px','0px']
                                },
                                {
                                    id: 'e5_shape',
                                    type: 'image',
                                    rect: ['-521px', '0px', '1544px', '768px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e5_shape.png",'0px','0px']
                                },
                                {
                                    id: 'e5_textsWrap-1',
                                    type: 'rect',
                                    rect: ['181px', '317px', '619px', '92px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e5_textsWrapContent-1',
                                        type: 'rect',
                                        rect: ['0px', '0px', '619px', '92px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'Text2',
                                            type: 'text',
                                            rect: ['266', '19', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​La charge</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [50, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_textsWrap-2',
                                    type: 'rect',
                                    rect: ['919px', '317px', '619px', '92px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e5_textsWrapContent-2',
                                        type: 'rect',
                                        rect: ['0px', '0px', '619px', '92px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'Text2Copy',
                                            type: 'text',
                                            rect: ['86px', '9px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">L'environnement</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [50, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_button-1',
                                    type: 'rect',
                                    rect: ['438px', '409px', '107px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "button btLoadScreen btLoadScreen-6",
                                    c: [
                                    {
                                        id: 'e5_button-content-1',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy6',
                                            type: 'image',
                                            rect: ['28', '18', '14px', '22px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_button-2',
                                    type: 'rect',
                                    rect: ['1174px', '409px', '107px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "button btLoadScreen btLoadScreen-8",
                                    c: [
                                    {
                                        id: 'e5_button-content-2',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy7',
                                            type: 'image',
                                            rect: ['28', '18', '14px', '22px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'e11_textsWrap',
                                    type: 'rect',
                                    rect: ['471px', '59px', '658px', '180px', 'auto', 'auto'],
                                    borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                    fill: ["rgba(228,228,228,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e11_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                        fill: ["rgba(228,228,228,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e11_txt-1',
                                            type: 'text',
                                            rect: ['260', '68', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Vous savez analyser une situation, voyons maintenant</p><p style=\"margin: 0px;\">​comment&nbsp;« <span style=\"font-family: poppins-bold-italic;\">Appliquer les règles de manutention</span> ».</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light-italic', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-3',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(250,250,250,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e6_video-container-1',
                                    type: 'rect',
                                    rect: ['-124px', '0px', '1294px', '728px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "video-brightness"
                                },
                                {
                                    id: 'e6_video-container-2',
                                    type: 'rect',
                                    rect: ['-124px', '0px', '1294px', '728px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "video-brightness"
                                },
                                {
                                    id: 'e6_picture',
                                    type: 'image',
                                    rect: ['0px', '2px', '1018px', '723px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e6_picture.png",'0px','0px']
                                },
                                {
                                    id: 'e6_sliderVideoGauge',
                                    type: 'rect',
                                    rect: ['940px', '556px', '238px', '2px', 'auto', 'auto'],
                                    fill: ["rgba(218,218,218,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e6_sliderVideoDuration',
                                        type: 'rect',
                                        rect: ['0px', '-1px', '0%', '4px', 'auto', 'auto'],
                                        fill: ["rgba(23,23,23,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    }]
                                },
                                {
                                    id: 'e6_slider',
                                    type: 'rect',
                                    rect: ['940px', '96px', '619px', '357px', 'auto', 'auto'],
                                    overflow: 'hidden',
                                    fill: ["rgba(181,140,106,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e6_slide-1',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "slide flexXStartCol col",
                                        c: [
                                        {
                                            id: 'e6_txt-slide-1',
                                            type: 'text',
                                            rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​La charge</p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-bold', [28, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e6_txt-slide-2',
                                            type: 'text',
                                            rect: ['0px', '50px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Identifie les caractéristiques de la charge.​</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e6_txt-slide-3',
                                            type: 'text',
                                            rect: ['0px', '100px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Sa forme, son volume, sa facilité</p><p style=\"margin: 0px;\">​à être saisie.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'e6_slide-2',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "slide flexXStartCol col",
                                        c: [
                                        {
                                            id: 'e6_txt-slide-4',
                                            type: 'text',
                                            rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​La charge</p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-bold', [28, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e6_txt-slide-5',
                                            type: 'text',
                                            rect: ['0px', '50px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Bouger légèrement la charge vous permet de :</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e6_txt-slide-6',
                                            type: 'text',
                                            rect: ['0px', '100px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">• Évaluer son poids approximativement.</p><p style=\"margin: 0px;\">• Vérifier si son centre de masse est centré ou non.</p><p style=\"margin: 0px;\">• Déterminer la solidité de l’emballage ...\n&nbsp;​</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", "none"]
                                        },
                                        {
                                            id: 'e6_txt-slide-7',
                                            type: 'text',
                                            rect: ['0px', '180px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Vous pourrez ainsi minimiser les risques.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [25, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'e6_slide-3',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "slide flexXStartCol col",
                                        c: [
                                        {
                                            id: 'e6_txt-slide-8',
                                            type: 'text',
                                            rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​La charge</p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-bold', [28, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e6_txt-slide-9',
                                            type: 'text',
                                            rect: ['0px', '50px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">Ne surestimez pas votre force</span>, vous ne</p><p style=\"margin: 0px;\">​participez pas à un concours d'haltérophilie.</p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", "none"]
                                        },
                                        {
                                            id: 'e6_txt-slide-10',
                                            type: 'text',
                                            rect: ['0px', '180px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">N'hésitez pas à demander</p><p style=\"margin: 0px;\">​l'aide d'un collègue.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [25, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "30px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e6_sliderGauge',
                                    type: 'rect',
                                    rect: ['970px', '453px', '155px', '50px', 'auto', 'auto'],
                                    fill: ["rgba(181,140,106,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e6_sliderGaugeContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter cMarginRight15",
                                        c: [
                                        {
                                            id: 'e6_sliderCurrent-1',
                                            type: 'ellipse',
                                            rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                            userClass: "sliderCurrent boxSizingInitial static"
                                        },
                                        {
                                            id: 'e6_sliderCurrent-2',
                                            type: 'ellipse',
                                            rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                            userClass: "sliderCurrent boxSizingInitial static"
                                        },
                                        {
                                            id: 'e6_sliderCurrent-3',
                                            type: 'ellipse',
                                            rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                            userClass: "sliderCurrent boxSizingInitial static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'e6_btSliderPrev',
                                    type: 'rect',
                                    rect: ['940px', '453px', '30px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btSlider2",
                                    c: [
                                    {
                                        id: 'e6_btSliderPrevContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy11',
                                            type: 'image',
                                            rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static",
                                            transform: [[],[],[],['-1']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e6_btSliderNext',
                                    type: 'rect',
                                    rect: ['1125px', '453px', '94px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btSlider2",
                                    c: [
                                    {
                                        id: 'e6_btSliderNextContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy10',
                                            type: 'image',
                                            rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-4',
                                type: 'rect',
                                rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                fill: ["rgba(255,255,255,0.00)"],
                                stroke: [0,"rgb(0, 0, 0)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e8_group-1',
                                    type: 'rect',
                                    rect: ['50px', '0px', '475px', '731px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e8_rect',
                                        type: 'image',
                                        rect: ['0px', '0px', '475px', '731px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e8_rect.jpg",'0px','0px']
                                    },
                                    {
                                        id: 'e8_textsWrap-1',
                                        type: 'rect',
                                        rect: ['83px', '0px', '392px', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexXStartCol col",
                                        c: [
                                        {
                                            id: 'e8_txt-1',
                                            type: 'text',
                                            rect: ['0px', '286', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​L'environnement</p>",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-bold', [35, "px"], "rgba(181,140,106,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                        },
                                        {
                                            id: 'e8_txt-2',
                                            type: 'text',
                                            rect: ['0px', '336px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Planifier votre trajet !</p>",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [20, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                        },
                                        {
                                            id: 'e8_txt-3',
                                            type: 'text',
                                            rect: ['0px', '386px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">L'environnement peut être</p><p style=\"margin: 0px;\">​une <span style=\"font-family: poppins-bold;\">source importante</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​d'accidents</span>.</p>",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e10_background',
                                    type: 'image',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e10_background.jpg",'0px','0px']
                                },
                                {
                                    id: 'e8_man',
                                    type: 'image',
                                    rect: ['424px', '92px', '726px', '699px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e8_man.png",'0px','0px']
                                },
                                {
                                    id: 'e9_info-picture-1',
                                    type: 'image',
                                    rect: ['0px', '0px', '882px', '751px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e9_info-picture-1.png",'0px','0px'],
                                    userClass: "info-picture"
                                },
                                {
                                    id: 'e9_info-picture-2',
                                    type: 'image',
                                    rect: ['0px', '302px', '1600px', '449px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e9_info-picture-2.png",'0px','0px'],
                                    userClass: "info-picture"
                                },
                                {
                                    id: 'e9_info-picture-3',
                                    type: 'image',
                                    rect: ['589px', '0px', '1011px', '587px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e9_info-picture-3.png",'0px','0px'],
                                    userClass: "info-picture"
                                },
                                {
                                    id: 'e9_info-picture-4',
                                    type: 'image',
                                    rect: ['1049px', '330px', '453px', '377px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e9_info-picture-4.png",'0px','0px'],
                                    userClass: "info-picture"
                                },
                                {
                                    id: 'e9_info-man',
                                    type: 'image',
                                    rect: ['424px', '92px', '726px', '699px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e9_info-man.png",'0px','0px']
                                },
                                {
                                    id: 'e9_link',
                                    type: 'rect',
                                    rect: ['1153px', '176px', '30px', '2px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,1)"],
                                    stroke: [0,"rgb(255, 255, 255)","none"],
                                    c: [
                                    {
                                        id: 'e9_txt-1',
                                        type: 'text',
                                        rect: ['41px', '-17px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold-italic;\">Cliquez</span> pour identifier</p><p style=\"margin: 0px;\">​les obstacles.</p>",
                                        font: ['poppins-light-italic', [20, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                    }]
                                },
                                {
                                    id: 'e10_circle',
                                    type: 'ellipse',
                                    rect: ['964px', '602px', '676px', '676px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"]
                                },
                                {
                                    id: 'e10_textsWrap',
                                    type: 'rect',
                                    rect: ['289px', '299px', '1018px', '270px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e10_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e10_txt-1',
                                            type: 'text',
                                            rect: ['367', '86', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Lorsque c'est possible, veillez</p><p style=\"margin: 0px;\">​à désencombrer et à retirer</p><p style=\"margin: 0px;\">​ces obstacles.</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [35, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "42px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e9_info-1',
                                    type: 'rect',
                                    rect: ['357px', '198px', '270px', '61px', 'auto', 'auto'],
                                    borderRadius: ["35px", "35px", "35px", "35px 35px"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(255, 255, 255)","none"],
                                    userClass: "info",
                                    c: [
                                    {
                                        id: 'e9_info-content-1',
                                        type: 'rect',
                                        rect: ['60px', '0px', '210px', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(255, 255, 255)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text6',
                                            type: 'text',
                                            rect: ['35px', '21px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-light;\">Les</span> escaliers</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e9_info-2',
                                    type: 'rect',
                                    rect: ['556px', '593px', '300px', '61px', 'auto', 'auto'],
                                    borderRadius: ["35px", "35px", "35px", "35px 35px"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(255, 255, 255)","none"],
                                    userClass: "info",
                                    c: [
                                    {
                                        id: 'e9_info-content-2',
                                        type: 'rect',
                                        rect: ['60px', '0px', '210px', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,1)"],
                                        stroke: [0,"rgb(255, 255, 255)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text6Copy',
                                            type: 'text',
                                            rect: ['35px', '21px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-light;\">L'</span>encombrement</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e9_info-3',
                                    type: 'rect',
                                    rect: ['1062px', '146px', '304px', '61px', 'auto', 'auto'],
                                    borderRadius: ["35px", "35px", "35px", "35px 35px"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(255, 255, 255)","none"],
                                    userClass: "info",
                                    c: [
                                    {
                                        id: 'e9_info-content-3',
                                        type: 'rect',
                                        rect: ['60px', '0px', '210px', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,1)"],
                                        stroke: [0,"rgb(255, 255, 255)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text6Copy2',
                                            type: 'text',
                                            rect: ['35px', '21px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-light;\">Les&nbsp;</span>lieux sombres</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e9_info-4',
                                    type: 'rect',
                                    rect: ['1038px', '528px', '358px', '61px', 'auto', 'auto'],
                                    borderRadius: ["35px", "35px", "35px", "35px 35px"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(255, 255, 255)","none"],
                                    userClass: "info",
                                    c: [
                                    {
                                        id: 'e9_info-content-4',
                                        type: 'rect',
                                        rect: ['30px', '0px', '271px', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,1)"],
                                        stroke: [0,"rgb(255, 255, 255)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text6Copy3',
                                            type: 'text',
                                            rect: ['35px', '21px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-light;\">Les&nbsp;</span>surfaces glissantes</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e8_button',
                                    type: 'rect',
                                    rect: ['476px', '598px', '107px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btNext",
                                    c: [
                                    {
                                        id: 'e5_button-content-1Copy',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy8',
                                            type: 'image',
                                            rect: ['28', '18', '14px', '22px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'e9_btInfo-1',
                                    type: 'ellipse',
                                    rect: ['357px', '198px', '57px', '57px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                    userClass: "btInfo boxSizingInitial",
                                    c: [
                                    {
                                        id: 'e9_btInfo-content-1',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text5',
                                            type: 'text',
                                            rect: ['20', '22', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​!</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e9_btInfo-2',
                                    type: 'ellipse',
                                    rect: ['556px', '593px', '57px', '57px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                    userClass: "btInfo boxSizingInitial",
                                    c: [
                                    {
                                        id: 'e9_btInfo-content-2',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text5Copy',
                                            type: 'text',
                                            rect: ['20', '22', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​!</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e9_btInfo-3',
                                    type: 'ellipse',
                                    rect: ['1062px', '146px', '57px', '57px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                    userClass: "btInfo boxSizingInitial",
                                    c: [
                                    {
                                        id: 'e9_btInfo-content-3',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text5Copy2',
                                            type: 'text',
                                            rect: ['20', '22', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​!</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e9_btInfo-4',
                                    type: 'ellipse',
                                    rect: ['1337px', '528px', '57px', '57px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                    userClass: "btInfo boxSizingInitial",
                                    c: [
                                    {
                                        id: 'e9_btInfo-content-4',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text5Copy3',
                                            type: 'text',
                                            rect: ['20', '22', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​!</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-5',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(192,192,192,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e13_background-blurred',
                                    type: 'image',
                                    rect: ['49px', '0px', '1537px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e13_background-blurred.png",'0px','0px']
                                },
                                {
                                    id: 'e14_exercice',
                                    type: 'rect',
                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e14_picture-center-corrected',
                                        type: 'image',
                                        rect: ['156px', '72px', '1288px', '719px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e14_picture-center-corrected.png",'0px','0px']
                                    },
                                    {
                                        id: 'e14_picture-center',
                                        type: 'image',
                                        rect: ['106px', '66px', '1338px', '725px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e14_picture-center.png",'0px','0px']
                                    },
                                    {
                                        id: 'e14_textsWrap',
                                        type: 'rect',
                                        rect: ['499px', '54px', '602px', '143px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e14_textsWrapContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexYStartCol col",
                                            c: [
                                            {
                                                id: 'e14_txt-1',
                                                type: 'text',
                                                rect: ['274px', '47px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-extra-bold-italic;\">Cliquez</span> sur la bonne réponse.</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'e14_txt-2',
                                                type: 'text',
                                                rect: ['254px', '87px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​À&nbsp;<span style=\"font-family: poppins-bold;\">quelle distance </span>vous positionnez-vous</p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">de la charge à porter </span>?</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e14_element-right',
                                        type: 'rect',
                                        rect: ['1102px', '93px', '429px', '582px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        userClass: "click boxSizingInitial",
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'e14_element-right-content',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e14_picture-right2',
                                                type: 'image',
                                                rect: ['-375px', '55px', '869px', '595px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e14_picture-right.png",'0px','0px']
                                            },
                                            {
                                                id: 'e14_textsWrap-right',
                                                type: 'rect',
                                                rect: ['0px', '47px', '100%', '115px', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e14_textsWrapRightContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexYStartCol col",
                                                    c: [
                                                    {
                                                        id: 'e14_txt-right',
                                                        type: 'text',
                                                        rect: ['24px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Le <span style=\"font-family: poppins-bold; font-size: 25px;\">plus proche</span> possible.​</p>",
                                                        align: "center",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "25px", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e14_element-right-clicked',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e14_element-right-textsWrap',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter col",
                                                c: [
                                                {
                                                    id: 'Text10Copy3',
                                                    type: 'text',
                                                    rect: ['214', '234', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Exact</p>",
                                                    align: "left",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(40,135,113,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy2',
                                                    type: 'text',
                                                    rect: ['214', '284px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Vous devez être le plus</p><p style=\"margin: 0px;\">​<span style=\"font-size: 25px; font-family: poppins-bold;\">proche possible</span></p><p style=\"margin: 0px;\"><span style=\"font-size: 25px; font-family: poppins-bold;\">​de la charge</span>.</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                }]
                                            },
                                            {
                                                id: 'e14_circle-right',
                                                type: 'ellipse',
                                                rect: ['-41px', '258px', '76px', '76px', 'auto', 'auto'],
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(40,135,113,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e14_circle-right-content',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'check-white2',
                                                        type: 'image',
                                                        rect: ['27', '18', '24px', '16px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"check-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            },
                                            {
                                                id: 'e14_button-right',
                                                type: 'rect',
                                                rect: ['100px', '541px', '239px', '50px', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "btNext",
                                                c: [
                                                {
                                                    id: 'e14_buttonRightContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'Text8Copy2',
                                                        type: 'text',
                                                        rect: ['81', '19', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Règle suivante</p>",
                                                        align: "left",
                                                        userClass: "static marginRight20",
                                                        font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "", "", "none"]
                                                    },
                                                    {
                                                        id: 'arrow-white2Copy2',
                                                        type: 'image',
                                                        rect: ['178', '6', '12px', '19px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e14_element-left',
                                        type: 'rect',
                                        rect: ['61px', '93px', '429px', '582px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        userClass: "click boxSizingInitial",
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'e14_element-left-content',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e14_picture-left',
                                                type: 'image',
                                                rect: ['-65px', '55px', '774px', '595px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e14_picture-left.png",'0px','0px']
                                            },
                                            {
                                                id: 'e14_textsWrap-left',
                                                type: 'rect',
                                                rect: ['0px', '47px', '100%', '115px', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e14_textsWrapLeftContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexYStartCol col",
                                                    c: [
                                                    {
                                                        id: 'e14_txt-left',
                                                        type: 'text',
                                                        rect: ['24px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">À​ <span style=\"font-family: poppins-bold; font-size: 25px;\">50 cm</span> pour <span style=\"font-family: poppins-bold;\">conserver</span></p><p style=\"margin: 0px;\">​de l'<span style=\"font-family: poppins-bold;\">amplitude de mouvement</span>.</p>",
                                                        align: "center",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "25px", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e14_element-left-clicked',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e14_element-left-textsWrap',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter col",
                                                c: [
                                                {
                                                    id: 'Text10',
                                                    type: 'text',
                                                    rect: ['214', '234', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">​Dommage !</p>",
                                                    align: "left",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(234,31,41,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy',
                                                    type: 'text',
                                                    rect: ['214', '284px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Vous devez être le plus</p><p style=\"margin: 0px;\">​<span style=\"font-size: 25px; font-family: poppins-bold;\">proche possible</span></p><p style=\"margin: 0px;\"><span style=\"font-size: 25px; font-family: poppins-bold;\">​de la charge</span>.</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                }]
                                            },
                                            {
                                                id: 'e14_circle-left',
                                                type: 'ellipse',
                                                rect: ['400px', '258px', '76px', '76px', 'auto', 'auto'],
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(234,31,41,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e4_circle-left-content',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'cross-whiteCopy2',
                                                        type: 'image',
                                                        rect: ['17', '25', '18px', '20px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"cross-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            },
                                            {
                                                id: 'e14_button-left',
                                                type: 'rect',
                                                rect: ['100px', '541px', '239px', '50px', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "btNext",
                                                c: [
                                                {
                                                    id: 'e14_buttonLeftContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'Text8Copy',
                                                        type: 'text',
                                                        rect: ['81', '19', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Règle suivante</p>",
                                                        align: "left",
                                                        userClass: "static marginRight20",
                                                        font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "", "", "none"]
                                                    },
                                                    {
                                                        id: 'arrow-white2Copy',
                                                        type: 'image',
                                                        rect: ['178', '6', '12px', '19px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e15_exercice',
                                    type: 'rect',
                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "hidden",
                                    c: [
                                    {
                                        id: 'e15_picture-center-corrected-right',
                                        type: 'image',
                                        rect: ['156px', '66px', '1288px', '725px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e15_picture-center-corrected-right.png",'0px','0px']
                                    },
                                    {
                                        id: 'e15_group-wrong',
                                        type: 'group',
                                        rect: ['155', '187', '1288', '604', 'auto', 'auto'],
                                        c: [
                                        {
                                            id: 'e15_picture-center-corrected-wrong',
                                            type: 'image',
                                            rect: ['0px', '0px', '1288px', '604px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e15_picture-center-corrected-wrong.png",'0px','0px']
                                        },
                                        {
                                            id: 'e15_veil-wrong',
                                            type: 'image',
                                            rect: ['563px', '104px', '430px', '500px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e15_veil-wrong.png",'0px','0px'],
                                            userClass: "fading"
                                        }]
                                    },
                                    {
                                        id: 'e15_picture-center',
                                        type: 'image',
                                        rect: ['156px', '66px', '1273px', '725px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e15_picture-center.png",'0px','0px']
                                    },
                                    {
                                        id: 'e15_textsWrap',
                                        type: 'rect',
                                        rect: ['499px', '54px', '602px', '143px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e15_textsWrapContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexYStartCol col",
                                            c: [
                                            {
                                                id: 'e15_txt-1',
                                                type: 'text',
                                                rect: ['274px', '47px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-extra-bold-italic;\">Cliquez</span> sur la bonne réponse.</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'e15_txt-2',
                                                type: 'text',
                                                rect: ['254px', '87px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​À présent que vous êtes proche de la charge<span style=\"font-family: poppins-bold;\">,</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​comment positionnez-vous vos pieds</span> ?</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e15_element-right',
                                        type: 'rect',
                                        rect: ['1102px', '93px', '429px', '582px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        userClass: "click boxSizingInitial",
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'e15_element-right-content',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e15_picture-right',
                                                type: 'image',
                                                rect: ['18px', '-89px', '412px', '731px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e15_picture-right.png",'0px','0px']
                                            },
                                            {
                                                id: 'e15_textsWrap-right',
                                                type: 'rect',
                                                rect: ['0px', '490px', '100%', '115px', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e15_textsWrapRightContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexYStartCol col",
                                                    c: [
                                                    {
                                                        id: 'e15_txt-right',
                                                        type: 'text',
                                                        rect: ['24px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">En <span style=\"font-family: poppins-bold; font-size: 25px;\">parallèle</span>.</p>",
                                                        align: "center",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "25px", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e15_element-right-clicked',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e15_element-right-textsWrap',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter col",
                                                c: [
                                                {
                                                    id: 'Text10Copy7',
                                                    type: 'text',
                                                    rect: ['214', '234', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Dommage !</p>",
                                                    align: "left",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(234,31,41,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy6',
                                                    type: 'text',
                                                    rect: ['214', '284px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Cette position</p><p style=\"margin: 0px;\">​ne vous permet pas d'être</p>",
                                                    align: "center",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                },
                                                {
                                                    id: 'Text11',
                                                    type: 'text',
                                                    rect: ['165', '390px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">​au plus proche</p><p style=\"margin: 0px;\">​de la charge.</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "31px", "", "none"]
                                                }]
                                            },
                                            {
                                                id: 'e15_circle-right',
                                                type: 'ellipse',
                                                rect: ['-41px', '258px', '76px', '76px', 'auto', 'auto'],
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(234,31,41,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e15_circle-right-contentCopy',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'cross-whiteCopy4',
                                                        type: 'image',
                                                        rect: ['0px', '0px', '18px', '20px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"cross-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            },
                                            {
                                                id: 'e15_button-right',
                                                type: 'rect',
                                                rect: ['82px', '541px', '275px', '50px', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "",
                                                c: [
                                                {
                                                    id: 'e15_buttonRightContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'Text8Copy4',
                                                        type: 'text',
                                                        rect: ['81', '19', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Voir la bonne position</p>",
                                                        align: "left",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e15_element-left',
                                        type: 'rect',
                                        rect: ['61px', '93px', '429px', '582px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        userClass: "click boxSizingInitial",
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'e15_element-left-content',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e15_picture-left',
                                                type: 'image',
                                                rect: ['-65px', '0px', '650px', '424px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e15_picture-left.png",'0px','0px']
                                            },
                                            {
                                                id: 'e15_textsWrap-left',
                                                type: 'rect',
                                                rect: ['0px', '490px', '100%', '115px', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e15_textsWrapLeftContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexYStartCol col",
                                                    c: [
                                                    {
                                                        id: 'e15_txt-left',
                                                        type: 'text',
                                                        rect: ['24px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">En <span style=\"font-size: 25px; font-family: poppins-bold;\">équerre</span>.</p>",
                                                        align: "center",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "25px", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e15_element-left-clicked',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e15_element-left-textsWrap',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter col",
                                                c: [
                                                {
                                                    id: 'Text10Copy5',
                                                    type: 'text',
                                                    rect: ['214', '234', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Parfait !</p>",
                                                    align: "left",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(40,135,113,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy4',
                                                    type: 'text',
                                                    rect: ['64px', '284px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Encadrer la charge avec les pieds</p><p style=\"margin: 0px;\">​placés en équerre permet de</p>",
                                                    align: "center",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy8',
                                                    type: 'text',
                                                    rect: ['64px', '354px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">diminuer la distance</p><p style=\"margin: 0px;\">​entre la charge</p><p style=\"margin: 0px;\">​et le bas de votre dos</p>",
                                                    align: "center",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "30px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy9',
                                                    type: 'text',
                                                    rect: ['64px', '444px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Le pied de la main dominante</p><p style=\"margin: 0px;\">se place en avant et l'autre sur le côté</p><p style=\"margin: 0px;\">(personne droitière dans notre exemple).​</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-light', [19, "px"], "rgba(134,134,134,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                }]
                                            },
                                            {
                                                id: 'e15_circle-left',
                                                type: 'ellipse',
                                                rect: ['400px', '258px', '76px', '76px', 'auto', 'auto'],
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(40,135,113,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e15_circle-left-content',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'check-white2Copy',
                                                        type: 'image',
                                                        rect: ['0px', '0px', '24px', '16px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"check-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            },
                                            {
                                                id: 'e15_button-left',
                                                type: 'rect',
                                                rect: ['100px', '541px', '239px', '50px', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "btNext",
                                                c: [
                                                {
                                                    id: 'e15_buttonLeftContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'Text8Copy3',
                                                        type: 'text',
                                                        rect: ['81', '19', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Règle suivante</p>",
                                                        align: "left",
                                                        userClass: "static marginRight20",
                                                        font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "", "", "none"]
                                                    },
                                                    {
                                                        id: 'arrow-white2Copy3',
                                                        type: 'image',
                                                        rect: ['178', '6', '12px', '19px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e16_exercice',
                                    type: 'rect',
                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e16_picture-center-corrected-right',
                                        type: 'image',
                                        rect: ['156px', '66px', '1288px', '725px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e15_picture-center-corrected-right.png",'0px','0px']
                                    },
                                    {
                                        id: 'e16_picture-center',
                                        type: 'image',
                                        rect: ['156px', '66px', '1288px', '725px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e15_picture-center-corrected-right.png",'0px','0px']
                                    },
                                    {
                                        id: 'e16_group-wrong',
                                        type: 'group',
                                        rect: ['156', '66', '1288', '725', 'auto', 'auto'],
                                        c: [
                                        {
                                            id: 'e16_picture-center-corrected-wrong',
                                            type: 'image',
                                            rect: ['0px', '0px', '1288px', '725px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e16_picture-center-corrected-wrong.png",'0px','0px']
                                        },
                                        {
                                            id: 'e16_veil-wrong',
                                            type: 'image',
                                            rect: ['574px', '166px', '115px', '100px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e16_veil-wrong.png",'0px','0px'],
                                            userClass: "fading"
                                        }]
                                    },
                                    {
                                        id: 'e16_textsWrap',
                                        type: 'rect',
                                        rect: ['499px', '54px', '602px', '143px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e16_textsWrapContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexYStartCol col",
                                            c: [
                                            {
                                                id: 'e16_txt-1',
                                                type: 'text',
                                                rect: ['274px', '47px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-extra-bold-italic;\">Cliquez</span> sur la bonne réponse.</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'e16_txt-2',
                                                type: 'text',
                                                rect: ['254px', '87px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​À présent, vous décidez de...</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e16_element-right',
                                        type: 'rect',
                                        rect: ['1102px', '93px', '429px', '582px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        userClass: "click boxSizingInitial",
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'e16_element-right-content',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e16_picture-right',
                                                type: 'image',
                                                rect: ['-850px', '-97px', '1344px', '791px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e16_picture-right.png",'0px','0px']
                                            },
                                            {
                                                id: 'e16_textsWrap-right',
                                                type: 'rect',
                                                rect: ['0px', '47px', '100%', '115px', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e16_textsWrapRightContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexYStartCol col",
                                                    c: [
                                                    {
                                                        id: 'e16_txt-right',
                                                        type: 'text',
                                                        rect: ['24px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Regarder <span style=\"font-family: poppins-bold; font-size: 25px;\">devant moi</span>.​</p>",
                                                        align: "center",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "25px", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e16_element-right-clicked',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e16_element-right-textsWrap',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter col",
                                                c: [
                                                {
                                                    id: 'Text10Copy13',
                                                    type: 'text',
                                                    rect: ['214px', '234px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Très bien !</p>",
                                                    align: "left",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(40,135,113,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy12',
                                                    type: 'text',
                                                    rect: ['214px', '284px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">De cette façon,</p><p style=\"margin: 0px;\">​vous conservez l'alignement</p><p style=\"margin: 0px;\">​de votre colonne vertébrale.</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                }]
                                            },
                                            {
                                                id: 'e16_circle-right',
                                                type: 'ellipse',
                                                rect: ['-41px', '258px', '76px', '76px', 'auto', 'auto'],
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(40,135,113,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e16_circle-right-content',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'check-white2Copy2',
                                                        type: 'image',
                                                        rect: ['27px', '18px', '24px', '16px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"check-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            },
                                            {
                                                id: 'e16_button-right',
                                                type: 'rect',
                                                rect: ['100px', '541px', '239px', '50px', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "btNext",
                                                c: [
                                                {
                                                    id: 'e16_buttonRightContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'Text8Copy6',
                                                        type: 'text',
                                                        rect: ['81px', '19px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Règle suivante</p>",
                                                        align: "left",
                                                        userClass: "static marginRight20",
                                                        font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "", "", "none"]
                                                    },
                                                    {
                                                        id: 'arrow-white2Copy6',
                                                        type: 'image',
                                                        rect: ['178px', '6px', '12px', '19px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e16_element-left',
                                        type: 'rect',
                                        rect: ['61px', '93px', '429px', '582px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        userClass: "click boxSizingInitial",
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'e16_element-left-content',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e16_picture-left',
                                                type: 'image',
                                                rect: ['-65px', '14px', '826px', '620px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e16_picture-left.png",'0px','0px']
                                            },
                                            {
                                                id: 'e16_textsWrap-left',
                                                type: 'rect',
                                                rect: ['0px', '47px', '100%', '115px', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e16_textsWrapLeftContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexYStartCol col",
                                                    c: [
                                                    {
                                                        id: 'e16_txt-left',
                                                        type: 'text',
                                                        rect: ['24px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold; font-size: 25px;\">Regarder la charge</span></p><p style=\"margin: 0px;\">​afin de bien <span style=\"font-family: poppins-bold;\">visualiser</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​ma prise en main</span>.</p>",
                                                        align: "center",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "25px", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e16_element-left-clicked',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e16_element-left-textsWrap',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter col",
                                                c: [
                                                {
                                                    id: 'Text10Copy11',
                                                    type: 'text',
                                                    rect: ['214px', '234px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">​Dommage !</p>",
                                                    align: "left",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(234,31,41,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy10',
                                                    type: 'text',
                                                    rect: ['154px', '334px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Vous devez conserver​</p>",
                                                    align: "center",
                                                    userClass: "static marginBottom10",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy14',
                                                    type: 'text',
                                                    rect: ['144px', '384px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">l'alignement</p><p style=\"margin: 0px;\">​de votre colonne</p><p style=\"margin: 0px;\">​vertébrale</p>",
                                                    align: "center",
                                                    userClass: "static marginBottom10",
                                                    font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "31px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy15',
                                                    type: 'text',
                                                    rect: ['154px', '484px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">et donc garder la tête droite.</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                }]
                                            },
                                            {
                                                id: 'e16_circle-left',
                                                type: 'ellipse',
                                                rect: ['400px', '258px', '76px', '76px', 'auto', 'auto'],
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(234,31,41,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e16_circle-left-content',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'cross-whiteCopy5',
                                                        type: 'image',
                                                        rect: ['17px', '25px', '18px', '20px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"cross-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            },
                                            {
                                                id: 'e16_button-left',
                                                type: 'rect',
                                                rect: ['81px', '541px', '275px', '50px', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "",
                                                c: [
                                                {
                                                    id: 'e16_buttonLeftContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'Text8Copy5',
                                                        type: 'text',
                                                        rect: ['81px', '19px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Voir la bonne position​</p>",
                                                        align: "left",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e17_exercice',
                                    type: 'rect',
                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e17_picture-center',
                                        type: 'image',
                                        rect: ['156px', '66px', '1288px', '725px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e15_picture-center-corrected-right.png",'0px','0px']
                                    },
                                    {
                                        id: 'e17_picture-center-corrected-right',
                                        type: 'image',
                                        rect: ['156px', '239px', '1288px', '552px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e17_picture-center-corrected-right.png",'0px','0px']
                                    },
                                    {
                                        id: 'e17_group-wrong',
                                        type: 'group',
                                        rect: ['156', '66', '1288', '725', 'auto', 'auto'],
                                        c: [
                                        {
                                            id: 'e17_picture-corrected-wrong',
                                            type: 'image',
                                            rect: ['0px', '0px', '1288px', '725px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e17_picture-corrected-wrong.png",'0px','0px']
                                        },
                                        {
                                            id: 'e17_veil-wrong',
                                            type: 'image',
                                            rect: ['538px', '433px', '191px', '209px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e17_veil-wrong.png",'0px','0px'],
                                            userClass: "fading"
                                        }]
                                    },
                                    {
                                        id: 'e17_textsWrap',
                                        type: 'rect',
                                        rect: ['499px', '54px', '602px', '143px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e17_textsWrapContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexYStartCol col",
                                            c: [
                                            {
                                                id: 'e17_txt-1',
                                                type: 'text',
                                                rect: ['274px', '47px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-extra-bold-italic;\">Cliquez</span> sur la bonne réponse.</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'e17_txt-2',
                                                type: 'text',
                                                rect: ['254px', '87px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Vous allez <span style=\"font-family: poppins-bold;\">fléchir vos jambes</span></p><p style=\"margin: 0px;\">​pour approcher de la charge.</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e17_element-right',
                                        type: 'rect',
                                        rect: ['1102px', '93px', '429px', '582px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["27px", "27px", "27px", "27px 27px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        userClass: "click boxSizingInitial",
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'e17_element-right-content',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e17_picture-right',
                                                type: 'image',
                                                rect: ['-192px', '-36px', '686px', '494px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e17_picture-right.png",'0px','0px']
                                            },
                                            {
                                                id: 'e17_textsWrap-right',
                                                type: 'rect',
                                                rect: ['0px', '47px', '100%', '115px', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e17_textsWrapRightContent',
                                                    type: 'rect',
                                                    rect: ['0px', '449px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexYStartCol col",
                                                    c: [
                                                    {
                                                        id: 'e17_txt-right',
                                                        type: 'text',
                                                        rect: ['24px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Je <span style=\"font-family: poppins-bold;\">fléchis</span></p><p style=\"margin: 0px;\">​mes <span style=\"font-family: poppins-bold; font-size: 25px;\">genoux à 90°</span>.</p>",
                                                        align: "center",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "25px", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e17_element-right-clicked',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e17_element-right-textsWrap',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter col",
                                                c: [
                                                {
                                                    id: 'Text10Copy21',
                                                    type: 'text',
                                                    rect: ['214px', '234px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Bravo !</p>",
                                                    align: "left",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(40,135,113,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy20',
                                                    type: 'text',
                                                    rect: ['214px', '284px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Fléchir les genoux à 90°</p><p style=\"margin: 0px;\">​vous permet de vous</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy25',
                                                    type: 'text',
                                                    rect: ['134px', '344px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">rapprocher de la charge</p><p style=\"margin: 0px;\">​dans l'axe vertical</p><p style=\"margin: 0px;\">​sans trop incliner</p><p style=\"margin: 0px;\">​votre tronc.</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "31px", "", "none"]
                                                }]
                                            },
                                            {
                                                id: 'e17_circle-right',
                                                type: 'ellipse',
                                                rect: ['-41px', '258px', '76px', '76px', 'auto', 'auto'],
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(40,135,113,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e17_circle-right-content',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'check-white2Copy3',
                                                        type: 'image',
                                                        rect: ['27px', '18px', '24px', '16px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"check-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e17_element-left',
                                        type: 'rect',
                                        rect: ['61px', '93px', '429px', '582px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                        fill: ["rgba(250,250,250,1.00)"],
                                        stroke: [4,"rgba(255,255,255,1.00)","solid"],
                                        userClass: "click boxSizingInitial",
                                        boxShadow: ["", 0, 0, 57, 0, "rgba(0,0,0,0.13)"],
                                        c: [
                                        {
                                            id: 'e17_element-left-content',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            overflow: 'hidden',
                                            borderRadius: ["25px", "25px", "25px", "25px 25px"],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e17_picture-left',
                                                type: 'image',
                                                rect: ['-65px', '-36px', '746px', '494px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"e17_picture-left.png",'0px','0px']
                                            },
                                            {
                                                id: 'e17_textsWrap-left',
                                                type: 'rect',
                                                rect: ['0px', '496px', '100%', '115px', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e17_textsWrapLeftContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexYStartCol col",
                                                    c: [
                                                    {
                                                        id: 'e17_txt-left',
                                                        type: 'text',
                                                        rect: ['24px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Je fléchis</p><p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold; font-size: 25px;\">au maximum</span>.</p>",
                                                        align: "center",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "25px", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            id: 'e17_element-left-clicked',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e17_element-left-textsWrap',
                                                type: 'rect',
                                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "flexCenter col",
                                                c: [
                                                {
                                                    id: 'Text10Copy19',
                                                    type: 'text',
                                                    rect: ['144px', '34px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">​Dommage !</p>",
                                                    align: "left",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(234,31,41,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy18',
                                                    type: 'text',
                                                    rect: ['84px', '134px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Une flexion supérieure à 90°</p><p style=\"margin: 0px;\">​vous demande un</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy17',
                                                    type: 'text',
                                                    rect: ['74px', '184px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">effort très important</p><p style=\"margin: 0px;\">​pour vous redresser.</p>",
                                                    align: "center",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "31px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy22',
                                                    type: 'text',
                                                    rect: ['84px', '274px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">Elle provoque une bascule</p><p style=\"margin: 0px;\">​du bassin vers l'arrière et donc un</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy16',
                                                    type: 'text',
                                                    rect: ['74px', '324px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">mauvais positionnement</p><p style=\"margin: 0px;\">​vertébral.</p>",
                                                    align: "center",
                                                    userClass: "static marginBottom20",
                                                    font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "31px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy24',
                                                    type: 'text',
                                                    rect: ['84px', '394px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">De plus, une flexion trop importante​</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "25px", "", "none"]
                                                },
                                                {
                                                    id: 'Text10Copy23',
                                                    type: 'text',
                                                    rect: ['74px', '444px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">comprime fortement</p><p style=\"margin: 0px;\">​le cartilage de vos rotules.</p>",
                                                    align: "center",
                                                    userClass: "static",
                                                    font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                    textStyle: ["", "", "31px", "", "none"]
                                                }]
                                            },
                                            {
                                                id: 'e17_circle-left',
                                                type: 'ellipse',
                                                rect: ['400px', '258px', '76px', '76px', 'auto', 'auto'],
                                                borderRadius: ["50%", "50%", "50%", "50%"],
                                                fill: ["rgba(234,31,41,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                c: [
                                                {
                                                    id: 'e17_circle-left-content',
                                                    type: 'ellipse',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'cross-whiteCopy',
                                                        type: 'image',
                                                        rect: ['17px', '25px', '18px', '20px', 'auto', 'auto'],
                                                        fill: ["rgba(0,0,0,0)",im+"cross-white.svg",'0px','0px'],
                                                        userClass: "static"
                                                    }]
                                                }]
                                            },
                                            {
                                                id: 'e17_button-left',
                                                type: 'rect',
                                                rect: ['81px', '541px', '275px', '50px', 'auto', 'auto'],
                                                fill: ["rgba(181,140,106,1.00)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "",
                                                c: [
                                                {
                                                    id: 'e17_buttonLeftContent',
                                                    type: 'rect',
                                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                                    fill: ["rgba(255,255,255,0.00)"],
                                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                                    userClass: "flexCenter",
                                                    c: [
                                                    {
                                                        id: 'Text8Copy7',
                                                        type: 'text',
                                                        rect: ['81px', '19px', 'auto', 'auto', 'auto', 'auto'],
                                                        text: "<p style=\"margin: 0px;\">Voir la bonne position​</p>",
                                                        align: "left",
                                                        userClass: "static",
                                                        font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                        textStyle: ["", "", "", "", "none"]
                                                    }]
                                                }]
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e13_bloc',
                                    type: 'rect',
                                    rect: ['417px', '198px', '765px', '335px', 'auto', 'auto'],
                                    borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                    fill: ["rgba(228,228,228,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e13_blocContent',
                                        type: 'rect',
                                        rect: ['150px', '0px', '615px', '335px', 'auto', 'auto'],
                                        borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                        fill: ["rgba(228,228,228,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexXStartCol col",
                                        c: [
                                        {
                                            id: 'e13_txt-1',
                                            type: 'text',
                                            rect: ['0px', '98', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Appliquer les règles de manutention</p>",
                                            align: "left",
                                            userClass: "static marginBottom30",
                                            font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e13_txt-2',
                                            type: 'text',
                                            rect: ['0px', '148px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Vous allez devoir <span style=\"font-family: poppins-bold;\">réaliser un port de charge</span> </p><p style=\"margin: 0px;\">en choisissant les positions qui feront subir</p><p style=\"margin: 0px;\">le <span style=\"font-family: poppins-bold;\">moins de pression possible à votre colonne</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">vertébrale</span>.​</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'e13_picture-2',
                                        type: 'image',
                                        rect: ['-93px', '-74px', '238px', '284px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e13_picture-2.png",'0px','0px']
                                    },
                                    {
                                        id: 'e13_picture-1',
                                        type: 'image',
                                        rect: ['-162px', '56px', '238px', '284px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e13_picture-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'e13_circle-1',
                                        type: 'ellipse',
                                        rect: ['-174px', '155px', '63px', '63px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(234,31,41,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e13_circle-content-1',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '63px', '63px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'cross-white',
                                                type: 'image',
                                                rect: ['17', '25', '15px', '17px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"cross-white.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e13_circle-2',
                                        type: 'ellipse',
                                        rect: ['107px', '-1px', '63px', '63px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(40,135,113,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e13_circle-content-2',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '63px', '63px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'check-white',
                                                type: 'image',
                                                rect: ['23px', '29px', '20px', '14px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"check-white.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e13_button',
                                        type: 'rect',
                                        rect: ['454px', '335px', '245px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "btNext",
                                        c: [
                                        {
                                            id: 'e13_buttonContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text8',
                                                type: 'text',
                                                rect: ['81', '19', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Commencer</p>",
                                                align: "left",
                                                userClass: "static marginRight20",
                                                font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            },
                                            {
                                                id: 'arrow-white2',
                                                type: 'image',
                                                rect: ['178', '6', '12px', '19px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-6',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(250,250,250,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e18_video-container',
                                    type: 'rect',
                                    rect: ['347px', '27px', '1200px', '674px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "video-brightness"
                                },
                                {
                                    id: 'e19_video-container',
                                    type: 'rect',
                                    rect: ['347px', '27px', '1200px', '674px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "video-brightness"
                                },
                                {
                                    id: 'e18_link',
                                    type: 'rect',
                                    rect: ['279px', '249px', '180px', '2px', 'auto', 'auto'],
                                    fill: ["rgba(224,224,224,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "origin0-50"
                                },
                                {
                                    id: 'e19_link',
                                    type: 'rect',
                                    rect: ['280px', '248px', '83px', '4px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "origin0-50"
                                },
                                {
                                    id: 'e20_link',
                                    type: 'rect',
                                    rect: ['375px', '248px', '83px', '4px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "origin0-50"
                                },
                                {
                                    id: 'e18_dot-1',
                                    type: 'ellipse',
                                    rect: ['267px', '243px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [2,"rgba(5,5,5,1.00)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e18_dot-2',
                                    type: 'ellipse',
                                    rect: ['362px', '243px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgba(5,5,5,1.00)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e18_dot-3',
                                    type: 'ellipse',
                                    rect: ['457px', '243px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgba(5,5,5,1.00)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e18_textsWrap',
                                    type: 'rect',
                                    rect: ['267px', '257px', '533px', '181px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e18_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexXStart",
                                        c: [
                                        {
                                            id: 'e18_txt-1',
                                            type: 'text',
                                            rect: ['0px', '52px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Vos <span style=\"font-family: poppins-bold;\">bras sont près de votre corps</span></p><p style=\"margin: 0px;\">​et vos <span style=\"font-family: poppins-bold;\">pieds sont bien à plats</span>, vous pouvez</p><p style=\"margin: 0px;\">​effectuer l'action de levage de la charge...</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'e19_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexXStart",
                                        c: [
                                        {
                                            id: 'e19_txt-1',
                                            type: 'text',
                                            rect: ['0px', '52px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">En vous servant de la <span style=\"font-family: poppins-bold;\">force</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​de vos jambes</span>, votre dos</p><p style=\"margin: 0px;\">​n'est pas mis à contribution.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e20_popup',
                                    type: 'rect',
                                    rect: ['297px', '420px', '466px', '144px', 'auto', 'auto'],
                                    borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                    fill: ["rgba(228,228,228,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "origin0-50",
                                    c: [
                                    {
                                        id: 'e20_popupContent',
                                        type: 'rect',
                                        rect: ['66px', '0px', '400px', '144px', 'auto', 'auto'],
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexXStart",
                                        c: [
                                        {
                                            id: 'e20_txt-popup',
                                            type: 'text',
                                            rect: ['22px', '28px', 'auto', 'auto', 'auto', 'auto'],
                                            opacity: '0.7',
                                            text: "<p style=\"margin: 0px;\">​Conseil : soufflez en soulevant</p><p style=\"margin: 0px;\">​la charge <span style=\"font-family: poppins-light;\">vous permet d'</span>éviter</p><p style=\"margin: 0px;\">​le blocage respiratoire.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e18_button',
                                    type: 'rect',
                                    rect: ['267px', '437px', '94px', '50px', 'auto', 'auto'],
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
                                },
                                {
                                    id: 'e20_button',
                                    type: 'ellipse',
                                    rect: ['267px', '461px', '61px', '61px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "toClick",
                                    c: [
                                    {
                                        id: 'e20_buttonContent',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '61px', '61px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter normalEl",
                                        c: [
                                        {
                                            id: 'Text3',
                                            type: 'text',
                                            rect: ['15', '30', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​?</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-regular', [37, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    },
                                    {
                                        id: 'e20_buttonClickedEl',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '61px', '61px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter clickedEl",
                                        c: [
                                        {
                                            id: 'cross-white2',
                                            type: 'image',
                                            rect: ['24', '13', '14px', '15px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"cross-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-7',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(250,250,250,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e21_background',
                                    type: 'image',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e21_background.jpg",'0px','0px']
                                },
                                {
                                    id: 'e21_textsWrap',
                                    type: 'rect',
                                    rect: ['400px', '53px', '800px', '88px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e21_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e21_txt-1',
                                            type: 'text',
                                            rect: ['321', '37', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Étapes d'un port de charge <span style=\"font-family: poppins-light;\">bien effectué :</span></p>",
                                            userClass: "static",
                                            font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "25px", "", ""]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e22_txt-1',
                                    type: 'text',
                                    rect: ['974px', '251', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-light;\">Je </span>regarde devant moi</p>",
                                    align: "left",
                                    font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "", "", "none"]
                                },
                                {
                                    id: 'e22_line',
                                    type: 'rect',
                                    rect: ['883px', '200px', '64px', '0px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [1,"rgb(255, 255, 255)","dashed"],
                                    userClass: "boxSizingInitial origin0-50"
                                },
                                {
                                    id: 'e22_triangle',
                                    type: 'image',
                                    rect: ['951px', '198px', '10px', '6px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"triangle-white.svg",'0px','0px']
                                },
                                {
                                    id: 'e23_txt-1',
                                    type: 'text',
                                    rect: ['344px', '211px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-light;\">Je garde le </span>dos bien droit</p>",
                                    align: "left",
                                    font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "", "", "none"]
                                },
                                {
                                    id: 'e23_txt-2',
                                    type: 'text',
                                    rect: ['347px', '241px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-light;\">les </span>pressions <span style=\"font-family: poppins-light;\">sont ainsi</span></p><p style=\"margin: 0px;\">​uniformément réparties.</p>",
                                    align: "right",
                                    font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "25px", "", "none"]
                                },
                                {
                                    id: 'e23_line',
                                    type: 'rect',
                                    rect: ['622px', '317px', '198px', '0px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [1,"rgb(255, 255, 255)","dashed"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e23_dot-1',
                                    type: 'ellipse',
                                    rect: ['787px', '237px', '6px', '6px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(255, 255, 255)","none"]
                                },
                                {
                                    id: 'e23_dot-2',
                                    type: 'ellipse',
                                    rect: ['649px', '394px', '6px', '6px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(255, 255, 255)","none"]
                                },
                                {
                                    id: 'e24_txt-1',
                                    type: 'text',
                                    rect: ['925px', '371px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-light;\">Je garde les</span> bras</p><p style=\"margin: 0px;\">​près du corps</p>",
                                    align: "left",
                                    font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "25px", "", "none"]
                                },
                                {
                                    id: 'e25_txt-1',
                                    type: 'text',
                                    rect: ['425px', '551px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-light;\">Je</span> plie les jambes​</p>",
                                    align: "left",
                                    font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "25px", "", "none"]
                                },
                                {
                                    id: 'e26_txt-1',
                                    type: 'text',
                                    rect: ['1000px', '551px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-light;\">J'</span>aligne<span style=\"font-family: poppins-light;\"> les </span>centres</p><p style=\"margin: 0px;\">​de gravité</p>",
                                    align: "left",
                                    font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "25px", "", "none"]
                                },
                                {
                                    id: 'e21_button',
                                    type: 'ellipse',
                                    rect: ['896px', '231px', '57px', '57px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                    userClass: "btNext btWhite",
                                    c: [
                                    {
                                        id: 'e21_buttonContent',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e21_button-txt',
                                            type: 'text',
                                            rect: ['33', '19', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​1</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [30, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e22_button',
                                    type: 'ellipse',
                                    rect: ['621px', '218px', '57px', '57px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                    userClass: "btNext btWhite inactive",
                                    c: [
                                    {
                                        id: 'e22_buttonContent',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e22_button-txt',
                                            type: 'text',
                                            rect: ['33', '19', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">2</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [30, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e23_button',
                                    type: 'ellipse',
                                    rect: ['846px', '371px', '57px', '57px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                    userClass: "btNext btWhite inactive",
                                    c: [
                                    {
                                        id: 'e23_buttonContent',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e23_button-txt',
                                            type: 'text',
                                            rect: ['33', '19', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">3</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [30, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e24_button',
                                    type: 'ellipse',
                                    rect: ['626px', '537px', '57px', '57px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                    userClass: "btNext btWhite inactive",
                                    c: [
                                    {
                                        id: 'e24_buttonContent',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e24_button-txt',
                                            type: 'text',
                                            rect: ['33', '19', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">4</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [30, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e25_button',
                                    type: 'ellipse',
                                    rect: ['920px', '548px', '57px', '57px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                    userClass: "btNext btWhite inactive",
                                    c: [
                                    {
                                        id: 'e25_buttonContent',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(255,255,255,1.00)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e25_button-txt',
                                            type: 'text',
                                            rect: ['33', '19', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">5</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [30, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-8',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(250,250,250,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e27_shapeGrey-2',
                                    type: 'rect',
                                    rect: ['6px', '0px', '1815px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(228,228,228,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    transform: [[],[],['-33']]
                                },
                                {
                                    id: 'e27_shapeWhite',
                                    type: 'rect',
                                    rect: ['1560px', '0px', '1814px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"]
                                },
                                {
                                    id: 'e29_group-1',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e29_video-container',
                                        type: 'rect',
                                        rect: ['15px', '0px', '1280px', '721px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "video-brightness"
                                    },
                                    {
                                        id: 'e30_picture-blurred',
                                        type: 'image',
                                        rect: ['200px', '0px', '1071px', '772px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e30_picture-blurred.png",'0px','0px']
                                    },
                                    {
                                        id: 'e29_shapeCache',
                                        type: 'rect',
                                        rect: ['-27px', '0px', '234px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(228,228,228,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        transform: [[],[],['-33']]
                                    },
                                    {
                                        id: 'e29_videoGauge',
                                        type: 'rect',
                                        rect: ['1014px', '483px', '232px', '2px', 'auto', 'auto'],
                                        fill: ["rgba(218,218,218,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e29_videoDuration',
                                            type: 'rect',
                                            rect: ['0px', '-1px', '0%', '4px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,1.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"]
                                        }]
                                    },
                                    {
                                        id: 'e29_textsWrap',
                                        type: 'rect',
                                        rect: ['1014px', '251px', '404px', '213px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e29_textsWrapContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flex col",
                                            c: [
                                            {
                                                id: 'e29_txt-1',
                                                type: 'text',
                                                rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Travaillez dans un rythme </p><p style=\"margin: 0px;\">régulier.​</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-bold', [25, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "31px", "", "none"]
                                            },
                                            {
                                                id: 'e29_txt-2',
                                                type: 'text',
                                                rect: ['0px', '80px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Éviter <span style=\"font-family: poppins-regular;\">les </span>mouvements brusques </p><p style=\"margin: 0px;\">et saccadés <span style=\"font-family: poppins-regular;\">afin de ne pas porter </span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-regular;\">des </span>chocs supplémentaires</p><p style=\"margin: 0px;\"> <span style=\"font-family: poppins-regular;\">à votre</span> corps<span style=\"font-family: poppins-regular;\">.​</span></p>",
                                                align: "left",
                                                userClass: "static marginBottom10",
                                                font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e30_bloc',
                                        type: 'rect',
                                        rect: ['409px', '260px', '783px', '209px', 'auto', 'auto'],
                                        borderRadius: ["15px", "15px", "15px", "15px 15px"],
                                        fill: ["rgba(228,228,228,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e30_blocContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'e30_txt-1',
                                                type: 'text',
                                                rect: ['94px', '70', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Même si vous respectez les bonnes pratiques,</p><p style=\"margin: 0px;\">certains imprévus peuvent survenir lors d’un port de charges.</p><p style=\"margin: 0px;\">Voyons comment « <span style=\"font-family: poppins-bold;\">Ne pas retenir une situation qui dégénère</span> ».</p>",
                                                align: "center",
                                                font: ['poppins-light-italic', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e27_group-1',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e27_shapeGrey',
                                        type: 'rect',
                                        rect: ['6px', '0px', '1344px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(23,23,23,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        transform: [[],[],['-33']]
                                    },
                                    {
                                        id: 'e27_patterns',
                                        type: 'image',
                                        rect: ['0px', '377px', '1202px', '414px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e27_patterns.png",'0px','0px']
                                    },
                                    {
                                        id: 'e27_group-man',
                                        type: 'group',
                                        rect: ['159', '119', '695', '613', 'auto', 'auto'],
                                        c: [
                                        {
                                            id: 'e27_man',
                                            type: 'image',
                                            rect: ['0px', '0px', '695px', '613px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e27_man.png",'0px','0px']
                                        },
                                        {
                                            id: 'e27_cube',
                                            type: 'image',
                                            rect: ['125px', '170px', '263px', '247px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e27_cube.png",'0px','0px']
                                        }]
                                    },
                                    {
                                        id: 'e27_line',
                                        type: 'rect',
                                        rect: ['531px', '351px', '141px', '2px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "origin0-50"
                                    },
                                    {
                                        id: 'e27_textsWrap',
                                        type: 'rect',
                                        rect: ['691px', '312px', '540px', '269px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flex col",
                                        c: [
                                        {
                                            id: 'e27_textsWrapContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            c: [
                                            {
                                                id: 'e27_txt-1',
                                                type: 'text',
                                                rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Faite «&nbsp;corps avec la charge&nbsp;» afin</p><p style=\"margin: 0px;\">que son <span style=\"font-family: poppins-bold;\">centre de gravité</span> se <span style=\"font-family: poppins-bold;\">superpose</span></p><p style=\"margin: 0px;\">au vôtre.</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-regular', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            },
                                            {
                                                id: 'e27_txt-2',
                                                type: 'text',
                                                rect: ['0px', '100px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Plus la charge est éloignée,</p><p style=\"margin: 0px;\">​plus l'effort est conséquent</p><p style=\"margin: 0px;\">​sur votre colonne vertébrale.</p>",
                                                align: "left",
                                                userClass: "static",
                                                font: ['poppins-bold', [25, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "31px", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e27_dot-1',
                                        type: 'ellipse',
                                        rect: ['517px', '347px', '10px', '10px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    }]
                                },
                                {
                                    id: 'e28_group-1',
                                    type: 'rect',
                                    rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e28_man',
                                        type: 'image',
                                        rect: ['151px', '117px', '502px', '615px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e28_man.png",'0px','0px']
                                    },
                                    {
                                        id: 'e28_textsWrap',
                                        type: 'rect',
                                        rect: ['767px', '182px', '528px', '411px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e28_textsWrapContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flex col",
                                            c: [
                                            {
                                                id: 'e28_txt-1',
                                                type: 'text',
                                                rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Lorsque vous le pouvez, positionnez </p><p style=\"margin: 0px;\">vos mains de façon asymétrique.</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-bold', [25, "px"], "rgba(181,140,106,1)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "31px", "", "none"]
                                            },
                                            {
                                                id: 'e28_txt-2',
                                                type: 'text',
                                                rect: ['0px', '110px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Votre <span style=\"font-family: poppins-bold;\">main située au sommet</span></p><p style=\"margin: 0px;\">contribue à la <span style=\"font-family: poppins-bold;\">stabilité horizontale</span>,</p><p style=\"margin: 0px;\">et vous permet de donner la direction</p><p style=\"margin: 0px;\">souhaitée à la charge.​</p>",
                                                align: "left",
                                                userClass: "static marginBottom10",
                                                font: ['poppins-regular', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            },
                                            {
                                                id: 'e28_txt-3',
                                                type: 'text',
                                                rect: ['0px', '220px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Votre <span style=\"font-family: poppins-bold;\">main située en bas</span></p><p style=\"margin: 0px;\">contribue à la <span style=\"font-family: poppins-bold;\">stabilité verticale</span>.​</p>",
                                                align: "left",
                                                userClass: "static marginBottom10",
                                                font: ['poppins-regular', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            },
                                            {
                                                id: 'e28_txt-4',
                                                type: 'text',
                                                rect: ['0px', '300px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Cette prise vous permettra de faire pivoter</p><p style=\"margin: 0px;\">facilement la charge lors du déplacement</p><p style=\"margin: 0px;\">ou du dépôt de celle-ci.​</p>",
                                                align: "left",
                                                userClass: "static",
                                                font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e28_popup',
                                        type: 'rect',
                                        rect: ['643px', '266px', '607px', '379px', 'auto', 'auto'],
                                        overflow: 'hidden',
                                        borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                        fill: ["rgba(255,255,255,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "origin0-50",
                                        c: [
                                        {
                                            id: 'e28_popup-img',
                                            type: 'image',
                                            rect: ['-619px', '-19px', '1003px', '544px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"e28_popup-img.png",'0px','0px']
                                        },
                                        {
                                            id: 'e28_popupContent',
                                            type: 'rect',
                                            rect: ['87px', '46px', '472px', '210px', 'auto', 'auto'],
                                            borderRadius: ["0px", "0px", "0px", "0px 0px"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flex col",
                                            c: [
                                            {
                                                id: 'e28_txt-popup-1',
                                                type: 'text',
                                                rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                opacity: '0.7',
                                                text: "<p style=\"margin: 0px;\">Conseils : utilisez la paume de vos mains</p><p style=\"margin: 0px;\">et la base des doigts.​</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            },
                                            {
                                                id: 'e28_txt-popup-2',
                                                type: 'text',
                                                rect: ['0px', '60px', 'auto', 'auto', 'auto', 'auto'],
                                                opacity: '0.7',
                                                text: "<p style=\"margin: 0px;\">Plus la surface de prise est large,</p><p style=\"margin: 0px;\">plus votre sécurité est garantie.​</p>",
                                                align: "left",
                                                userClass: "static",
                                                font: ['poppins-regular', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e28_button',
                                        type: 'ellipse',
                                        rect: ['611px', '297px', '61px', '61px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,1)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "toClick",
                                        c: [
                                        {
                                            id: 'e20_buttonContentCopy',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '61px', '61px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter normalEl",
                                            c: [
                                            {
                                                id: 'Text3Copy',
                                                type: 'text',
                                                rect: ['15', '30', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​?</p>",
                                                align: "left",
                                                userClass: "static",
                                                font: ['poppins-regular', [37, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "", "", "none"]
                                            }]
                                        },
                                        {
                                            id: 'e20_buttonClickedElCopy',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '61px', '61px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter clickedEl",
                                            c: [
                                            {
                                                id: 'cross-white2Copy',
                                                type: 'image',
                                                rect: ['24', '13', '14px', '15px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"cross-white.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e27_sliderGauge',
                                    type: 'rect',
                                    rect: ['1045px', '640px', '111px', '50px', 'auto', 'auto'],
                                    fill: ["rgba(181,140,106,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e27_sliderGaugeContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter cMarginRight15",
                                        c: [
                                        {
                                            id: 'e27_sliderCurrent-1',
                                            type: 'ellipse',
                                            rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                            userClass: "boxSizingInitial static"
                                        },
                                        {
                                            id: 'e27_sliderCurrent-2',
                                            type: 'ellipse',
                                            rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                            userClass: "boxSizingInitial static"
                                        },
                                        {
                                            id: 'e27_sliderCurrent-3',
                                            type: 'ellipse',
                                            rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(255,255,255,1.00)","solid"],
                                            userClass: "boxSizingInitial static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'e27_btSliderPrev',
                                    type: 'rect',
                                    rect: ['1015px', '640px', '30px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btSlider3 btPrev",
                                    c: [
                                    {
                                        id: 'e27_btSliderPrevContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy12',
                                            type: 'image',
                                            rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static",
                                            transform: [[],[],[],['-1']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e27_btSliderNext',
                                    type: 'rect',
                                    rect: ['1156px', '640px', '94px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btSlider3 btNext",
                                    c: [
                                    {
                                        id: 'e27_btSliderNextContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy9',
                                            type: 'image',
                                            rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-9',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(255,255,255,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e32_video-container',
                                    type: 'rect',
                                    rect: ['822px', '-2px', '1200px', '675px', 'auto', 'auto'],
                                    fill: ["rgba(250,250,250,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "video-brightness"
                                },
                                {
                                    id: 'e32_groupLeft',
                                    type: 'rect',
                                    rect: ['0px', '0px', '688px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e32_videoGauge',
                                        type: 'rect',
                                        rect: ['133px', '593px', '231px', '2px', 'auto', 'auto'],
                                        fill: ["rgba(218,218,218,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e32_videoDuration',
                                            type: 'rect',
                                            rect: ['0px', '-1px', '0%', '4px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,1.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"]
                                        }]
                                    },
                                    {
                                        id: 'e32_textsWrap',
                                        type: 'rect',
                                        rect: ['133px', '134px', '588px', '425px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'e32_textsWrapContent',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flex col",
                                            c: [
                                            {
                                                id: 'e32_txt-1',
                                                type: 'text',
                                                rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Ne pas retenir</p><p style=\"margin: 0px;\">​une situation qui dégénère.</p>",
                                                align: "left",
                                                userClass: "static marginBottom30",
                                                font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "31px", "", "none"]
                                            },
                                            {
                                                id: 'e32_txt-2',
                                                type: 'text',
                                                rect: ['0px', '90px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Les <span style=\"font-family: poppins-bold;\">accidents</span> proviennent le plus souvent </p><p style=\"margin: 0px;\">d’une <span style=\"font-family: poppins-bold;\">mauvaise anticipation</span>.​</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            },
                                            {
                                                id: 'e32_txt-3',
                                                type: 'text',
                                                rect: ['0px', '180px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Veillez à toujours avoir de l’espace </p><p style=\"margin: 0px;\">afin de pouvoir vous dégager </p><p style=\"margin: 0px;\">de l’objet qui chute.​</p>",
                                                align: "left",
                                                userClass: "static marginBottom20",
                                                font: ['poppins-bold', [25, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "31px", "", "none"]
                                            },
                                            {
                                                id: 'e32_txt-4',
                                                type: 'text',
                                                rect: ['0px', '290px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Si vous n’avez pas bien évaluer l’action</p><p style=\"margin: 0px;\">à réaliser et que la situation dégénère,</p><p style=\"margin: 0px;\">pensez en premier lieu à vous préserver.​</p>",
                                                align: "left",
                                                userClass: "static",
                                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                                textStyle: ["", "", "25px", "", "none"]
                                            }]
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-menu',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(192,192,192,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e1_group-1',
                                    type: 'rect',
                                    rect: ['0px', '0px', '400px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "inner-menu-group",
                                    c: [
                                    {
                                        id: 'e1_picture-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '400px', '731px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-1.png",'0px','0px'],
                                        userClass: "picture-seen"
                                    },
                                    {
                                        id: 'e1_bloc-1',
                                        type: 'rect',
                                        rect: ['0px', '543px', '100%', '248px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'Rectangle2',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,0.95)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "bg"
                                        },
                                        {
                                            id: 'e1_bloc-txt-1',
                                            type: 'rect',
                                            rect: ['0px', '25px', '100%', '163px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'Text',
                                                type: 'text',
                                                rect: ['167', '78px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">​Échauffer</p><p style=\"margin: 0px;\">​vos muscles</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-bold', [25, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e1_button-1',
                                        type: 'rect',
                                        rect: ['153px', '518px', '94px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "button btLoadScreen btLoadScreen-2",
                                        c: [
                                        {
                                            id: 'e1_button-content-1',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'arrow-white',
                                                type: 'image',
                                                rect: ['28', '18', '14px', '22px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_group-2',
                                    type: 'rect',
                                    rect: ['400px', '0px', '400px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "inner-menu-group",
                                    c: [
                                    {
                                        id: 'e1_picture-2-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '400px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-2-2.png",'0px','0px'],
                                        userClass: "picture-seen"
                                    },
                                    {
                                        id: 'e1_picture-2-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '400px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-2-1.png",'0px','0px'],
                                        userClass: "picture-unseen"
                                    },
                                    {
                                        id: 'e1_bloc-2',
                                        type: 'rect',
                                        rect: ['0px', '543px', '100%', '248px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'Rectangle2Copy2',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,0.95)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "bg"
                                        },
                                        {
                                            id: 'e1_bloc-txt-2',
                                            type: 'rect',
                                            rect: ['0px', '25px', '100%', '163px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter col",
                                            c: [
                                            {
                                                id: 'TextCopy',
                                                type: 'text',
                                                rect: ['167', '78px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Analyser la situation</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-bold', [25, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                            },
                                            {
                                                id: 'TextCopy4',
                                                type: 'text',
                                                rect: ['77px', '118px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">pour avoir une <span style=\"font-family: poppins-bold;\">vision globale</span></p><p style=\"margin: 0px;\">​et <span style=\"font-family: poppins-bold;\">planifier le port de charge</span>.</p>",
                                                align: "center",
                                                userClass: "static marginTop5 currentEl",
                                                font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e1_button-2',
                                        type: 'rect',
                                        rect: ['153px', '518px', '94px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "button btLoadScreen btLoadScreen-5",
                                        c: [
                                        {
                                            id: 'e1_button-content-2',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'arrow-whiteCopy',
                                                type: 'image',
                                                rect: ['28', '18', '14px', '22px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_group-3',
                                    type: 'rect',
                                    rect: ['800px', '0px', '400px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "inner-menu-group",
                                    c: [
                                    {
                                        id: 'e1_picture-3-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '400px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-3-2.png",'0px','0px'],
                                        userClass: "picture-seen"
                                    },
                                    {
                                        id: 'e1_picture-3-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '400px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-3-1.png",'0px','0px'],
                                        userClass: "picture-unseen"
                                    },
                                    {
                                        id: 'e1_bloc-3',
                                        type: 'rect',
                                        rect: ['0px', '543px', '100%', '248px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'Rectangle2Copy3',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,0.95)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "bg"
                                        },
                                        {
                                            id: 'e1_bloc-txt-3',
                                            type: 'rect',
                                            rect: ['0px', '25px', '100%', '163px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'TextCopy2',
                                                type: 'text',
                                                rect: ['167px', '78px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Appliquer les règles</p><p style=\"margin: 0px;\">​de manutention</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-bold', [25, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e1_button-3',
                                        type: 'rect',
                                        rect: ['153px', '518px', '94px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "button btLoadScreen btLoadScreen-13",
                                        c: [
                                        {
                                            id: 'e1_button-content-3',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'arrow-whiteCopy2',
                                                type: 'image',
                                                rect: ['28px', '18px', '14px', '22px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_group-4',
                                    type: 'rect',
                                    rect: ['1200px', '0px', '400px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "inner-menu-group",
                                    c: [
                                    {
                                        id: 'e1_picture-4-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '400px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-4-2.png",'0px','0px'],
                                        userClass: "picture-seen"
                                    },
                                    {
                                        id: 'e1_picture-4-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '400px', '791px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-4-1.png",'0px','0px'],
                                        userClass: "picture-unseen"
                                    },
                                    {
                                        id: 'e1_bloc-4',
                                        type: 'rect',
                                        rect: ['0px', '543px', '100%', '248px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        c: [
                                        {
                                            id: 'Rectangle2Copy4',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,0.95)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "bg"
                                        },
                                        {
                                            id: 'e1_bloc-txt-4',
                                            type: 'rect',
                                            rect: ['0px', '25px', '100%', '163px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'TextCopy3',
                                                type: 'text',
                                                rect: ['47px', '78px', 'auto', 'auto', 'auto', 'auto'],
                                                text: "<p style=\"margin: 0px;\">Ne pas retenir</p><p style=\"margin: 0px;\">​une situation qui dégénère</p>",
                                                align: "center",
                                                userClass: "static",
                                                font: ['poppins-bold', [25, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                            }]
                                        }]
                                    },
                                    {
                                        id: 'e1_button-4',
                                        type: 'rect',
                                        rect: ['153px', '518px', '94px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "button btLoadScreen btLoadScreen-32",
                                        c: [
                                        {
                                            id: 'e1_button-content-4',
                                            type: 'rect',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgb(0, 0, 0)","none"],
                                            userClass: "flexCenter",
                                            c: [
                                            {
                                                id: 'arrow-whiteCopy3',
                                                type: 'image',
                                                rect: ['28px', '18px', '14px', '22px', 'auto', 'auto'],
                                                fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                                userClass: "static"
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_textsWrap',
                                    type: 'rect',
                                    rect: ['402px', '-2px', '797px', '518px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "noEvent",
                                    c: [
                                    {
                                        id: 'e1_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(192,192,192,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter col",
                                        c: [
                                        {
                                            id: 'e1_txt-1',
                                            type: 'text',
                                            rect: ['102px', '177px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Les 4 règles d'or</p><p style=\"margin: 0px;\">​du port de charge</p>",
                                            align: "center",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-bold', [65, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "79px", "", "none"]
                                        },
                                        {
                                            id: 'e1_txt-2',
                                            type: 'text',
                                            rect: ['382', '237', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Celles-ci doivent être systématiquement respectées.</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
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
                                            rect: ['156px', '80', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Vous avez terminé la partie</p><p style=\"margin: 0px;\">« <span style=\"font-family: poppins-bold;\">Les 4 règles d'or</span>&nbsp;».</p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'end-txt-2',
                                            type: 'text',
                                            rect: ['156px', '170px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Découvrons à présent</p><p style=\"margin: 0px;\">« <span style=\"font-size: 25px; font-family: poppins-bold; color: rgb(181, 140, 106);\">La manutention régulière</span></p><p style=\"margin: 0px;\"><span style=\"font-size: 25px; font-family: poppins-bold; color: rgb(181, 140, 106);\">de charges légères</span>&nbsp;».​</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
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
})("les-4-regles-or");
