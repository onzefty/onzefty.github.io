// REQUESTANIMATIONFRAME
const requestAnimationFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
    );
})();

// CANCELANIMATIONFRAME
const cancelAnimationFrame = (function () {
    return (
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (id) {
            return window.clearTimeout(id);
        }
    );
})();

const limitLoop = function (fn, fps) {
    // Use var then = Date.now(); if you
    // don't care about targetting < IE9
    const then = new Date().getTime();

    // custom fps, otherwise fallback to 60
    fps = fps || 60;
    const interval = 1000 / fps;

    return (function loop(time) {
        requestAnimationFrame(loop);

        // again, Date.now() if it's available
        const now = new Date().getTime();
        const delta = now - then;

        if (delta > interval) {
            // Update time
            // now - (delta % interval) is an improvement over just 
            // using then = now, which can end up lowering overall fps
            then = now - (delta % interval);

            // call the fn
            fn(time, then);
        }
    }(0));
};

(function () {
    const isTransformProperty = (p) => p.indexOf("translate")!=-1||p.indexOf("rotate")!=-1||(p.indexOf("scale")!=-1&&p.indexOf("grayscale")==-1)
    const isClipProperty = (p) => p.indexOf("clip-polygon")!=-1||p.indexOf("clip-circle")!=-1
    const isFilterProperty = (p) => p.indexOf("blur")!=-1||p.indexOf("grayscale")!=-1
    const isColorProperty = (p) => (p.indexOf("color") != -1 || p.indexOf("Color") != -1 || p=="stroke")
    const fps = 60
    const fpsInterval = 1000 / fps
    let startTime, then
    function hexToRgbA(hex) {
        let c
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('')
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]]
            }
            c = '0x' + c.join('')
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)'
        } else {
            return undefined
        }
    }
    const actives = []
    let animating = false
    let ID = 0
    const easings = {
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
            }
    }
    const performance = function () {
            var perf = window.performance || {};
            if (typeof perf.now !== "function") {
                var nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : now();
                perf.now = function () {
                    return now() - nowOffset;
                };
            }
            return perf;
    }();
    function changePropertyName(p) {
        if (/[A-Z]/g.test(p) == true && p.match(/[A-Z].*/g)[0].length > 1) {
            const b = p.match(/[A-Z].*/g).join("").toLowerCase()
            const f = p.match(/.+?(?=[A-Z])/g).join("")
            return f + "-" + b
        }
        return p;
    }
    function loopThrough(t) {
            const currentTime = performance.now();
            let len = actives.length;
            let i = 0;

            while (i < len) {
                const active = actives[i]
                if (active.paused === false) {
                    active.update(t);
                    i++;
                } else {
                    actives.splice(i, 1);
                    len--;
                }
            }

            if (i > 0) {
                requestAnimationFrame(loopThrough);
            } else {
                animating = false;
                cancelAnimationFrame(loopThrough);
            }
    }
    function launch() {
        if (actives.length > 0 && animating === false) {
            animating = true;
            // then = window.performance.now();
            // startTime = then;
            // loopThrough();
            requestAnimationFrame(loopThrough);
        }
    }
    function minMax(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
    function findDot(x, y, length, angle, minusX, minusY) {
        const newX = (minusX == undefined || minusX == "") ? x + Math.cos(angle) * length : x - Math.cos(angle) * length;
        const newY = (minusY == undefined || minusY == "") ? y + Math.sin(angle) * length : y - Math.sin(angle) * length;
        return {
            x: newX,
            y: newY
        }
    }
    function findDotOnLine(line, length) {
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
    function getLineFromDots(point1, point2) {
        const dx = point2.x - point1.x, dy = point2.y - point1.y
        const d = Math.sqrt((dx) * (dx) + (dy) * (dy))
        const angle = Math.atan2(dy, dx) * 180 / Math.PI
        return { length: d, angle: angle, dx: dx, dy: dy, x1: point1.x, y1: point1.y, x2: point2.x, y2: point2.y }
    }
    function radToDeg(radians) {
        const degres = radians * 180 / Math.PI
        return degres > 0.0 ? degres % 360 : (degres + 360.0) % 360
    }
    function degToRad(degrees) {
        return degrees * Math.PI / 180
    }
    function getCubicValue(a, datas, el, prop) {
        const time = a.reversed == true ? a.reversedTime : a.currentTime
        const coords = getCubicValues(time / a.duration, a.cubic)
        const value = prop === "left" || prop === "translateX" ? coords.x : coords.y
        //withEasing = a.reversed == true ? easings[a.easing](time, datas.end, value, a.duration) : easings[a.easing](time, datas.start, value, a.duration);
        //TEMPORAIRE
        return value
    }
    function getCubicValues(t, cubic) {
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
    const noProperties = ["function","delay","duration","easing"];
    const transformProperties = ["translateX", "translateY", "translateZ", "rotateX", "rotateY", "rotate", "rotate3d", "scaleX", "scaleY", "skewX", "skewY"];
    const filterProperties = ["blur","grayscale"];
    const regexNumbersUnit = new RegExp("[-.0-9]*.(%|px|rem|em)","g");
    const regexNumberOnly = new RegExp("[-100000000-99999999999999999999\\.-]","g");
    const regexUnitOnly = new RegExp("[^\\.\\--100000000-99999999999999999999]","g");
    const checkOnlyZero = (currentValue) => typeof currentValue === "number" ? currentValue === 0 : currentValue.value === 0;
    const defaultStartValues = {
        "opacity":1,
        "scaleX":1,
        "scaleY":1,
        "clip-polygon":"0% 0%, 100% 0%, 100% 100%, 0% 100%",
        "clip-circle": "100% at 50% 50%"
    }
    const defaultUnits = {
        "rotate":"deg",
        "grayscale":"",
        "opacity":"",
        "scaleX":"",
        "scaleY":"",
        "clip-polygon":"%"
    }
    function getProperties(el,props,to,u,to2){
        const toReturn = {};

        for(let prop in props){
            
            const property = isFilterProperty(prop) ? "filter" : prop.indexOf("clip")!=-1 ? "clip-path" : prop.endsWith("X")||prop.endsWith("Y") ? prop.slice(0,-1) : prop;
            let valRef = el.style[property] || window.getComputedStyle(el).getPropertyValue(property);
            if(to){
                valRef = props[prop].toString();
            }

            if(isTransformProperty(prop)){
                toReturn[prop] = getTransform(prop,valRef,to,u,to2);
            }
            else if(isClipProperty(prop)){
                let t = [];
                switch(prop){
                    case "clip-polygon":
                        if (valRef != "none") {
                            const val = valRef.replace(/path\(|\'|\)|"/g, "");
                            let tab = val.trim().match(/[-.0-9]*.(%|px|rem|em)/g);
                            tab.forEach((tabEl) => {
                                t.push({
                                    value: parseFloat(tabEl.match(regexNumberOnly).join("")),
                                    unit: tabEl.match(regexUnitOnly).join("")
                                });
                            });
                        } else {
                            let tab = defaultStartValues[prop].trim().match(/[-.0-9]*.(%|px|rem|em)/g);
                            tab.forEach((tabEl) => {
                                t.push({
                                    value: parseFloat(tabEl.match(regexNumberOnly).join("")),
                                    unit: tabEl.match(regexUnitOnly).join("")
                                });
                            });
                        }
                        
                        toReturn[prop] = {
                            value:t
                        }
                    break;

                    case "clip-circle":
                        if (valRef != "none") {
                            const val = valRef.replace(/circle\(|\'|\)|"/g, "");
                            const atAfter = val.trim().match(/at.*/g).join("").replace("at","").match(/[-.0-9]*.(%|px|rem|em)/g);
                            let tab = val.trim().match(/[-.0-9]*.(%|px|rem|em)/g);
                            if(atAfter.length===1){
                                tab.push("50%")
                            }
                            tab.forEach((tabEl) => {
                                t.push({
                                    value: parseFloat(tabEl.match(regexNumberOnly).join("")),
                                    unit: tabEl.match(regexUnitOnly).join("")
                                });
                            });
                        } else {
                            let tab = defaultStartValues[prop].trim().match(/[-.0-9]*.(%|px|rem|em)/g);
                            tab.forEach((tabEl) => {
                                t.push({
                                    value: parseFloat(tabEl.match(regexNumberOnly).join("")),
                                    unit: tabEl.match(regexUnitOnly).join("")
                                });
                            });
                        }
                        
                        toReturn[prop] = {
                            value:t
                        }

                    break;
              }
            }
            else if(isFilterProperty(prop)){
                let value;
                if(valRef==="none" || (valRef.indexOf("(")!=-1 && valRef.indexOf(prop)==-1)){
                    value = defaultStartValues[prop] || 0;
                }
                else if(valRef.indexOf("(")!=-1){
                    value = valRef;
                    const reg1 = new RegExp(prop+'\\((.*?)\\)', 'g');
                    const reg2 = new RegExp('\\((.*?)\\)', 'g');
                    const part = value.match(reg1).join("");
                    value = part.match(reg2).join("").replace(/\(|\)/g, "").replace(/[^0-9\.-]/g, "");
                } else {
                    value = valRef;
                }
                
                let unit = value.toString().match(regexUnitOnly);
                value = value.toString().match(regexNumberOnly).join("");
                if(unit){
                    unit = unit.join("");  
                }
                toReturn[prop] = {
                    value:parseFloat(value),
                    unit:unit?unit:typeof defaultUnits[prop]==="string"?defaultUnits[prop]:"px"
                }
            }
            else if(isColorProperty(prop)){
                let c;
                if (valRef.indexOf("#") != -1) {
                    c = hexToRgbA(valRef).match(/\(.*?\)/g).join("").replace(/\(|\)/g, "").split(",");
                }
                else if (valRef.indexOf("rgb") != -1 && valRef.indexOf("rgba") == -1) {
                    c = valRef.match(/\(.*?\)/g).join("").replace(/\(|\)/g, "").split(",");
                    c.push("1");
                } else {
                    c = valRef.match(/\(.*?\)/g).join("").replace(/\(|\)/g, "").split(",");
                }
                toReturn[prop] = {
                    value:c.map(Number),
                    unit: ""
                }
            } else {
                let value = valRef==="none"||valRef==="auto" ? (defaultStartValues[prop] || 0) : valRef;
                let unit = value.toString().match(regexUnitOnly);
                value = value.toString().match(regexNumberOnly).join("");
                if(unit){
                    unit = unit.join("");
                }
                toReturn[prop] = {
                    value:parseFloat(value),
                    unit:unit?unit:typeof defaultUnits[prop]==="string"?defaultUnits[prop]:"px"
                }
            }
        } 
        return toReturn;
    }

    function getTransform(prop,valRef,to,u,to2){
        const index = prop.endsWith("X")?0:prop.endsWith("Y")?1:0;
        let value = valRef==="none" ? (defaultStartValues[prop] || 0) : valRef.split(" ");
        if(Array.isArray(value) && !to){
            value = value[index] ? value[index] : prop==="translateY" ? typeof u === "string" ? "0"+u : "0px" : value[0];
        }
        
        let unit = value.toString().match(regexUnitOnly);
        value = value.toString().match(regexNumberOnly).join("");
        if(unit){
            unit = unit.join("");  
        }
        if(prop==="rotateX"||prop==="rotateY"){
            unit = "deg";
        }
        //Si on ne trouve pas la bonne valeur d'unité de démarrage, on prend celle d'arrivée
        if(to2 && to2[prop].unit!=unit){
            unit = to2[prop].unit;
        }
        return {
            value:parseFloat(value),
            unit:unit?unit:typeof defaultUnits[prop]== "string"?defaultUnits[prop]:"px"
        }
    }

    function getChanges(to,from,rejectSame){
        const toReturn = {};

        for(let prop in to){
            const propFrom = from[prop];
            if(propFrom){
                const propToValue = to[prop].value;
                const propToUnit = to[prop].unit;
                const propFromValue = propFrom.value;
                const propFromUnit = propFrom.unit;

                if(Array.isArray(propToValue) && Array.isArray(propFromValue)){
                    let values = [];
                    for(let i=1; i<=propToValue.length; i++){
                        const valTo = propToValue[i-1];
                        const valFrom = propFromValue[i-1];
                        if(typeof valFrom === "number" && typeof valTo==="number"){
                            const calc = valTo - valFrom;
                            values.push(calc);
                        } else {
                            if (valTo.letter && valTo.values) {
                                values[i-1] = { letter: valTo.letter, values: [] };
                                for (let v = 1; v <= valTo.values.length; v++) {
                                    const calc = valTo.values[v - 1] - valFrom.values[v - 1];
                                    change[i-1].values.push(calc);
                                }
                            } else {
                                const calc = valTo.value - valFrom.value;
                                values.push({ value:calc, unit: valTo.unit });
                            }  
                        }
                    }
                    const noChanges = values.every(checkOnlyZero);
                    if(noChanges===true && rejectSame===true){
                        values = [];
                    }
                    toReturn[prop] = {
                        value:values
                    }
                } else {
                    const calc = (propToValue - propFromValue);
                    if(calc===0 && rejectSame===true){
                        continue;
                    }
                    toReturn[prop] = {
                        value:calc,
                        unit:propToUnit
                    }
                }
            }
        }

        return toReturn;
    }

    function addWillChange(el,prop,animating){
        if(!animating){
            return;
        }
        const style = el.style["will-change"];
        const p = prop.endsWith("X")||prop.endsWith("Y") ? prop.slice(0,-1) : prop;
        if(style.indexOf(p)==-1){
            el.style["will-change"] = style.length===0 ? p : style+", "+p;
        }
    }

    function removeWillChange(el){
        el.style["will-change"] = "";
    }

    function buildProperties(el,props,animating){
        for(let prop in props){
            const valRef = props[prop];
            //addWillChange(el,prop,animating);
            if (isTransformProperty(prop)) {
                buildTransform(el,prop,valRef);
            }
            else if (isColorProperty(prop)) {
                buildColors(el,prop,valRef);
            }
            else if (isClipProperty(prop)) {
                buildClip(el,prop,valRef);
            }
            else if (isFilterProperty(prop)) {
                buildFilters(el,prop,valRef);
            } else {
                el.style[prop] = valRef.value+valRef.unit;
            }
        }
    }

    function buildTransform(el, property, valRef) {
        let str = "";
        const opposite = property.endsWith("X")?property.substring(0,property.length-1)+"Y": property.endsWith("Y")?property.substring(0,property.length-1)+"X":null;
        if(opposite && property.indexOf("rotate")==-1){
            const p = property.endsWith("X")||property.endsWith("Y") ? property.slice(0,-1) : property;
            let val = el.style[p] || window.getComputedStyle(el).getPropertyValue(p);
            const props = getTransform(opposite,val,null,valRef.unit);
            str = property.endsWith("X") ? valRef.value+valRef.unit + " " + props.value+props.unit : props.value+props.unit + " " + valRef.value+valRef.unit ;
            const prop = property.substring(0,property.length-1);
            el.style[prop] = str;
        } else {
            if(property==="rotateY"||property==="X"){
                const add = property.slice(-1).toLowerCase();
                el.style["rotate"] = add+" "+valRef.value+valRef.unit;
            } else {
               el.style[property] = valRef.value+valRef.unit; 
            }
            
        }
    }

    function buildClip(el,property,valRef){
        let str = "";
        if (property === "clip-circle") {
            const tab = valRef.value;
            str = "circle(" + tab[0].value + tab[0].unit + " at " + tab[1].value + tab[1].unit + " " + tab[2].value + tab[2].unit + ")";
        }
        else if (property === "clip-polygon") {
            str = "polygon(";
            valRef
            valRef.value.forEach((v,num) => {
                str += ((num+1) % 2 == 0 && (num+1) != valRef.value.length) ? v.value + v.unit + "," : v.value + v.unit + " ";
            });
            str += ")";
        }
        else if (property === "clip-path") {
            str = "path('";
            for (let v = 1; v <= valRef.length; v++) {
                const vv = valRef[v - 1];
                switch (vv.letter) {
                    case "A":
                        str += vv.letter + " " + vv.values[0] + "," + vv.values[1] + " " + vv.values[2] + "," + vv.values[3] + "," + vv.values[4] + " " + vv.values[5] + "," + vv.values[6] + " ";
                        break;
                    default:
                        str += vv.letter + " " + vv.values.join(",") + " ";
                        break;
                }
            }
            str += "Z')";
        }
        el.style["clip-path"] = str;
    }

    function buildColors(el, property, valRef) {
        let str = "rgba(";
        valRef.value.forEach((v,num) => {
            str += ((num+1) === valRef.value.length) ? v + ")" : v + ",";
        });
        el.style[property] = str;
    }

    function buildFilters(el, property, valRef) {
        let str = "";
        let chain = el.style["filter"] || window.getComputedStyle(el,null).getPropertyValue("filter");
        const matches = chain.match(/(blur|grayscale)/g);
        if(matches.indexOf(property)==-1){
            matches.push(property);
        }
        if (matches.length > 0) {
            matches.forEach((match,num) => {
                if(match===property){
                    str += property + "(" + valRef.value + valRef.unit + ") ";
                } else {
                    const props = getProperties(el,{[match]:""},null,valRef.unit);
                    str += match + "(" + props[match].value + props[match].unit + ") ";
                }
            });
        }
        el.style["filter"] = str;
    }

    function resetTime(a, b) {
        a.startTime = 0;
        a.lastTime = a.currentTime + b;
    }

    class Animations {
        constructor(datas){
            this.id = ID;
            this.element = datas.element;
            this.properties = datas.properties;
            this.delay = typeof datas.delay === "number" ? datas.delay : 0;
            this.easing = typeof datas.easing === "string" ? datas.easing : "linear";
            this.start = datas.start;
            this.progress = datas.progress;
            this.end = datas.end;
            this.reversed = datas.reversed;
            this.started = false;
            this.animating = false;
            this.finished = false;
            this.resettable = typeof datas.resettable === "boolean" ? datas.resettable : true;
            this.cubic = Array.isArray(datas.cubic) === true ? datas.cubic : false;
            this.percent = 0;
            this.currentTime = 0;
            this.paused = false;
            this.startTime = 0;
            this.lastTime = 0;
            this.autoplay = datas.autoplay;
            this.duration = typeof datas.duration === "number" ? datas.duration : 1000;
            this.delayNormal = this.delay
            this.delayReversed = (this.duration - (this.duration + this.delay)) + this.delay
            this.reversedTime = typeof datas.duration === "number" ? datas.duration : 1000;
            this.unapplied = typeof datas.unapplied === "boolean" ? datas.unapplied : false;
            this.rejectSame = this.unapplied === true ? false : true;
            this.applyOnly = typeof datas.applyOnly === "boolean" ? datas.applyOnly : false;
            this.updatable = typeof datas.updatable === "boolean" ? datas.updatable : false;
            this.updated = false;
            if(this.applyOnly === true){
                this.from = getProperties(this.element,datas.properties);
                this.apply(this.from);
            } else {
                this.to = getProperties(this.element,datas.properties,true);
                this.from = getProperties(this.element,datas.properties,null,null,this.to);
                this.change = getChanges(this.to,this.from,this.rejectSame);
                this.apply();
                if (this.autoplay === true) {
                    this.play();
                }    
            }
        }

        modify(props){
            for(const prop in props){
                if(this.hasOwnProperty(prop)===true){
                    this[prop] = props[prop];
                }
            }
        }

        getPropertiesFrom(){
            const toReturn = {};
            for(let prop in this.from){
                const datas = this.from[prop];
                if (isTransformProperty(prop)) {
                    toReturn[prop] = datas.value+datas.unit;
                }
                else if (isColorProperty(prop)) {
                    toReturn[prop] = "rgba("+datas.value[0]+","+datas.value[1]+","+datas.value[2]+","+datas.value[3]+")";
                }
                else if (isClipProperty(prop)) {
                    if (prop === "clip-circle") {
                        const tab = datas.value;
                        toReturn[prop] = tab[0].value + tab[0].unit + " at " + tab[1].value + tab[1].unit + " " + tab[2].value + tab[2].unit;
                    }
                    else if (prop === "clip-polygon") {
                        let str = "";
                        datas.value.forEach((v,num) => {
                            str += ((num+1) % 2 == 0 && (num+1) != valRef.value.length) ? v.value + v.unit + "," : v.value + v.unit;
                        });
                        toReturn[prop] = str;
                    }
                }
                else if (isFilterProperty(prop)) {
                    //buildFilters(el,prop,valRef);
                } else {
                    toReturn[prop] = datas.value+datas.unit;
                }
            }
            return toReturn;
        }

        getEasingValues() {
            const toReturn = {};
            const time = this.reversed === true ? this.reversedTime : this.currentTime;

            for(let prop in this.from){
                const propFrom = this.from[prop];
                const propTo = this.to[prop];
                const propChange = this.change[prop];

                if(propFrom && propTo && propChange){
                    const propFromValue = propFrom.value;
                    const propToValue = propTo.value;
                    const propChangeValue = propChange.value;
                    
                    if (Array.isArray(propChangeValue) === true && Array.isArray(propFromValue) === true) {
                        const values = [];
                        propChangeValue.forEach((valChange,index) => {
                            const valFrom = propFromValue[index];
                            const valTo = propToValue[index];
                            //const valTaken = this.reversed === true ? valTo : valFrom;
                            const valTaken = valFrom;
                            if(typeof valFrom === "number" && typeof valTo==="number" && typeof valChange === "number"){
                                const calc = (this.cubic === true && prop==="left"||prop==="top") ? getCubicValue(this,null,null,prop) : easings[this.easing](time, valTaken, valChange, this.duration);
                                values.push(calc);
                            } else {
                                if (valChange.letter && valChange.values) {
                                    values[index] = { letter: valChange.letter, values: [] };
                                    for (let v = 1; v <= valChange.values.length; v++) {
                                        change[index].values.push(easings[this.easing](time, valTaken.values[v - 1], valChange.values[v - 1], this.duration));
                                    }
                                } else {
                                    values.push({
                                        value: easings[this.easing](time, valTaken.value, valChange.value, this.duration),
                                        unit: valChange.unit
                                    });
                                }  
                            }
                        });
                        toReturn[prop] = {
                            value:values,
                            unit:propFrom.unit
                        }
                    } else {
                        let value;
                        if(Array.isArray(this.cubic) && (prop==="left"||prop==="top")){
                            value = getCubicValue(this,null,null,prop);
                        } else {
                            value = easings[this.easing](time, propFromValue, propChangeValue, this.duration);
                        }
                        toReturn[prop] = {
                            value:value,
                            unit:propFrom.unit
                        }
                    } 
                }
            }

            return toReturn;        
        }

        update(timestamp) {
            const currentTime = timestamp
            //Si l'élément n'existe plus, alors on supprime toutes les occurences ayant cet élément
            if (!this.element.parentNode) {
                //deleteAnimsByElement();
                return;
            }

            if (!this.startTime && this.finished === false) {
                this.startTime = currentTime;
            }

            if (this.finished === true) {
                return;
            }

            //La valeur temps est également à celle actuelle + (la dernière enregistrée - celle de départ) afin de retrancher pour celles ayant des delay > 0
            const time = (currentTime + (this.lastTime - this.startTime));
            this.currentTime = minMax(time, this.delay, (this.duration + this.delay)) - this.delay;
            const percent = (this.currentTime / this.duration) * 100;
            const reversedPercent = 100 - percent;
            this.reversedTime = reversedPercent / 100 * this.duration;
            this.percent = minMax(percent, 0, 100);
            //Delay
            if (time >= this.delay && this.finished === false) {
                if (!this.started) {
                    this.started = true;
                    this.start(this);
                }
                this.animating = true;
                //Remise à jours des propriétés de départ (si l'élément a été modifié entre temps. Animations successives par exemple)
                if(this.updated===false && this.updatable===true && this.reversed===false){
                    this.updated=true;
                    this.from = getProperties(this.element,this.properties,null,null,this.to);
                    this.change = getChanges(this.to,this.from,this.rejectSame);
                }
                this.apply();
            }
            //Fin de l'animation
            if (time >= (this.duration + this.delay) && this.animating === true) {
                this.lastTime = 0;
                this.paused = true;
                this.animating = false;
                if (this.finished === false) {
                    this.paused = true;
                    this.finished = true;
                    this.end(this);
                }
                //removeWillChange(this.element);
            }

            if (this.animating === true) {
                this.progress(this);
            }
        }

        play() {
            if (this.paused === false) {
                if (this.finished === true && this.resettable === true) {
                    this.reset();
                }
                this.paused = false
                actives.push(this)
                launch()
                return this
            }
        }

        pause() {
            this.paused = true;
            let bonus = 0;
            this.animating = false;
            if(this.finished===false){
                //Le bonus (décalage) est attribué uniquement aux animations suivantes non démarrées, sinon, leur delay est utilisé
                const bonus2 = this.delay;
                resetTime(this, bonus2);
                if (this.lastTime != 0 && !bonus) {
                    //Bonus attribué
                    bonus = this.lastTime;
                }
            }
            
            return this;
        }

        resume() {
            this.paused = false;
            actives.push(this);
            launch();
            return this;
        }

        switch(){
            this.reversed = !this.reversed
            if(this.reversed===true){
                this.delay = this.delayReversed
            } else {
                this.delay = this.delayNormal
            }
            
            this.percent = 100 - this.percent
            this.currentTime = this.reversedTime
            if(this.finished===true){
                this.finished = false
            }
            resetTime(this, this.delay);
            this.apply();
            //this.animating = false
            //this.setAt(100 - this.percent)
            //this.animating = true
            return this;
        }

        reset() {
            this.finished = false;
            this.started = false;
            this.paused = false;
            this.currentTime = 0;
            this.reversedTime = this.duration;
            this.startTime = 0;
            this.lastTime = 0;
            this.updated = false;
            this.apply();
            return this;
        }

        restart() {
            this.reset().play();
        }

        setAt(p) {
            if(this.animating===true){
                return;
            }
            p = minMax(p,0,100);
            const time = Math.round(p / 100 * this.duration);
            this.currentTime = minMax(time, 0, this.duration);
            //this.currentTime = minMax(time, this.delay, (this.duration + this.delay)) - this.delay;
            this.lastTime = this.reversed===true ? time : time;
            //this.startTime = time - this.currentTime
            const percent = (this.currentTime / this.duration) * 100;
            const reversedPercent = 100 - percent;
            this.reversedTime = reversedPercent / 100 * this.duration;
            this.percent = minMax(percent, 0, 100);
            this.apply();
            if (time >= (this.duration)) {
                this.lastTime = 0;
                this.finished = true;
            } else {
                this.finished = false;
            }
        }

        apply(props){
            const values = props ? props : this.getEasingValues();
            if(this.unapplied===false){
                buildProperties(this.element,values,this.animating);
            }
        }
    }

    function animate(props) {
        const defaults = {
            element: null,
            properties: [],
            duration: 1000,
            delay: 0,
            easing: "linear",
            autoplay: true,
            reversed: false,
            start: function () { },
            end: function () { },
            progress: function () { }
        };
        let options = Object.assign(defaults, props);
        if(options.element instanceof NodeList){
            const anims = [];
            options.element.forEach((element,index)=> {
                const newOptions = Object.assign({},options);
                newOptions.element = element;
                if(newOptions.delay.indexOf("/")!=-1){
                    const delay = index*parseFloat(newOptions.delay.replace("/",""));
                    newOptions.delay = delay;
                }
                anims.push(new Animations(newOptions))
                ID++
            });
            return anims;
        } else {
            const anim = new Animations(options)
            ID++
            return anim;    
        }
    }

    window.animate = animate;
})();