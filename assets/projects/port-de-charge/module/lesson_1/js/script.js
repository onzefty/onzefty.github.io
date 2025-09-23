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

function screen3DrawSvg(){
    var svgContainer = sections[1].querySelector("#Stage_e3_svg-container");
    if(svgContainer.children.length==0){
        svgContainer.innerHTML = "\
        <svg class='widthAll heightAll' viewBox='0 0 326 326' xmlns='http://www.w3.org/2000/svg' style='overflow:visible;'>\
            <circle id='e3_svg-circle-correct-min' transform='rotate(-90,163,163)' cx='163' cy='163' r='153' stroke='#288771' stroke-linecap='round' fill='none' stroke-width='24' style='transform-origin:50% 50%;transform:rotate(-90deg) scaleX(1)'></circle>\
            <circle id='e3_svg-circle-draw' transform='rotate(-90,163,163)' cx='163' cy='163' r='153' stroke='#b58c6a' stroke-linecap='round' fill='none' stroke-width='24' style='transform-origin:50% 50%;transform:rotate(-90deg) scaleX(1)'></circle>\
            <circle id='e3_svg-circle-correct-max' transform='rotate(-90,163,163)' cx='163' cy='163' r='153' stroke='#288771' stroke-linecap='round' fill='none' stroke-width='24' style='transform-origin:50% 50%;transform:rotate(-90deg) scaleX(1)'></circle>\
        </svg>";
    }
    var c = Math.PI*(153*2),
    pct = ((100-70)/100)*c,
    circleDraw = svgContainer.querySelector("#e3_svg-circle-draw"),
    circleCorrectMin = svgContainer.querySelector("#e3_svg-circle-correct-min"),
    circleCorrectMax = svgContainer.querySelector("#e3_svg-circle-correct-max");
    circleDraw.setAttribute('stroke',"#b58c6a");
    circleCorrectMin.setAttribute('stroke-dashoffset',pct);
    circleCorrectMin.setAttribute('stroke-dasharray',c);
    circleCorrectMin.classList.add("hidden");
    circleCorrectMax.setAttribute('stroke-dashoffset',pct);
    circleCorrectMax.setAttribute('stroke-dasharray',c);
    circleCorrectMax.classList.add("hidden");
}

function screen3DrawCircle(percent){
    var svgContainer = sections[1].querySelector("#Stage_e3_svg-container"),
    c = Math.PI*(153*2),
    pct = ((100-percent)/100)*c,
    circleDraw = svgContainer.querySelector("#e3_svg-circle-draw");
    circleDraw.setAttribute('stroke-dashoffset',pct);
    circleDraw.setAttribute('stroke-dasharray',c);
}

function screen3Exo(){
    var btValidate = sections[1].querySelector("#Stage_e3_btValidate"),
    btCursor = sections[1].querySelector("#Stage_e3_btCursor"),
    percentTxt = sections[1].querySelector("#Stage_e3_txt-progress"),
    svgContainer = sections[1].querySelector("#Stage_e3_svg-container"),
    circleDraw = svgContainer.querySelector("#e3_svg-circle-draw"),
    circleCorrectMin = svgContainer.querySelector("#e3_svg-circle-correct-min"),
    circleCorrectMax = svgContainer.querySelector("#e3_svg-circle-correct-max"),
    answer = 70,
    onValidate = function(){
        this.classList.remove("pulseBrown");
        $(this).off();
        if(btCursor.percent==answer){
            soundManager.play("right");
            circleDraw.setAttribute('stroke',"#288771");
            btCursor.classList.add("right");
            percentTxt.classList.add("color-right");
        } else {
            soundManager.play("wrong");
            circleDraw.setAttribute('stroke',"#ea1f29");
            if(btCursor.percent>answer){
                circleCorrectMax.classList.remove("hidden");
            } else {
                circleCorrectMin.classList.remove("hidden");
            }
            btCursor.classList.add("wrong");
            percentTxt.classList.add("color-wrong");
        }
        timeline.play("screen_3_feedback");
    },
    rotable = new Rotable({
        element:btCursor,
        cannotReset:true,
        customOnDown:function(){
            soundManager.play("take");
        },
        customOnUp:function(){
            soundManager.play("drop");
        },
        customOnRotate:function(angle){
            btValidate.classList.add("pulseBrown");
            btValidate.classList.remove("inactive");
            var c = Math.PI*(153*2),
            percent = Math.round(angle/360*100);
            screen3DrawCircle(percent);
            btCursor.percent = percent;
            percentTxt.querySelector("p").innerHTML = percent;
        }
    });

    btValidate.classList.add("inactive");
    btValidate.classList.remove("pulseBrown");
    $(btValidate).off().on(Constants.CLICK_TOUCH,onValidate);
    btCursor.style['transform-origin'] = "50% 170px";
    btCursor.classList.remove("wrong");
    btCursor.classList.remove("right");
    percentTxt.querySelector("p").innerHTML = "0";
    percentTxt.classList.remove("color-wrong");
    percentTxt.classList.remove("color-right");
}

var screen4Exo;

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