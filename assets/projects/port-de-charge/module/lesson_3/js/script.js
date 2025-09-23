pulseAnims();

var soundsData = [
    { id:'open', name:'open', path:'common' },
    { id:'close', name:'close', path:'common' },
    { id:'click', name:'click', path:'common' },
    { id:'take', name:'take', path:'common' },
    { id:'drop', name:'drop', path:'common' },
    { id:'right', name:'right', path:'common' },
    { id:'wrong', name:'wrong', path:'common' },
];


videoDatas = {
    "e3_video-container-1":{
        src:"Port_de_charge_V10",
        onEnded:screen3ExoVideoEnd,
        onTimeUpdate:screen3ExoVideoTimeUpdate
    },
    "e3_video-container-2":{
        src:"Port_de_charge_V11",
        onEnded:screen3ExoVideoEnd,
        onTimeUpdate:screen3ExoVideoTimeUpdate
    },
    "e3_video-container-3":{
        src:"Port_de_charge_V12",
        onEnded:screen3ExoVideoEnd,
        onTimeUpdate:screen3ExoVideoTimeUpdate
    },
    "e6_video-container-1":{
        src:"Port_de_charge_V13",
        timeStart:2.38,
        timeEnd:10,
        onTimeUpdate:screen6ExoVideoTimeUpdate
    },
    "e6_video-container-2":{
        src:"Port_de_charge_V15",
        timeStart:9.18,
        timeEnd:14.09,
        onTimeUpdate:screen6ExoVideoTimeUpdate
    },
    "e18_video-container":{
        src:"Port_de_charge_V18",
        loadScreens:20
    },
    "e29_video-container":{
        src:"Port_de_charge_V19",
        onTimeUpdate:screen29VideoTimeUpdate
    },
    "e32_video-container":{
        src:"Port_de_charge_V22",
        timeEnd:19,
        onTimeUpdate:screen32VideoTimeUpdate
    },
}


var sectionInnerMenu, sectionEnd, screen2Slider, screen3Num, screen5Part1Seen = false, screen5Part2Seen = false, screen6Slider, screen6Num;

function updateInnerMenu(c){
    var groups = sectionInnerMenu.querySelectorAll(".inner-menu-group"),
    datas = scorm.parsedDatas[currentFileId-1],
    maxSeen = navigation.maxReached;

    for(var g=1; g<=groups.length; g++){
        var group = groups[g-1],
        button = group.querySelector(".button"),
        num = button.className.match(/btLoadScreen-([0-9]+)/)[1];

        group.classList.remove("current");
        group.classList.remove("seen");
        group.classList.remove("unseen");
        button.classList.remove("pulseBrown");

        if(g==c){
            group.classList.add("current");
            button.classList.add("pulseBrown");
        }
        else if(g<c){
            group.classList.add("seen");
        } else {
           group.classList.add("unseen"); 
        }

        /*

        if(num==(maxSeen+1)){
            group.classList.add("current");
            button.classList.add("pulseBrown");
        }
        else if(num>(maxSeen+1)){
            group.classList.add("unseen");
        } else {
            group.classList.add("seen");
        }

        */
    }
}

function screen2Exo(){
    var sliderImg1 = sections[0].querySelector("#Stage_e2_slider-img-1"),
    sliderImg2 = sections[0].querySelector("#Stage_e2_slider-img-2"),
    sliderImg3 = sections[0].querySelector("#Stage_e2_slider-img-3"),
    updateGauge = function(current){
        var sliderCurrents = sections[0].querySelectorAll(".sliderCurrent");
        for(var s=1; s<=sliderCurrents.length; s++){
            var sliderCurrent = sliderCurrents[s-1];
            if(s==current){
                sliderCurrent.classList.add("current");
            } else {
                sliderCurrent.classList.remove("current");
            }
        }
    }
    if(screen2Slider==undefined){
        screen2Slider = new Slider({
            element:sections[0].querySelector("#Stage_e2_slider"),
            btNext:sections[0].querySelector("#Stage_e2_btSliderNext"),
            btPrev:sections[0].querySelector("#Stage_e2_btSliderPrev"),
            easing:"cubic-bezier(0.16, 1, 0.3, 1)",
            duration:0.8,
            reverse:true,
            onEnd:function(){
                navigation.isOn();
            },
            onEach:function(current,dir){
                updateGauge(current);
                switch(current){
                    case 1:
                        if(dir=="next"){
                        }
                        else if(dir=="prev"){
                            var a = animate({
                                element:sliderImg1,
                                properties:{scaleX:1,scaleY:1},
                                easing:"outBack",
                                duration:700
                            });
                            var b = animate({
                                element:sliderImg2,
                                properties:{scaleX:1,scaleY:1},
                                easing:"outBack",
                                duration:700
                            });
                            var c = animate({
                                element:sliderImg3,
                                properties:{scaleX:0,scaleY:0},
                                easing:"outExpo",
                                duration:700
                            });
                        }
                    break;

                    case 2:
                        if(dir=="next"){
                            var a = animate({
                                element:sliderImg1,
                                properties:{scaleX:0,scaleY:0},
                                easing:"outExpo",
                                duration:700
                            });
                            var b = animate({
                                element:sliderImg2,
                                properties:{scaleX:0,scaleY:0},
                                easing:"outExpo",
                                duration:700
                            });
                            var c = animate({
                                element:sliderImg3,
                                properties:{scaleX:1,scaleY:1},
                                easing:"outBack",
                                duration:700
                            });
                        }
                    break;
                }
                soundManager.play("click");
            }
        });
    } else {
        screen2Slider.setAtPos(1);
        screen2Slider.onEach(1);
        screen2Slider.activate();
    }
}

function screen3ExoInit(){
    var exoEls = sections[0].querySelectorAll(".exo-el"),
    pauseEl = sections[0].querySelector("#Stage_e3_video-pause"),
    popup = sections[0].querySelector("#Stage_e3_popup"),
    popupContent1 = popup.querySelector("#Stage_e3_popup-content-1"),
    popupContent2 = popup.querySelector("#Stage_e3_popup-content-2"),
    popupContent3 = popup.querySelector("#Stage_e3_popup-content-3"),
    popupContent4 = popup.querySelector("#Stage_e3_popup-content-4"),
    videoContainer1 = sections[0].querySelector("#Stage_e3_video-container-1"),
    videoContainer2 = sections[0].querySelector("#Stage_e3_video-container-2"),
    videoContainer3 = sections[0].querySelector("#Stage_e3_video-container-3"),
    popupButton = popup.querySelector("#Stage_e3_popup-button");

    pauseEl.classList.add("hidden");
    videoContainer1.classList.remove("unavailable");
    videoContainer2.classList.add("unavailable");
    videoContainer3.classList.add("unavailable");

    for(var e=1; e<=exoEls.length; e++){
        var exoEl = exoEls[e-1],
        buttonPlay = exoEl.querySelector(".button-play");

        exoEl.classList.remove("locked");
        exoEl.classList.remove("unlocked");
        exoEl.classList.remove("seen");

        buttonPlay.classList.remove("pulseBrown");
        buttonPlay.removeAttribute("type");;
        buttonPlay.num = e;

        $(buttonPlay).off().on(Constants.CLICK_TOUCH,screen3ExoVideoClick);
    }

    $(popupButton).off().on(Constants.CLICK_TOUCH,screen3ExoVideoClick);
    popupButton.classList.add("hidden");
}

function screen3ExoSet(num){
    var popup = sections[0].querySelector("#Stage_e3_popup"),
    popupContent1 = popup.querySelector("#Stage_e3_popup-content-1"),
    popupContent2 = popup.querySelector("#Stage_e3_popup-content-2"),
    popupContent3 = popup.querySelector("#Stage_e3_popup-content-3"),
    popupContent4 = popup.querySelector("#Stage_e3_popup-content-4"),
    videoContainer1 = sections[0].querySelector("#Stage_e3_video-container-1"),
    videoContainer2 = sections[0].querySelector("#Stage_e3_video-container-2"),
    videoContainer3 = sections[0].querySelector("#Stage_e3_video-container-3"),
    popupButton = popup.querySelector("#Stage_e3_popup-button");

    if(typeof num == "number"){
        screen3Num = num;
    }

    switch(screen3Num){
        case 1:
            popupContent1.style.opacity = 1;
            popupContent2.style.opacity = 0;
            popupContent3.style.opacity = 0;
            popupContent4.style.opacity = 0;
            popupButton.classList.remove("hidden");
        break;

        case 2:
            popupContent1.style.opacity = 0;
            popupContent2.style.opacity = 1;
            popupContent3.style.opacity = 0;
            popupContent4.style.opacity = 0;
            popupButton.classList.remove("hidden");
        break;

        case 3:
            popupContent1.style.opacity = 0;
            popupContent2.style.opacity = 0;
            popupContent3.style.opacity = 1;
            popupContent4.style.opacity = 0;
            popupButton.classList.remove("hidden");
        break;

        case 4:
            popupContent1.style.opacity = 0;
            popupContent2.style.opacity = 0;
            popupContent3.style.opacity = 0;
            popupContent4.style.opacity = 1;
            popupButton.classList.add("hidden");
        break;
    }
}

function screen3ExoUpdate(){
    var exoEls = sections[0].querySelectorAll(".exo-el"),
    pauseEl = sections[0].querySelector("#Stage_e3_video-pause"),
    popup = sections[0].querySelector("#Stage_e3_popup"),
    popupContent1 = popup.querySelector("#Stage_e3_popup-content-1"),
    popupContent2 = popup.querySelector("#Stage_e3_popup-content-2"),
    popupContent3 = popup.querySelector("#Stage_e3_popup-content-3"),
    popupButton = popup.querySelector("#Stage_e3_popup-button"),
    maxSeen = navigation.maxReached,
    currentSeen = navigation.current;

    for(var e=1; e<=exoEls.length; e++){
        var exoEl = exoEls[e-1],
        buttonPlay = exoEl.querySelector(".button-play");

        exoEl.classList.remove("locked");
        exoEl.classList.remove("unlocked");
        exoEl.classList.remove("seen");

        buttonPlay.removeAttribute("type");
        buttonPlay.classList.remove("pulseBrown");

        if(maxSeen>currentSeen){
            exoEl.classList.add("seen");
            buttonPlay.setAttribute("type","replay");
            buttonPlay.seen = true;
        } else {
            if(screen3Num==e){
                exoEl.classList.add("unlocked");
                buttonPlay.setAttribute("type","play");
            }
            else if(screen3Num>e){
                exoEl.classList.add("seen");
                buttonPlay.setAttribute("type","replay");
                buttonPlay.seen = true;
            } else {
                exoEl.classList.add("locked");
            }
        }
    }

    if(maxSeen>currentSeen){
        navigation.isOn();
    }
}

function screen3ExoVideoClick(){
    var popup = sections[0].querySelector("#Stage_e3_popup"),
    exoEls = sections[0].querySelectorAll(".exo-el"),
    videoContainer1 = sections[0].querySelector("#Stage_e3_video-container-1"),
    videoContainer2 = sections[0].querySelector("#Stage_e3_video-container-2"),
    videoContainer3 = sections[0].querySelector("#Stage_e3_video-container-3"),
    exoEl = exoEls[screen3Num-1],
    pauseEl = sections[0].querySelector("#Stage_e3_video-pause"),
    id = this.id;

    soundManager.play("click");

    if(id.indexOf("button-play")!=-1){
        screen3Num = this.num;
        if(this.getAttribute("type")=="play"){
            pauseEl.classList.add("hidden");
            screen3ExoVideoPlay();
        }
        else if(this.getAttribute("type")=="replay"){
            pauseEl.classList.add("hidden");
            screen3ExoVideoPlay("start");
        }
        else if(this.getAttribute("type")=="pause"){
            pauseEl.classList.remove("hidden");
            screen3ExoVideoPause();
        }
        var a = animate({
            element:popup,
            properties:{opacity:0,translateX:"-300%"},
            easing:"inOutExpo",
            duration:800
        });
    } else {
        var a = animate({
            element:popup,
            properties:{opacity:0,translateX:"-300%"},
            easing:"inOutExpo",
            duration:800
        });
        screen3ExoVideoPlay();
    }    
}

function screen3ExoVideoPlay(start){
    var exoEls = sections[0].querySelectorAll(".exo-el"),
    exoEl = exoEls[screen3Num-1],
    videoContainer1 = sections[0].querySelector("#Stage_e3_video-container-1"),
    videoContainer2 = sections[0].querySelector("#Stage_e3_video-container-2"),
    videoContainer3 = sections[0].querySelector("#Stage_e3_video-container-3");

    if(exoEl){
        exoEl.querySelector(".button-play").setAttribute("type","pause");
    }

    switch(screen3Num){
        case 1:
            showVideo(videosList["e3_video-container-1"]);
            playVideo(videosList["e3_video-container-1"],start);
            hideVideo(videosList["e3_video-container-2"]);
            pauseVideo(videosList["e3_video-container-2"]);
            hideVideo(videosList["e3_video-container-3"]);
            pauseVideo(videosList["e3_video-container-3"]);
            if(exoEls[1].querySelector(".button-play").getAttribute("type")!="replay"){
               exoEls[1].querySelector(".button-play").setAttribute("type","play"); 
            }
            if(exoEls[2].querySelector(".button-play").getAttribute("type")!="replay"){
               exoEls[2].querySelector(".button-play").setAttribute("type","play"); 
            }
        break;

        case 2:
            showVideo(videosList["e3_video-container-2"]);
            playVideo(videosList["e3_video-container-2"],start);
            hideVideo(videosList["e3_video-container-1"]);
            pauseVideo(videosList["e3_video-container-1"]);
            hideVideo(videosList["e3_video-container-3"]);
            pauseVideo(videosList["e3_video-container-3"]);
            if(exoEls[0].querySelector(".button-play").getAttribute("type")!="replay"){
               exoEls[0].querySelector(".button-play").setAttribute("type","play"); 
            }
            if(exoEls[2].querySelector(".button-play").getAttribute("type")!="replay"){
               exoEls[2].querySelector(".button-play").setAttribute("type","play"); 
            }
        break;

        case 3:
            showVideo(videosList["e3_video-container-3"]);
            playVideo(videosList["e3_video-container-3"],start);
            hideVideo(videosList["e3_video-container-1"]);
            pauseVideo(videosList["e3_video-container-1"]);
            hideVideo(videosList["e3_video-container-2"]);
            pauseVideo(videosList["e3_video-container-2"]);
            if(exoEls[0].querySelector(".button-play").getAttribute("type")!="replay"){
               exoEls[0].querySelector(".button-play").setAttribute("type","play"); 
            }
            if(exoEls[1].querySelector(".button-play").getAttribute("type")!="replay"){
               exoEls[1].querySelector(".button-play").setAttribute("type","play"); 
            }
        break;
    }   
}

function screen3ExoVideoPause(){
    var exoEls = sections[0].querySelectorAll(".exo-el"),
    exoEl = exoEls[screen3Num-1],
    videoContainer1 = sections[0].querySelector("#Stage_e3_video-container-1"),
    videoContainer2 = sections[0].querySelector("#Stage_e3_video-container-2"),
    videoContainer3 = sections[0].querySelector("#Stage_e3_video-container-3");

    if(exoEl){
        exoEl.querySelector(".button-play").setAttribute("type","play");
    }

    switch(screen3Num){
        case 1:
            pauseVideo(videosList["e3_video-container-1"]);
        break;

        case 2:
            pauseVideo(videosList["e3_video-container-2"]);
        break;

        case 3:
            pauseVideo(videosList["e3_video-container-3"]);
        break;
    }
}

function screen3ExoVideoEnd(){
    var popup = sections[0].querySelector("#Stage_e3_popup"),
    exoEls = sections[0].querySelectorAll(".exo-el"),
    videoContainer1 = sections[0].querySelector("#Stage_e3_video-container-1"),
    videoContainer2 = sections[0].querySelector("#Stage_e3_video-container-2"),
    videoContainer3 = sections[0].querySelector("#Stage_e3_video-container-3"),
    exoEl = exoEls[screen3Num-1];

    if(exoEl){
        exoEl.querySelector(".button-play").classList.remove("pause");
        exoEl.querySelector(".button-play").classList.remove("play");
        exoEl.querySelector(".button-play").classList.add("replay");
        exoEl.querySelector(".button-play").seen = true;
    }

    screen3Num++;

    screen3ExoUpdate();
    screen3ExoSet();

    var a = animate({
        element:popup,
        properties:{opacity:1,translateX:"0%"},
        easing:"inOutExpo",
        duration:800,
        end:function(){
            if(screen3Num==4){
                navigation.isOn();
            }
        }
    });
}

function screen3ExoVideoTimeUpdate(current,start,end){
    if(!screen3Num || screen3Num!=parseInt(this.container.id.match(/\d/g)[1])){
        return;
    }
    var durationEl = sections[0].querySelector("#Stage_e3_duration-"+screen3Num);
    durationEl.style.height = Math.round((current-start)/(end-start)*100)+"%";
}

function screen5Update(){
    var buttons = sections[1].querySelectorAll(".button");

    for(var b=1; b<=buttons.length; b++){
        var button = buttons[b-1],
        num = button.className.match(/btLoadScreen-([0-9]+)/)[1];

        button.classList.remove("seen");
        button.classList.remove("pulseBrown");
        button.classList.remove("inactive");

        if(b==1){
            if(screen5Part1Seen==true){
                button.classList.add("seen");
            } else {
                button.classList.add("pulseBrown");
            }
        } else {
            if(screen5Part2Seen==true){
                button.classList.add("seen");
            }
            else if(screen5Part1Seen==false){
                button.classList.add("inactive");  
            } else {
                button.classList.add("pulseBrown"); 
            }
        }
    }

}

function screen6Exo(){
    var picture = sections[2].querySelector("#Stage_e6_picture"),
    videoGaugeEl = sections[2].querySelector("#Stage_e6_sliderVideoGauge"),
    videoDurationEl = sections[2].querySelector("#Stage_e6_sliderVideoDuration"),
    updateGauge = function(current){
        var sliderCurrents = sections[2].querySelectorAll(".sliderCurrent");
        for(var s=1; s<=sliderCurrents.length; s++){
            var sliderCurrent = sliderCurrents[s-1];
            if(s==current){
                sliderCurrent.classList.add("current");
            } else {
                sliderCurrent.classList.remove("current");
            }
        }
    }
    if(screen6Slider==undefined){
        screen6Slider = new Slider({
            element:sections[2].querySelector("#Stage_e6_slider"),
            btNext:sections[2].querySelector("#Stage_e6_btSliderNext"),
            btPrev:sections[2].querySelector("#Stage_e6_btSliderPrev"),
            easing:"cubic-bezier(0.16, 1, 0.3, 1)",
            duration:0.8,
            reverse:true,
            onEnd:function(){
                screen5Part1Seen = true;
                navigation.isOn();
            },
            onEach:function(current,dir){
                updateGauge(current);
                switch(current){
                    case 1:
                        if(dir=="prev"){
                            picture.classList.remove("hidden");
                            videoGaugeEl.classList.add("hidden");
                            hideVideo(videosList["e6_video-container-1"]);
                            pauseVideo(videosList["e6_video-container-1"],"start");
                        }
                    break;

                    case 2:
                        if(dir=="next"){
                            screen6Num = 1;
                            showVideo(videosList["e6_video-container-1"]);
                            playVideo(videosList["e6_video-container-1"]);
                            picture.classList.add("hidden");
                            videoGaugeEl.classList.remove("hidden");
                        }
                        else if(dir=="prev"){
                            screen6Num = 1;
                            showVideo(videosList["e6_video-container-1"]);
                            playVideo(videosList["e6_video-container-1"]);
                            hideVideo(videosList["e6_video-container-2"]);
                            pauseVideo(videosList["e6_video-container-2"],"start");
                        }
                    break;

                    case 3:
                        if(dir=="next"){
                            screen6Num = 2;
                            hideVideo(videosList["e6_video-container-1"]);
                            pauseVideo(videosList["e6_video-container-1"],"start");
                            showVideo(videosList["e6_video-container-2"]);
                            playVideo(videosList["e6_video-container-2"]);
                        }
                    break;
                }
                if(dir!=undefined){
                    soundManager.play("click");
                }
            }
        });
    } else {
        screen6Num = 1;
        screen6Slider.setAtPos(1);
        screen6Slider.onEach(1);
        screen6Slider.activate();
    }

    picture.classList.remove("hidden");
    videoGaugeEl.classList.add("hidden");
    hideVideo(videosList["e6_video-container-1"]);
    hideVideo(videosList["e6_video-container-2"]);
}

function screen6ExoVideoTimeUpdate(current,start,end){
    if(screen6Num!=parseInt(this.container.id.match(/\d/g)[1])){
        return;
    }
    var videoDurationEl = sections[2].querySelector("#Stage_e6_sliderVideoDuration");
    videoDurationEl.style.width = Math.round((current-start)/(end-start)*100)+"%";
}

function screen21Update(current){
    var buttons = sections[6].querySelectorAll(".btWhite");

    for(var b=1; b<=buttons.length; b++){
        var button = buttons[b-1];

        button.classList.remove("pulseWhite");
        button.classList.remove("inactive");
        button.classList.remove("clicked");

        if(b<current){
            button.classList.add("clicked");
        }
        else if(b>current){
            button.classList.add("inactive");
        } else {
           button.classList.add("pulseWhite"); 
        }
    }
}

function screen27Update(current){
    var btSliderPrev = sections[7].querySelector("#Stage_e27_btSliderPrev"),
    btSliderNext = sections[7].querySelector("#Stage_e27_btSliderNext");

    btSliderPrev.classList.remove("inactive");
    btSliderNext.classList.remove("inactive");

    switch(current){
        case 1:
            btSliderPrev.classList.add("inactive");
            btSliderNext.classList.remove("inactive");
        break;
        case 2:
            btSliderPrev.classList.remove("inactive");
            if(timeline.steps["screen_28_popup_show"].seen==true){
                btSliderNext.classList.remove("inactive");
            } else {
                btSliderNext.classList.add("inactive");
            }
        break;
        case 3:
            btSliderPrev.classList.remove("inactive");
            btSliderNext.classList.add("inactive");
        break;
    }
}

function screen29VideoTimeUpdate(current,start,end){
    var videoDurationEl = sections[7].querySelector("#Stage_e29_videoDuration");
    videoDurationEl.style.width = Math.round((current-start)/(end-start)*100)+"%";
}

function screen32VideoTimeUpdate(current,start,end){
    var videoDurationEl = sections[8].querySelector("#Stage_e32_videoDuration");
    videoDurationEl.style.width = Math.round((current-start)/(end-start)*100)+"%";
}

function checkInfos(props){
    var buttons = props.buttons,
    infos = props.infos,
    duration = typeof props.duration == "number" ? props.duration : .8,
    easing = typeof props.easing == "string" ? props.easing : "ease-out",
    transitionsOut = getPropertiesArray("out"),
    transitionsIn = getPropertiesArray("in"),
    onEach = typeof props.onEach == "function" ? props.onEach : function(){},
    onEnd = typeof props.onEnd == "function" ? props.onEnd : function(){},
    classClicked = typeof props.classClicked == "string" ? props.classClicked : "clicked",
    classSeen = typeof props.classSeen == "string" ? props.classSeen : "seen",
    classInactive = typeof props.classInactive == "string" ? props.classInactive : "inactive",
    classActive = typeof props.classActive == "string" ? props.classActive : "active",
    classHide = typeof props.classHide == "string" ? props.classHide : "visibilityHidden",
    hideButtons = props.hideButtons!=undefined ? true : false,
    onlyOneInfoDisplayed = props.onlyOneInfoDisplayed!=undefined ? true : false;

    function getPropertiesArray(w){
        var properties = w=="out" ? props.transitionsOut : props.transitionsIn,
        transforms = ["translateX","translateY","rotate","scaleX","scaleY"];
        if(Array.isArray(properties)==true && properties.length==infos.length){
            for(var p=1; p<=properties.length; p++){
                var pro = properties[p-1];
                for(var pr in pro){
                    if(transforms.indexOf(pr)!=-1){
                        if(pro.transform==undefined){
                            pro.transform = {};
                        }
                        pro.transform[pr] = pro[pr];
                        delete pro[pr];
                    }
                }
            }
            return properties;
        } else {
            var arr = [];
            for(var p=1; p<=infos.length; p++){
                if(properties!=undefined){
                    for(var pr in properties){
                        if(transforms.indexOf(pr)!=-1){
                            if(properties.transform==undefined){
                                properties.transform = {};
                            }
                            properties.transform[pr] = properties[pr];
                            delete properties[pr];
                        }
                    }
                    arr.push(properties);
                } else {
                  arr.push((w=="out") ? {opacity:1,transform:{scaleX:1,scaleY:1}} : {opacity:0,transform:{scaleX:0,scaleY:0}});  
                }
                
            }
            return arr;
        }
    }
    function onClick(e){
        this.classList.remove(classActive);
        if(this.classList.contains(classClicked)){
            this.classList.remove(classClicked);
            hide(infos[this.num-1]);
            onEach("hide",this.num);
        } else {
            this.classList.add(classClicked);
            this.classList.add(classSeen);
            if(hideButtons==true){
                this.classList.add(classHide);
            }
            show(infos[this.num-1]);
            onEach("show",this.num);
        }
    }
    function show(info){
        if(onlyOneInfoDisplayed==true){
            for(var i=1; i<=infos.length; i++){
                var inf = infos[i-1],
                button = buttons[i-1];
                if(inf.opened==true){
                    inf.opened = false;
                    inf.setValue("in");
                    button.classList.remove(classClicked);
                }
            }
        }
        info.classList.remove(classHide);
        info.opened = true;
        info.state = "out";
        info.forceEnd = false;
        info.setValue("out");
    }
    function hide(info){
        info.opened = false;
        info.state = "in";
        info.forceEnd = false;
        info.setValue("in");
    }
    function setValue(w){
        var props = w == "out" ? transitionsOut[this.num-1] : transitionsIn[this.num-1];
        for(var t in props){
            if(t=="transform"){
                var s2 = "";
                for(var t2 in props[t]){
                    s2+= t2+"("+(props[t][t2])+")";
                }
                this.style["transform"] = s2;
            } else {
                this.style[t] = props[t];
            }
        }
    }
    function handleTransitionEnd(e){
        if(this.forceEnd==false){
            this.forceEnd = true;
            this.style["pointer-events"] = this.state == "out" ? "" : "none";
            if(this.state=="in"){
                this.classList.add(classHide);
            }
            if(checkOpened()==true){
               onEnd(); 
            }
            
        }
    }
    function checkOpened(){
        var count = 0;
        for(var b=1; b<=buttons.length; b++){
            if(buttons[b-1].classList.contains(classSeen)){
                count++;
            }
        }
        return (count==buttons.length);
    }
    function init(){
        for(var b=1; b<=buttons.length; b++){
            var button = buttons[b-1],
            info = infos[b-1],
            btClose = info.querySelector(".btClose");

            button.num = b;
            button.classList.remove(classHide);
            button.classList.remove(classClicked);
            button.classList.remove(classSeen);
            button.classList.add(classActive);
            $(button).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,onClick);

            info.num = b;
            info.setValue = setValue;
            info.forceEnd = false;
            info.opened = false;
            info.classList.add(classHide);
            var transIn = transitionsIn[b-1],
            s = "", i = 1, total = Object.keys(transIn).length;
            for(var t in transIn){
                s+= i<total ? t+"," : t;
                if(t=="transform"){
                    var s2 = "";
                    for(var t2 in transIn[t]){
                        s2+= t2+"("+(transIn[t][t2])+")"
                    }
                    info.style["transform"] = s2;
                } else {
                    info.style[t] = transIn[t];
                }
                i++;
            }
            info.style["transition-property"] = s;
            info.style["transition-duration"] = duration+"s";
            info.style["pointer-events"] = "none";
            info.removeEventListener("transitionend",handleTransitionEnd);
            info.removeEventListener("webkitTransitionEnd",handleTransitionEnd);
            info.addEventListener("transitionend",handleTransitionEnd);
            info.addEventListener("webkitTransitionEnd",handleTransitionEnd);

            if(btClose){
                btClose.info = info;
                $(btClose).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,function(){
                    hide(this.info);
                });
            }
        }
    }

    init();
}