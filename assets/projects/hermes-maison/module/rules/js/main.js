import CONFIG from "./config.js";
import App from "../../../common/content/js/app.js";
import {Timeline} from "../../../common/content/js/lib/MotionBroth/MotionBroth.js";
import { timelineDatas } from "./screens.js";
import Cards from "../../../common/content/js/components/cards.js";
import DragDrop from "../../../common/content/js/components/drag-drop.js";
import { getIntersection } from "../../../common/content/js/lib/dom.js";
import MESSAGES from "../../../common/content/js/components/message-constants.js";
import Clickables from "../../../common/content/js/components/clickables.js";
import Slider from "../../../common/content/js/components/slider.js";
import Movable from "../../../common/content/js/components/movable.js";
import Scroll from "../../../common/content/js/components/scroll.js";

const app = new App(CONFIG);
export let timeline = null;
export let swap;
export let interactions = {};

const rules = {
    "3":"footer-subtitle-1",
    "11":"footer-subtitle-2",
    "25":"footer-subtitle-3",
    "40":"footer-subtitle-4",
    "45":"footer-subtitle-5",
    "48":"footer-subtitle-6"
}

function rulesUpdate(current){
    const keys = Object.keys(rules).reverse();
    for(let k=1; k<=keys.length; k++){
        const key = keys[k-1];
        if(current >= parseInt(key)){
            app.sendToFooter({
                type: MESSAGES.FOOTER_UPDATE,
                subtitle: app.jsonsManager.get(rules[key])
            });
            break;
        }
    }
}

export function cbNext(current){
    if(timeline){
        timeline.play();
        rulesUpdate(current)
    }
}

export function cbPrev(current){
    if(timeline){
        timeline.stopAt(current-1);
        rulesUpdate(current);
    }
}

export function cbNone(num){
    if(num<0 && swap.disabled === true){
        swap.disabled = false;
    }
}

export function interactionScreen5(){
    if(!interactions["5"]){
        const cardsWrap = document.querySelector("#s5-cards-wrap");
        const cards = cardsWrap.querySelectorAll(".s5-card");
        const colorPickers = document.querySelectorAll(".s5-color-picker");
        function update(){
            const current = interactions["5"].current - 1;
            for(let c=1; c<=colorPickers.length; c++){
                const colorPicker = colorPickers[c-1];
                colorPicker.classList.remove("focus","unfocus");
                if(c === current){
                    colorPicker.classList.add("focus");
                } else {
                    colorPicker.classList.add("unfocus");
                }
            }
        }
        interactions["5"] = new Cards({
            cards, delayValidation:0,
            current:2
        });
        interactions["5"].on(interactions["5"].events.END,()=>{
            app.navigation.next(true);
        });
        interactions["5"].on(interactions["5"].events.RESET,()=>{
           update(); 
        });
        interactions["5"].on(interactions["5"].events.EACH,()=>{
            update();
        });
    }
    interactions["5"].reset();
}

export function interactionScreen6(){
    if(!interactions["6"]){
        const cardsWrap = document.querySelector("#s6-cards-wrap");
        const cards = cardsWrap.querySelectorAll(".s6-card");
        const colorPickers = document.querySelectorAll(".s6-color-picker");
        function update(){
            const current = interactions["6"].current - 1;
            for(let c=1; c<=colorPickers.length; c++){
                const colorPicker = colorPickers[c-1];
                colorPicker.classList.remove("focus","unfocus");
                if(c === current){
                    colorPicker.classList.add("focus");
                } else {
                    colorPicker.classList.add("unfocus");
                }
            }
        }
        interactions["6"] = new Cards({
            cards, delayValidation:0,
            current:2
        });
        interactions["6"].on(interactions["6"].events.END,()=>{
            app.navigation.next(true);
        });
        interactions["6"].on(interactions["6"].events.RESET,()=>{
            update();
        });
        interactions["6"].on(interactions["6"].events.EACH,()=>{
            update();
        });
    }
    interactions["6"].reset();
}

export function interactionScreen9(){
    if(!interactions["9"]){
        const suggestions = document.querySelectorAll(".s9-suggestion");
        const buttonWrong = document.querySelector("#s9-button-wrong");
        const buttonRight = document.querySelector("#s9-button-right");
        let buttonOverlapped;
        interactions["9"] = new Cards({
            angleMin:330, angleMax:30,
            cards:suggestions,
            rightEl: buttonRight,
            leftEl: buttonWrong,
            gapMin:10,
            datas:[{side:"right"},{side:"right"},{side:"left"},{side:"right"},{side:"right"}],
            mustValidate: true
        });
        interactions["9"].on(interactions["9"].events.END,()=>{
            app.navigation.next(true);
        });
        interactions["9"].on(interactions["9"].events.MOVE,()=>{
            const {cards, current} = interactions["9"];
            const card = cards[current-1].element;
            const wrongOver = getIntersection(buttonWrong,card);
            const rightOver = getIntersection(buttonRight,card);
            if(wrongOver){
                buttonWrong.classList.add("overlapped");
                buttonOverlapped = buttonWrong;
            } else {
                if(buttonWrong.classList.contains("overlapped")){
                    buttonWrong.classList.remove("overlapped");
                }
            }
            if(rightOver){
                buttonRight.classList.add("overlapped");
                buttonOverlapped = buttonRight;
            } else {
                if(buttonRight.classList.contains("overlapped")){
                    buttonRight.classList.remove("overlapped");
                }
            }
        });
        interactions["9"].on(interactions["9"].events.RIGHT,()=>{
            if(!buttonOverlapped){
                buttonOverlapped = buttonRight;
            }
            const {current} = interactions["9"];
            const suggestion = suggestions[current-1];
            suggestion.classList.add("hidden");
            buttonOverlapped.classList.add("right");
        });
        interactions["9"].on(interactions["9"].events.WRONG,()=>{
            if(!buttonOverlapped){
                buttonOverlapped = buttonWrong;
            }
            buttonOverlapped.classList.add("wrong");
        });
        interactions["9"].on(interactions["9"].events.EACH,() =>{
            const {current, cards} = interactions["9"];
            const card = cards[current-1];
            const suggestion = suggestions[current-1];
            suggestion.classList.remove("hidden");
            card.rotable.reset();
            buttonWrong.classList.remove("overlapped","right","wrong");
            buttonRight.classList.remove("overlapped","right","wrong");
        });
        interactions["9"].on(interactions["9"].events.RESET,()=>{
            buttonWrong.classList.remove("overlapped","right","wrong");
            buttonRight.classList.remove("overlapped","right","wrong");
            for(let s=1; s<=suggestions.length; s++){
                const suggestion = suggestions[s-1];
                if(s===1){
                    suggestion.classList.remove("hidden");
                } else {
                    suggestion.classList.add("hidden");
                }
            }
        });
    } else {
        interactions["9"].reset();
    }
    
}

export function interactionScreen23(){
    if(!interactions["23"]){
        const drags = document.querySelectorAll(".s23-drag");
        const drops = document.querySelectorAll("#s22-drop");
        const dropDatas = [{answer:2}];
        interactions["23"] = new DragDrop({
            drags, drops, dropDatas
        });
        interactions["23"].on(interactions["23"].events.END,()=>{
            timeline.play("screen-23-feedback");
        });
        interactions["23"].on(interactions["23"].events.RESET,()=>{
            
        });
    } else {
        interactions["23"].reset();
    }
}

export function interactionScreen31(){
    if(!interactions["31"]){
        const drags = document.querySelectorAll(".s31-drag");
        const drops = document.querySelectorAll("#s30-drop");
        const dropDatas = [{answer:1},{answer:3},{answer:2}];
        interactions["31"] = new DragDrop({
            drags, drops, dropDatas
        });
        interactions["31"].on(interactions["31"].events.END,()=>{
            app.navigation.next(true);
        });
    } else {
        interactions["31"].reset();
    }
}

export function interactionScreen33(){
    if(!interactions["33"]){
        const drags = document.querySelectorAll(".s33-drag");
        const drops = document.querySelectorAll(".s33-drop");
        const dropDatas = [{answer:1},{answer:[3,2]},{answer:[3,2]}];
        const imgs = [
            document.querySelector("#s33-item-3"),
            [document.querySelector("#s33-item-1"),document.querySelector("#s33-item-2-2")],
            [document.querySelector("#s33-item-2"),document.querySelector("#s33-item-1-2")]
        ]
        interactions["33"] = new DragDrop({
            drags, drops, dropDatas, steps:true, dropHostFull:false
        });
        interactions["33"].on(interactions["33"].events.END,()=>{
            app.navigation.next(true);
        });
        interactions["33"].on(interactions["33"].events.RIGHT,(event)=>{
            const {data} = event;
            const {element, num} = data;
            const drag = data.hosting[0];
            const dragElement = drag.element;
            dragElement.style.opacity = 0;
            element.style["clip-path"] = "polygon(-10% -10%, -10% -10%, -10% 110%, -10% 110%)";
            const img = imgs[num-1];
            if(Array.isArray(img)){
                if(num === drag.num){
                    img[1].style.opacity = 1;
                } else {
                    img[0].style.opacity = 1;
                }
            } else {
                img.style.opacity = 1;
            }
            
        });
    } else {
        interactions["33"].reset();
    }
}

export function interactionScreen43(){
    if(!interactions["43"]){
        interactions["43"] = {};
        const buttons = document.querySelectorAll(".s43-clickable");
        interactions["43"].clickables = new Clickables({
            buttons: buttons,
            once: true
        });
        interactions["43"].clickables.on(interactions["43"].clickables.events.SELECTED,(event)=>{
            const {data} = event;
            const {num,element} = data;
            element.classList.add("checked");
            interactions["43"].slider.display(num+1);
        });
        interactions["43"].clickables.on(interactions["43"].clickables.events.RESET,(event)=>{
            interactions["43"].clickables.buttons.forEach((clickable) => {
                clickable.element.classList.remove("checked");
            })
        });
        interactions["43"].slider = new Slider({
            element:document.querySelector("#s43-slider"),
        });
        interactions["43"].slider.on(interactions["43"].slider.events.EACHEND,()=>{
            if(interactions["43"].clickables.success){
                app.navigation.next(true);
                interactions["43"].clickables.desactivate();
            }
        });
    } else {
        interactions["43"].clickables.reset();
        interactions["43"].slider.reset();
    }
}

export function interactionScreen46(){
    if(!interactions["46"]){
        interactions["46"] = {}; 
        const bubble = document.querySelector("#s46-bubble");
        const slider = bubble.querySelector("#s46-slider");
        const btNext = bubble.querySelector("#s46-slider-button-next");
        const btPrev = bubble.querySelector("#s46-slider-button-prev");
        const gauge = bubble.querySelector("#s46-gauge");
        interactions["46"].slider = new Slider({
            element:slider,
            btNext, btPrev, gauge
        });
        interactions["46"].slider.on(interactions["46"].slider.events.END,()=>{
            if(swap){
                swap.disabled = false;
            }
        });
        interactions["46"].slider.on(interactions["46"].slider.events.EACHEND,()=>{
            interactions["46"].swap.disabled = false;
        });
        interactions["46"].slider.on(interactions["46"].slider.events.EXTREME,()=>{
            interactions["46"].swap.disabled = false;
        });
        interactions["46"].swap = new Scroll({
            positionReceiver:document.querySelector("#s46-container"),
            helper:false,
            axis:"x",
            difference:50
        });
        interactions["46"].swap.on(interactions["46"].swap.events.SCROLL_UP,()=>{
            interactions["46"].slider.prevSlide();
        });
        interactions["46"].swap.on(interactions["46"].swap.events.SCROLL_DOWN,()=>{
            interactions["46"].slider.nextSlide();
        });
    } else {
        interactions["46"].slider.reset();
        interactions["46"].swap.addEvents();
    }
}

export function interactionScreen50(){
    if(!interactions["50"]){
        const drags = document.querySelectorAll(".s50-drag");
        const drops = document.querySelectorAll(".s50-drop");
        const dropDatas = [{answer:3}];
        interactions["50"] = new DragDrop({
            drags, drops, dropDatas, once: true
        });
        interactions["50"].on(interactions["50"].events.END,(event)=>{
            drops[0].setAttribute("plaid",3);
            drops[0].classList.remove("wrong");
            drops[0].classList.add("right");
            timeline.play("screen-50-right");
        });
        interactions["50"].on(interactions["50"].events.ATTEMPT,(event)=>{
            const {data} = event;
            const {num} = data;
            drops[0].setAttribute("plaid",num);
            drops[0].classList.add("wrong");
            if(timeline.getStep("screen-50-wrong").forwarded === 0){
                timeline.play("screen-50-wrong");
            }
        });
        interactions["50"].on(interactions["50"].events.RESET,()=>{
            drops[0].removeAttribute("plaid");
            drops[0].classList.remove("wrong");
            drops[0].classList.remove("right");
        });
    } else {
        interactions["50"].reset();
    }
}

export function interactionScreen55(){
    if(!interactions["55"]){
        const buttons = document.querySelectorAll(".s55-clickable");
        interactions["55"] = new Clickables({
            buttons: buttons,
            datas:[{answer:false},{answer:true},{answer:false}],
            steps: true, delayAfterAttempt:900
        });
        interactions["55"].on(interactions["55"].events.END,(event)=>{
            timeline.play("screen-55-feedback");
        });
    } else {
        interactions["55"].reset();
    }
}

export function interactionScreen56(){
    if(!interactions["56"]){
        const element = document.querySelector("#s56-dot");
        const plaid = document.querySelector("#s56-plaid-1");
        const boundariesEl = element.parentNode;
        const boundaries = {
            x:{
                min:boundariesEl,
                max:boundariesEl
            },
            y:{
                min:0,
                max:0
            }
        }
        const right = [34,75];
        function update(percents){
            const {x} = percents;
            plaid.style.translate = x+"% 0%";
        }
        interactions["56"] = new Movable({
            element, boundaries
        });
        interactions["56"].on(interactions["56"].events.UP,()=>{
            const {x} = interactions["56"].percents;
            if(x>=right[0] && x<=right[1]){
                interactions["56"].enabled = false;
                interactions["56"].removeEvents();
                timeline.play("screen-56-feedback");
            }
        });
        interactions["56"].on(interactions["56"].events.MOVE,()=>{
            update(interactions["56"].percents);
        });
    } else {
        interactions["56"].reset();
    }
}

function appReady() {
    //alert(window.document.body.offsetWidth+ "    "+window.document.body.offsetHeight);
    swap = app.swap;
    timeline = new Timeline(timelineDatas);
    if(app.navigation.current > 1){
        timeline.stopAt(app.navigation.current-1);
    } else {
        timeline.play();
    }
    rulesUpdate(app.navigation.current);
}

app.on(App.READY, appReady);
app.init();