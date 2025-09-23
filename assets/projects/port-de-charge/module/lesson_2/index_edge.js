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
                                fill: ["rgba(255,255,255,0.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e1_patterns',
                                    type: 'image',
                                    rect: ['0px', '0px', '1600px', '717px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e1_patterns.png",'0px','0px']
                                },
                                {
                                    id: 'e1_group-1',
                                    type: 'group',
                                    rect: ['652', '88', '301', '666', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e1_man-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '301px', '643px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_man-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'e1_skeleton-1',
                                        type: 'image',
                                        rect: ['66px', '83px', '168px', '583px', 'auto', 'auto'],
                                        opacity: '0.5',
                                        fill: ["rgba(0,0,0,0)",im+"e1_skeleton-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'e2_man',
                                        type: 'image',
                                        rect: ['0px', '0px', '301px', '643px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e2_man.png",'0px','0px']
                                    },
                                    {
                                        id: 'e2_skeleton-1',
                                        type: 'image',
                                        rect: ['69px', '83px', '162px', '583px', 'auto', 'auto'],
                                        opacity: '0.2',
                                        fill: ["rgba(0,0,0,0)",im+"e2_skeleton-1.png",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e1_group-2',
                                    type: 'group',
                                    rect: ['1013', '93', '186', '638', 'auto', 'auto'],
                                    opacity: '1',
                                    c: [
                                    {
                                        id: 'e1_man-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '186px', '638px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e1_man-2.png",'0px','0px']
                                    },
                                    {
                                        id: 'e1_skeleton-2',
                                        type: 'image',
                                        rect: ['18px', '65px', '127px', '558px', 'auto', 'auto'],
                                        opacity: '0.5',
                                        fill: ["rgba(0,0,0,0)",im+"e1_skeleton-2.png",'0px','0px']
                                    },
                                    {
                                        id: 'e3_man',
                                        type: 'image',
                                        rect: ['0px', '0px', '186px', '638px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e3_man.png",'0px','0px']
                                    },
                                    {
                                        id: 'e3_skeleton-1',
                                        type: 'image',
                                        rect: ['18px', '65px', '126px', '558px', 'auto', 'auto'],
                                        opacity: '0.3',
                                        fill: ["rgba(0,0,0,0)",im+"e3_skeleton-1.png",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e1_bloc-1',
                                    type: 'rect',
                                    rect: ['145px', '0px', '453px', '142px', 'auto', 'auto'],
                                    fill: ["rgba(228,228,228,1.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "origin50-0",
                                    c: [
                                    {
                                        id: 'e1_bloc-content-1',
                                        type: 'rect',
                                        rect: ['46px', '0px', '407px', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(0,0,0,1)","none"],
                                        userClass: "flexXStartCol col",
                                        c: [
                                        {
                                            id: 'e1_txt-1',
                                            type: 'text',
                                            rect: ['38px', '32px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​La pièce maîtresse de votre dos</p>",
                                            userClass: "static marginBottom10",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                        },
                                        {
                                            id: 'e1_txt-2',
                                            type: 'text',
                                            rect: ['38px', '72px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">LA COLONNE VERTÉBRALE</p>",
                                            userClass: "static",
                                            font: ['poppins-bold', [25, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_txt-3',
                                    type: 'text',
                                    rect: ['145px', '185px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​La <span style=\"font-family: poppins-bold;\">compréhension de votre dos</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​et de son fonctionnement </span>vous permettra</p><p style=\"margin: 0px;\">​de mieux saisir la façon de le <span style=\"font-family: poppins-bold;\">protéger</span>.</p>",
                                    align: "left",
                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "24px", "", "none"]
                                },
                                {
                                    id: 'e1_textsWrap',
                                    type: 'rect',
                                    rect: ['238px', '395px', '354px', '60px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "flexXEnd",
                                    c: [
                                    {
                                        id: 'e1_txt-4',
                                        type: 'text',
                                        rect: ['70px', '19px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold-italic;\">Cliquez</span> pour en savoir plus.</p>",
                                        align: "left",
                                        userClass: "static",
                                        font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                        textStyle: ["", "", "", "", "none"]
                                    },
                                    {
                                        id: 'Rectangle3',
                                        type: 'rect',
                                        rect: ['auto', '20px', '38px', '2px', '0px', 'auto'],
                                        fill: ["rgba(0,0,0,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "static marginLeft5"
                                    }]
                                },
                                {
                                    id: 'e2_txt-1',
                                    type: 'text',
                                    rect: ['987px', '333px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​Vue de face,</p><p style=\"margin: 0px;\">​votre colonne vertébrale</p><p style=\"margin: 0px;\">​est <span style=\"font-family: poppins-bold;\">rectiligne</span>.</p>",
                                    font: ['poppins-light', [20, "px"], "rgba(0,0,0,1)", "normal", "none", "", "break-word", "nowrap"],
                                    textStyle: ["", "", "24px", "", ""]
                                },
                                {
                                    id: 'e2_edge-white-2',
                                    type: 'image',
                                    rect: ['827px', '536px', '6px', '10px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"edge-white.svg",'0px','0px'],
                                    transform: [[],[],[],['1','-1']]
                                },
                                {
                                    id: 'e2_link',
                                    type: 'rect',
                                    rect: ['829px', '185px', '0px', '343px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [1,"rgba(255,255,255,1.00)","dashed"]
                                },
                                {
                                    id: 'e2_edge-white-1',
                                    type: 'image',
                                    rect: ['827px', '168px', '6px', '10px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"edge-white.svg",'0px','0px']
                                },
                                {
                                    id: 'e3_schema',
                                    type: 'image',
                                    rect: ['627px', '162px', '156px', '360px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e3_schema.png",'0px','0px']
                                },
                                {
                                    id: 'e3_slider-group-2',
                                    type: 'group',
                                    rect: ['706', '133', '180', '366', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e3_veil',
                                        type: 'image',
                                        rect: ['0px', '0px', '180px', '366px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e3_veil.png",'0px','0px']
                                    }]
                                },
                                {
                                    id: 'e3_slider-group-3',
                                    type: 'group',
                                    rect: ['480', '93', '303', '492', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e3_man-shadow',
                                        type: 'image',
                                        rect: ['70px', '0px', '181px', '406px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e3_man-shadow.png",'0px','0px']
                                    },
                                    {
                                        id: 'e3_schema-2',
                                        type: 'image',
                                        rect: ['164px', '286px', '139px', '143px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e3_schema-2.png",'0px','0px']
                                    },
                                    {
                                        id: 'e3_2-3',
                                        type: 'text',
                                        rect: ['0px', '312px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">​2/3</p>",
                                        font: ['poppins-bold', [102, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                    },
                                    {
                                        id: 'e3_2-3-2',
                                        type: 'text',
                                        rect: ['18px', '425px', 'auto', 'auto', 'auto', 'auto'],
                                        text: "<p style=\"margin: 0px;\">du poids total​</p>",
                                        font: ['poppins-bold', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                    }]
                                },
                                {
                                    id: 'e3_slider',
                                    type: 'rect',
                                    rect: ['987px', '213px', '527px', '233px', 'auto', 'auto'],
                                    overflow: 'hidden',
                                    fill: ["rgba(181,140,106,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e3_slide-1',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "slide",
                                        c: [
                                        {
                                            id: 'e3_slider-txt-1',
                                            type: 'text',
                                            rect: ['0px', '120px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Vue de profil,</p><p style=\"margin: 0px;\">​votre colonne vertébrale</p><p style=\"margin: 0px;\">​présent <span style=\"font-family: poppins-bold;\">3 courbatures</span>.</p>",
                                            font: ['poppins-light', [20, "px"], "rgba(0,0,0,1)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", ""]
                                        }]
                                    },
                                    {
                                        id: 'e3_slide-2',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "slide",
                                        c: [
                                        {
                                            id: 'e3_slider-txt-2',
                                            type: 'text',
                                            rect: ['0px', '120px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Ces <span style=\"font-family: poppins-bold;\">courbatures naturelles</span> et notamment</p><p style=\"margin: 0px;\">​celle située en vas vous permettent</p><p style=\"margin: 0px;\">​de <span style=\"font-family: poppins-bold;\">tenir debout sans avoir à contracter</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">​vos muscles</span>.</p>",
                                            font: ['poppins-light', [20, "px"], "rgba(0,0,0,1)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", ""]
                                        }]
                                    },
                                    {
                                        id: 'e3_slide-3',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "slide",
                                        c: [
                                        {
                                            id: 'e3_slider-txt-3',
                                            type: 'text',
                                            rect: ['0px', '120px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\"><span style=\"font-size: 25px;\">Le </span><span style=\"font-family: poppins-bold; font-size: 25px;\">bas</span><span style=\"font-size: 25px;\"> de votre </span><span style=\"font-family: poppins-bold; font-size: 25px;\">dos supporte</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold; font-size: 25px;\">​2/3 du poids total de votre corps</span><span style=\"font-size: 25px;\">,</span></p><p style=\"margin: 0px;\">​soit 50kg pour une personne de 75kg.</p>",
                                            font: ['poppins-light', [20, "px"], "rgba(0,0,0,1)", "normal", "none", "", "break-word", "nowrap"],
                                            textStyle: ["", "", "24px", "", ""]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e3_sliderGauge',
                                    type: 'rect',
                                    rect: ['1017px', '446px', '111px', '50px', 'auto', 'auto'],
                                    fill: ["rgba(181,140,106,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e3_sliderGaugeContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter cMarginRight15",
                                        c: [
                                        {
                                            id: 'e3_sliderCurrent-1',
                                            type: 'ellipse',
                                            rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                            userClass: "sliderCurrent boxNormalSizing static"
                                        },
                                        {
                                            id: 'e3_sliderCurrent-2',
                                            type: 'ellipse',
                                            rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                            userClass: "sliderCurrent boxNormalSizing static"
                                        },
                                        {
                                            id: 'e3_sliderCurrent-3',
                                            type: 'ellipse',
                                            rect: ['33px', '8px', '10px', '10px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(181,140,106,0)"],
                                            stroke: [2,"rgba(23,23,23,1.00)","solid"],
                                            userClass: "sliderCurrent boxNormalSizing static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'e1_button',
                                    type: 'ellipse',
                                    rect: ['623px', '395px', '60px', '60px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btNext pulseBrown",
                                    c: [
                                    {
                                        id: 'e1_button-content',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'cross',
                                            type: 'image',
                                            rect: ['29px', '18px', '15px', '15px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"cross.svg",'0px','0px'],
                                            userClass: "static",
                                            transform: [[],['45']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e2_button',
                                    type: 'ellipse',
                                    rect: ['1357px', '336px', '60px', '60px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btNext pulseBrown",
                                    c: [
                                    {
                                        id: 'e2_button-content',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'crossCopy',
                                            type: 'image',
                                            rect: ['29px', '18px', '15px', '15px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"cross.svg",'0px','0px'],
                                            userClass: "static",
                                            transform: [[],['45']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e3_btSliderPrev',
                                    type: 'rect',
                                    rect: ['987px', '446px', '30px', '50px', 'auto', 'auto'],
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
                                            id: 'arrow-white',
                                            type: 'image',
                                            rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static",
                                            transform: [[],[],[],['-1']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e3_btSliderNext',
                                    type: 'rect',
                                    rect: ['1128px', '446px', '94px', '50px', 'auto', 'auto'],
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
                                            id: 'arrow-whiteCopy',
                                            type: 'image',
                                            rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
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
                                fill: ["rgba(250,250,250,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e7_video-container',
                                    type: 'rect',
                                    rect: ['-360px', '0px', '1271px', '715px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "video-container video-brightness",
                                    transform: [[],[],[],['-1']]
                                },
                                {
                                    id: 'e6_video-container',
                                    type: 'rect',
                                    rect: ['-360px', '0px', '1271px', '715px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "video-container video-brightness",
                                    transform: [[],[],[],['-1']]
                                },
                                {
                                    id: 'e5_video-container',
                                    type: 'rect',
                                    rect: ['-360px', '0px', '1271px', '715px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "video-container video-brightness",
                                    transform: [[],[],[],['-1']]
                                },
                                {
                                    id: 'e4_video-container',
                                    type: 'rect',
                                    rect: ['-230px', '0px', '1271px', '715px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,0.00)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "video-container video-brightness",
                                    transform: [[],[],[],['-1']]
                                },
                                {
                                    id: 'e4_shape',
                                    type: 'image',
                                    rect: ['571px', '132px', '142px', '113px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e4_shape.png",'0px','0px']
                                },
                                {
                                    id: 'e4_link-dashed',
                                    type: 'rect',
                                    rect: ['753px', '300px', '86px', '0px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [1,"rgba(0,0,0,1.00)","dashed"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e4_link',
                                    type: 'rect',
                                    rect: ['855px', '300px', '271px', '2px', 'auto', 'auto'],
                                    fill: ["rgba(221,221,221,1.00)"],
                                    stroke: [1,"rgba(0,0,0,1.00)","none"],
                                    userClass: ""
                                },
                                {
                                    id: 'e5_link',
                                    type: 'rect',
                                    rect: ['855px', '300px', '81px', '2px', 'auto', 'auto'],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [1,"rgba(0,0,0,1.00)","none"],
                                    userClass: ""
                                },
                                {
                                    id: 'e6_link',
                                    type: 'rect',
                                    rect: ['950px', '300px', '81px', '2px', 'auto', 'auto'],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [1,"rgba(0,0,0,1.00)","none"],
                                    userClass: ""
                                },
                                {
                                    id: 'e7_link',
                                    type: 'rect',
                                    rect: ['1045px', '300px', '81px', '2px', 'auto', 'auto'],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [1,"rgba(0,0,0,1.00)","none"],
                                    userClass: ""
                                },
                                {
                                    id: 'e4_txt-kg',
                                    type: 'text',
                                    rect: ['753px', '257px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​kg</p>",
                                    align: "left",
                                    font: ['poppins-regular', [25, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "", "", "none"]
                                },
                                {
                                    id: 'e4_txt-50',
                                    type: 'text',
                                    rect: ['602px', '242px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">50</p>",
                                    align: "left",
                                    font: ['poppins-bold', [102, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "", "", "none"]
                                },
                                {
                                    id: 'e4_txt-1',
                                    type: 'text',
                                    rect: ['753px', '350px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​Lorsque votre <span style=\"font-family: poppins-bold;\">colonne </span><span style=\"font-family: poppins-bold; color: rgb(40, 135, 113);\">correspond</span></p><p style=\"margin: 0px;\">​à sa <span style=\"font-family: poppins-bold;\">cambrure naturelle </span>(vers l'avant)...</p>",
                                    align: "left",
                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "24px", "", "none"]
                                },
                                {
                                    id: 'e5_txt-0',
                                    type: 'text',
                                    rect: ['753px', '350px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​Lorsque votre <span style=\"font-family: poppins-bold;\">colonne </span><span style=\"font-family: poppins-bold; color: rgb(234, 31, 41);\">ne correspond plus</span></p><p style=\"margin: 0px;\">​à sa <span style=\"font-family: poppins-bold;\">cambrure naturelle </span>(vers l'avant)...</p>",
                                    align: "left",
                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "24px", "", "none"]
                                },
                                {
                                    id: 'e4_circle-1',
                                    type: 'ellipse',
                                    rect: ['841px', '294px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [2,"rgb(0, 0, 0)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e4_circle-2',
                                    type: 'ellipse',
                                    rect: ['936px', '294px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgb(0, 0, 0)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e4_circle-3',
                                    type: 'ellipse',
                                    rect: ['1031px', '294px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgb(0, 0, 0)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e4_circle-4',
                                    type: 'ellipse',
                                    rect: ['1126px', '294px', '10px', '10px', 'auto', 'auto'],
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(255,255,255,1.00)"],
                                    stroke: [2,"rgb(0, 0, 0)","solid"],
                                    userClass: "boxSizingInitial"
                                },
                                {
                                    id: 'e4_popup',
                                    type: 'rect',
                                    rect: ['692px', '85px', '504px', '100px', 'auto', 'auto'],
                                    fill: ["rgba(192,192,192,1)"],
                                    stroke: [0,"rgba(0,0,0,1)","none"],
                                    userClass: "origin0-50",
                                    c: [
                                    {
                                        id: 'e4_popup-content',
                                        type: 'rect',
                                        rect: ['59px', '0px', '445px', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgba(0,0,0,1)","none"],
                                        userClass: "flexXStart",
                                        c: [
                                        {
                                            id: 'e4_popup-txt',
                                            type: 'text',
                                            rect: ['45px', '14px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold;\">Rappel </span>: pour une personne de <span style=\"font-family: poppins-bold;\">75kg</span>,</p><p style=\"margin: 0px;\">​le <span style=\"font-family: poppins-bold;\">bas du dos supporte 50kg au repos</span>.</p>",
                                            userClass: "static",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e4_txt-2',
                                    type: 'text',
                                    rect: ['864px', '517px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​<span style=\"font-family: poppins-bold-italic;\">Cliquez </span>pour lancer la simulation.</p>",
                                    align: "left",
                                    font: ['poppins-light-italic', [20, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "", "", "none"]
                                },
                                {
                                    id: 'e4_button',
                                    type: 'ellipse',
                                    rect: ['661px', '104px', '61px', '61px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    borderRadius: ["50%", "50%", "50%", "50%"],
                                    fill: ["rgba(181,140,106,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "pulseBrown btInterro",
                                    c: [
                                    {
                                        id: 'e4_button-content-normal',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter normalEl",
                                        c: [
                                        {
                                            id: 'Text',
                                            type: 'text',
                                            rect: ['35', '25', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​?</p>",
                                            userClass: "static",
                                            font: ['poppins-regular', [37, "px"], "rgba(255,255,255,1.00)", "normal", "none", "", "break-word", "nowrap"]
                                        }]
                                    },
                                    {
                                        id: 'e4_button-content-close',
                                        type: 'ellipse',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        cursor: 'pointer',
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter closeEl",
                                        c: [
                                        {
                                            id: 'cross2',
                                            type: 'image',
                                            rect: ['22', '34', '18px', '18px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"cross.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'e4_btNext',
                                    type: 'rect',
                                    rect: ['753px', '509px', '94px', '50px', 'auto', 'auto'],
                                    cursor: 'pointer',
                                    fill: ["rgba(181,140,106,1)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    userClass: "btNext pulseBrown",
                                    c: [
                                    {
                                        id: 'e3_btNextContent',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(181,140,106,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexCenter",
                                        c: [
                                        {
                                            id: 'arrow-whiteCopy2',
                                            type: 'image',
                                            rect: ['13px', '18px', '11px', '18px', 'auto', 'auto'],
                                            fill: ["rgba(0,0,0,0)",im+"arrow-white.svg",'0px','0px'],
                                            userClass: "static"
                                        }]
                                    }]
                                },
                                {
                                    id: 'e5_txt-300',
                                    type: 'text',
                                    rect: ['539px', '242px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">300</p>",
                                    align: "left",
                                    font: ['poppins-bold', [102, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "", "", "none"]
                                },
                                {
                                    id: 'e5_txt-1',
                                    type: 'text',
                                    rect: ['753px', '415px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​la répartition des pressions</p><p style=\"margin: 0px;\">​n'est plus respectée.</p>",
                                    align: "left",
                                    font: ['poppins-bold', [25, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "30px", "", "none"]
                                },
                                {
                                    id: 'e6_txt-1',
                                    type: 'text',
                                    rect: ['753px', '350px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">La <span style=\"font-family: poppins-bold;\">rotation augmente</span> encore la pression</p><p style=\"margin: 0px;\">​de <span style=\"font-family: poppins-bold; color: rgb(181, 140, 106);\">10 à 20%</span> par rapport à la position axiale.</p>",
                                    align: "left",
                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "24px", "", "none"]
                                },
                                {
                                    id: 'e6_txt-345',
                                    type: 'text',
                                    rect: ['539px', '242px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">345</p>",
                                    align: "left",
                                    font: ['poppins-bold', [102, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "", "", "none"]
                                },
                                {
                                    id: 'e7_txt-1',
                                    type: 'text',
                                    rect: ['753px', '350px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">Si vous effectuez le <span style=\"font-family: poppins-bold;\">bon mouvement</span>,</p>",
                                    align: "left",
                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "24px", "", "none"]
                                },
                                {
                                    id: 'e7_txt-2',
                                    type: 'text',
                                    rect: ['753px', '385px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">la pression sur votre dos</p><p style=\"margin: 0px;\">​n'augmente pas.</p>",
                                    align: "left",
                                    font: ['poppins-bold', [25, "px"], "rgba(181,140,106,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "30px", "", "none"]
                                }]
                            },
                            {
                                id: 'section-3',
                                type: 'rect',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                fill: ["rgba(181,140,106,1.00)"],
                                stroke: [0,"rgba(0,0,0,1)","none"],
                                userClass: "section",
                                c: [
                                {
                                    id: 'e8_patterns',
                                    type: 'image',
                                    rect: ['0px', '0px', '1600px', '717px', 'auto', 'auto'],
                                    fill: ["rgba(0,0,0,0)",im+"e1_patterns.png",'0px','0px']
                                },
                                {
                                    id: 'e8_sep',
                                    type: 'rect',
                                    rect: ['799px', '204px', '2px', '404px', 'auto', 'auto'],
                                    fill: ["rgba(23,23,23,1.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"]
                                },
                                {
                                    id: 'e8_group-2',
                                    type: 'group',
                                    rect: ['236', '0', '996', '762', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e8_picture-2',
                                        type: 'image',
                                        rect: ['0px', '0px', '996px', '762px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e8_picture-2.png",'0px','0px']
                                    },
                                    {
                                        id: 'e8_veil-2',
                                        type: 'image',
                                        rect: ['644px', '338px', '172px', '235px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e8_veil-2.png",'0px','0px'],
                                        userClass: "fading"
                                    }]
                                },
                                {
                                    id: 'e8_group-1',
                                    type: 'group',
                                    rect: ['0', '0', '1130', '762', 'auto', 'auto'],
                                    c: [
                                    {
                                        id: 'e8_picture-1',
                                        type: 'image',
                                        rect: ['0px', '0px', '1130px', '762px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e8_picture-1.png",'0px','0px']
                                    },
                                    {
                                        id: 'e8_veil-1',
                                        type: 'image',
                                        rect: ['472px', '331px', '238px', '104px', 'auto', 'auto'],
                                        fill: ["rgba(0,0,0,0)",im+"e8_veil-1.png",'0px','0px'],
                                        userClass: "fading"
                                    },
                                    {
                                        id: 'e8_dot-1',
                                        type: 'ellipse',
                                        rect: ['588px', '329px', '10px', '10px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(234,31,41,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "wave-container",
                                        c: [
                                        {
                                            id: 'e8_dot-1-3',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e8_dot-1-2',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e8_dot-1-1',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(234,31,41,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        }]
                                    },
                                    {
                                        id: 'e8_dot-2',
                                        type: 'ellipse',
                                        rect: ['932px', '428px', '10px', '10px', 'auto', 'auto'],
                                        borderRadius: ["50%", "50%", "50%", "50%"],
                                        fill: ["rgba(64,210,176,1.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "wave-container",
                                        c: [
                                        {
                                            id: 'e8_dot-2-3',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(64,210,176,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e8_dot-2-2',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(64,210,176,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        },
                                        {
                                            id: 'e8_dot-2-1',
                                            type: 'ellipse',
                                            rect: ['3px', '3px', '0px', '0px', 'auto', 'auto'],
                                            borderRadius: ["50%", "50%", "50%", "50%"],
                                            fill: ["rgba(234,31,41,0.00)"],
                                            stroke: [2,"rgba(64,210,176,1.00)","solid"],
                                            userClass: "boxSizingInitial wave",
                                            transform: [[],[],[],['1.5','1.5']]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e8_textsWrap-1',
                                    type: 'rect',
                                    rect: ['200px', '89px', '1200px', '150px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0.00)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e8_textsWrapContent-1',
                                        type: 'rect',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0.00)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexYStart",
                                        c: [
                                        {
                                            id: 'e8_txt-1',
                                            type: 'text',
                                            rect: ['319px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Adoptez les bons gestes</p>",
                                            align: "left",
                                            userClass: "static",
                                            font: ['poppins-bold', [45, "px"], "rgba(255,255,255,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e8_txt-2',
                                    type: 'text',
                                    rect: ['347', '196px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">​vous permet de <span style=\"font-family: poppins-bold;\">protéger votre dos</span></p><p style=\"margin: 0px;\">​et d'éviter un(e)&nbsp;…</p>",
                                    align: "center",
                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "24px", "", "none"]
                                },
                                {
                                    id: 'e8_textsWrap-2',
                                    type: 'rect',
                                    rect: ['-80px', '510px', '500px', '265px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e8_textsWrapContent-2',
                                        type: 'rect',
                                        rect: ['0px', '0px', '500px', '265px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexXEndYStartCol col",
                                        c: [
                                        {
                                            id: 'e8_txt-3',
                                            type: 'text',
                                            rect: ['auto', '0px', 'auto', 'auto', '0px', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Hernie discale</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [45, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e8_txt-4',
                                            type: 'text',
                                            rect: ['auto', '50px', 'auto', 'auto', '0px', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Lumbago aigu</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [45, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e8_txt-5',
                                            type: 'text',
                                            rect: ['auto', '100px', 'auto', 'auto', '0px', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Sciatique&nbsp;…</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [45, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        }]
                                    }]
                                },
                                {
                                    id: 'e8_txt-6',
                                    type: 'text',
                                    rect: ['937px', '196px', 'auto', 'auto', 'auto', 'auto'],
                                    text: "<p style=\"margin: 0px;\">et ainsi <span style=\"font-family: poppins-bold;\">continuer à faire les activités</span></p><p style=\"margin: 0px;\"><span style=\"font-family: poppins-bold;\">que vous aimez&nbsp;</span>…</p>",
                                    align: "center",
                                    font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                    textStyle: ["", "", "24px", "", "none"]
                                },
                                {
                                    id: 'e8_textsWrap-3',
                                    type: 'rect',
                                    rect: ['1130px', '364px', '500px', '265px', 'auto', 'auto'],
                                    fill: ["rgba(255,255,255,0)"],
                                    stroke: [0,"rgb(0, 0, 0)","none"],
                                    c: [
                                    {
                                        id: 'e8_textsWrapContent-3',
                                        type: 'rect',
                                        rect: ['0px', '0px', '500px', '265px', 'auto', 'auto'],
                                        fill: ["rgba(255,255,255,0)"],
                                        stroke: [0,"rgb(0, 0, 0)","none"],
                                        userClass: "flexXStartYStartCol col",
                                        c: [
                                        {
                                            id: 'e8_txt-7',
                                            type: 'text',
                                            rect: ['0px', '0px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Courir</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [45, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e8_txt-8',
                                            type: 'text',
                                            rect: ['0px', '50px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Jouer avec</p><p style=\"margin: 0px;\">​les enfants</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [45, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'e8_txt-9',
                                            type: 'text',
                                            rect: ['0px', '100px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Danser&nbsp;…</p>",
                                            align: "center",
                                            userClass: "static",
                                            font: ['poppins-bold', [45, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
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
                                            rect: ['276', '80', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">​Vous avez terminé la partie</p><p style=\"margin: 0px;\">« <span style=\"font-family: poppins-bold;\">Votre dos et son fonctionnement</span>&nbsp;».</p>",
                                            align: "left",
                                            userClass: "static marginBottom20",
                                            font: ['poppins-light', [20, "px"], "rgba(23,23,23,1.00)", "400", "none", "normal", "break-word", "nowrap"],
                                            textStyle: ["", "", "", "", "none"]
                                        },
                                        {
                                            id: 'end-txt-2',
                                            type: 'text',
                                            rect: ['276', '170px', 'auto', 'auto', 'auto', 'auto'],
                                            text: "<p style=\"margin: 0px;\">Découvrons à présent</p><p style=\"margin: 0px;\">« <span style=\"font-size: 25px; font-family: poppins-bold; color: rgb(181, 140, 106);\">Les règle d'or</span>&nbsp;».​</p>",
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
})("votre-dos-et-son-fonctionnement");
