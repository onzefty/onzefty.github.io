
import { Animations } from "./MotionBroth.js";

const TimelineOptions = {
    triggers:{
        start: () => { },
        end: () => { },
        progress: () => { },
        reset: () => { },
        render: () => { }    
    } 
};
//Les éléments des lines des Steps doivent être dans l'ordre, en particulier pour le calcul des delays 'next' | 'same' | '+1000'
//Les unités doivent idéalement correspondre à celles mises dans elements (sauf cas scale/opacity/skew/rotate)
//Timeline contenant n Step(s)
export class Timeline {
    constructor(options = {}){
        if (!options.steps) {
            return console.error("La propriété [steps] n'est pas renseignée ou est invalide.");
        }
        this.triggers = {
            ...TimelineOptions.triggers,
            ...options.triggers
        };
        this.status = "normal"; 
        this.registered = null;
        this.currentIndex = -1;
        //steps: contient toutes les étapes de la Timeline (certaines étapes peuvent être joués indépendamment de la ligne principale)
        this.steps = options.steps;
        //line: Ligne principale contenant toutes les étapes dans l'ordre (tous les Steps créés n'ont pas besoin d'être dans la ligne principale)
        this.line = this.setLine(Array.isArray(options.line) ? options.line : Object.keys(options.steps));
        if(Object.keys(this.steps).length===0){
            return console.error("Aucune des étapes fournies n'est valide");
        }
        this.reset();
    }

    get total(){
        return this.line.length;
    }

    setLine(tab) {
        const newTab = []
        for (let t = 1; t <= tab.length; t++) {
            let el = tab[t - 1]
            if (typeof el === "string") {
                el = { [el]: 0}
            }
            const steps = [];
            for(let prop in el){
                if(!this.steps[prop]){
                    console.warn("Le nom d'étape ",prop," n'existe pas dans l'objet steps définis dans les paramètres")
                    delete el[prop]
                } else {
                    const datas = {
                        name:prop,
                        additionnalDelay:el[prop]==="ignored" ? 0 : el[prop],
                        ignored:el[prop]==="ignored",
                        reversed:false,
                        ...this.steps[prop]
                    }
                    const step = this.createStep(datas,datas.additionnalDelay!=="ignored");
                    step.render();
                    steps.push(step);
                }
            }
            if(Object.keys(el).length === 0){
                console.warn("Aucune bonne étape valide")
                continue
            }
            newTab.push(steps)
        }
        return newTab
    }

    createStep(options,staged) {
        const newOptions = {
            ...options
        };
        newOptions.unstaged = !staged;
        return new Animations(newOptions);
    }

    getStep(name) {
        for(let l=this.line.length; l>=1; l--){
            const steps = this.line[l-1]
            for(let s=steps.length; s>=1; s--){
                const step = steps[s-1]
                if(step.name===name){
                    return step;
                }
            }
        }
    }

    reset(){
        //Remet à 0 toutes les étapes
        for(let l=this.line.length; l>=1; l--){
            const steps = this.line[l-1]
            steps.forEach((step)=> {
                step.reset();
            })
        }
        this.currentIndex = -1;
        return this;
    }

    play(el, force, isIgnored) {
        let currentLine;
        const promises = [];
        let flagUnstaged = false;
        if (el === undefined) {
            el = this.currentIndex+1;
            currentLine = this.line[this.currentIndex + 1];
        }
        else if (typeof el === "string") {
            const stepUnstaged = this.getStep(el);
            if(stepUnstaged){
                stepUnstaged.update();
                stepUnstaged.play();
                flagUnstaged = true;
            } else {
                const obj = {
                    name:el,
                    additionnalDelay:0,
                    ...this.steps[el]
                }
                currentLine = [this.createStep(obj,false)];
            }  
        }
        else if (typeof el === "number") {
            currentLine = this.line[el];
        }
        else if (typeof el === "object") {
            currentLine = [el];
        } else {
            currentLine = null;
        }
        if (this.canPlay(force) && Array.isArray(currentLine) && flagUnstaged===false) {
            if (!isIgnored) {
                this.status = "forwards";
            }
            currentLine.forEach((step) => {
                if(step.ignored === false){
                    step.resume("forwards");
                    promises.push(step.promise);    
                }
            });
            return Promise.all(promises).then(() => {
                this.status = "normal"
                if (typeof el === "number") {
                    this.currentIndex = el
                }
                this.triggers.end();
            })    
        }
    }

    rewind(num) {
        const to = typeof num === "number" ? num : this.currentIndex;
        const currentLine = this.line[to];
        const promises = [];
        if (this.canPlay() && Array.isArray(currentLine)) {
            this.status = "backwards";
            currentLine.forEach((step) => {
                if(step.paused===false && step.ignored===false){
                    step.resume("backwards");
                    promises.push(step.promise);
                } 
            });
            return Promise.all(promises).then((resolve, reject) => {
                this.status = "normal";
                this.currentIndex = Math.max(-1, this.currentIndex - 1);
                this.triggers.end();
            }) ;
        }
    }

    next(){
        const to = Math.min(this.currentIndex+1,this.total-1);
        this.stopAt(to);
    }

    previous(){
        const to = Math.max(this.currentIndex-1,-1);
        this.stopAt(to);
    }

    playFrom(num) {
        if (this.status === "normal") {
            this.stopAt(num - 1, false);
            this.play();
        }
    }

    stopAt(reach, noForwardsEnd) {
        if(this.playing){
            this.stopPlaying();
        }
        if (this.status === "normal" || this.status === "stop") {
            this.status = "rendering";
            this.render(reach, noForwardsEnd);
            this.triggers.end();
            this.status = "normal";
        }
        return this;
    }

    render(num,noForwardsEnd) {
        const to = typeof num === "number" ? num : this.currentIndex;
        const from = this.currentIndex;
        let flagRender = false;
        for(let l=from; l>=0; l--){
            const steps = this.line[l];
            if(l>to && steps){
                steps.forEach((step)=> {
                    console.log("resetting step => ",step.name);
                    //if(step.finished===true){
                        step.reset();
                    //}
                });
            } 
        }
        for(let l=(from+1); l<=to; l++){
            const steps = this.line[l];
            if(steps){
                flagRender = true;
                steps.forEach((step)=> {
                    console.log("rendering step => ",step.name);
                    if(step.ignored === true){
                        step.reset();
                    } else {
                        step.render();
                        if (l === to && noForwardsEnd === undefined) {
                            step.triggers.end();
                        }    
                    } 
                });
            }
        }
        this.currentIndex = num;
        const steps = this.line[this.currentIndex];
        if(steps && flagRender===false){
            steps.forEach((step)=> {
                console.log("rendering current step => ",step.name);
                if(step.ignored === true){
                    step.reset();
                } else {
                    step.render();
                    step.triggers.end();    
                } 
            });
        }
    } 

    canPlay(force){
        return !this.playing || force
    }

    get playing() {
        const toReturn = [];
        for(let l=this.total; l>=1; l--){
            const steps = this.line[l-1];
            steps.forEach((step)=> {
                if (step.playing !== false) {
                    toReturn.push(step);
                }
            });
        }
        return toReturn.length > 0 ? toReturn : false;
    }

    stopPlaying() {
        for(let l=this.total; l>=1; l--){
            const steps = this.line[l-1];
            steps.forEach((step)=> {
                if(step.playing!==false){
                    step.pause();
                }
            });
        }
        this.registered = this.status;
        this.status = "stop";
        return this;
    }
        
}