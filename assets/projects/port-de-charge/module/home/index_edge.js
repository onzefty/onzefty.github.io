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
                            rect: ['0px', '0px', '1600px', '791px', 'auto', 'auto'],
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
                                id: 'e1_circle',
                                type: 'ellipse',
                                rect: ['389px', '-230px', '257px', '257px', 'auto', 'auto'],
                                borderRadius: ["50%", "50%", "50%", "50%"],
                                fill: ["rgba(181,140,106,1)"],
                                stroke: [0,"rgb(0, 0, 0)","none"]
                            },
                            {
                                id: 'e1_rect',
                                type: 'rect',
                                rect: ['-38px', '663px', '629px', '219px', 'auto', 'auto'],
                                fill: ["rgba(23,23,23,1.00)"],
                                stroke: [0,"rgb(0, 0, 0)","none"]
                            },
                            {
                                id: 'e1_group-1',
                                type: 'group',
                                rect: ['1050', '645', '357', '357', 'auto', 'auto'],
                                c: [
                                {
                                    id: 'Ellipse2',
                                    type: 'ellipse',
                                    rect: ['0px', '0px', '353px', '353px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(23,23,23,0.00)"],
                                    stroke: [2,"rgba(23,23,23,1.00)","dashed"],
                                    userClass: "rotating360",
                                    c: [
                                    {
                                        id: 'Ellipse3',
                                        type: 'ellipse',
                                        rect: ['47px', '44px', '11px', '11px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(23,23,23,1.00)"],
                                        stroke: [2,"rgb(0, 0, 0)","none"]
                                    }]
                                }]
                            },
                            {
                                id: 'e1_triangle',
                                type: 'image',
                                rect: ['1425px', '181px', '177px', '177px', 'auto', 'auto'],
                                fill: ["rgba(0,0,0,0)",im+"e1_triangle.png",'0px','0px']
                            },
                            {
                                id: 'e1_man',
                                type: 'image',
                                rect: ['158px', '36px', '443px', '720px', 'auto', 'auto'],
                                fill: ["rgba(0,0,0,0)",im+"e1_man.png",'0px','0px']
                            },
                            {
                                id: 'e1_txt',
                                type: 'text',
                                rect: ['592px', '517', 'auto', 'auto', 'auto', 'auto'],
                                text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold;\">60 minutes</span> pour connaître et appliquer</p><p style=\"margin: 0px;\">​les <span style=\"font-family: poppins-bold;\">bons gestes lors d'un port de charge</span>.</p>",
                                align: "left",
                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                textStyle: ["", "", "26px", "", "none"]
                            },
                            {
                                id: 'end-txt',
                                type: 'text',
                                rect: ['592px', '517', 'auto', 'auto', 'auto', 'auto'],
                                text: "<p style=\"margin: 0px;\">Vous avez terminé le module « <span style=\"font-family: poppins-bold;\">Port de charges</span> ».</p><p style=\"margin: 0px;\">Vous pouvez librement le <span style=\"font-family: poppins-bold;\">revisionner</span> ou <span style=\"font-family: poppins-bold;\">quitter la formation</span>.​</p>",
                                align: "left",
                                font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                textStyle: ["", "", "26px", "", "none"]
                            },
                            {
                                id: 'e1_title',
                                type: 'text',
                                rect: ['592px', '258px', 'auto', 'auto', 'auto', 'auto'],
                                text: "<p style=\"margin: 0px;\">​Port</p><p style=\"margin: 0px;\">​de charge</p>",
                                align: "left",
                                font: ['poppins-bold', [130, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                textStyle: ["", "", "115px", "", "none"]
                            },
                            {
                                id: 'e1_logo',
                                type: 'image',
                                rect: ['592px', '165px', '142px', '57px', 'auto', 'auto'],
                                fill: ["rgba(0,0,0,0)",im+"logo.png",'0px','0px']
                            },
                            {
                                id: 'e1_button',
                                type: 'rect',
                                rect: ['592px', '613px', '210px', '50px', 'auto', 'auto'],
                                cursor: 'pointer',
                                fill: ["rgba(181,140,106,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "pulseBrown btLaunch",
                                c: [
                                {
                                    id: 'e1_buttonContent',
                                    type: 'rect',
                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,0.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "flexCenter",
                                    c: [
                                    {
                                        id: 'e1_button-txt',
                                        type: 'text',
                                        rect: ['65', '19', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">​Commencer</p>",
                                        userClass: "static",
                                        font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                    },
                                    {
                                        id: 'arrow-white',
                                        type: 'image',
                                        rect: ['189px', '17px', '12px', '19px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                        userClass: "marginLeft10 static"
                                    }]
                                }]
                            },
                            {
                                id: 'buttonQuit',
                                type: 'rect',
                                rect: ['592px', '613px', '210px', '50px', 'auto', 'auto'],
                                cursor: 'pointer',
                                fill: ["rgba(181,140,106,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "pulseBrown btQuit",
                                c: [
                                {
                                    id: 'e1_buttonQuitContent',
                                    type: 'rect',
                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,0.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "flexCenter",
                                    c: [
                                    {
                                        id: 'buttonQuit-txt',
                                        type: 'text',
                                        rect: ['65', '19', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">Quitter</p>",
                                        userClass: "static",
                                        font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                    },
                                    {
                                        id: 'quit',
                                        type: 'image',
                                        rect: ['151', '21', '20px', '20px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"quit.svg",'0px','0px'],
                                        userClass: "marginLeft20 static"
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
})("accueil");
