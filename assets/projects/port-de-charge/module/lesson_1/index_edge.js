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
                            overflow: 'hidden',
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
                                    id: 'e1_group-2',
                                    type: 'group',
                                    rect: ['384', '0', '832', '231', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e1_picture-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '832px', '231px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-2.jpg",'0px','0px']
                                    },
                                    {
                                        id: 'e1_red-zone-3',
                                        type: 'image',
                                        rect: ['127px', '39px', '166px', '89px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_red-zone-3.png",'0px','0px'],
                                        userClass: "fading"
                                    },
                                    {
                                        id: 'e1_dot-3',
                                        type: 'ellipse',
                                        rect: ['197px', '39px', '10px', '10px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(234,31,41,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "wave-container",
                                        c: [
                                        {
                                            id: 'e1_dot-1Copy10',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy9',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy8',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e2_group-2',
                                    type: 'group',
                                    rect: ['384px', '0px', '832', '231', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e2_picture-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '832px', '231px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e2_picture-2.jpg",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e1_group-6',
                                    type: 'group',
                                    rect: ['700', '500', '528', '352', 'auto', 'auto'],
                                    overflow: 'hidden',
                                    c: [
                                    {
                                        id: 'e1_picture-6',
                                        type: 'image',
                                        rect: ['0px', '0px', '528px', '352px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-6.jpg",'0px','0px']
                                    },
                                    {
                                        id: 'e1_red-zone-2',
                                        type: 'image',
                                        rect: ['278px', '-69px', '260px', '254px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_red-zone-2.png",'0px','0px'],
                                        userClass: "fading"
                                    },
                                    {
                                        id: 'e1_dot-2',
                                        type: 'ellipse',
                                        rect: ['403px', '46px', '10px', '10px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(234,31,41,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "wave-container",
                                        c: [
                                        {
                                            id: 'e1_dot-1Copy7',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy6',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy5',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_group-3',
                                    type: 'group',
                                    rect: ['384', '500', '416', '231', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e1_picture-3',
                                        type: 'image',
                                        rect: ['0px', '0px', '416px', '231px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-3.jpg",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e1_group-4',
                                    type: 'group',
                                    rect: ['1216', '0', '384', '500', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e1_picture-4',
                                        type: 'image',
                                        rect: ['0px', '0px', '384px', '500px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-4.jpg",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e1_group-5',
                                    type: 'group',
                                    rect: ['0', '231', '384', '500', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e1_picture-5',
                                        type: 'image',
                                        rect: ['0px', '0px', '384px', '500px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-5.jpg",'0px','0px']
                                    },
                                    {
                                        id: 'e1_red-zone-1',
                                        type: 'image',
                                        rect: ['145px', '22px', '238px', '241px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_red-zone-1.png",'0px','0px'],
                                        userClass: "fading"
                                    },
                                    {
                                        id: 'e1_dot-1',
                                        type: 'ellipse',
                                        rect: ['259px', '132px', '10px', '10px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(234,31,41,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "wave-container",
                                        c: [
                                        {
                                            id: 'e1_dot-1Copy',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy2',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy3',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e2_group-3',
                                    type: 'group',
                                    rect: ['384px', '500px', '832', '231', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e2_picture-3',
                                        type: 'image',
                                        rect: ['0px', '0px', '832px', '231px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e2_picture-3.jpg",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e2_group-1',
                                    type: 'group',
                                    rect: ['0px', '221px', '384', '500', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e2_picture-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '384px', '500px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e2_picture-1.jpg",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e1_group-1',
                                    type: 'group',
                                    rect: ['0', '0', '384', '231', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e1_picture-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '384px', '231px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-1.jpg",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e1_group-7',
                                    type: 'group',
                                    rect: ['1216', '500', '384', '231', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e1_picture-7',
                                        type: 'image',
                                        rect: ['0px', '0px', '384px', '231px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_picture-7.jpg",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e1_textsWrap',
                                    type: 'rect',
                                    rect: ['384px', '231px', '832px', '269px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e1_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '832px', '269px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e1_txt-1',
                                            type: 'text',
                                            rect: ['197px', '64px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Quotidiennement, vous pouvez être <span style=\"font-family: poppins-bold;\">exposé</span></p><p style=\"margin: 0px;\">à des <span style=\"font-family: poppins-bold;\">dangers multiples et variés</span>.</p><p style=\"margin: 0px;\">​</p><p style=\"margin: 0px;\">Il est <span style=\"font-family: poppins-bold;\">important</span> que vous appreniez</p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">à les connaître et à vous en prémunir</span>.</p>",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(0,0,0,1)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", ""]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e2_textsWrap',
                                    type: 'rect',
                                    rect: ['384px', '231px', '832px', '269px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e2_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '832px', '269px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e2_txt-1',
                                            type: 'text',
                                            rect: ['197px', '64px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Nous vous invitons donc à <span style=\"font-family: poppins-bold;\">suivre nos recommandations</span></p><p style=\"margin: 0px;\">​face aux <span style=\"font-family: poppins-bold;\">risques liés aux ports de charges</span>.</p>",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(0,0,0,1)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", ""]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_button',
                                    type: 'rect',
                                    rect: ['1122px', '450px', '94px', '50px', 'auto', 'auto'],
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
                                            id: 'arrow-white',
                                            type: 'image',
                                            rect: ['42', '10', '12px', '19px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-2',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(192,192,192,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e3_picture',
                                    type: 'image',
                                    rect: ['0px', '0px', '1003px', '791px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e3_picture.png",'0px','0px']
                                },
                                {
                                    id: 'e3_txt-1',
                                    type: 'text',
                                    rect: ['974px', '351px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​D'après vous, quel est le <span style=\"font-family: poppins-bold;\">pourcentage de salarié</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​impactés</span> par le <span style=\"font-family: poppins-bold;\">mal de dos</span> durant leur carrière ?</p>",
                                    align: "left",
                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "28px", "", "none"]
                                },
                                {
                                    id: 'e3_group',
                                    type: 'rect',
                                    rect: ['558px', '226px', '303px', '303px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [2,"rgb(255, 255, 255)","none"],
                                    c: [
                                    {
                                        id: 'e3_shape',
                                        type: 'image',
                                        rect: ['56px', '-52px', '259px', '393px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e3_shape.png",'0px','0px']
                                    },
                                    {
                                        id: 'Ellipse2',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '299px', '299px', 'auto', 'auto'],
                                        clip: 'rect(0px 303px 303px 165.61459350585938px)',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [2,"rgb(0, 0, 0)","dashed"],
                                        userClass: "boxSizingInitial",
                                        transform: [[],['-34']]
                                    },
                                    {
                                        id: 'Ellipse2Copy',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '299px', '299px', 'auto', 'auto'],
                                        clip: 'rect(0px 166.62384033203125px 303px 0px)',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [2,"rgba(255,255,255,1.00)","dashed"],
                                        userClass: "boxSizingInitial",
                                        transform: [[],['-34']]
                                    },
                                    {
                                        id: 'e3_svg-container',
                                        type: 'rect',
                                        rect: ['-13px', '-11px', '326px', '326px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"]
                                    },
                                    {
                                        id: 'e3_circle',
                                        type: 'ellipse',
                                        rect: ['43px', '44px', '215px', '215px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,1.00)"],
                                        stroke: [0,"rgba(0,0,0,1)","none"],
                                        c: [
                                        {
                                            id: 'e3_circleContent',
                                            type: 'ellipse',
                                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(255,255,255,0.00)"],
                                            stroke: [0,"rgba(0,0,0,1)","none"],
                                            c: [
                                            {
                                                id: 'Rectangle',
                                                type: 'rect',
                                                rect: ['0px', '77px', '100%', '58px', 'auto', 'auto'],
                                                fill: ["rgba(255,255,255,0)"],
                                                stroke: [0,"rgb(0, 0, 0)","none"],
                                                userClass: "heightAuto flexXEnd",
                                                c: [
                                                {
                                                    id: 'e3_txt-progress',
                                                    type: 'text',
                                                    rect: ['95', '19px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">​0</p>",
                                                    userClass: "static",
                                                    font: ['poppins-regular', [64, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                                },
                                                {
                                                    id: 'e3_txt-percent',
                                                    type: 'text',
                                                    rect: ['95', '19px', 'auto', 'auto', 'auto', 'auto'],
                                                    text: "<p style=\"margin: 0px;\">​%</p>",
                                                    userClass: "static marginLeft30 marginRight10",
                                                    font: ['poppins-thin', [64, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                                }]
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e3_btCursor',
                                    type: 'ellipse',
                                    rect: ['689px', '207px', '37px', '37px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [2,"rgb(255, 255, 255)","solid"],
                                    userClass: "btRotateCursor boxSizingInitial",
                                    c: [
                                    {
                                        id: 'e3_btCursorContent',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(255, 255, 255)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-white2',
                                            type: 'image',
                                            rect: ['13px', '10px', '10px', '16px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'e3_helper',
                                    type: 'image',
                                    rect: ['714px', '235px', '38px', '37px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e3_helper.png",'0px','0px'],
                                    userClass: "noEvent"
                                },
                                {
                                    id: 'e3_btValidate',
                                    type: 'rect',
                                    rect: ['974px', '464px', '170px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btValidate",
                                    c: [
                                    {
                                        id: 'e3_btValidateContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '170px', '50px', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e3_txt-validate',
                                            type: 'text',
                                            rect: ['45px', '8px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​valider</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "uppercase"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e3_feedbackWrap',
                                    type: 'rect',
                                    rect: ['974px', '167px', '566px', '421px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "",
                                    c: [
                                    {
                                        id: 'e3_feedbackWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexXStartCol col",
                                        c: [
                                        {
                                            id: 'e3_txt-right',
                                            type: 'text',
                                            rect: ['0px', '120px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Presque !</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [30, "px"], "rgba(40,135,113,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e3_txt-wrong',
                                            type: 'text',
                                            rect: ['0px', '120px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Pas tout à fait !</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [30, "px"], "rgba(234,31,41,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e3_txt-2',
                                            type: 'text',
                                            rect: ['0px', '120px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Plus de</p><p style=\"margin: 0px;\">​2 salariés sur 3</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [45, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e3_txt-3',
                                            type: 'text',
                                            rect: ['0px', '120px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">sont concernés.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e3_txt-percent-correct',
                                    type: 'text',
                                    rect: ['653px', '557px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">70<span style=\"font-family: poppins-thin; color: rgb(255, 255, 255);\">%​</span></p>",
                                    userClass: "",
                                    font: ['poppins-regular', [64, "px"], "rgba(40,135,113,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                }]
                            },
                            {
                                id: 'section-3',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(255,255,255,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e4_background',
                                    type: 'rect',
                                    rect: ['-790px', '0px', '149.4%', '100%', 'auto', 'auto'],
                                    fill: ["rgba(23,23,23,1)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"]
                                },
                                {
                                    id: 'e4_group-2',
                                    type: 'group',
                                    rect: ['-562', '443', '1215', '499', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e4_patterns-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '1215px', '499px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e4_patterns.png",'0px','0px'],
                                        userClass: "floatingXY"
                                    }]
                                },
                                {
                                    id: 'e4_group-1',
                                    type: 'group',
                                    rect: ['244', '59', '1215', '499', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e4_patterns-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '1215px', '499px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e4_patterns.png",'0px','0px'],
                                        userClass: "floatingXY"
                                    }]
                                },
                                {
                                    id: 'e4_columns-shadow',
                                    type: 'image',
                                    rect: ['417px', '539px', '820px', '151px', 'auto', 'auto'],
                                    opacity: '0.2',
                                    fill: ["rgba(0,0,0,0)",im+"e4_columns-shadow.svg",'0px','0px']
                                },
                                {
                                    id: 'e4_group-3',
                                    type: 'group',
                                    rect: ['501', '331', '239', '260', 'auto', 'auto'],
                                    userClass: "origin50-100",
                                    c: [
                                    {
                                        id: 'e4_column-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '239px', '260px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e4_column-1.png",'0px','0px'],
                                        userClass: ""
                                    },
                                    {
                                        id: 'Rectangle6',
                                        type: 'rect',
                                        rect: ['0px', '72px', '100%', '57px', 'auto', 'auto'],
                                        fill: ["rgba(23,23,23,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e4_txt-num-1',
                                            type: 'text',
                                            rect: ['118', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​1</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [40, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e4_group-4',
                                    type: 'group',
                                    rect: ['789', '428', '312', '178', 'auto', 'auto'],
                                    userClass: "origin50-100",
                                    c: [
                                    {
                                        id: 'e4_column-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '312px', '178px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e4_column-2.png",'0px','0px'],
                                        userClass: ""
                                    },
                                    {
                                        id: 'Rectangle6Copy',
                                        type: 'rect',
                                        rect: ['0px', '85px', '100%', '57px', 'auto', 'auto'],
                                        fill: ["rgba(23,23,23,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e4_txt-num-2',
                                            type: 'text',
                                            rect: ['118', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">2</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [40, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e4_group-5',
                                    type: 'group',
                                    rect: ['536', '555', '389', '105', 'auto', 'auto'],
                                    userClass: "origin50-100",
                                    c: [
                                    {
                                        id: 'e4_column-3',
                                        type: 'image',
                                        rect: ['0px', '0px', '389px', '105px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e4_column-3.png",'0px','0px'],
                                        userClass: ""
                                    },
                                    {
                                        id: 'Rectangle6Copy2',
                                        type: 'rect',
                                        rect: ['0px', '58px', '100%', '57px', 'auto', 'auto'],
                                        fill: ["rgba(23,23,23,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e4_txt-num-3',
                                            type: 'text',
                                            rect: ['118', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">3</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [40, "px"], "rgba(255,255,255,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e4_txt-percent-1',
                                    type: 'text',
                                    rect: ['350', '263px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​40<span style=\"font-family: poppins-thin;\">%</span></p>",
                                    font: ['poppins-bold', [50, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                },
                                {
                                    id: 'e4_txt-percent-2',
                                    type: 'text',
                                    rect: ['680px', '365px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​23<span style=\"font-family: poppins-thin;\">%</span></p>",
                                    font: ['poppins-bold', [50, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                },
                                {
                                    id: 'e4_txt-percent-3',
                                    type: 'text',
                                    rect: ['469px', '495px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​11<span style=\"font-family: poppins-thin;\">%</span></p>",
                                    font: ['poppins-bold', [50, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                },
                                {
                                    id: 'e4_linked-dashed',
                                    type: 'rect',
                                    rect: ['270px', '286px', '60px', '0px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0.00)"],
                                    stroke: [2,"rgba(255,255,255,1.00)","dashed"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e4_feedbacks',
                                    type: 'rect',
                                    rect: ['-83px', '229px', '359px', '220px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0)"],
                                    stroke: [0,"rgb(255, 255, 255)","none"],
                                    c: [
                                    {
                                        id: 'e4_feedbacks-content',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(192,192,192,0)"],
                                        stroke: [0,"rgb(255, 255, 255)","none"],
                                        userClass: "flexYStartCol col",
                                        c: [
                                        {
                                            id: 'e4_feedback-txt-wrong',
                                            type: 'text',
                                            rect: ['142', '44', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Pas tout à fait</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [30, "px"], "rgba(234,31,41,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e4_feedback-txt-correct',
                                            type: 'text',
                                            rect: ['142', '44', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Presque !</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [30, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e4_feedback-txt-right',
                                            type: 'text',
                                            rect: ['142', '44', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Bravo !</p>",
                                            align: "left",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [30, "px"], "rgba(40,135,113,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e4_feedback-txt-1',
                                            type: 'text',
                                            rect: ['142', '44', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Le port et transport</p><p style=\"margin: 0px;\">​de charges</p>",
                                            align: "center",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-bold', [30, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "36px", "", "none"]
                                        },
                                        {
                                            id: 'e4_feedback-txt-2',
                                            type: 'text',
                                            rect: ['142', '44', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">est très largement la <span style=\"font-family: poppins-bold;\">première cause</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​du mal de dos</span> tous secteurs confondus.</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e4_drop-1',
                                    type: 'rect',
                                    rect: ['475px', '246px', '288px', '71px', 'auto', 'auto'],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [2,"rgba(55,55,54,1.00)","dashed"],
                                    userClass: "boxSizingInitial drop",
                                    boxShadow: ["inset", 0, 0, 100, 10, "rgba(0,0,0,0.35)"]
                                },
                                {
                                    id: 'e4_drop-2',
                                    type: 'rect',
                                    rect: ['799px', '343px', '288px', '71px', 'auto', 'auto'],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [2,"rgba(55,55,54,1.00)","dashed"],
                                    userClass: "boxSizingInitial drop",
                                    boxShadow: ["inset", 0, 0, 100, 10, "rgba(0,0,0,0.35)"]
                                },
                                {
                                    id: 'e4_drop-3',
                                    type: 'rect',
                                    rect: ['585px', '470px', '288px', '71px', 'auto', 'auto'],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [2,"rgba(55,55,54,1.00)","dashed"],
                                    userClass: "boxSizingInitial drop",
                                    boxShadow: ["inset", 0, 0, 100, 10, "rgba(0,0,0,0.35)"]
                                },
                                {
                                    id: 'e4_textsWrap',
                                    type: 'rect',
                                    rect: ['350px', '115px', '900px', '90px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "",
                                    c: [
                                    {
                                        id: 'e4_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e4_txt-1',
                                            type: 'text',
                                            rect: ['271', '48', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-medium-italic;\">Placez dans l'ordre</span> les principales sources du mal de dos.</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e4_drag-1',
                                    type: 'rect',
                                    rect: ['0px', '205px', '292px', '75px', 'auto', 'auto'],
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "drag",
                                    c: [
                                    {
                                        id: 'e4_drag-rect-1',
                                        type: 'rect',
                                        rect: ['auto', '0px', '14px', '100%', '0px', 'auto'],
                                        fill: ["rgba(181,140,106,0)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "rect"
                                    },
                                    {
                                        id: 'e4_drag-content-1',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e4_txt-drag-1',
                                            type: 'text',
                                            rect: ['63px', '4px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Chutes de hauteur</p><p style=\"margin: 0px;\">​ou de plain-pied</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", ""]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e4_drag-2',
                                    type: 'rect',
                                    rect: ['0px', '327px', '292px', '75px', 'auto', 'auto'],
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "drag",
                                    c: [
                                    {
                                        id: 'e4_drag-rect-2',
                                        type: 'rect',
                                        rect: ['auto', '0px', '14px', '100%', '0px', 'auto'],
                                        fill: ["rgba(181,140,106,0)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "rect"
                                    },
                                    {
                                        id: 'e4_drag-content-2',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e4_txt-drag-2',
                                            type: 'text',
                                            rect: ['63px', '4px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Port et transport</p><p style=\"margin: 0px;\">​de charges</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", ""]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e4_drag-3',
                                    type: 'rect',
                                    rect: ['0px', '449px', '292px', '75px', 'auto', 'auto'],
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "drag",
                                    c: [
                                    {
                                        id: 'e4_drag-rect-3',
                                        type: 'rect',
                                        rect: ['auto', '0px', '14px', '100%', '0px', 'auto'],
                                        fill: ["rgba(181,140,106,0)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "rect"
                                    },
                                    {
                                        id: 'e4_drag-content-3',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e4_txt-drag-3',
                                            type: 'text',
                                            rect: ['63px', '4px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Manutention manuelle</p><p style=\"margin: 0px;\">​d'objets régulière</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", ""]
                                        }]
                                    }]
                                }]
                            },
                            {
                                id: 'section-4',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(255,255,255,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e5_textsWrap-1',
                                    type: 'rect',
                                    rect: ['350px', '285px', '900px', '90px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "",
                                    c: [
                                    {
                                        id: 'e5_textsWrapContent-1',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e5_txt-1',
                                            type: 'text',
                                            rect: ['271', '48', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Le mal de dos lié au port de charge</p><p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold;\">impacte des secteurs très variés</span>.</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_textsWrap-2',
                                    type: 'rect',
                                    rect: ['350px', '350px', '900px', '90px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "",
                                    c: [
                                    {
                                        id: 'e5_textsWrapContent-2',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e5_txt-2',
                                            type: 'text',
                                            rect: ['271', '48', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold-italic;\">Cliquez sur les photos</span> pour découvrir</p><p style=\"margin: 0px;\">​le pourcentage de mal de dos lié au port de charge</p><p style=\"margin: 0px;\">​dans chacun de ces secteurs.</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_textsWrap-3',
                                    type: 'rect',
                                    rect: ['350px', '498px', '900px', '178px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "",
                                    c: [
                                    {
                                        id: 'e5_textsWrapContent-3',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e5_txt-3',
                                            type: 'text',
                                            rect: ['271', '48', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Nous sommes tous concernés, <span style=\"font-family: poppins-bold;\">restez vigilants !</span></p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_info-1',
                                    type: 'rect',
                                    rect: ['300px', '377px', '1000px', '100px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "info",
                                    c: [
                                    {
                                        id: 'e5_info-content-1',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'Text',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​46<span style=\"font-family: poppins-thin;\">%</span></p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [88, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'Rectangle3',
                                            type: 'rect',
                                            rect: ['558px', '35px', '10px', '70px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,1.00)"],
                                            stroke: [0,"rgb(55, 55, 54)","none"],
                                            userClass: "static marginLeft20 marginRight20"
                                        },
                                        {
                                            id: 'TextCopy',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Aide et soins</p><p style=\"margin: 0px;\">​à la personne</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [38, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_info-2',
                                    type: 'rect',
                                    rect: ['300px', '377px', '1000px', '100px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "info",
                                    c: [
                                    {
                                        id: 'e5_info-content-2',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'TextCopy3',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​42<span style=\"font-family: poppins-thin;\">%</span></p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [88, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'Rectangle3Copy',
                                            type: 'rect',
                                            rect: ['558px', '35px', '10px', '70px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,1.00)"],
                                            stroke: [0,"rgb(55, 55, 54)","none"],
                                            userClass: "static marginLeft20 marginRight20"
                                        },
                                        {
                                            id: 'TextCopy2',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Bâtiment</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [38, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_info-3',
                                    type: 'rect',
                                    rect: ['300px', '377px', '1000px', '100px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "info",
                                    c: [
                                    {
                                        id: 'e5_info-content-3',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'TextCopy5',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​43<span style=\"font-family: poppins-thin;\">%</span></p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [88, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'Rectangle3Copy2',
                                            type: 'rect',
                                            rect: ['558px', '35px', '10px', '70px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,1.00)"],
                                            stroke: [0,"rgb(55, 55, 54)","none"],
                                            userClass: "static marginLeft20 marginRight20"
                                        },
                                        {
                                            id: 'TextCopy4',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Transport</p><p style=\"margin: 0px;\">​&amp; logistique</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [38, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_info-4',
                                    type: 'rect',
                                    rect: ['300px', '377px', '1000px', '100px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "info",
                                    c: [
                                    {
                                        id: 'e5_info-content-4',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'TextCopy7',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​48<span style=\"font-family: poppins-thin;\">%</span></p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [88, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'Rectangle3Copy3',
                                            type: 'rect',
                                            rect: ['558px', '35px', '10px', '70px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,1.00)"],
                                            stroke: [0,"rgb(55, 55, 54)","none"],
                                            userClass: "static marginLeft20 marginRight20"
                                        },
                                        {
                                            id: 'TextCopy6',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Commerce</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [38, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_info-5',
                                    type: 'rect',
                                    rect: ['300px', '377px', '1000px', '100px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(55, 55, 54)","none"],
                                    userClass: "info",
                                    c: [
                                    {
                                        id: 'e5_info-content-5',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(55, 55, 54)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'TextCopy9',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​39<span style=\"font-family: poppins-thin;\">%</span></p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [88, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'Rectangle3Copy4',
                                            type: 'rect',
                                            rect: ['558px', '35px', '10px', '70px', 'auto', 'auto'],
                                            fill: ["rgba(23,23,23,1.00)"],
                                            stroke: [0,"rgb(55, 55, 54)","none"],
                                            userClass: "static marginLeft20 marginRight20"
                                        },
                                        {
                                            id: 'TextCopy8',
                                            type: 'text',
                                            rect: ['359px', '-2px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Gestion</p><p style=\"margin: 0px;\">​des déchets</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [38, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_btInfo-1',
                                    type: 'group',
                                    rect: ['700px', '-3px', '328', '227', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    userClass: "btInfo",
                                    c: [
                                    {
                                        id: 'e5_picture-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '328px', '227px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-1.jpg",'0px','0px']
                                    },
                                    {
                                        id: 'e5_picture-1-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '328px', '227px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-1-2.jpg",'0px','0px'],
                                        userClass: "seenEl"
                                    }]
                                },
                                {
                                    id: 'e5_btInfo-2',
                                    type: 'group',
                                    rect: ['1288px', '185px', '218', '273', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    userClass: "btInfo",
                                    c: [
                                    {
                                        id: 'e5_picture-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '218px', '273px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-2.jpg",'0px','0px']
                                    },
                                    {
                                        id: 'e5_picture-2-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '218px', '273px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-2-2.jpg",'0px','0px'],
                                        userClass: "seenEl"
                                    }]
                                },
                                {
                                    id: 'e5_btInfo-3',
                                    type: 'group',
                                    rect: ['209px', '458px', '258', '273', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    userClass: "btInfo",
                                    c: [
                                    {
                                        id: 'e5_picture-3',
                                        type: 'image',
                                        rect: ['0px', '0px', '258px', '273px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-3.jpg",'0px','0px']
                                    },
                                    {
                                        id: 'e5_picture-3-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '258px', '273px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-3-2.jpg",'0px','0px'],
                                        userClass: "seenEl"
                                    }]
                                },
                                {
                                    id: 'e5_btInfo-4',
                                    type: 'group',
                                    rect: ['-2px', '81px', '418', '228', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    userClass: "btInfo",
                                    c: [
                                    {
                                        id: 'e5_picture-4',
                                        type: 'image',
                                        rect: ['0px', '0px', '418px', '228px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-4.jpg",'0px','0px']
                                    },
                                    {
                                        id: 'e5_picture-4-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '418px', '228px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-4-2.jpg",'0px','0px'],
                                        userClass: "seenEl"
                                    }]
                                },
                                {
                                    id: 'e5_btInfo-5',
                                    type: 'group',
                                    rect: ['1070px', '458px', '218', '273', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    userClass: "btInfo",
                                    c: [
                                    {
                                        id: 'e5_picture-5',
                                        type: 'image',
                                        rect: ['0px', '0px', '218px', '273px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-5.jpg",'0px','0px']
                                    },
                                    {
                                        id: 'e5_picture-5-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '218px', '273px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e5_picture-5-2.jpg",'0px','0px'],
                                        userClass: "seenEl"
                                    }]
                                }]
                            },
                            {
                                id: 'section-5',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(255,255,255,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e6_picture',
                                    type: 'image',
                                    rect: ['0px', '0px', '1389px', '731px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e6_picture.jpg",'0px','0px']
                                },
                                {
                                    id: 'e6_rect',
                                    type: 'rect',
                                    rect: ['auto', '0px', '471px', '791px', '0px', 'auto'],
                                    overflow: 'hidden',
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    c: [
                                    {
                                        id: 'e6_man',
                                        type: 'image',
                                        rect: ['-92px', '10px', '592px', '745px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e6_man.png",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e7_man',
                                    type: 'image',
                                    rect: ['402px', '27px', '634px', '764px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e7_man.png",'0px','0px']
                                },
                                {
                                    id: 'e7_group-1',
                                    type: 'group',
                                    rect: ['402', '153', '544', '578', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e7_red-zone-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '544px', '578px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e7_red-zone-1.png",'0px','0px'],
                                        userClass: "fading"
                                    },
                                    {
                                        id: 'e7_dot-1',
                                        type: 'ellipse',
                                        rect: ['265px', '308px', '16px', '16px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(234,31,41,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "wave-container",
                                        c: [
                                        {
                                            id: 'e1_dot-1Copy13',
                                            type: 'ellipse',
                                            rect: ['6px', '6px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy12',
                                            type: 'ellipse',
                                            rect: ['6px', '6px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e1_dot-1Copy11',
                                            type: 'ellipse',
                                            rect: ['6px', '6px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e7_link',
                                    type: 'rect',
                                    rect: ['696px', '469px', '247px', '2px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(234, 31, 41)","none"],
                                    userClass: "origin0-50"
                                },
                                {
                                    id: 'e7_textsWrap',
                                    type: 'rect',
                                    rect: ['978px', '265px', '458px', '481px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(234, 31, 41)","none"],
                                    c: [
                                    {
                                        id: 'e7_textsWrapContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(234, 31, 41)","none"],
                                        userClass: "flex col",
                                        c: [
                                        {
                                            id: 'e7_txt-1',
                                            type: 'text',
                                            rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​45<span style=\"font-family: poppins-thin;\">%</span></p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-bold', [155, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e7_txt-2',
                                            type: 'text',
                                            rect: ['0px', '220px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">des <span style=\"font-size: 45px; font-family: poppins-bold;\">TMS</span> entraînent</p><p style=\"margin: 0px;\">​des <span style=\"font-size: 56px; font-family: poppins-bold; color: rgb(234, 31, 41);\">séquelles</span>.</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-extra-light', [33, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e6_group-1',
                                    type: 'rect',
                                    rect: ['556px', '252px', '573px', '229px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "origin100-50",
                                    c: [
                                    {
                                        id: 'e6_group-content-1',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'e6_txt-1',
                                            type: 'text',
                                            rect: ['140', '67', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold;\">Plus de la moitié</span> des troubles</p><p style=\"margin: 0px;\">​musculosquelettiques (<span style=\"font-family: poppins-bold;\">TMS</span>)</p><p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold;\">affectent le dos</span> (surtout le bas du dos).</p>",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "28px", "", ""]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e6_button',
                                    type: 'rect',
                                    rect: ['1035px', '481px', '94px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btNext pulseBrown",
                                    c: [
                                    {
                                        id: 'e1_buttonContentCopy',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        fill: ["rgba(181,140,106,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy',
                                            type: 'image',
                                            rect: ['42', '10', '12px', '19px', 'auto', 'auto'],
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
                                            rect: ['276', '80', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Vous avez terminé la partie</p><p style=\"margin: 0px;\">« <span style=\"font-family: poppins-bold;\">Contexte et risques</span> ».</p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'end-txt-2',
                                            type: 'text',
                                            rect: ['276', '170px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Découvrons à présent</p><p style=\"margin: 0px;\">« <span style=\"font-size: 25px; font-family: poppins-bold; color: rgb(181, 140, 106);\">Votre dos</span></p><p style=\"margin: 0px;\"><span style=\"font-size: 25px; font-family: poppins-bold; color: rgb(181, 140, 106);\">et son fonctionnement</span> ».​</p>",
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
})("contexte-risques");
