import CONFIG from "./config.js";
import App from "../../../common/content/js/app.js";
import {Timeline} from "../../../common/content/js/lib/MotionBroth/MotionBroth.js";
import { timelineDatas } from "./screens.js";
import Scroll from "../../../common/content/js/components/scroll.js";
import Rotable from "../../../common/content/js/components/rotable.js";
import Clickables from "../../../common/content/js/components/clickables.js";
import { EVENTS, getClosest } from "../../../common/content/js/lib/utils.js";
import MESSAGES from "../../../common/content/js/components/message-constants.js";

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

export function cbNone(num){
    if(num<0 && swap.disabled === true){
        swap.disabled = false;
    }
}

export function intersectionScreen1(){
    if(!interactions["1"]){
        const values = [0,35,70,110,145,180,215,250,290,325];
        const rightValue = 0;
        const earth = document.querySelector("#s1-earth");
        const text = earth.querySelector("p");
        const cursor = earth.querySelector("#s1-cursor");
        const btValidate = document.querySelector("#s1-button-validate");
        const feedback = document.querySelector("#s1-feedback");
        const dots = document.querySelector("#s1-dots");
        const validate = ()=>{
            btValidate.classList.add("noEvents");
            interactions["1"].dispose();
            const clName = interactions["1"].angleCurrent === rightValue ? "right" : "wrong";
            cursor.classList.add(clName);
            earth.classList.add(clName);
            feedback.classList.add(clName);
            timeline.play("screen-1-feedback");
        }
        interactions["1"] = new Rotable({
            element:cursor,
            snapValues:values,
            angleStart:180,
            transformOrigin: () => {
                const y = dots.offsetHeight/2 + cursor.offsetHeight/2
                return "50% "+y+"px"
            }
        });
        interactions["1"].on(interactions["1"].events.RESET,(event)=>{
            const {data} = event;
            const index = values.indexOf(data);
            text.innerHTML = index;
            feedback.classList.remove("right","wrong");
            cursor.classList.remove("right","wrong");
            earth.classList.remove("right","wrong");
            btValidate.classList.remove("noEvents");
        });
        interactions["1"].on(interactions["1"].events.UP,(event)=>{
            const {data} = event;
            const index = values.indexOf(data);
            text.innerHTML = index;
        });
        interactions["1"].on(interactions["1"].events.MOVE,(event)=>{
            const {data} = event;
            const closest = getClosest(values, data);
            const index = values.indexOf(closest);
            text.innerHTML = index;
        });
        btValidate.addEventListener(EVENTS.CLICK_TOUCH,validate);
    }
    interactions["1"].reset();
}

export function intersectionScreen2(){
    if(!interactions["2"]){
        const datas = [{answer:false},{answer:false},{answer:true},{answer:false}];
        const buttons = document.querySelectorAll(".s2-clickable");
        const btValidate = document.querySelector("#s2-button-validate");
        const feedback = document.querySelector("#s2-feedback");
        interactions["2"] = new Clickables({
            datas: datas,
            buttons: buttons,
            btValidate: btValidate,
            correctionAuto: true
        });
        interactions["2"].on(interactions["2"].events.RESET,()=>{
            feedback.classList.remove("right","wrong");
        });
        interactions["2"].on(interactions["2"].events.END,(event)=>{
            const clName = interactions["2"].success === true ? "right" : "wrong";
            feedback.classList.add(clName);
            timeline.play("screen-2-feedback");
        });
    }
    interactions["2"].reset();
}

export function intersectionScreen3(){
    if(!interactions["3"]){
        const datas = [{answer:false},{answer:false},{answer:false},{answer:true}];
        const buttons = document.querySelectorAll(".s3-clickable");
        const btValidate = document.querySelector("#s3-button-validate");
        const feedback = document.querySelector("#s3-feedback");
        interactions["3"] = new Clickables({
            datas: datas,
            buttons: buttons,
            btValidate: btValidate,
            correctionAuto: true,
            keepSelected: false
        });
        interactions["3"].on(interactions["3"].events.RESET,()=>{
            feedback.classList.remove("right","wrong");
        });
        interactions["3"].on(interactions["3"].events.END,(event)=>{
            const clName = interactions["3"].success === true ? "right" : "wrong";
            feedback.classList.add(clName);
            timeline.play("screen-3-feedback");
        });
    }
    interactions["3"].reset();
}

export function intersectionScreen4(){
    if(!interactions["4"]){
        const datas = [{answer:true},{answer:false},{answer:false},{answer:true},{answer:true},{answer:false}];
        const buttons = document.querySelectorAll(".s4-clickable");
        const btValidate = document.querySelector("#s4-button-validate");
        const feedback = document.querySelector("#s4-feedback");
        interactions["4"] = new Clickables({
            datas: datas,
            buttons: buttons,
            btValidate: btValidate,
            correctionAuto: true,
            keepSelected: false
        });
        interactions["4"].on(interactions["4"].events.RESET,()=>{
            feedback.classList.remove("right","wrong");
        });
        interactions["4"].on(interactions["4"].events.END,(event)=>{
            const clName = interactions["4"].success === true ? "right" : "wrong";
            feedback.classList.add(clName);
            timeline.play("screen-4-feedback");
        });
    }
    interactions["4"].reset();
}

function appReady() {
    swap = app.swap;
    timeline = new Timeline(timelineDatas);
    if(app.navigation.current > 1){
        timeline.stopAt(app.navigation.current-1);
    } else {
        timeline.play();
    }
}

app.on(App.READY, appReady);
app.init();
window.app = app;