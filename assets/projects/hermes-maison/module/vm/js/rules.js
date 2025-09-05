import { compositionGridSize, CATEGORIES } from "./view.js";

const RULES = ["colors","diversity","dynamism","integrity"/*,"transversality"*/];
const MAX = 100/(RULES.length-1);

//FUNCTIONS
export function getScore(shelves){
    let score = 100;
    const obj = {};
    RULES.forEach((rule) => {
        let datas;
        switch(rule){
            case "colors":
                datas = colorsPoints(shelves);
            break;
            case "diversity":
                datas = diversityPoints(shelves);
            break;
            case "dynamism":
                datas = dynamismPoints(shelves);
            break;
            case "integrity":
                datas = integrityPoints(shelves);
            break;
        }
        if(datas){
            const values = ruleGetValues(datas);
            const {value,array} = values;
            if(value === 0){
                console.log("La règle",rule,"a été respectée !");
            } else {
                console.warn("La règle",rule,"n'a pas été respectée !!!");
                obj[rule] = array;
                //console.log(array);
            }
            score-=value;
        }
    });
    score = score.toFixed(0);
    console.log("Score obtenu pour cette VM",score);
    console.log(shelves);
    return {obj, score};
}

function ruleGetValues(array = []){
    let count = 0;
    array.forEach((element) => {
        if(Array.isArray(element)){
            count+= element.reduce((total,malus)=>total+=malus.value,0);
        } else {
            count+=element.value;
        }
    });
    return {
        value:Math.min(MAX,count),
        array
    };
}

// 1) COLORS
// -- ANY MIN/MAX OF PATTERNS UNRESPECTED
// -- UNBALANCE OF PATTERNS
export const COLORSDATAS = {
    "vive":{
        min:2,
        max:3,
        list:["bleu","vert","jaune","orange","rouge","rose"]
    },
    "neutre":{
        min:1,
        max:Infinity,
        list:["beige","bois clair","bois foncé","bois moyen","gris","cuir gold","osier","transparent","naturel","blanc"]
    }
}

function colorsPoints(shelves){
    const colorsFound = {"vive":{list:[],keys:[],counts:{}},"neutre":{list:[],keys:[],counts:{}}};
    const array = [];
    for(const [key,shelf] of shelves){
        const {colors} = shelf;
        const counts = {"vive":0,"neutre":0};
        for(const pattern in COLORSDATAS){
            const datas = COLORSDATAS[pattern];
            const {list} = datas;
            colors.forEach((color)=>{
                if(list.includes(color)){
                    counts[pattern]++;
                    if(!colorsFound[pattern].list.includes(color)){
                        colorsFound[pattern].list.push(color);
                    }
                    if(!colorsFound[pattern].counts[color]){
                        colorsFound[pattern].counts[color] = 1;
                    } else {
                        colorsFound[pattern].counts[color]++;
                    }
                }
            });
        }
        if(counts["vive"] > counts["neutre"]){
            colorsFound["vive"].keys.push(key);
        }
        if(counts["vive"] < counts["neutre"]){
            colorsFound["neutre"].keys.push(key);
        }
    }
    colorsFound["vive"].counts = Object.fromEntries(
        Object.entries(colorsFound["vive"].counts)
          .sort(([, a], [, b]) => b - a)
    );
    //console.log(colorsFound["vive"].counts)
    // -- ANY MIN/MAX OF PATTERNS UNRESPECTED
    for(const pattern in COLORSDATAS){
        const datas = COLORSDATAS[pattern];
        const {min,max} = datas;
        const count = colorsFound[pattern].list.length;
        const rateMax = (count-max);
        const rateMin = count-min;
        //Trop de couleurs
        // if(rateMax > 0){
        if(count > max) {
            const keys = Object.keys(colorsFound[pattern].counts);
            const condition = colorsFound["vive"].counts[keys[2]] === colorsFound["vive"].counts[keys[3]];
            if(condition){
                const json = ["rule-color-pattern-1-max","<br>","rule-color-pattern-1-array","<br>",colorsFound[pattern].list.join(" / ")];
                const value = 10;
                array.push({
                    value, json
                });
            } 
        }
        //Pas assez de couleurs
        if(rateMin < 0){
            const pattern1 = pattern === "vive" ? "rule-color-pattern-1-min" : "rule-color-pattern-2-min";
            const pattern2 = pattern === "vive" ? "rule-color-pattern-1-number" : "rule-color-pattern-2-number";
            const json = [pattern1,"<br>",pattern2,count];
            const value = pattern === "vive" ? 10 : 5;
            array.push({
                value, json
            });
        }
        // console.log("nombre de couleurs",pattern,": ",count);
        // console.log("taux max",rateMax);
        // console.log("taux min",rateMin);
    }

    // -- UNBALANCE OF PATTERNS
    const gap = colorsFound["neutre"].keys.length - colorsFound["vive"].keys.length;
    if(gap > Math.ceil(shelves.size/2)){
        const count1 = colorsFound["vive"].list.length;
        const count2 = colorsFound["neutre"].list.length;
        const json = ["rule-color-patterns","<br>","rule-color-pattern-1-number",count1,"<br>","rule-color-pattern-2-number",count2];
        const value = 5;
        array.push({
            json, value
        });
    }
    return array;
}
// 2) DIVERSITY
const ROOMS = ["salon","bureau","salle à manger","chambre","salle de bain"];
// -- EMPY SLOTS
// -- LACK OF ONE ROOM IN ANY SLOT
// -- REPETITION OF TOO MUCH SAME-STYLE ITEMS
// -- 'SALLE DE BAIN' ELEMENTS ARE SLOT-UNFRIENDLY
// -- 'SALLE DE BAIN'-DEDICATED SLOTS MUST NOT EXCEED 2
// -- ALL CATEGORIES MUST BE PRESENT
function diversityPoints(shelves){
    const array = [];
    const roomsDisplayed = {};
    const categoriesDisplayed = [];
    const references = new Map();
    const slotsEmpty = [];
    const salleDeBainOnly = [];
    for(const [key,shelf] of shelves){
        const {items,rooms} = shelf;
        if(items.length === 0){
            slotsEmpty.push(key);
            continue;
        }
        if(rooms){
            rooms.forEach((room) => {
                if(!roomsDisplayed[room]){
                    roomsDisplayed[room] = [key];
                } else {
                    if(!roomsDisplayed[room].includes(key)){
                        roomsDisplayed[room].push(key);
                    } 
                }
            });
            // -- 'SALLE DE BAIN' ELEMENTS ARE SLOT-UNFRIENDLY
            if(rooms.includes("salle de bain") && rooms.length > 1){
                salleDeBainOnly.push(key);
                // const text = "Malus obtenu car la cellule "+key+" possède des objets de salle de bain mais aussi d'autres pièces.";
                // const value = 5;
                // array.push({
                //     json,value
                // });
            }
        }
        items.forEach((item) => {
            const {reference,datas} = item;
            const {category,name} = datas;
            if(!categoriesDisplayed.includes(category)){
                categoriesDisplayed.push(category);
            }
            if(references.get(reference)){
                let count = references.get(reference).count;
                count++;
                references.set(reference,{name,count});
            } else {
                references.set(reference,{name,count:1});
            }
        });
    }

    // -- EMPY SLOTS
    if(slotsEmpty.length > 0){
        const count = slotsEmpty.length;
        const json = ["rule-diversity-empty",count];
        const value = 25;
        array.push({
            json,value
        });
    }
    
    // -- LACK OF ONE ROOM IN ANY SLOT
    ROOMS.forEach((room) => {
        if(!roomsDisplayed[room]){
            const json = ["rule-diversity-missing-1",room.replace(/\s/g,"-"),"rule-diversity-missing-2"];
            const value = 10;
            array.push({
                json,value
            });
        }
    });

    // -- REPETITION OF TOO MUCH SAME-STYLE ITEMS
    for(const [key,obj] of references){
        if(obj.count > 1){
            const json = ["rule-diversity-repetition-1",obj.name,obj.count,"rule-diversity-repetition-2"];
            const value = 5;
            array.push({
                json,value
            });
        }
    }

    // -- ALL CATEGORIES MUST BE PRESENT
    if(CATEGORIES.length != categoriesDisplayed.length){
        const missed = CATEGORIES.filter((category) => !categoriesDisplayed.includes(category));
        const json = ["rule-diversity-categories-1"].concat(missed);
        const value = 10;
        array.push({
            json,value
        });
    }

    // -- 'SALLE DE BAIN'-DEDICATED SLOTS MUST NOT EXCEED 2
    if(roomsDisplayed["salle de bain"] && roomsDisplayed["salle de bain"].length > 2){
        const json = [roomsDisplayed["salle de bain"].length,"rule-diversity-salle-de-bain-max-1"];
        const value = 4;
        array.push({
            json,value
        });
    }

    // -- 'SALLE DE BAIN' ELEMENTS ARE SLOT-UNFRIENDLY
    if(salleDeBainOnly.length > 0){
        const json = ["rule-diversity-salle-de-bain-only",salleDeBainOnly.length];
        const value = 5;
        array.push({
            json,value
        });
    }

    return array;
}

// 3) DYNAMISM
// -- ALIGNED SAME SIDED
// -- ITEMS STUCK AT EXTREMES OPPOSITE SIDES
// -- SURFACE MINIMUM NOT CHECKED
function dynamismPoints(shelves){
    const array = [];
    const levels = {};
    let compareDatas = {};
    let keyPrev;
    for(const [key,shelf] of shelves){
        const {type,level,items,surface,hasExceptionnal,name} = shelf;
        if(!levels[level]){
            levels[level] = [type];
        } else {
            levels[level].push(type);
        }
        // -- ITEMS STUCK AT EXTREMES OPPOSITE SIDES
        if(compareDatas.level && compareDatas.level != level){
            compareDatas = {};
        } else {
            if(!compareDatas.level){
                compareDatas = {
                    level,colMin:Infinity,colMax:0
                };
                items.forEach((item) => {
                    const {borders} = item;
                    compareDatas.colMin = Math.min(compareDatas.colMin,borders.colMin);
                    compareDatas.colMax = Math.max(compareDatas.colMax,borders.colMax);
                });
            } else {
                const colMin = 1;
                const colMax = compositionGridSize.cols(level);
                items.forEach((item) => {
                    const {borders} = item;
                    const condition1 = compareDatas.colMin === colMin && borders.colMax === colMax;
                    const condition2 = compareDatas.colMax === colMax && borders.colMin === colMin;
                    if(condition1 || condition2){
                        const json = ["rule-cell",name,"rule-cell-2",keyPrev.split("-")[1],"rule-dynamism-break"];
                        const value = 5;
                        array.push({
                            json,value
                        });
                    }
                });  
            }  
        }
        // -- SURFACE MINIMUM NOT CHECKED
        const count = surface.xMax - surface.xMin;
        if(count < 4 && !hasExceptionnal){
            const json = ["rule-cell",name,"rule-dynamism-surface"];
            const value = 5;
            array.push({
                json,value
            });
        }
        keyPrev = key;
    }
    // -- ALIGNED SAME SIDED
    for(let level in levels){
        const rows = levels[level];
        if(level === "1"){
            if(rows[0] !== rows[1]){
                const json = "rule-dynamism-aligned-1";
                const value = 5;
                array.push({
                    json,value
                });
            }
        } else {
            if(rows[0] !== rows[2] || (rows[1] === rows[0] || rows[1] === rows[2])){
                const floor = Math.abs(4-level)+1;
                const json = ["rule-dynamism-aligned-2",floor,"rule-dynamism-aligned-3"];
                const value = 5;
                array.push({
                    json,value
                });
            }
        }
    }
    return array;
}

// 4) INTEGRITY
const COLLECTIONS = ["PASSIFOLIA","SOLEIL D'HERMES","SAUT HERMES","TRESSAGES EQUESTRES","A WALK IN THE GARDEN"];
// -- PLAIDS OR CUSHIONS THAT CONTAIN OTHER ITEMS
// -- TRAY THAT MAY CONTAIN NON-PORCELAINE ITEMS*
// -- TRAY THAT CONTAINS NOTHING
// -- MORE THAN 2 COLLECTIONS PRESENT IN THE VM
// -- ROTATED ITEMS
// -- EXCEPTIONNAL ITEMS ARE NOT PLACED ALONE ON THE SLOT
function integrityPoints(shelves){
    const array = [];
    const collectionDisplayed = [];
    for(const [key,shelf] of shelves){
        const {items,name} = shelf;
        items.forEach((item) => {
            const {containedBy, state, datas, reference} = item;
            const {tags, rotable} = datas;
            if(containedBy){
                // -- PLAIDS OR CUSHIONS THAT CONTAIN OTHER ITEMS
                if(containedBy.datas.tags.includes("coussin")){
                    const json = ["rule-cell",name,"rule-integrity-cushions"];
                    const value = 4;
                    array.push({
                        json,value
                    });
                }
                else if(containedBy.datas.tags.includes("plaid") && !tags.includes("plaid")){
                    const json = ["rule-cell",name,"rule-integrity-plaids"];
                    const value = 4;
                    array.push({
                        json,value
                    });
                }
                if(containedBy.datas.tags.includes("plaid") && containedBy.datas.tags.includes("exceptionnel","solo")){
                    const json = ["rule-cell",name,"rule-integrity-exceptionnal-2"];
                    const value = 3;
                    array.push({
                        json,value
                    });
                }
                // -- TRAY THAT MAY CONTAIN NON-PORCELAINE ITEMS
                if(containedBy.datas.tags.includes("plateau") && (!tags.includes("porcelaine") || (tags.includes("porcelaine") && tags.includes("vase")))){
                    const json = ["rule-cell",name,"rule-integrity-porcelaine"];
                    const value = 3;
                    array.push({
                        json,value
                    });
                }
            }
            // -- ROTATED ITEMS THAT MUST NOT BE
            const conditionProfile = state === "layed" && rotable === "x";
            // const conditionFace = state === "face" && ["boite à mouchoirs","plateau"].some((ch)=>tags.includes(ch));
            const conditionFace = state === "face" && tags.includes("boite à mouchoirs");
            if(conditionProfile || conditionFace){
                const json = ["rule-cell",name,"rule-integrity-profile"];
                const value = 3;
                array.push({
                    json,value
                });
            }
            // -- EXCEPTIONNAL ITEMS ARE NOT PLACED ALONE ON THE SLOT
            if(tags.includes("exceptionnel","solo") && length > 1){
                const json = ["rule-cell",name,"rule-integrity-exceptionnal"];
                const value = 3;
                array.push({
                    json,value
                });
            }
            if(tags.includes("porcelaine") && tags.some(item => COLLECTIONS.includes(item))){
                const collections = tags.filter((tag) =>COLLECTIONS.includes(tag));
                if(!collectionDisplayed.includes(...collections)){
                    collectionDisplayed.push(...collections);
                }
            }
            // -- TRAY THAT CONTAINS NOTHING
            if(tags.includes("plateau") && state === "layed"){
                const hasItems = items.filter((item2) => item2.containedBy && item2.containedBy.reference === reference).length;
                if(hasItems === 0){
                    const json = ["rule-cell",name,"rule-integrity-plateau-empty"];
                    const value = 25;
                    array.push({
                        json,value
                    });
                }
            }
        });
    }
    // -- MORE THAN 2 COLLECTIONS PRESENT IN THE VM
    if(collectionDisplayed.length > 2){
        const json = ["rule-integrity-collections-max"].concat(collectionDisplayed);
        const value = 10;
        array.push({
            json,value
        });
    }
    return array;
}

// 5) TRANSVERSALITY
// -- UN PLATEAU QUI CONTIENT AUTRE CHOSE QUE DE LA PORCELAINE/VIDE
function transversalityPoints(shelves){
    let malus = 0;
    let bonus = 0;
    for(const [key,shelf] of shelves){
        const {items} = shelf;
        items.forEach((item) => {
            const {containedBy, state, datas} = item;
            const {tags, transversality} = datas;
            if(containedBy){
                if(containedBy.datas.tags.includes("plateau") && !tags.includes("porcelaine")){
                    malus+=5;
                }
            }
            if(transversality){
                items.forEach((item2)=>{
                    const {reference} = item2;
                    if(transversality === reference){
                        bonus +=2.5;
                    }
                })
            }
        });
    }
    if(malus > 0){
        console.log("Malus obtenu car certains objets ne respectent pas la transversalité : ",malus);
    }
    if(bonus > 0){
        console.log("Bonus obtenu car des objets remplissent les conditions de transversalité : ",bonus);
    }
    return {"transversality-malus":malus,"transversality-bonus":bonus};
}