import CONFIG from "./config.js";
import App from "../../../common/content/js/app.js";
import {Timeline} from "../../../common/content/js/lib/MotionBroth/MotionBroth.js";
import { timelineDatas } from "./screens.js";
import Slider from "../../../common/content/js/components/slider.js";
import Scroll from "../../../common/content/js/components/scroll.js";
import { EVENTS } from "../../../common/content/js/lib/utils.js";

const app = new App(CONFIG);
export let timeline = null;
export let swap;
export let interactions = {};

export function cbNext(){
    if(timeline){
        timeline.play();
    }
}

export function cbPrev(current){
    if(timeline){
        timeline.stopAt(current-1);
    }
}

export function interactionScreen2(){
    const cursorHelper = document.querySelector("#s2-swap-helper");
    if(!interactions["2"]){
        function update(percent){
            const step = timeline.getStep("screen-3");
            const position = percent/100*step.duration;
            step.setPosition(position);
        }
        interactions["2"] = new Scroll({
            positionsReceiver:document.querySelector("#main"),
            difference: 200,
            ignore:true,
            wheel:false,
            time:Infinity
        });
        
        interactions["2"].on(interactions["2"].events.SCROLL_UP,(event)=>{
            const {data} = event;
            const {percent} = data;
            if(percent >= 50){
                interactions["2"].removeEvents();
                app.navigation.next(true);
            } else {
                interactions["2"].disabled = false;
                update(0);
                cursorHelper.classList.remove("unavailable");
            }
        });
        interactions["2"].on(interactions["2"].events.MOVE,(event)=>{
            const {data} = event;
            const {percent,direction} = data;
            if(!cursorHelper.classList.contains("unavailable")){
                cursorHelper.classList.add("unavailable");
            }
            if(direction === "up"){
                update(percent);
            }
        });
    } else {
        interactions["2"].reset();
        if(interactions["2"].disposed === true){
            interactions["2"].addEvents();
        }
        cursorHelper.classList.remove("unavailable");
    }
    interactions["2"].disabled = false;
}

export function interactionScreen5(){
    if(!interactions["5"]){
        interactions["5"] = new Slider({
            element:document.querySelector("#s5-slider"),
            gauge:document.querySelector("#s5-gauge"),
            axis:"y"
        });
        interactions["5"].on(interactions["5"].events.END,()=>{
            if(swap){
                swap.disabled = false;
            }
        });
    } else {
        interactions["5"].reset();
    }
}

function appReady() {
    swap = app.swap;
    timeline = new Timeline(timelineDatas);
    if(app.navigation.current > 1){
        timeline.stopAt(app.navigation.current-1);
    } else {
        timeline.play();
    }

    const buttonStart = document.querySelector("#s1-button-start");
    buttonStart.addEventListener(EVENTS.CLICK_TOUCH,()=>{
        app.navigation.next(true);
    });
}

app.on(App.READY, appReady);
app.init();
window.app = app;
