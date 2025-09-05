import CONFIG from "./config.js";
import App from "../../../common/content/js/app.js";
import { EVENTS } from "../../../common/content/js/lib/utils.js";
import { getIntersection } from "../../../common/content/js/lib/dom.js";
import Component from "../../../common/content/js/components/component.js";
import ShelfManager from "../../../common/content/js/components/shelves/shelf-manager.js";
import View from "./view.js";
import html2canvas from "../../../common/content/js/lib/html2canvas.esm.js";
import { getScore } from "./rules.js";
import { TEMPLATES } from "./templates.js";

const app = new App(CONFIG);
const elements = {};
let templateIndex = -1;

export const sizes = (iPad) => {
    return {
        bgSize:{
            width:1125,
            height:iPad?1619:2436
        },
        dropSize:{
            width:918,
            height:iPad?96:141
        },
        dropPositions: [
            iPad?360:546,
            iPad?661:997,
            iPad?955:1439,
            iPad?1244:1875,
        ]
    }
}

function appReady() {
    //alert(window.document.body.offsetWidth+ "    "+window.document.body.offsetHeight);
    //DOMS Elements
    elements.analyzing = document.querySelector("#analyzing");
    elements.startContainer = document.querySelector("#start-container");
    elements.resultsContainer = document.querySelector("#results-container");
    elements.vmContainer = document.querySelector("#vm-container");
    elements.slots = elements.vmContainer.querySelectorAll(".slot");
    elements.vmView = elements.vmContainer.querySelector("#vm-view");
    elements.buttonAnalyze = elements.vmContainer.querySelector("#vm-button-analyze");
    //Components
    elements.analyzingComponent = new Component({element:analyzing});
    elements.startComponent = new Component({element:elements.startContainer});
    elements.resultsComponent = new Component({element:elements.resultsContainer});
    elements.vmContainerComponent = new Component({element:elements.vmContainer});
    
    //Inits
    startInit();
    startUpdate();
    vmInit();
    resultsInit();
    //Rendering
    elements.analyzingComponent.hide();
    elements.resultsComponent.hide();
    elements.vmContainerComponent.hide();
}

function startInit(){
    elements.templateEls = elements.startContainer.querySelectorAll(".start-template");
    const parsedDatas = app.scorm.parsedDatas[app.currentFileId-1];
    const array = parsedDatas[parsedDatas.length-1];
    array.forEach((templateScore,index)=>{
        const templateEl = elements.templateEls[index];
        if(templateEl){
            templateEl.addEventListener(EVENTS.CLICK_TOUCH,()=>{
                applyTemplate(index).then(()=>{
                    elements.analyzingComponent.hide();
                });
            });
        }
    });
}

function startUpdate(){
    const parsedDatas = app.scorm.parsedDatas[app.currentFileId-1];
    const array = parsedDatas[parsedDatas.length-1];
    array.forEach((templateScore,index)=>{
        const templateEl = elements.templateEls[index];
        switch(templateScore){
            case "na":
                templateEl.setAttribute("state","locked");
            break;
            case "-1":
                templateEl.setAttribute("state","unlocked");
            break;
            default:
                templateEl.setAttribute("state","score");
                const scorePoints = templateEl.querySelector(".start-score-points");
                scorePoints.innerHTML = templateScore+"%";
            break;
        }
    });
}

function vmInit(){
    //Etagères
    elements.shelfMan = new ShelfManager({
        elements:elements.slots
    });
    elements.shelfMan.on(elements.shelfMan.events.SHELF_ISCLICKED,()=>{
        elements.view.component.show();
    });
    elements.shelfMan.on(elements.shelfMan.events.SHELF_MOVE,()=>{
        if(elements.shelfMan.enabled){
            elements.shelfMan.enabled = false;
        }
    });
    elements.shelfMan.on(elements.shelfMan.events.SHELF_DROPPED,()=>{
        //Si l'étagère survole une autre étagère, alors les objets de la composition sont alternés entre les deux compositions
        const {shelves, composition} = elements.shelfMan;
        const {level} = composition;
        for(const [id,datas] of shelves){
            if(id != composition.id){
                const intersection = getIntersection(composition.options.element,datas.options.element);
                //Les 2 premières étagères (niveau 1) sont plus grandes que le reste, donc on ne peut pas permuter entre les niveaux 1 et le reste (vice versa)
                const levelCondition = (level===1 && datas.level===1 || level!==1 && datas.level!==1);
                // Les cellules servant de TEMPLATE ne peuvent pas être écrasables
                const templateCondition = !datas.isTemplate;
                if(intersection && levelCondition && templateCondition){
                    if(intersection.percentX > 50 && intersection.percentY > 50){
                        const compositionItems = [...composition.items];
                        const compositionSource = composition.source;
                        const compositionSourceUp = composition.sourceUp;
                        const targetItems = [...datas.items];
                        const targetSource = datas.source;
                        const targetSourceUp = datas.sourceUp;

                        composition.items = targetItems;
                        datas.items = compositionItems;


                        composition.addSrc(targetSourceUp,"up");
                        composition.addSrc(targetSource);
                        composition.movable.update();

                        datas.addSrc(compositionSourceUp,"up");
                        datas.addSrc(compositionSource);
                        datas.movable.update();
                    }
                }   
            }  
        }
        composition.movable.reset();
        elements.shelfMan.composition = null;
        elements.shelfMan.enabled = true;
        
    });
    //Vue (interieur d'une étagère pour le placement des objets)
    const items = app.jsonsManager.get("items");
    elements.view = new View({
        element:elements.vmView,
        items:items,
        names:app.jsonsManager.get(/item\-[0-9]+\-name/g)
    });
    elements.view.on(elements.view.events.SCREENSHOT, async ()=>{
        elements.view.options.element.classList.add("unavailable");
        if(elements.shelfMan.composition.items.length > 0){
            //SCREENSHOT
            // const className = shelfMan.composition.level < 3 ? "up" : null;
            // const classNameOpposite = className === "up" ? null : "up";
            // const type = classNameOpposite === "up" ? "top" : "bottom";
            // //SCREENSHOT 1
            // view.composition.setAttribute("screenshot","true");
            // const canvas1 = await html2canvas(view.composition,{
            //     backgroundColor:null
            // });
            // const src1 = canvas1.toDataURL('image/png', 1.0);
            // shelfMan.composition.addSrc(src1,className);
            // view.composition.removeAttribute("screenshot");
            // view.composition.setAttribute("y",type);
            // shelfMan.composition.items.forEach((itemDatas) => {
            //     const {containedBy} = itemDatas;
            //     if(containedBy){
            //         const {grid,item} = containedBy;
            //         const {containable} = item;
            //         grid.options.element.style.height = containable.height;
            //         grid.options.element.style.bottom = containable.bottom;
            //     }
            // });
            elements.view.composition.setAttribute("screenshot","true");
            const canvas2 = await html2canvas(elements.view.composition,{
                backgroundColor:null
            });
            const src2 = canvas2.toDataURL('image/png', 1.0);
            elements.shelfMan.composition.addSrc(src2/*,classNameOpposite*/);
            elements.view.composition.removeAttribute("screenshot");
            //console.log(shelfMan.composition.height);
            elements.view.clear();
            elements.buttonAnalyze.style.display = "";
            //register();
        } else {
            elements.shelfMan.composition.addSrc(null);
        }
        elements.shelfMan.composition.movable.disabled = false;
        //shelfMan.composition = null;
        elements.view.component.hide();
    })
    elements.view.component.on(elements.view.component.events.SHOW,()=>{
        elements.buttonAnalyze.style.display = "none";
        elements.shelfMan.composition.movable.disabled = true;
        elements.view.axis = elements.shelfMan.composition.axis;
        elements.view.level = parseInt(elements.shelfMan.composition.level);
        elements.view.composition.setAttribute("axis",elements.shelfMan.composition.axis);
        elements.view.composition.setAttribute("level",elements.shelfMan.composition.level);
        elements.view.items = [...elements.shelfMan.composition.items];
        //UPDATE DES ITEMS PRESENT OU NON
        elements.view.render();
        elements.view.categoryDisplay();
    });
    elements.view.component.on(elements.view.component.events.DISPLAY,()=>{
        elements.buttonAnalyze.style.display = "none";
        elements.view.axis = elements.shelfMan.composition.axis;
        elements.view.level = parseInt(elements.shelfMan.composition.level);
        elements.view.composition.setAttribute("axis",elements.shelfMan.composition.axis);
        elements.view.composition.setAttribute("level",elements.shelfMan.composition.level);
        elements.view.render();
    });
    elements.view.component.on(elements.view.component.events.HIDE,()=>{
        elements.buttonAnalyze.style.display = "";
    });
    elements.view.on(elements.view.events.ITEM_PLACED,()=>{
        elements.shelfMan.composition.items = [...elements.view.items];
    });
    elements.view.on(elements.view.events.ITEM_DELETED,()=>{
        elements.shelfMan.composition.items = [...elements.view.items];
        if(elements.shelfMan.composition.items.length === 0){
            elements.shelfMan.composition.movable.disabled = true;
        }
    });

    elements.buttonAnalyze.addEventListener(EVENTS.CLICK_TOUCH,()=>{
        elements.resultsComponent.show();
    });
}

function vmRestart(){
    elements.resultsComponent.hide();
    applyTemplate(templateIndex).then(()=>{
        elements.analyzingComponent.hide();
    });
}

function vmNext(){
    elements.resultsComponent.hide();
}

function vmReturn(){
    elements.analyzingComponent.hide();
    elements.resultsComponent.hide();
    elements.vmContainerComponent.hide();
    elements.startComponent.show();
}

function resultsInit(){
    elements.resultScore = elements.resultsContainer.querySelector(".results-score");
    elements.resultsFeedback1 = elements.resultsContainer.querySelector("#results-feedback-1");
    elements.resultsFeedback2 = elements.resultsContainer.querySelector("#results-feedback-2");
    elements.resultsSVG = elements.resultsContainer.querySelector("#results-top-svg");
    elements.resultsPath = elements.resultsSVG.querySelector("#results-svg-path-levels");
    elements.resultsRuleEls = elements.resultsContainer.querySelectorAll(".results-rule");
    elements.resultsButtons = elements.resultsContainer.querySelector("#results-buttons");
    elements.resultsButtonRestart = elements.resultsButtons.querySelector("#results-button-restart");
    elements.resultsButtonNext = elements.resultsButtons.querySelector("#results-button-next");
    elements.resultsButtonReturn = elements.resultsButtons.querySelector("#results-button-return");

    for(let r=1; r<=elements.resultsRuleEls.length; r++){
        const resultsRuleEl = elements.resultsRuleEls[r-1];
        resultsRuleEl.setAttribute("state","close");
        const rule = resultsRuleEl.getAttribute("data-rule");
        const resultRuleButton = resultsRuleEl.querySelector(".button");
        const ruleDetailsEl = resultsRuleEl.querySelector(".rules-details");
        resultRuleButton.addEventListener(EVENTS.CLICK_TOUCH,()=>{
            if(ruleDetailsEl.children.length === 0){
                return;
            }
            const state = resultsRuleEl.getAttribute("state");
            if(state === "open"){
                resultsRuleEl.setAttribute("state","close");
                elements.resultsButtons.classList.remove("unavailable");  
            } else {
                const openEl = resultsRuleEl.parentNode.querySelector("[state='open']");
                if(openEl){
                    //elements.resultsButtons
                    openEl.setAttribute("state","close");
                }
                resultsRuleEl.setAttribute("state","open");
                elements.resultsButtons.classList.add("unavailable");    
            }
        });
    }

    elements.resultsPath.style["stroke-dasharray"] = elements.resultsPath.getTotalLength();

    elements.resultsButtonRestart.addEventListener(EVENTS.CLICK_TOUCH,vmRestart);
    elements.resultsButtonNext.addEventListener(EVENTS.CLICK_TOUCH,vmNext);
    elements.resultsButtonReturn.addEventListener(EVENTS.CLICK_TOUCH,vmReturn);

    elements.resultsComponent.on(elements.resultsComponent.events.SHOW,()=>{
        resultsUpdate();
    });
}

function resultsUpdate(){
    const analysis = getScore(elements.shelfMan.shelves);
    const {score,obj} = analysis;

    elements.resultScore.innerHTML = score;

    for(let r=1; r<=elements.resultsRuleEls.length; r++){
        const resultsRuleEl = elements.resultsRuleEls[r-1];
        const rule = resultsRuleEl.getAttribute("data-rule");
        const ruleScoreEl = resultsRuleEl.querySelector(".results-rule-score");
        const ruleDetailsEl = resultsRuleEl.querySelector(".rules-details");
        let ruleScore = 25;
        ruleDetailsEl.innerHTML = "";
        if(obj[rule]){
            obj[rule].forEach((malus)=>{
                const {value,json} = malus;
                const malusEl = document.createElement("p");
                let text = "";
                if(Array.isArray(json)){
                    json.forEach((jsonPart,index)=>{
                        if(typeof jsonPart === "string"){
                            const translation = app.jsonsManager.get(jsonPart);
                            if(translation){
                                text+= translation;
                            } else {
                                text += jsonPart;
                            }
                        } else {
                            text+= jsonPart;
                        }
                        if(index < json.length-1 && jsonPart !== "<br>"){
                            text+="&nbsp;";
                        }
                    });
                } else {
                    text = app.jsonsManager.get(json);
                }
                malusEl.innerHTML = text;
                ruleScore = Math.max(0,ruleScore-value);
                ruleDetailsEl.append(malusEl);
            });
            ruleScoreEl.innerHTML = (ruleScore/25*100)+"%";
        } else {
            ruleScoreEl.innerHTML = "100%"
        }
    }

    const scoreTxt1 = score >= 80 ? "results-feedback-success-1": "results-feedback-fail-1"; 
    const scoreTxt2 = score >= 80 ? "results-feedback-success-2": "results-feedback-fail-2"; 
    elements.resultsFeedback1.innerHTML = app.jsonsManager.get(scoreTxt1);
    elements.resultsFeedback2.innerHTML = app.jsonsManager.get(scoreTxt2);
    const value = (100-score)/100 * elements.resultsPath.getTotalLength();
    elements.resultsPath.style["stroke-dashoffset"] = value;

    //UPDATE SCORM
    const parsedDatas = app.scorm.parsedDatas[app.currentFileId-1];
    const array = parsedDatas[parsedDatas.length-1];
    array[templateIndex] = score;
    if(score >=80){
        if(array[templateIndex+1] && array[templateIndex+1] === "na"){
            array[templateIndex+1] = "-1";
        }
    }
    app.scorm.parsedDatas[app.currentFileId-1][parsedDatas.length-1] = array;
    app.scorm.save(true);
    startUpdate();
}

async function applyTemplate(index){
    const template = TEMPLATES[index];
    if(template){
        templateIndex = index;
        elements.view.empty();
        elements.shelfMan.clear();
        elements.vmContainerComponent.show();
        elements.analyzingComponent.show();
        elements.startComponent.hide();

        for(const [shelfName,composition] of elements.shelfMan.shelves){
            composition.options.element.setAttribute("movable","true");
            if(template[shelfName]){
                composition.options.element.setAttribute("movable","false");
                elements.view.items = [];
                elements.shelfMan.composition = composition;
                elements.view.component.display();
                const array = template[shelfName];
                for(let i=1; i<=array.length; i++){
                    const item = array[i-1];
                    const {reference,box,state,containedBy} = item;
                    let grid;
                    if(containedBy){
                        const container = elements.shelfMan.composition.items.filter((it)=>{
                            if(it.template === containedBy){
                                return it;
                            }
                        });
                        if(container[0]){
                            grid = container[0].grid;
                            grid.item = container[0];
                        }
                    } else {
                        grid = elements.view.grid;
                    }
                    elements.view.itemSelected = await elements.view.itemCreate(reference);
                    if(state && state!="layed"){
                        elements.view.itemRotate();    
                    }
                    const {width,depth} = elements.view.itemSelected.dimensions;
                    const boxes = grid.getBoxesByFrom(box,width,depth);
                    boxes.forEach((box) => {
                        box.state = "item";
                    });
                    elements.view.itemSelected.containedBy = grid.item;
                    elements.view.itemSelected.boxes = boxes;
                    elements.view.itemSelected.status = "normal";
                    elements.view.itemSelected.place();
                    elements.view.itemSelected.template = shelfName+"-"+i;
                    elements.view.items.push(elements.view.itemSelected);
                    elements.shelfMan.composition.items = [...elements.view.items];
                }
                elements.view.composition.setAttribute("screenshot","true");
                const canvas2 = await html2canvas(elements.view.composition,{
                    backgroundColor:null
                });
                const src2 = canvas2.toDataURL('image/png', 1.0);
                elements.shelfMan.composition.addSrc(src2/*,classNameOpposite*/);
                elements.view.composition.removeAttribute("screenshot");
                elements.view.itemSelected = null;
                elements.view.clear();
            }
        }
        elements.view.component.hide();
    }
}

app.on(App.READY, appReady);
app.init();
//TEMP
window.app = app;