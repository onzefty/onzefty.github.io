export const regexes = {
    numberUnits: new RegExp("[-.0-9]+(%|px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|deg)|(?<![a-zA-Z])[-.0-9]+","g"),
    numberOnly:new RegExp("[-.0-9]+","g"),
    unitOnly:new RegExp("[^-.0-9]+","g"),
    noSpacesUnit: new RegExp("(%|px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|deg)([-\.0-9])","g"),
    noSpacesComma: new RegExp("(,)([^\s])","g")
}

export const isCubicProperty = (prop) => prop==="left"||prop==="top"||prop==="translateX"||prop==="translateY"

export const propertyPatterns = {
	"filter":["blur","grayscale","hue-rotate","contrast","brightness"],
    "clip-path":["polygon","circle"],
    "transform":["translateX","translateY","translateZ","scaleX","scaleY","scaleZ","skewX","skewY","rotate"]
}

export const defaultStartValues = {
    "opacity":1,
    "scaleX":1,
    "scaleY":1,
    "translate": "0px 0px",
    "scale":"1 1",
    "rotate": "0deg",
    "text-shadow":"0px 0px 0px rgba(0,0,0,0)",
    "box-shadow":"0px 0px 0px 0px rgba(0,0,0,0)",
    "polygon":"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    "circle": "circle(100% at 50% 50%)",
    "blur":"blur(0px)",
    "grayscale":"grayscale(0)",
    "hue-rotate":"hue-rotate(0deg)",
    "contrast":"contrast(100%)",
    "brightness":"brightness(0)"
}

export const defaultUnits = {
    "rotate":"deg",
    "grayscale":"",
    "opacity":"",
    "scaleX":"",
    "scaleY":"",
    "clip-polygon":"%"
}

export const defaulPropertiesNumbers = {
	"border-radius":4,
    "padding":4,
    "margin":4,
    "translate":2,
    "scale":2
}

export function toRgba(value) {
    if(value.includes("rgba")){
        return value
    }
    else if(value.includes("rgb(")){
        return value.replace(")",",1)").replace("rgb","rgba")
    }
    else if(value.includes("#")){
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(value)) {
            let c = value.substring(1).split('')
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
            c = '0x' + c.join('')
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)'
        }
    }
    return value
}

export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    if (obj instanceof Map) {
        return new Map(Array.from(obj, ([key, val]) => [key, deepClone(val)]));
    }

    if (obj instanceof Set) {
        return new Set(Array.from(obj, val => deepClone(val)));
    }

    if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
    }

    const clonedObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }

    return clonedObj;
}

export const isColorProperty = (p) => (p.indexOf("color") != -1 || p.indexOf("Color") != -1 || p=="stroke")

const getPropertyName = (property) => {
	if(/[A-Z]/g.test(property)){ 
  	return property.replace(/[A-Z]/g,"-$&").toLowerCase();
  }
  return property;
}

const getPatterns = (property,value) => {
    if (propertyPatterns[property]){
        return value.match(/[A-Za-z]*(?=\()/g).filter((v) => v.length>0);
    } else {
        return null;
    }    
}

// Retourne les valeurs de propriétés pouvant être découpées en plusieurs (on donne 1 qui doit donner 2/3/4)
const updatePropertiesNumber = (property,value) => {
    const total = defaulPropertiesNumbers[property];
    if(total){
        const array = value.toString().split(" ")
        if(array.length != total){
            switch(total){
                case 2:
                    let second;
                    if(property === "translate"){
                        second = value === "0" ? "0" : defaultStartValues[property].split(" ")[1];
                    } else {
                        second = array[0];
                    }
                    value+=" "+second;
                break;
                case 4:
                    if(array.length===1){
                        value+=" "+value+" "+value+" "+value;
                    }
                    else if(array.length===2){
                        value+=" "+array[0]+" "+array[1];
                    }
                    else if(array.length===3){
                        value+=" "+array[2];
                    }
                break;
            }
        }
    }
    return value;
}

export const propertiesJoin = (array) => {
    let str = "";
    array.forEach((el) => {
        str+=el.value+el.unit;
    });
    return str;
}

function getComputed(element,property){
    const changed = getPropertyName(property);
    element.style.display = "none"
    let value = window.getComputedStyle(element).getPropertyValue(getPropertyName(changed));
    element.style.display = "";
    if(value!="none"){
        value = updatePropertiesNumber(property,value);
    }
    return value
}

function getProperty({property,value,element,patterns}){
	let taken = value;
    if(!taken){
        taken = getComputed(element,property);
    }
    if(isColorProperty(property)){
        taken = toRgba(taken);
    }
    if(patterns){
        if(taken === "none"){
            taken = "";
        }
        patterns.forEach((pattern)=>{
            if(taken.indexOf(pattern)==-1){
                taken+=" "+defaultStartValues[pattern];
            } 
        })
    }
    
    if(taken === "none"){
        taken = defaultStartValues[property] || "0px";
    }
    if(taken!=="none"){
        return valuesSplitter(taken.trim(),property);
    }
}

function valuesSplitter(taken,property){
    const toReturn = [];
    const loop = (str, array, prop) => {
        if(typeof str === "number"){
            array.push(createUpdatable(str));
            return;
        }
        let character = str[0];
        let value = null;
        if(character === "#"){
            let color = str.match(/^#[0-9-A-Za-z]+/g)[0];
            const rgba = toRgba(color);
            str = str.replace(color,rgba);
            character = str[0];
        }
        if(/[a-z]/g.test(character)){
            const check = str.match(/^[a-z\-]+\(([^\(\)]*(?:\([^\(\)]*\)[^\(\)]*)*)\)/g);
            if(check){
                value = check[0]
                const key = value.match(/^[A-Za-z-]*(?=\()/g).join("");
                const cloned = value.replace(/^[A-Za-z-]+\(|\)$/g,"");
                const newArray = valuesSplitter(cloned,key);
                newArray.unshift(createUpdatable(key+"("));
                newArray.push(createUpdatable(")"));
                array.push(newArray);
            }
        }
        else if(/[-\.0-9]/g.test(character)){
            const check = str.match(/^[-\.0-9]*.(%|px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|deg)|^[-\.0-9]*/g);
            if(check){
                value = check[0];
                array.push(createUpdatable(value));
            }
        }
        else if(/\s|,/g.test(character)){
            const check = str.match(/^\s|,/g)
            if(check){
                value = check[0];
                array.push(createUpdatable(value));
            }
        }
        if(value){
            str = str.slice(value.length,str.length);
            loop(str,array,prop);
        }
    }
    loop(taken,toReturn,property);
    return toReturn
}

function createUpdatable(el){
	let values = el.toString();
	values = values.match(regexes.numberUnits);
    const updatable = values!=null;
    const value = updatable ? parseFloat(values.join("").match(regexes.numberOnly).join("")) : el;
    let unit = updatable ? values.join("").match(regexes.unitOnly) ? values.join("").match(regexes.unitOnly).join("") : "" : "";
    return {value,updatable,unit}
}

export function getUpdatable(array,index){
		let a = 0
    let count = -1
    do {
    	const {updatable} = array[a]
      if(updatable===true){
      	count++
      }
      if(count===index){
      	return a;
        break;
      }
      a++
    }
    while(array[a])
}

// Clean les propriétés demandées translateX => translate
function cleanProperties(obj,element){
	const properties = {}
  for(const property in obj){
      let cleaned = property.replace(/(X|Y)/g,"")
    	properties[cleaned] = obj[property]
  }
  return properties
}

//Clean les valeurs des propriétés (espaces manquants par exemple)
function cleanValues(value){
    if(typeof value === "number"){
        return value;
    }
    const replacementUnit = value.replace(regexes.noSpacesUnit,"$1 $2");
    const replacementComma = replacementUnit.replace(regexes.noSpacesComma,"$1 $2");
    const replacementExtrasSpaces = replacementComma.replace(/(\s)(\s)+/g," ");
    return replacementExtrasSpaces;
}

export function setPoints(element,properties){
    const obj = {
        from:{},
        to:{},
        change:{}
    }
    //Clean des propriétés pour from
    const fromProperties = cleanProperties(properties,element);
    //On récupère les valeurs de départ pour from
    for(const property in fromProperties){
        const value = fromProperties[property];
        const patterns = getPatterns(property,value);
        const from = getProperty({property,element,patterns});
        obj.from[property] = from;
    }
    //To est cloné de from pour avoir les mêmes bases

    //console.log(obj.from)
    
    obj.to = deepClone(obj.from)
    obj.change = deepClone(obj.from)
    //On modifie uniquement les nouvelles propriétés à animer dans to
    for(const property in properties){
        let value = properties[property];
        value = cleanValues(value);
        if(isColorProperty(property)){
            value = toRgba(value)
        }
        if(property.endsWith("X")||property.endsWith("Y")){
            const cleaned = property.replace(/X|Y/g,"")
            const index = property.endsWith("X") ? 0 : 1
            const array = obj.to[cleaned]
            const indexReal = getUpdatable(array,index)
            obj.to[cleaned][indexReal] = {...createUpdatable(value)}
        }
        else if (propertyPatterns[property] && property!="clip-path"){
            const patterns = value.match(/[a-z\-]+\(.*?\)/g)
            patterns.forEach((pattern)=>{
                obj.to[property].forEach((element) => {
                    if(Array.isArray(element)){
                        const first = element[0]
                        if(pattern.startsWith(first.value)){
                            element[1] = createUpdatable(pattern)
                        }
                    }
                })
            })
        }
        else if(defaulPropertiesNumbers[property]){
            const calculated = updatePropertiesNumber(property,value)
            obj.to[property] = valuesSplitter(calculated,property)
        } else {
            
            obj.to[property] = valuesSplitter(value,property)
        }
    }
    //Check des unités qui diffèrent entre to et from (to l'emporte)
    //Calcul des changes entre to et from
    for(const property in obj.to){
        const arrayTo = obj.to[property]
        const arrayFrom = obj.from[property]
        const arrayChange = obj.change[property]
        arrayTo.forEach((elementTo,index) => {
            const elementFrom = arrayFrom[index]
            const elementChange = arrayChange[index]
            if(Array.isArray(elementTo)){
                //let count = -1
                //console.log(elementTo,elementFrom)
                elementTo.forEach((partTo,index2)=>{
                    const {unit, updatable, value} = partTo
                    if(updatable){
                        //count++
                        // const indexFrom = getUpdatable(arrayFrom,count)
                        // const sameFrom = arrayFrom[indexFrom]
                        // const valueFrom =  sameFrom.value
                        // const unitFrom =  sameFrom.unit
                        // const indexChange = getUpdatable(arrayChange,count)
                        // const sameChange = arrayChange[indexChange]
    
                        const sameFrom = elementFrom[index2]
                        const valueFrom =  sameFrom.value
                        const unitFrom =  sameFrom.unit
                        const sameChange = elementChange[index2]
                        
                        if(unitFrom != unit){
                            sameFrom.unit = unit
                            sameChange.unit = unit
                        }
                        // console.log(partTo,sameFrom)
                        // console.log(value-valueFrom)
                        sameChange.value = value - valueFrom
                    }
                })
            } else {
                const {unit, updatable, value } = elementTo
                if(updatable){
                    const valueFrom = elementFrom.value
                    const unitFrom = elementFrom.unit
                    if(unitFrom != unit){
                        elementFrom.unit = unit
                        elementChange.unit = unit
                    }
                    elementChange.value = value - valueFrom    
                }
            }
        })
    }
  
    return obj
}

export const easings = {
    linear: function (t, b, c, d) {
        return c * t / d + b
    },
    inExpo: function (t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    outExpo: function (t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    inOutExpo: function (t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    inQuad: function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    outQuad: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    inOutQuad: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    inSine: function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    outSine: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    inOutSine: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    inElastic: function (t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    outElastic: function (t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    inOutElastic: function (t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    inBack: function (t, b, c, d) {
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    outBack: function (t, b, c, d) {
        if(t===0 && b===0){
            return 0;
        }
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    inOutBack: function (t, b, c, d) {
        var s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    inBounce:easeInBounce,
    outBounce: easeOutBounce,
    inOutBounce: function(elapsed, initialValue, amountOfChange, duration){
        if (elapsed < duration / 2) {
            return easeInBounce(elapsed * 2, 0, amountOfChange, duration) * 0.5 + initialValue;
        }
        return easeOutBounce(elapsed * 2 - duration, 0, amountOfChange, duration) * 0.5 + amountOfChange * 0.5 + initialValue;
    }
}

function easeInBounce(elapsed, initialValue, amountOfChange, duration){
    return amountOfChange - easeOutBounce(duration - elapsed, 0, amountOfChange, duration) + initialValue;
}

function easeOutBounce(elapsed, initialValue, amountOfChange, duration) {
	if ((elapsed /= duration) < 1 / 2.75) {
		return amountOfChange * (7.5625 * elapsed * elapsed) + initialValue;
	} else if (elapsed < 2 / 2.75) {
		return amountOfChange * (7.5625 * (elapsed -= 1.5 / 2.75) * elapsed + 0.75) + initialValue;
	} else if (elapsed < 2.5 / 2.75) {
		return amountOfChange * (7.5625 * (elapsed -= 2.25 / 2.75) * elapsed + 0.9375) + initialValue;
	} else {
		return amountOfChange * (7.5625 * (elapsed -= 2.625 / 2.75) * elapsed + 0.984375) + initialValue;
	}
}

export function minMax(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
export function findDot(x, y, length, angle, minusX, minusY) {
    const newX = (minusX == undefined || minusX == "") ? x + Math.cos(angle) * length : x - Math.cos(angle) * length;
    const newY = (minusY == undefined || minusY == "") ? y + Math.sin(angle) * length : y - Math.sin(angle) * length;
    return {
        x: newX,
        y: newY
    }
}
export function findDotOnLine(line, length) {
    //
    //       <--   length   --> 
    //                          |   
    // (line.x1,line.y1)__________________|________(line.x2,line.y2)
    //                          |
    //                          |
    //                   return (x3,y3)
    //
    const distance = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2))
    const t = length / distance
    const x = ((1 - t) * line.x1 + (t * line.x2))
    const y = ((1 - t) * line.y1 + (t * line.y2))
    const dx = line.x2 - line.x1
    const dy = line.y2 - line.y1
    const angle = Math.atan2(dy, dx) * 180 / Math.PI
    if (0 < t && t < 1) {
    } else if (t < 0) {
        //console.log("en dehors proche du premier point.");
    } else if (t > 1) {
        //console.log("en dehors proche du deuxième point.");
    }
    return { x: x, y: y, angle: angle }
}
export function getLineFromDots(point1, point2) {
    const dx = point2.x - point1.x, dy = point2.y - point1.y
    const d = Math.sqrt((dx) * (dx) + (dy) * (dy))
    const angle = Math.atan2(dy, dx) * 180 / Math.PI
    return { length: d, angle: angle, dx: dx, dy: dy, x1: point1.x, y1: point1.y, x2: point2.x, y2: point2.y }
}
export function radToDeg(radians) {
    const degres = radians * 180 / Math.PI
    return degres > 0.0 ? degres % 360 : (degres + 360.0) % 360
}
export function degToRad(degrees) {
    return degrees * Math.PI / 180
}
export function getCubicValue(a, datas, el, prop) {
    const time = a.reversed == true ? a.reversedTime : a.currentTime
    const coords = getCubicValues(time / a.duration, a.cubicValues)
    const value = prop === "left" || prop === "translateX" ? coords.x : coords.y
    //withEasing = a.reversed == true ? easings[a.easing](time, datas.end, value, a.duration) : easings[a.easing](time, datas.start, value, a.duration);
    //TEMPORAIRE
    return value
}
export function getCubicValues(t, cubic) {
    //Lignes entre les points
    const linesM = [];
    const linesG = [];
    let line;
    for (let l = 1; l <= cubic.length - 1; l++) {
        const dot1 = cubic[l - 1];
        const dot2 = cubic[l];
        const coords1 = { x: dot1[0], y: dot1[1] };
        const coords2 = { x: dot2[0], y: dot2[1] };
        linesM.push(getLineFromDots(coords1, coords2));
    }
    for (let m = 1; m <= linesM.length - 1; m++) {
        let dot1 = findDotOnLine(linesM[m - 1], t * linesM[m - 1].length);
        let dot2 = findDotOnLine(linesM[m], t * linesM[m].length);
        linesG.push(getLineFromDots(dot1, dot2));
    }
    //Last line
    let dot1 = findDotOnLine(linesG[0], t * linesG[0].length);
    let dot2 = findDotOnLine(linesG[1], t * linesG[1].length);
    line = getLineFromDots(dot1, dot2);
    const coords = findDotOnLine(line, t * line.length);
    return coords;
}
export function fakeCubicCurve(el, cubic, wrapper) {
    const main = wrapper ? wrapper : document.body
    let svg = main.querySelector(".faker-cubic")
    if(!svg){
        svg = document.createElementNS('http://www.w3.org/2000/svg',"svg")
        svg.setAttribute("width", 10000);
        svg.setAttribute("height", 10000);
        svg.style.left = "0px";
        svg.style.top = "0px";
        svg.style["background"] = "transparent";
        svg.style["overflow"] = "visible";
        svg.style["z-index"] = 999
        svg.setAttribute("class", "absolute faker-cubic");
        svg.setAttribute("id", "faker-cubic-"+(main.querySelectorAll(".faker-cubic").length + 1));
        main.appendChild(svg)
    }
    
    const curve = createCurve()
    const dotStart = createDot(cubic[0])
    const dotEnd = createDot(cubic[3])
    const box = el.getBoundingClientRect();
    let cursor = null;
    let dotSelected = null;

    function createCurve(){
        const path = document.createElementNS('http://www.w3.org/2000/svg',"path")
        path.setAttribute("stroke","green")
        path.setAttribute("fill","none")
        path.id = "fake-cubic-path-" + (svg.querySelectorAll("path").length + 1)
        svg.appendChild(path)
        return path
    }

    function createDot(coords){
        const dot = document.createElementNS('http://www.w3.org/2000/svg',"circle")
        dot.setAttribute("stroke","none")
        dot.setAttribute("fill","red")
        dot.setAttribute("r","10")
        dot.setAttribute("cx",coords[0]-5)
        dot.setAttribute("cy",coords[1]-5)
        dot.id = "fake-cubic-dot-" + (svg.querySelectorAll(".fake-cubic-dot").length + 1)
        svg.appendChild(dot)
        return dot
    }

    function onDown(e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        cursor = getCursorIn(event, this);
        svg.addEventListener("mousemove",onMove);
        svg.addEventListener("mouseup",onUp);
        this.removeEventListener("mousedown", onDown);
        // $(svg).off(Constants.MOVE_TOUCHMOVE).on(Constants.MOVE_TOUCHMOVE, onMove);
        // $(svg).off(Constants.UP_TOUCHEND).on(Constants.UP_TOUCHEND, onUp);
        // $(this).off();
        dotSelected = this;
    }

    function onMove(e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e,
            c = getCursorIn(event, el.parentNode);

        dotSelected.setAttribute("cx", (c.x - cursor.x));
        dotSelected.setAttribute("cy", (c.y - cursor.y));

        update();
    }

    function onUp(e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        svg.removeEventListener("mousemove",onMove);
        svg.removeEventListener("mouseup",onUp);
        dotSelected.addEventListener("mousedown", onDown);
        // $(svg).off(Constants.MOVE_TOUCHMOVE);
        // $(svg).off(Constants.UP_TOUCHEND);
        // $(dotSelected).on(Constants.DOWN_TOUCHSTART, onDown);
    }

    function draw() {
        for (var c = 1; c <= cubic.length - 2; c++) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
            circle.setAttribute("fill", "blue");
            circle.setAttribute("r", 10);
            circle.setAttribute("cx", cubic[c][0]);
            circle.setAttribute("cy", cubic[c][1]);
            circle.setAttribute("class", "cubic-dot");
            svg.appendChild(circle);
            circle.addEventListener("mousedown", onDown);
            //$(circle).off().on(Constants.DOWN_TOUCHSTART, onDown);
        }
    }

    function update() {
        var dotsCubics = svg.querySelectorAll(".cubic-dot");
        let d = "";
        for (var c = 1; c <= cubic.length; c++) {
            var cub = cubic[c - 1];
            if (c == 1) {
                d += "M";
            }
            if (c == 2) {
                d += (cubic.length == 4) ? "C" : (cubic.length == 2) ? "L" : "Q";
            }
            if (c == 2) {
                d += dotsCubics[0].getAttribute("cx") + "," + dotsCubics[0].getAttribute("cy") + " ";
            }
            else if (c == 3) {
                d += dotsCubics[1].getAttribute("cx") + "," + dotsCubics[1].getAttribute("cy") + " ";
            } else {
                d += cub[0] + "," + cub[1] + " ";
            }

        }
        d = d.trim();
        curve.setAttribute("d", d);
    }

    let d = "";
    for (let c = 1; c <= cubic.length; c++) {
        var cub = cubic[c - 1];
        if (c == 1) {
            d += "M";
        }
        if (c == 2) {
            d += (cubic.length == 4) ? "C" : (cubic.length == 2) ? "L" : "Q";
        }
        d += cub[0] + "," + cub[1] + " ";
    }
    d = d.trim();
    curve.setAttribute("d", d);

    draw();
}
export function getPixels(element,property,obj){
    const {value,unit} = obj
    const parent = element.parentNode
    const boxParent = parent.getBoundingClientRect()
    const box = element.getBoundingClientRect()
    const isPercent = unit==="%"
    let toReturn = 0

    if(property==="left"||property==="top"){
        if(isPercent){
            const ref= property==="left"? boxParent.right : boxParent.bottom
            toReturn = parseFloat(value)/100*ref
        } else {
            toReturn = parseFloat(value)
        }
    } else {
        const pos = property==="translateX"? box.left : box.top
        if(isPercent){
            const ref = property==="translateX"? box.width : box.height
            toReturn = parseFloat(value)/100*ref + pos
        } else {
            toReturn = parseFloat(value) + pos
        }
    }

    return toReturn
}
export function getPropertyValue(element,property){
    const styleValue = element.style[property]
    element.style.display = "none"
    const computedValue = window.getComputedStyle(element).getPropertyValue(property);
    element.style.display = ""
    return styleValue || computedValue
}
// -> Position par rapport à l'écran d'un élément
function getOffset(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
        left: box.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)
    };
}
// -> Récupère la position du curseur par rapport à un élément
function getCursorIn(event,elem) {
    var offset = getOffset(elem);
    return {
        x: (event.clientX - offset.left),
        y: (event.clientY - offset.top)
    };
}

export function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function getDomElement(ref){
    if(ref instanceof HTMLElement){
        return ref;
    }
    const byGetId = document.getElementById(ref)
    const byQuery = document.querySelector(ref)
    const byQueries = document.querySelectorAll(ref)
    if(byGetId){
        return byGetId
    }
    if(byQueries && byQueries.length>1){
        return byQueries
    }
    if(byQuery){
        return byQuery
    }
    return null
}
