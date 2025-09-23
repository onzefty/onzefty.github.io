// REQUESTANIMATIONFRAME
var requestAnimationFrame = (function () {
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
var cancelAnimationFrame = (function () {
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

var limitLoop = function (fn, fps) {
    // Use var then = Date.now(); if you
    // don't care about targetting < IE9
    var then = new Date().getTime();

    // custom fps, otherwise fallback to 60
    fps = fps || 60;
    var interval = 1000 / fps;

    return (function loop(time) {
        requestAnimationFrame(loop);

        // again, Date.now() if it's available
        var now = new Date().getTime();
        var delta = now - then;

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

function minMax(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

(function () {
    var actives = [], animating = false,
        ID = 0,
        easings = {
            linear: function (t, b, c, d) {
                return c * t / d + b;
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
                var s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            inOutBack: function (t, b, c, d) {
                var s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        performance = function () {
            var perf = window.performance || {};
            if (typeof perf.now !== "function") {
                var nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : now();
                perf.now = function () {
                    return now() - nowOffset;
                };
            }
            return perf;
        }(),
        isTransformProperty = function (p) {
            if(p=="grayscale"){
                return false;
            }
            else if (p.indexOf("scale") != -1 || p.indexOf("rotate") != -1 || p.indexOf("skew") != -1 || p.indexOf("translate") != -1) {
                return true;
            }
            return false;
        },
        isColorProperty = function (p) {
            if (p.indexOf("color") != -1 || p.indexOf("Color") != -1 || p=="stroke") {
                return true;
            }
            return false;
        },
        isClipProperty = function (p) {
            if (p.indexOf("clip") != -1) {
                return true;
            }
            return false;
        },
        isFilterProperty = function(p){
            return (p.indexOf("blur")!=-1||p.indexOf("grayscale")!=-1);
        },
        getUnit = function (el, s, v) {
            if (typeof v == "number") {
                if (s.indexOf("rotate") != -1 || s.indexOf("skew") != -1) {
                    return "deg";
                }
                else if(s=="stroke-dashoffset"){
                    return "px";
                } else {
                    return "";
                }
            } else {
                if (s == "rotate3d") {
                    return "deg";
                }
                else if (isColorProperty(s) || s == "opacity") {
                    return "";
                }
                else if (isClipProperty(s) && s.indexOf("polygon") != -1) {
                    return v.match(/[^0-9\.-]/g).join("");
                }
                else if(isFilterProperty(s)){
                    switch(s){
                        case "blur":
                            return v.match(/[^0-9\.-]/g).join("");
                        break;
                    }
                } else {
                    var match = v.match(/[^0-9\.-]/g)
                    return match ? match.join("") : "";
                }
            }
        },
        //Retourne la/les valeur(s) de départ sous format nombre
        getStartValue = function (el, prop, unit) {
            if (isTransformProperty(prop)) {
                if (typeof el == "string") {
                    if (prop == "rotate3d") {
                        var tab = el.split(",").map(function (v) { return parseFloat(v.replace(/[^0-9\.-]/g, "")); })
                        return tab;
                    } else {
                        var val = el.replace(/[^0-9\.-]/g, "");
                        return parseFloat(val);
                    }
                }
                else if (typeof el == "number") {
                    return el;
                } else {
                    //Cas transform
                    var t = el.style.transform;
                    if (t && t.indexOf(prop) == -1) {
                        if (prop == "rotate3d") {
                            return [0, 0, 0, 0];
                        }
                        return 0;
                    } else {
                        var reg = new RegExp(prop + '\\((.*?)\\)', 'g');
                        r = t.match(reg).join("");
                        if (prop == "rotate3d") {
                            var regValues = new RegExp('\\((.*?)\\)', 'g'),
                                values = r.match(regValues).join("").replace(/\(|\)/g, "");
                            var tab = values.split(",").map(function (v) { return parseFloat(v.trim().replace(/[^0-9\.-]/g, "")); });
                            return tab;
                        } else {
                            var val = r.replace(/[^0-9\.-]/g, "");
                            return parseFloat(val);
                        }
                    }
                }
            }
            else if (isColorProperty(prop)) {
                //Cas couleurs
                var bc = (typeof el == "string") ? el : window.getComputedStyle(el).getPropertyValue(prop);
                //CAS IE (transparent)
                if (bc == "transparent") {
                    bc = 'rgba(0, 0, 0, 0)';
                }
                //Cas Edge/IE qui ne scinde pas pareil pour les composites
                if (bc.length == 0) {
                    switch (prop) {
                        case "border-color":
                            bc = window.getComputedStyle(el).getPropertyValue("border-bottom-color");
                            break;
                    }
                }
                //Cas des couleurs (transformations des valeurs hexa en rgba, + rgb en rgba)
                if (bc.indexOf("#") != -1) {
                    var c = hexToRgbA(bc).match(/\(.*?\)/g).join("").replace(/\(|\)/g, "").split(",");
                }
                else if (bc.indexOf("rgb") != -1 && bc.indexOf("rgba") == -1) {
                    var c = bc.match(/\(.*?\)/g).join("").replace(/\(|\)/g, "").split(",");
                    c.push("1");
                } else {
                    var c = bc.match(/\(.*?\)/g).join("").replace(/\(|\)/g, "").split(",");
                }
                return c.map(Number);
            }
            else if (isClipProperty(prop)) {
                var c = typeof el == "string" ? el : window.getComputedStyle(el).getPropertyValue("clip-path");
                if (prop == "clip-circle") {
                    if (c != "none") {
                        var tab = c.match(/[-.0-9]*.(%|px|rem|em)/g),
                            t = [];
                        for (var i = 1; i <= tab.length; i++) {
                            var tabEl = tab[i - 1];
                            t.push({
                                value: parseFloat(tabEl.match(/[-100000000-99999999999999999999\.-]/g).join("")),
                                unit: tabEl.match(/[^\.\--100000000-99999999999999999999]/g).join("")
                            })
                        }
                        return t;
                    }
                }
                else if (prop == "clip-polygon") {
                    if (c != "none") {
                        c = c.replace(/path\(|\'|\)|"/g, "");
                        var tab = c.trim().match(/[-.0-9]*.(%|px|rem|em)/g),
                            t = [];
                        for (var i = 1; i <= tab.length; i++) {
                            var tabEl = tab[i - 1];
                            t.push({
                                value: parseFloat(tabEl.match(/[-100000000-99999999999999999999\.-]/g).join("")),
                                unit: tabEl.match(/[^\.\--100000000-99999999999999999999]/g).join("")
                            })
                        }
                        return t;
                    }
                }
                else if (prop == "clip-path") {
                    if (c != "none") {
                        //(?<=[A-Z])(.*?)(?=[A-Z])
                        c = c.replace(/path\(|\'|\)|"/g, "");
                        var tab = c.match(/[A-Z].*?(?=[A-Z])/g),
                            toReturn = [];
                        for (var t = 1; t <= tab.length; t++) {
                            var tt = tab[t - 1];
                            toReturn[t - 1] = {
                                letter: tt.match(/[A-Z]/g).join(""),
                                values: []
                            };
                            var values = tt.match(/([-100000000-99999999999999999999]|\,|\s|\-|\.)/g).join("").trim().split(/,|\s/g)
                            for (var v = 1; v <= values.length; v++) {
                                toReturn[t - 1].values.push(parseFloat(values[v - 1]));
                            }
                        }
                        return toReturn;
                    }
                }
            }
            else if(isFilterProperty(prop)){
                if(typeof el == "number"){
                    return el;
                }
                var f = typeof el == "string" ? el : window.getComputedStyle(el).getPropertyValue("filter");
                if(f=="none"){
                    return;
                }
                var reg1 = new RegExp(prop+'\\((.*?)\\)', 'g');
                var reg2 = new RegExp('\\((.*?)\\)', 'g');
                var match1 = f.match(reg1)
                var output1 = match1 ? match1.join("") : null;
                var output2 = output1 ? output1.match(reg2).join("").replace(/\(|\)/g, "").replace(/[^0-9\.-]/g, "") : f.replace(/[^0-9\.-]/g, "");
                return parseFloat(output2);
            } else {
                if (typeof el == "string") {
                    var val = el,
                        u = val.match(/[^0-9\.-]/g).join("");
                    if (u != unit) {
                        val = convertValueFromUnit(val, unit, u, el, prop);
                    }
                    return parseFloat(val.match(/[0-9\.-]/g).join(""));
                }
                else if (typeof el == "number") {
                    return el;
                } else {
                    var val = window.getComputedStyle(el, null).getPropertyValue(prop);
                    u = val.match(/[^0-9\.]/g) == null ? "" : val.match(/[^0-9\.-]/g).join("");
                    el.style.display = "none";
                    var val2 = window.getComputedStyle(el, null).getPropertyValue(prop),
                        u2 = val2.match(/[^0-9\.]/g) == null ? "" : val2.match(/[^0-9\.-]/g).join("");
                    el.style.display = "";
                    if (unit == u2) {
                        var v = val2;
                    }
                    else if (u != unit && unit != u2) {
                        var v = convertValueFromUnit(val, unit, u, el, prop);
                    } else {
                        v = val;
                    }
                    if(v==""||v==undefined){
                        return null;
                    } else {
                        return parseFloat(v.match(/[0-9\.-]/g).join(""));
                    }
                }
            }
        },
        //Retourne la/les valeur(s) en cours d'animation sous format chaîne de caractères (CSS)
        getAnimatingValue = function (el, property, value, unit) {
            if (isTransformProperty(property)) {
                return buildTransform(el, property, value, unit);
            }
            else if (isColorProperty(property)) {
                return buildColors(el, property, value);
            }
            else if (isClipProperty(property)) {
                var values = buildPath(el, property, value, unit);
                return values;
            }
            else if(isFilterProperty(property)){
                return buildFilters(el,property,value,unit);
            } else {
                return value;
            }
        },
        //Retourne la/les valeur(s) d'arrivée sous format nombre
        getEndValue = function (property, value, unit, start) {
            if (property.indexOf("translate") != -1 || property.indexOf("skew") != -1 || property.indexOf("rotate") != -1) {
                if (property == "rotate3d") {
                    var tab = !Array.isArray(value) ? value.split(",") : value;
                    return tab.map(function (v) { return parseFloat(v) });
                }
                return parseFloat(value);
            }
            else if (isColorProperty(property)) {
                if (value.indexOf("#") != -1) {
                    if (value.length == 4) {
                        value += value[1] + value[1] + value[1];
                    }
                    value = hexToRgbA(value);
                    var c = value.match(/\(.*?\)/g).join("").replace(/\(|\)/g, "").split(",");
                }
                else if (value.indexOf("rgb") != -1 && value.indexOf("rgba") == -1) {
                    var c = value.match(/\(.*?\)/g).join("").replace(/\(|\)/g, "").split(",");
                    c.push("1");
                } else {
                    var c = value.match(/\(.*?\)/g).join("").replace(/\(|\)/g, "").split(",");
                }
                return c.map(Number);
            }
            else if (isClipProperty(property)) {
                if (property == "clip-circle") {
                    var tab = value.trim().match(/[-100000000-99999999999999999999\.-]*.(%|px|rem|em)/g),
                        t = [];
                    for (var i = 1; i <= tab.length; i++) {
                        var tabEl = tab[i - 1];
                        t.push({
                            value: parseFloat(tabEl.match(/[-100000000-99999999999999999999\.-]/g).join("")),
                            unit: tabEl.match(/[^\.\--100000000-99999999999999999999]/g).join("")
                        })
                    }
                    return t;
                }
                else if (property == "clip-polygon") {
                    var tab = value.trim().match(/[-100000000-99999999999999999999\.-]*.(%|px|rem|em)/g),
                        t = [];
                    for (var i = 1; i <= tab.length; i++) {
                        var tabEl = tab[i - 1];
                        t.push({
                            value: parseFloat(tabEl.match(/[-100000000-99999999999999999999\.-]/g).join("")),
                            unit: tabEl.match(/[^\.\--100000000-99999999999999999999]/g).join("")
                        })
                    }
                    return t;
                }
                else if (property == "clip-path") {
                    var tab = value.match(/[A-Z].*?(?=[A-Z])/g),
                        toReturn = [];
                    for (var t = 1; t <= tab.length; t++) {
                        var tt = tab[t - 1];
                        toReturn[t - 1] = {
                            letter: tt.match(/[A-Z]/g).join(""),
                            values: []
                        };
                        var values = tt.match(/([0-9]|\,|\s|\-|\.)/g).join("").trim().split(/,|\s/g)
                        for (var v = 1; v <= values.length; v++) {
                            toReturn[t - 1].values.push(parseFloat(values[v - 1]));
                        }
                    }
                    return toReturn;
                }
            }
            else if(isFilterProperty(property)){
                switch(property){
                    case "blur":
                        return parseFloat(value);
                    break;
                    case "grayscale":
                        return parseFloat(value);
                    break;
                }
            } else {
                return parseFloat(value);
            }
        },
        //Retourne la valeur animée selon l'easing sous format nombre
        getEasingValue = function (a, datas, el, prop) {
            //Si animation de retour, on prend reversedTime pour partir de la fin (reproduire l'inverse) et la donnée de fin pour calculer la valeur actuelle
            var time = a.reversed == true ? a.reversedTime : a.currentTime;
            if (Array.isArray(datas.change) == true && Array.isArray(datas.start) == true) {
                var change = [];
                for (var c = 1; c <= datas.change.length; c++) {
                    var cc = datas.change[c - 1],
                        end = datas.end[c - 1],
                        start = datas.start[c - 1],
                        ss = a.reversed == true ? end : start;
                    if (typeof cc == "number" && typeof end == "number" && typeof start == "number") {
                        change.push(easings[a.easing](time, ss, cc, a.duration));
                    } else {
                        if (cc.letter && cc.values) {
                            change[c - 1] = { letter: cc.letter, values: [] };
                            for (var v = 1; v <= cc.values.length; v++) {
                                change[c - 1].values.push(easings[a.easing](time, ss.values[v - 1], cc.values[v - 1], a.duration))
                            }

                        } else {
                            change.push({
                                value: easings[a.easing](time, ss.value, cc.value, a.duration),
                                unit: datas.change[c - 1].unit
                            });
                        }
                    }
                }
                return change;
            } else {
                return a.reversed == true ? easings[a.easing](time, datas.end, datas.change, a.duration) : easings[a.easing](time, datas.start, datas.change, a.duration);
            }
        },
        //Retourne la valeur animée cubic 
        getCubicValue = function (a, datas, el, prop) {
            var time = a.reversed == true ? a.reversedTime : a.currentTime,
                coords = getCubicValues(time / a.duration, a.cubic),
                value = prop == "left" || prop == "translateX" ? coords.x : coords.y;
            //withEasing = a.reversed == true ? easings[a.easing](time, datas.end, value, a.duration) : easings[a.easing](time, datas.start, value, a.duration);
            //TEMPORAIRE
            return value;
        },
        //Retourne la différence entre la valeur d'arrivée et celle de départ
        getChangeValue = function (end, start) {
            if (Array.isArray(end) == true && Array.isArray(start) == true) {
                var change = [];
                for (var e = 1; e <= end.length; e++) {
                    var ee = end[e - 1],
                        ss = start[e - 1];
                    if (typeof ee == "number" && typeof ss == "number") {
                        change.push(ee - ss);
                    } else {
                        if (ee.letter && ee.values) {
                            change[e - 1] = { letter: ee.letter, values: [] };
                            for (var v = 1; v <= ee.values.length; v++) {
                                change[e - 1].values.push(ee.values[v - 1] - ss.values[v - 1])
                            }
                        } else {
                            change.push({ value: ee.value - ss.value, unit: ee.unit });
                        }
                    }
                }
                return change;
            } else {
                return (end - start);
            }
        },
        //Retourne le delay (cas "next" | "same" | "+number")
        getDelay = function (tab, index) {
            var el = tab[index],
                delay = el.delay,
                prevEl = tab[index - 1],
                prevDelay = prevEl == undefined ? 0 : typeof prevEl.delay == "number" ? prevEl.delay : 0,
                duration = el.duration;
            if (typeof delay == "string") {
                if (delay == "next") {
                    return (prevEl.duration + prevDelay);
                }
                else if (delay == "same") {
                    return prevDelay;
                }
                else if (delay.indexOf("+") != -1) {
                    return (parseInt(delay) + prevDelay);
                }
            } else {
                return delay;
            }
        },
        //Met à jour une propriété CSS avec une chaîne de caractères
        setPropertyValue = function (e, p, v, u) {
            if (isTransformProperty(p)) {
                e.style.transform = v;
            }
            else if (isColorProperty(p)) {
                e.style[p] = v;
            }
            else if (isClipProperty(p)) {
                e.style["clip-path"] = v;
            }
            else if (isFilterProperty(p)) {
                e.style["filter"] = v;
            } else {
                e.style[p] = v + u;
            }
        },
        //Met à jour le CSS en début (ajout des transforms et des filters)
        updateCSS = function (el) {
            var t = el.style.transform,
                ts = ["translateX", "translateY", "translateZ", "rotateX", "rotateY", "rotate", "rotate3d", "scaleX", "scaleY", "skewX", "skewY"],
                tn = "";
            if (t.length > 0) {
                var rt = t.match(/(scaleX|scaleY|translateX|translateY|rotateX|rotateY|rotate3d|skewX|skewY|rotate\(|scale\(|translate\(|skew\(|translateZ)/g);
                for (var m = 1; m <= rt.length; m++) {
                    var mt = rt[m - 1];
                    if (mt == "scale(" || mt == "translate(" || mt == "skew(") {
                        mt = mt.replace("(", "");
                        var reg = new RegExp(mt + '\\((.*?)\\)', 'g'),
                            r = t.match(reg).join(""),
                            reg2 = new RegExp("\\(.*\\)", 'g'),
                            ct = r.match(reg2).join("").replace(/\(|\)/g, "").split(",");
                        for (var c = 1; c <= ct.length; c++) {
                            var cc = ct[c - 1].trim(),
                                cv = cc.match(/\d/g).join(""),
                                cu = cc.match(/\D/g);
                            if (cu != null) {
                                tn += mt + ((c == 1) ? "X" : "Y") + "(" + cv + cu.join("") + ")";
                            } else {
                                tn += mt + ((c == 1) ? "X" : "Y") + "(" + cv + ")";
                            }
                        }
                    } else {
                        if (mt == "rotate(") {
                            mt = "rotate";
                        }
                        var regProp = new RegExp(mt + '\\((.*?)\\)', 'g'),
                            r = t.match(regProp).join(""),
                            regValues = new RegExp('\\((.*?)\\)', 'g'),
                            vals = r.match(regValues).join("").replace(/\(|\)/g, "");
                        if (vals.indexOf(",") != -1) {
                            tn += r;
                        } else {
                            var val = t.replace(/\D/g, ""),
                                reg2 = new RegExp("\\(.*\\)", 'g'),
                                unit = t.match(reg2).join("").replace(/\d|\(|\)/g, "");
                            tn += mt + "(" + val + unit + ") ";
                        }
                    }
                }
            }
            //Ajout des éléments manquantes
            for (var ts1 = 1; ts1 <= ts.length; ts1++) {
                var tsn = ts[ts1 - 1];
                if (tn.indexOf(tsn + "(") == -1) {
                    var u = tsn == "rotate" || tsn == "rotateX" || tsn == "rotateY" || tsn == "rotate3d" || tsn == "skewX" || tsn == "skewY" ? "deg" : tsn == "scaleX" || tsn == "scaleY" ? "" : "px",
                        v = tsn == "rotate3d" ? "0,0,0,0" : tsn == "scaleX" || tsn == "scaleY" ? 1 : 0;
                    tn += tsn + "(" + v + u + ")";
                }
            }
            el.style.transform = tn;
            //Filtres
            var f = window.getComputedStyle(el).getPropertyValue("filter"),
                fs = ["blur","grayscale"],
                fn = "";
            if (f!="none") {
                var rf = f.match(/(blur|grayscale)/g);
                for (var m = 1; m <= rf.length; m++) {
                    var mt = rf[m - 1];
                    var regProp = new RegExp(mt + '\\((.*?)\\)', 'g'),
                        r = f.match(regProp).join(""),
                        regValues = new RegExp('\\((.*?)\\)', 'g'),
                        vals = r.match(regValues).join("").replace(/\(|\)/g, "");
                    if (vals.indexOf(",") != -1) {
                        fn += r;
                    } else {
                        var val = r.replace(/\D/g, ""),
                            reg2 = new RegExp("\\(.*\\)", 'g'),
                            unit = r.match(reg2).join("").replace(/\d|\(|\)/g, "");
                        fn += mt + "(" + val + unit + ") ";
                    }
                }
            }
            //Ajout des éléments manquantes
            for (var fs1 = 1; fs1 <= fs.length; fs1++) {
                var fsn = fs[fs1 - 1];
                if (fn.indexOf(fsn + "(") == -1) {
                    var v, u;
                    switch(fsn){
                        case "blur":
                            v="-1";
                            u="px";
                        break;
                        case "grayscale":
                            v="0";
                            u="";
                        break;
                    }
                    fn += fsn + "(" + v + u + ")";
                }
            }
            el.style.filter = fn;
        },
        //Modifie le nombre de propriété => 'backgroundColor' --> 'background-color'
        changePropertyName = function (p) {
            if (/[A-Z]/g.test(p) == true && p.match(/[A-Z].*/g)[0].length > 1) {
                var b = p.match(/[A-Z].*/g).join("").toLowerCase(),
                    f = p.match(/.+?(?=[A-Z])/g).join("");
                return f + "-" + b;
            }
            return p;
        },
        //Si l'unité de départ et celle d'arrivée diffèrent, conversion
        convertValueFromUnit = function (value, uD, uO, el, prop) {
            var v = parseFloat(value.match(/([0-9]|\.)/g).join("")),
                p = el.parentNode;
            switch (uD) {
                case "vw":
                    var vn = (v / window.innerWidth) * 100;
                    return (vn.toString() + uD);
                    break;

                case "vh":
                    var vn = (v / window.innerWidth) * 100;
                    return (vn.toString() + uD);
                    break;

                case "%":
                    //Dépend de la propriété
                    switch (prop) {
                        case "left":
                            return ((el.offsetLeft / p.offsetWidth * 100).toString() + uD);
                            break;
                        case "top":
                            return ((el.offsetTop / p.offsetHeight * 100).toString() + uD);
                            break;
                        case "right":
                            return ((100 - ((el.offsetLeft + el.offsetWidth) / p.offsetWidth * 100)).toString() + uD);
                            break;
                        case "bottom":
                            return ((100 - ((el.offsetTop + el.offsetHeight) / p.offsetHeight * 100)).toString() + uD);
                            break;
                        case "width":
                            return ((el.offsetWidth / p.offsetWidth * 100).toString() + uD);
                            break;
                        case "height":
                            return ((el.offsetHeight / p.offsetHeight * 100).toString() + uD);
                            break;
                        case "font-size":
                            return (((3 / 4 * vn) * 100 / 12).toString() + uD);
                            break;
                        case "margin":
                            return ((vn / p.offsetWidth * 100).toString() + uD);
                            break;
                        case "margin-left":
                            return ((vn / p.offsetWidth * 100).toString() + uD);
                            break;
                        case "margin-top":
                            return ((vn / p.offsetWidth * 100).toString() + uD);
                            break;
                        case "margin-bottom":
                            return ((vn / p.offsetWidth * 100).toString() + uD);
                            break;
                        case "margin-right":
                            return ((vn / p.offsetWidth * 100).toString() + uD);
                            break;

                    }
                    break;

                case "em":
                    return ((v * 1 / 16).toString() + uD)
                    break;

                case "pt":
                    return ((v * 3 / 4).toString() + uD)
                    break;

                default:
                    //Pixels
                    break;
            }
        },
        //Retourne la chaîne de caractères de la valeur transform
        buildTransform = function (el, property, value, unit) {
            var t = el.style.transform,
                v = "", matches = t.match(/(scaleX|scaleY|translateX|translateY|skewX|skewY|rotate\(|rotateX|rotateY|rotate3d|translateZ)/g);
            if (matches.length > 0) {
                for (var m = 1; m <= matches.length; m++) {
                    var ma = matches[m - 1];
                    if (ma == "rotate(") {
                        ma = "rotate";
                    }
                    if (ma == property) {
                        v += property + "(" + value + unit + ") ";
                    } else {

                        var regProp = new RegExp(ma + '\\((.*?)\\)', 'g'),
                            r = t.match(regProp).join(""),
                            regValues = new RegExp('\\((.*?)\\)', 'g'),
                            vals = r.match(regValues).join("").replace(/\(|\)/g, "");
                        if (vals.indexOf(",") != -1) {
                            v += r;
                        } else {
                            var val = r.replace(/[^0-9\.-]/g, ""),
                                reg2 = new RegExp("\\(.*\\)", 'g'),
                                u = r.match(reg2).join("").replace(/\d|\(|\)|\.|\-/g, "");
                            v += ma + "(" + val + u + ") ";
                        }
                    }
                }
            }
            return v;
        },
        //Retourne la chaîne de caractères de la valeur color
        buildColors = function (el, property, value) {
            var s = "rgba(";
            for (var v = 1; v <= value.length; v++) {
                s += (v == value.length) ? value[v - 1] + ")" : value[v - 1] + ",";
            }
            return s;
        },
        //Retourne la chaîne de caractères de clip-path
        buildPath = function (el, property, value, unit) {
            var clipPath = window.getComputedStyle(el).getPropertyValue("clip-path"),
                values = "";
            if (property == "clip-circle") {
                values = "circle(" + value[0].value + value[0].unit + " at " + value[1].value + value[1].unit + " " + value[2].value + value[2].unit + ")";
            }
            else if (property == "clip-polygon") {
                values = "polygon(";
                for (var v = 1; v <= value.length; v++) {
                    values += (v % 2 == 0 && v != value.length) ? value[v - 1].value + value[v - 1].unit + "," : value[v - 1].value + value[v - 1].unit + " ";
                }
                values += ")";
            }
            else if (property == "clip-path") {
                values = "path('";
                for (var v = 1; v <= value.length; v++) {
                    var vv = value[v - 1];
                    switch (vv.letter) {
                        case "A":
                            values += vv.letter + " " + vv.values[0] + "," + vv.values[1] + " " + vv.values[2] + "," + vv.values[3] + "," + vv.values[4] + " " + vv.values[5] + "," + vv.values[6] + " ";
                            break;
                        default:
                            values += vv.letter + " " + vv.values.join(",") + " ";
                            break;
                    }
                }
                values += "Z')";
            }
            return values;
        },
        //Retourne la chaîne de caractères de filter
        buildFilters = function (el, property, value, unit) {
            var f = window.getComputedStyle(el).getPropertyValue("filter"),
                v = "", matches = f.match(/(blur|grayscale)/g);
            if (matches.length > 0) {
                for (var m = 1; m <= matches.length; m++) {
                    var ma = matches[m - 1];
                    if (ma == property) {
                        v += property + "(" + value + unit + ") ";
                    } else {
                        var regProp = new RegExp(ma + '\\((.*?)\\)', 'g'),
                            r = f.match(regProp).join(""),
                            regValues = new RegExp('\\((.*?)\\)', 'g'),
                            vals = r.match(regValues).join("").replace(/\(|\)/g, "");
                        if (vals.indexOf(",") != -1) {
                            v += r;
                        } else {
                            var val = r.replace(/[^0-9\.-]/g, ""),
                                reg2 = new RegExp("\\(.*\\)", 'g'),
                                u = r.match(reg2).join("").replace(/\d|\(|\)|\.|\-/g, "");
                            v += ma + "(" + val + u + ") ";
                        }
                    }
                }
            }
            return v;
        },
        hexToRgbA = function (hex) {
            var c;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                c = hex.substring(1).split('');
                if (c.length == 3) {
                    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c = '0x' + c.join('');
                return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
            } else {
                return undefined;
            }
        },
        getEndTime = function () {
            var value = 0
            for (var i = 1; i <= actives.length; i++) {
                var e = actives[i - 1];
                if (e.finished == false) {
                    value = Math.max(value, e.delay + e.duration);
                }
            }
            return value;
        },
        loopThrough = function (timestamp) {
            var currentTime = performance.now();
            len = actives.length,
                i = 0;

            while (i < len) {
                var active = actives[i];
                if (active.paused == false) {
                    active.update(timestamp);
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
        },
        launch = function () {
            if (actives.length > 0 && animating == false) {
                animating = true;
                requestAnimationFrame(loopThrough);
            } else {
                animating = false;
                cancelAnimationFrame(loopThrough);
            }
        };

    function minMax(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function findDot(x, y, length, angle, minusX, minusY) {
        var newX = (minusX == undefined || minusX == "") ? x + Math.cos(angle) * length : x - Math.cos(angle) * length;
        var newY = (minusY == undefined || minusY == "") ? y + Math.sin(angle) * length : y - Math.sin(angle) * length;
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
        var distance = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
        var t = length / distance;
        var x = ((1 - t) * line.x1 + (t * line.x2));
        var y = ((1 - t) * line.y1 + (t * line.y2));
        var dx = line.x2 - line.x1, dy = line.y2 - line.y1, angle;
        angle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (0 < t && t < 1) {
        } else if (t < 0) {
            console.log("en dehors proche du premier point.");
        } else if (t > 1) {
            console.log("en dehors proche du deuxième point.");
        }
        return { x: x, y: y, angle: angle };
    }

    function getLineFromDots(point1, point2) {
        var dx = point2.x - point1.x, dy = point2.y - point1.y, angle;
        var d = Math.sqrt((dx) * (dx) + (dy) * (dy));
        angle = Math.atan2(dy, dx) * 180 / Math.PI;
        return { length: d, angle: angle, dx: dx, dy: dy, x1: point1.x, y1: point1.y, x2: point2.x, y2: point2.y };
    }

    function radToDeg(radians) {
        var degres = radians * 180 / Math.PI;
        return degres > 0.0 ? degres % 360 : (degres + 360.0) % 360;
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function getCubicValues(t, cubic) {
        //Lignes entre les points
        var linesM = [],
            linesG = [],
            line;
        for (var l = 1; l <= cubic.length - 1; l++) {
            var dot1 = cubic[l - 1],
                dot2 = cubic[l],
                coords1 = { x: dot1[0], y: dot1[1] },
                coords2 = { x: dot2[0], y: dot2[1] };
            linesM.push(getLineFromDots(coords1, coords2));
        }
        for (var m = 1; m <= linesM.length - 1; m++) {
            var dot1 = findDotOnLine(linesM[m - 1], t * linesM[m - 1].length),
                dot2 = findDotOnLine(linesM[m], t * linesM[m].length);
            linesG.push(getLineFromDots(dot1, dot2));
        }
        //Last line
        var dot1 = findDotOnLine(linesG[0], t * linesG[0].length),
            dot2 = findDotOnLine(linesG[1], t * linesG[1].length);
        line = getLineFromDots(dot1, dot2);
        var coords = findDotOnLine(line, t * line.length);

        return coords;
    }

    function animate(props) {
        var defaults = {
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
        },
            options = Object.assign(defaults, props),
            anim = {}, animations = [], currentTime = 0;

        function update(timestamp) {
            currentTime = timestamp;

            //Si l'élément n'existe plus, alors on supprime toutes les occurences ayant cet élément
            if (!this.element.parentNode) {
                //deleteAnimsByElement();
                return;
            }

            for (var a = 1; a <= this.animations.length; a++) {
                var animation = this.animations[a - 1];
                if (!animation.startTime && animation.finished == false) {
                    animation.startTime = currentTime;
                }

                if (animation.finished == true) {
                    continue;
                }

                //La valeur temps est également à celle actuelle + (la dernière enregistrée - celle de départ) afin de retrancher pour celles ayant des delay > 0
                var time = (currentTime + (animation.lastTime - animation.startTime));

                //Delay
                if (time >= animation.delay && animation.finished == false) {
                    if (!this.started) {
                        this.started = true;
                        this.start(this);
                    }
                    animation.animating = true;
                    for (var prop in animation.properties) {
                        var datas = animation.properties[prop];
                        if (datas.updated == undefined) {
                            //MAJ des valeurs de départ et de change si la valeur a changé entre temps (cas d'animations successives sur un même élément avec les mêmes propriétés)
                            var start = getStartValue(this.element, prop, datas.unit);
                            datas.start = start;
                            //Si reversed, on alterne les valeurs de début et de fin
                            datas.change = this.reversed == true ? getChangeValue(datas.start, datas.end) : getChangeValue(datas.end, datas.start);
                            datas.updated = true;
                        }
                        var value = animation.cubic ? getCubicValue(animation, datas, this.element, prop) : getEasingValue(animation, datas, this.element, prop);
                        value = getAnimatingValue(this.element, prop, value, datas.unit);
                        setPropertyValue(this.element, prop, value, datas.unit);
                    }
                    animation.currentTime = minMax(time, animation.delay, (animation.duration + animation.delay)) - animation.delay;
                    var percent = (animation.currentTime / animation.duration) * 100,
                        reversedPercent = 100 - percent;
                    animation.reversedTime = reversedPercent / 100 * animation.duration;
                    animation.percent = minMax(percent, 0, 100);
                }
                //Fin de l'animation
                if (time >= (animation.duration + animation.delay) && animation.animating == true) {
                    animation.lastTime = 0;
                    animation.paused = true;
                    animation.animating = false;
                    for (var prop in animation.properties) {
                        var datas = animation.properties[prop],
                            value = getAnimatingValue(this.element, prop, datas.end, datas.unit);
                        setPropertyValue(this.element, prop, value, datas.unit);
                    }
                    if (animation.finished == false) {
                        animation.finished = true;
                    }
                }
            }

            this.animating = setAnimating(this);
            this.percent = getProgressMain(this);
            if (this.animating == true) {
                this.progress(this);
            }

            if (this.isDone() == true && this.paused == false) {
                this.paused = true;
                this.finished = true;
                this.end(this);
            }
        }

        function play() {
            if (this.paused == false) {
                if (this.finished == true) {
                    this.reset();
                }
                this.paused = false;
                actives.push(this);
                launch();
            }
        }

        function pause() {
            this.paused = true;
            var bonus = 0;
            for (var a = 1; a <= this.animations.length; a++) {
                var anim = this.animations[a - 1];
                if (anim.finished == false) {
                    //Le bonus (décalage) est attribué uniquement aux animations suivantes non démarrées, sinon, leur delay est utilisé
                    var bonus2 = (anim.animating == false) ? bonus : anim.delay;
                    resetTime(anim, bonus2);
                    if (anim.lastTime != 0 && !bonus) {
                        //Bonus attribué
                        bonus = anim.lastTime;
                    }
                }
            }
        }

        function resume() {
            this.paused = false;
            actives.push(this);
            launch();
        }

        function reset() {
            this.finished = false;
            this.started = false;
            this.paused = false;
            this.currentTime = 0;
            this.reversedTime = this.duration;
            this.reversed = false;
            this.startTime = 0;
            this.lastTime = 0;
        }

        function restart() {
            this.reset();
            this.play();
        }

        function setAt(percent) {
            var cd = Math.round(percent / 100 * this.duration), bonus = 0;
            for (var a = 1; a <= this.animations.length; a++) {
                var anim = this.animations[a - 1],
                    cTime = minMax(cd, anim.delay, (anim.duration + anim.delay)) - anim.delay;
                anim.currentTime = cTime;
                animation.currentTime = minMax(cTime, animation.delay, (animation.duration + animation.delay)) - animation.delay;
                var percent = (animation.currentTime / animation.duration) * 100,
                    reversedPercent = 100 - percent;
                animation.reversedTime = reversedPercent / 100 * animation.duration;
                animation.percent = minMax(percent, 0, 100);
                anim.lastTime = cd;
                anim.startTime = 0;
                for (var prop in anim.properties) {
                    var datas = anim.properties[prop];
                    var start = getStartValue(this.element, prop, datas.unit);
                    datas.start = start;
                    //Si animation de retour, les données de start et end sont donc inversées
                    datas.change = this.reversed == true ? getChangeValue(datas.start, datas.end) : getChangeValue(datas.end, datas.start);
                    var value = animation.cubic ? getCubicValue(anim, datas, this.element, prop) : getEasingValue(anim, datas, this.element, prop);
                    value = getAnimatingValue(this.element, prop, value, datas.unit);
                    setPropertyValue(this.element, prop, value, datas.unit);
                }
                if (cd >= (anim.duration + anim.delay)) {
                    anim.lastTime = 0;
                    anim.finished = true;
                }
            }
        }

        function overrideCSS(props) {
            for (var a = 1; a <= this.animations.length; a++) {
                var anim = this.animations[a - 1];

                for (var prop in anim.properties) {
                    var datas = anim.properties[prop],
                        prop2 = changePropertyName(prop);
                    if (props[prop] != undefined || props[prop2] != undefined) {
                        var unit = getUnit(this.element, prop, props[prop]);
                        datas.unit = unit;
                        datas.start = getStartValue(props[prop], prop, unit);
                        datas.change = this.reversed == true ? getChangeValue(datas.start, datas.end) : getChangeValue(datas.end, datas.start);
                        var value = animation.cubic ? getCubicValue(anim, datas, this.element, prop) : getEasingValue(anim, datas, this.element, prop);
                        value = getAnimatingValue(this.element, prop, value, datas.unit);
                        setPropertyValue(this.element, prop, value, datas.unit);
                    }
                }
            }
        }

        function isDone() {
            return (this.animations.filter(function (a) { if (a.finished == true) { return a } }).length == this.animations.length);
        }

        function getDurationMax(a) {
            var d = 0;
            for (var b = 1; b <= a.animations.length; b++) {
                var bb = a.animations[b - 1],
                    d2 = bb.duration + bb.delay,
                    d = Math.max(d, d2);
            }
            return (d + a.delay);
        }

        function getProgressMain(o) {
            var p = 0, total = o.animations.length;
            for (var a = 1; a <= o.animations.length; a++) {
                var anim = o.animations[a - 1];
                p += anim.percent;
            }
            return Math.round(p / (total * 100) * 100);
        }

        function setAnimating(o) {
            var total = o.animations.length;
            for (var a = 1; a <= o.animations.length; a++) {
                var anim = o.animations[a - 1];
                if (anim.animating == true) {
                    return true;
                    break;
                }
            }
            return false;
        }

        function resetTime(a, b) {
            a.startTime = 0;
            a.lastTime = a.currentTime + b;
        }

        if (Array.isArray(options.properties) == false) {
            options.properties = [options.properties];
        }

        //Update css pour les transforms
        updateCSS(options.element);

        for (var p = 1; p <= options.properties.length; p++) {
            var a = options.properties[p - 1],
                duration = typeof a.duration === "number" ? a.duration : options.duration,
                delay = a.delay != undefined ? a.delay : options.delay,
                easing = typeof a.easing === "string" ? a.easing : options.easing;

            animations[p - 1] = {
                duration: duration,
                delay: delay,
                easing: easing,
                id: p,
                percent: 0,
                finished: false,
                animating: false,
                reversed: options.reversed,
                currentTime: 0,
                reversedTime: duration,
                cubic: Array.isArray(options.cubic) == true ? options.cubic : null,
                startTime: 0,
                lastTime: 0,
                properties: {}
            };

            for (var s in a) {
                if (typeof s[a] === "function" || s == "delay" || s == "duration" || s == "easing") {
                    continue;
                }

                var prop = changePropertyName(s),
                    unit = getUnit(options.element, prop, a[s]),
                    start = getStartValue(options.element, prop, unit),
                    end = getEndValue(prop, a[s], unit, start);

                if (start == undefined) {
                    start = end;
                }
                var change = getChangeValue(end, start);

                animations[p - 1].properties[prop] = {
                    start: start,
                    change: change,
                    end: end,
                    unit: unit
                };
            }
        }

        //MAJ des délais
        for (var a = 1; a <= animations.length; a++) {
            var animation = animations[a - 1];
            animation.delay = getDelay(animations, (a - 1));
        }

        //On remet dans l'ordre les animations selon les delay
        animations.sort(function (a, b) {
            var sA = a.duration + a.delay,
                sB = b.duration + b.delay;
            if (sA > sB) {
                return 1
            }
            else if (sB > sA) {
                return -1
            }
            return 0
        });

        ID++;

        anim.id = ID;
        anim.element = options.element;
        anim.delay = options.delay;
        anim.easing = options.easing;
        anim.start = options.start;
        anim.progress = options.progress;
        anim.end = options.end;
        anim.animations = animations;
        anim.reversed = options.reversed;
        anim.started = false;
        anim.animating = false;
        anim.finished = false;
        anim.cubic = Array.isArray(options.cubic) == true ? options.cubic : null;
        anim.percent = 0;
        anim.currentTime = 0;
        anim.paused = false;
        anim.autoplay = options.autoplay;
        anim.play = play;
        anim.reset = reset;
        anim.pause = pause;
        anim.resume = resume;
        anim.setAt = setAt;
        anim.overrideCSS = overrideCSS;
        anim.update = update;
        anim.isDone = isDone;
        anim.duration = getDurationMax(anim);
        anim.reversedTime = getDurationMax(anim);

        if (anim.autoplay == true) {
            anim.play();
        }

        return anim;
    }

    window.animate = animate;
})();