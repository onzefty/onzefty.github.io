// REQUESTANIMATIONFRAME
var requestAnimationFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
    );
})();

// CANCELANIMATIONFRAME
var cancelAnimationFrame = (function() {
    return (
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function(id) {
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
 
    return (function loop(time){
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
            fn(time,then);
        }
    }(0));
};

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

(function() {
	var actives = [], lastTime, animating = false, FRAME_TIME = 1000 / 60, lastTick = 0,
    ID = 0,
	easings = {
	        linear:function(t, b, c, d) {
	            return c * t / d + b;
	        },
	        inExpo:function(t, b, c, d) {
	            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	        },
	        outExpo:function(t, b, c, d) {
	            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	        },
	        inOutExpo:function(t, b, c, d) {
	            if (t == 0) return b;
	            if (t == d) return b + c;
	            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	        },
	        inQuad:function(t, b, c, d) {
	            return c * (t /= d) * t + b;
	        },
	        outQuad:function(t, b, c, d) {
	            return -c * (t /= d) * (t - 2) + b;
	        },
	        inOutQuad:function(t, b, c, d) {
	            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
	            return -c / 2 * ((--t) * (t - 2) - 1) + b;
	        },
	        inSine:function(t, b, c, d) {
	            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	        },
	        outSine:function(t, b, c, d) {
	            return c * Math.sin(t / d * (Math.PI / 2)) + b;
	        },
	        inOutSine:function(t, b, c, d) {
	            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	        },
	        inElastic:function(t, b, c, d) {
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
	        outElastic:function(t, b, c, d) {
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
	        inOutElastic:function(t, b, c, d) {
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
	        inBack:function(t, b, c, d) {
	            var s = 1.70158;
	            return c * (t /= d) * t * ((s + 1) * t - s) + b;
	        },
	        outBack:function(t, b, c, d) {
	           var s = 1.70158;
	            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	        },
	        inOutBack:function(t, b, c, d) {
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
	isTransformProperty = function(p){
        if(p.indexOf("scale")!=-1 || p.indexOf("rotate")!=-1 || p.indexOf("skew")!=-1 || p.indexOf("translate")!=-1){
            return true;
        }
        return false;
    },
    isColorProperty = function(p){
    	if(p.indexOf("color")!=-1||p.indexOf("Color")!=-1){
        	return true;
        }
        return false;
    },
    isClipProperty = function(p){
    	if(p.indexOf("clip")!=-1){
    		return true;
    	}
    	return false;
    },
    getUnit = function(el,s,v){
        if(typeof v == "number"){
            if(s.indexOf("rotate")!=-1||s.indexOf("skew")!=-1){
                return "deg";
            } else {
                return "";
            }
        } else {
            if(isColorProperty(s) || s == "opacity"){
                return "";
            }
            else if(isClipProperty(s) && s.indexOf("polygon")!=-1){
                //var c = window.getComputedStyle(el).getPropertyValue("clip-path"),
                //a = c.match(/\(.*?\)/g).join("").trim().match(/[^0-9\,\.\(\)\s]/g);
                //return a;
                return v.match(/[^0-9\.-]/).join("");
            }  else {
                return v.match(/[^0-9\.-]/g).join("");
            }
        }
    },
    //Retourne la/les valeur(s) de départ sous format nombre
	getStartValue = function(el,prop,unit){
		if(isTransformProperty(prop)){
            if(typeof el == "string"){
                var val = el.replace(/[^0-9\.-]/g,"");
                return parseFloat(val);
            }
            else if(typeof el == "number"){
                return el;
            } else {
                //Cas transform
                var t = el.style.transform;
                if(t && t.indexOf(prop)==-1){
                    return 0;
                } else {
                    var reg = new RegExp(prop+'\\((.*?)\\)','g');
                    r = t.match(reg).join(""),
                    val = r.replace(/[^0-9\.-]/g,"");
                    return parseFloat(val);
                }    
            }
			
		}
		else if(isColorProperty(prop)){
			//Cas couleurs
			var bc = (typeof el == "string") ? el : window.getComputedStyle(el).getPropertyValue(prop);
            //Cas Edge/IE qui ne scinde pas pareil pour les composites
            if(bc.length==0){
                switch(prop){
                    case "border-color":
                        bc = window.getComputedStyle(el).getPropertyValue("border-bottom-color");
                    break;
                }
            }   
			//Cas des couleurs (transformations des valeurs hexa en rgba, + rgb en rgba)
	    	if(bc.indexOf("#")!=-1){
                var c = hexToRgbA(bc).match(/\(.*?\)/g).join("").replace(/\(|\)/g,"").split(",");
	    	}
	    	else if(bc.indexOf("rgb")!=-1 && bc.indexOf("rgba")==-1){
	    		var c = bc.match(/\(.*?\)/g).join("").replace(/\(|\)/g,"").split(",");
	    		c.push("1");
	    	} else {
	    		var c = bc.match(/\(.*?\)/g).join("").replace(/\(|\)/g,"").split(",");
	    	}
	    	return c.map(Number);
		}
		else if(isClipProperty(prop)){
			var c = typeof el == "string" ? el : window.getComputedStyle(el).getPropertyValue("clip-path");
			if(prop=="clip-path") {
				if(c.indexOf("circle")!=-1 || typeof el == "string"){
					var a = c.match(/\(.*?\)/g).join(""),
					a2 = a.match(/[0-9].*at/g).join(""),
					a3 = a2.match(/[0-9]/g).join("");
					return parseFloat(a3);
				} else {
					return 0;
				}
			}
			else if(prop.indexOf("polygon")!=-1){
				var idx = prop.indexOf("top")!=-1 ? 0 : prop.indexOf("right")!=-1 ? 1 : prop.indexOf("bottom")!=-1 ? 2 : 3;
				if(c.indexOf("polygon")!=-1 || typeof el == "string"){
					var a = c.match(/\(.*?\)/g).join("").split(","),
					t = [];
					for(var b=1; b<=a.length; b++){
						var aa = a[b-1],
						tt = aa.trim().split(" ");
						if((b-1)==idx){
							t.push(parseFloat(tt[0].match(/[0-9\.-]/g).join("")));
							t.push(parseFloat(tt[1].match(/[0-9\.-]/g).join("")));	
						}
					}
					return t;
				} else {
					return [0,0,100,0,100,100,0,100];
				}
			}
		} else {
            if(typeof el == "string"){
                var val = el,
                u = val.match(/[^0-9\.-]/g).join("");
                if(u!=unit){
                    val = convertValueFromUnit(val,unit,u,el,prop);
                }
                return parseFloat(val.match(/[0-9\.-]/g).join(""));
            }
            else if(typeof el == "number"){
                return el;
            } else {
                var val = window.getComputedStyle(el,null).getPropertyValue(prop);
                u = val.match(/[^0-9\.]/g)==null ? "" : val.match(/[^0-9\.-]/g).join("");
                el.style.display = "none";
                var val2 = window.getComputedStyle(el,null).getPropertyValue(prop),
                u2 = val2.match(/[^0-9\.]/g)==null ? "" : val2.match(/[^0-9\.-]/g).join("");
                el.style.display = "block";
                if(unit==u2){
                    var v = val2;
                }
                else if(u!=unit && unit!=u2){
                    var v = convertValueFromUnit(val,unit,u,el,prop);
                }
                return parseFloat(v.match(/[0-9\.-]/g).join(""));    
            }
            		
		}	
	},
    //Retourne la/les valeur(s) en cours d'animation sous format chaîne de caractères (CSS)
	getAnimatingValue = function(el,property,value,unit){
        if(isTransformProperty(property)){
            return buildTransform(el,property,value,unit);
        }
        else if(isColorProperty(property)){
        	return buildColors(el,property,value);
        }
        else if(isClipProperty(property)){
            var values = buildPath(el,property,value,unit);
            return values;
        } else {
            return value;
        }
    },
    //Retourne la/les valeur(s) d'arrivée sous format nombre
    getEndValue = function(property,value,unit,start){
        if(property.indexOf("translate")!=-1 || property.indexOf("skew")!=-1 || property.indexOf("rotate")!=-1){
            return parseFloat(value);
        }
        else if(isColorProperty(property)){
        	if(value.indexOf("#")!=-1){
        		if(value.length==4){
        			value+=value[1]+value[1]+value[1];
        		}
        		value = hexToRgbA(value);
        		var c = value.match(/\(.*?\)/g).join("").replace(/\(|\)/g,"").split(",");
	    	}
	    	else if(value.indexOf("rgb")!=-1 && value.indexOf("rgba")==-1){
	    		var c = value.match(/\(.*?\)/g).join("").replace(/\(|\)/g,"").split(",");
	    		c.push("1");
	    	} else {
	    		var c = value.match(/\(.*?\)/g).join("").replace(/\(|\)/g,"").split(",");
	    	}
	    	return c.map(Number);
        }
        else if(isClipProperty(property)){
        	if(property=="clip-circle"){
        		return parseFloat(value)
        	}
        	else if(property.indexOf("polygon")!=-1){
        		v = value.trim().split(" "),
        		tab = [];
				tab.push(parseFloat(v[0].match(/[0-9\.]/g).join("")));
				tab.push(parseFloat(v[1].match(/[0-9\.]/g).join("")));
        		return tab;
        	}
		} else {
            return parseFloat(value);
        }
    },
    //Retourne la valeur animée selon l'easing sous format nombre
    getEasingValue = function(a,datas,el,prop){
        //Si animation de retour, on prend reversedTime pour partir de la fin (reproduire l'inverse) et la donnée de fin pour calculer la valeur actuelle
        //Si animation de retour, on prend en compte 
        var time = a.reversed==true ? a.reversedTime : a.currentTime;
    	if(Array.isArray(datas.change)==true && Array.isArray(datas.start)==true){
    		var change = [];
    		for(var c=1; c<=datas.change.length; c++){
    			var cc = datas.change[c-1],
    			ss = a.reversed==true ? datas.end[c-1] : datas.start[c-1];
    			change.push(easings[a.easing](time,ss,cc,a.duration));
    		}
    		return change;
    	} else {
    		return a.reversed==true ? easings[a.easing](time,datas.end,datas.change,a.duration) : easings[a.easing](time,datas.start,datas.change,a.duration);
    	}
    },
    //Retourne la différence entre la valeur d'arrivée et celle de départ
    getChangeValue = function(end,start){
    	if(Array.isArray(end)==true && Array.isArray(start)==true){
    		var change = [];
    		for(var e=1; e<=end.length; e++){
    			var ee = end[e-1],
    			ss = start[e-1];
    			change.push(ee-ss);
    		}
    		return change;
    	} else {
    		return (end-start);
    	}
    },
    //Retourne le delay (cas "next" | "same" | "+number")
    getDelay = function(tab,index){
        var el = tab[index],
        delay = el.delay,
        prevEl = tab[index-1],
        prevDelay = prevEl==undefined ? 0 : typeof prevEl.delay == "number" ? prevEl.delay : 0,
        duration = el.duration;
        if(typeof delay == "string"){
            if(delay=="next"){
                return (prevEl.duration + prevDelay);   
            } 
            else if (delay=="same"){
                return prevDelay;
            }
            else if (delay.indexOf("+")!=-1){
                return (parseInt(delay) + prevDelay);
            }
        } else {
            return delay;
        }
    },
    //Met à jour une propriété CSS avec une chaîne de caractères
    setPropertyValue = function(e,p,v,u){
    	if(isTransformProperty(p)){
            e.style.transform = v;
        }
        else if(isColorProperty(p)){
        	e.style[p] = v;
        }
        else if(isClipProperty(p)){
			if(p=="clip-circle"){
				e.style["clip-path"] = v;
			}
			else if(p.indexOf("polygon")!=-1){
				e.style["clip-path"] = v;
			}
		} else {
            e.style[p] = v+u;
        }
    },
    //Met à jour le CSS en début (ajout des transforms)
    updateCSS = function(el){
    	var t = el.style.transform,
    	ts = ["rotate","translateX","translateY","scaleX","scaleY","skewX","skewY","translateZ"],
    	tn = "";
    	if(t.length > 0){
    		var rt = t.match(/(scaleX|scaleY|translateX|translateY|skewX|skewY|rotate|scale\(|translate\(|skew\(|translateZ)/g);
    		for(var m=1; m<=rt.length; m++){
    			var mt = rt[m-1];
    			if(mt=="scale("||mt=="translate("||mt=="skew("){
                    mt = mt.replace("(","");
    				var reg = new RegExp(mt+'\\((.*?)\\)','g'),
    				r = t.match(reg).join(""),
    				reg2 = new RegExp("\\(.*\\)",'g'),
    				ct = r.match(reg2).join("").replace(/\(|\)/g,"").split(",");
					for(var c=1; c<=ct.length; c++){
						var cc = ct[c-1].trim(),
						cv = cc.match(/\d/g).join(""),
						cu = cc.match(/\D/g);
						if(cu!=null){
							tn+=mt+((c==1)?"X":"Y")+"("+cv+cu.join("")+")";
						} else {
							tn+=mt+((c==1)?"X":"Y")+"("+cv+")";
						}
					} 
    			} else {
    				var reg = new RegExp(mt+'\\((.*?)\\)','g'),
    				r = t.match(reg).join(""),
    				val = r.replace(/\D/g,""),
    				reg2 = new RegExp("\\(.*\\)",'g'),
    				unit = r.match(reg2).join("").replace(/\d|\(|\)/g,"");
            		tn += mt+"("+val+unit+") ";
    			}
    		}
    	}
    	//Ajout des éléments manquantes
    	for(var ts1=1; ts1<=ts.length; ts1++){
    		var tsn = ts[ts1-1];
    		if(tn.indexOf(tsn)==-1){
    			var u = tsn=="rotate"||tsn=="skewX"||tsn=="skewY" ? "deg" : tsn=="scaleX"||tsn=="scaleY" ? "" : "px",
    			v = tsn=="scaleX"||tsn=="scaleY" ? 1 : 0;
    			tn += tsn+"("+v+u+")";
    		}
    	}
    	el.style.transform = tn;
    },
    //Modifie le nombre de propriété => 'backgroundColor' --> 'background-color'
    changePropertyName = function(p){
    	if(/[A-Z]/g.test(p)==true && p.match(/[A-Z].*/g)[0].length > 1){
    		var b = p.match(/[A-Z].*/g).join("").toLowerCase(),
    		f = p.match(/.+?(?=[A-Z])/g).join("");
    		return f+"-"+b;
    	}
    	return p;
    },
    //Si l'unité de départ et celle d'arrivée diffèrent, conversion
    convertValueFromUnit = function(value,uD,uO,el,prop){
    	var v = parseFloat(value.match(/([0-9]|\.)/g).join("")),
        p = el.parentNode;
        //console.log(v,uD,uO);
        switch(uD){
            case "vw":
                var vn = (v/window.innerWidth)*100;
                return (vn.toString()+uD);
            break;

            case "vh":
                var vn = (v/window.innerWidth)*100;
                return (vn.toString()+uD);
            break;

            case "%":
                //Dépend de la propriété
                switch(prop){
                    case "left":
                        return ((el.offsetLeft/p.offsetWidth*100).toString()+uD);
                    break;
                    case "top":
                        return ((el.offsetTop/p.offsetHeight*100).toString()+uD);
                    break;
                    case "right":
                        return ((100-((el.offsetLeft+el.offsetWidth)/p.offsetWidth*100)).toString()+uD);
                    break;
                    case "bottom":
                        return ((100-((el.offsetTop+el.offsetHeight)/p.offsetHeight*100)).toString()+uD);
                    break;
                    case "width":
                        return ((el.offsetWidth/p.offsetWidth*100).toString()+uD);
                    break;
                    case "height":
                        return ((el.offsetHeight/p.offsetHeight*100).toString()+uD);
                    break;
                    case "font-size":
                        return (((3/4*vn)*100/12).toString()+uD);
                    break;
                    case "margin":
                        return ((vn/p.offsetWidth*100).toString()+uD);
                    break;
                    case "margin-left":
                        return ((vn/p.offsetWidth*100).toString()+uD);
                    break;
                    case "margin-top":
                        return ((vn/p.offsetWidth*100).toString()+uD);
                    break;
                    case "margin-bottom":
                        return ((vn/p.offsetWidth*100).toString()+uD);
                    break;
                    case "margin-right":
                        return ((vn/p.offsetWidth*100).toString()+uD);
                    break;

                }
            break;

            case "em":
                return ((v*1/16).toString()+uD)
            break;

            case "pt":
                return ((v*3/4).toString()+uD)
            break;

            default:
                //Pixels
            break;
        }
    },
    //Retourne la chaîne de caractères de la valeur transform
    buildTransform = function(el,property,value,unit){
        var t = el.style.transform,
        v = "", matches = t.match(/(scaleX|scaleY|translateX|translateY|skewX|skewY|rotate|translateZ)/g);
        if(matches.length > 0){
        	for(var m=1; m<=matches.length; m++){
        		var ma = matches[m-1];
        		if(ma==property){
            		v += property+"("+value+unit+") ";
        		} else {
        			var reg = new RegExp(ma+'\\((.*?)\\)','g'),
    				r = t.match(reg).join(""),
    				val = r.replace(/[^0-9\.-]/g,""),
    				r2 = new RegExp("\\(.*\\)",'g'),
    				u = r.match(r2).join("").replace(/\d|\(|\)|\.|\-/g,"");
            		v += ma+"("+val+u+") ";
        		}
        	}
        }
        return v;
    },
    //Retourne la chaîne de caractères de la valeur color
    buildColors = function(el,property,value){
        var s = "rgba(";
        for(var v=1; v<=value.length; v++){
        	s+= (v==value.length) ? value[v-1]+")" : value[v-1]+",";
        }
        return s;
    },
    //Retourne la chaîne de caractères de clip-path
    buildPath = function(el,property,value,unit){
        var clipPath = window.getComputedStyle(el).getPropertyValue("clip-path"),
        values = "";
        if(property=="clip-circle"){
        	var a = clipPath.match(/\(.*?\)/g).join(""),
        	end = a.match(/at.*/g).join("");
        	values = "circle("+value+unit+end;
        }
        else if(property.indexOf("polygon")!=-1){
        	values = "polygon(";
	        var path = clipPath.match(/\(([^\)]+)\)/g).join(",").replace(/[\(-\)]/g,"").split(","),
	        idx = property.indexOf("top")!=-1 ? 0 : property.indexOf("right")!=-1 ? 1 : property.indexOf("bottom")!=-1 ? 2 : 3;
	        for(var p=1; p<=path.length; p++){
				var pp = path[p-1],
				tt = pp.trim().split(" ");
				if((p-1)==idx){
					values+= value[0]+unit+value[1]+unit;
				} else {
					values+= pp;
				}
				if(p!=path.length){
					values+=",";
				}
			}
        }	
        return values;
    },
    hexToRgbA = function(hex){
	    var c;
	    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
	        c= hex.substring(1).split('');
	        if(c.length== 3){
	            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
	        }
	        c= '0x'+c.join('');
	        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
	    } else {
	    	return undefined;
	    }
	},
    getEndTime = function(){
    	var value = 0
    	for(var i=1; i<=actives.length; i++){
        	var e = actives[i-1];
        	if(e.finished==false){
        		value = Math.max(value,e.delay + e.duration);	
        	}
        }
        return value;
    },
	loopThrough = function(timestamp){
		var currentTime = performance.now();
        len = actives.length,
        i = 0;

        while(i<len){
            var active = actives[i];
            if(active.paused==false){
                active.update(timestamp);
                i++;
            } else {
                actives.splice(i,1);
                len--;
            }
        }

        if(i > 0){
            requestAnimationFrame(loopThrough);
        } else {
            animating = false;
            cancelAnimationFrame(loopThrough);
        }    
    },
    launch = function(){
        if(actives.length > 0 && animating==false){
            animating = true;
            requestAnimationFrame(loopThrough);
        } else {
            animating = false;
            cancelAnimationFrame(loopThrough);
            startTime = undefined;
        }
    };

	function animate(props){
		var defaults = {
			element:null,
	        properties:[],
	        duration:1000,
	        delay:0,
	        easing:"linear",
            autoplay:true,
            reversed:false,
	        start:function(){},
	        end:function(){},
            progress:function(){}
		},
		options = Object.assign(defaults,props),
        anim = {}, animations = [], startTime = 0, lastTime = 0, currentTime = 0;

        function update(timestamp){
            currentTime = timestamp;
            
            //Si l'élément n'existe plus, alors on supprime toutes les occurences ayant cet élément
            if(!this.element.parentNode){
                //deleteAnimsByElement();
                return;
            }

            for(var a=1; a<=this.animations.length; a++){
                var animation = this.animations[a-1];
                if(!animation.startTime && animation.finished==false){
                    animation.startTime = currentTime;
                }

                if(animation.finished==true){
                    continue;
                }
                
                //La valeur temps est également à celle actuelle + (la dernière enregistrée - celle de départ) afin de retrancher pour celles ayant des delay > 0
                var time = (currentTime + (animation.lastTime - animation.startTime));
                
                //Delay
                if(time >= animation.delay && animation.finished == false){
                    if(!this.started){
                        this.started=true;
                        this.start(this);
                    }
                    animation.animating = true;
                    for(var prop in animation.properties){
                        var datas = animation.properties[prop];
                        if(datas.updated==undefined){
                            //MAJ des valeurs de départ et de change si la valeur a changé entre temps (cas d'animations successives sur un même élément avec les mêmes propriétés)
                            var start = getStartValue(this.element,prop,datas.unit);
                            datas.start = start;
                            //Si reversed, on alterne les valeurs de début et de fin
                            datas.change = this.reversed==true ? getChangeValue(datas.start,datas.end) : getChangeValue(datas.end,datas.start);
                            datas.updated = true;   
                        }
                        var value = getEasingValue(animation,datas,this.element,prop);
                        value = getAnimatingValue(this.element,prop,value,datas.unit);
                        setPropertyValue(this.element,prop,value,datas.unit);
                    }
                    animation.currentTime = minMax(time, animation.delay, (animation.duration+animation.delay)) - animation.delay;
                    var percent = (animation.currentTime/animation.duration)*100,
                    reversedPercent = 100-percent;
                    animation.reversedTime = reversedPercent/100*animation.duration;
                    animation.percent = minMax(percent,0,100);
                }
                //Fin de l'animation
                if(time >= (animation.duration+animation.delay) && animation.animating==true){
                    animation.lastTime = 0;
                    animation.paused = true;
                    animation.animating = false;
                    for(var prop in animation.properties){
                        var datas = animation.properties[prop],
                        value = getAnimatingValue(this.element,prop,datas.end,datas.unit);
                        setPropertyValue(this.element,prop,value,datas.unit);
                    }
                    if(animation.finished==false){
                        animation.finished=true;
                    }
                }
            }

            this.animating = setAnimating(this);
            this.percent = getProgressMain(this);
            if(this.animating==true){
                this.progress(this);
            }

            if(this.isDone()==true && this.paused==false){
                this.paused = true;
                this.finished = true;
                this.end(this);
            }
        }

        function play(){
            if(this.paused==false){
                if(this.finished==true){
                    this.reset();
                }
                this.paused = false;
                actives.push(this);
                launch();
            } 
        }

        function pause(){
            this.paused = true;
            var bonus = 0;
            for(var a=1; a<=this.animations.length; a++){
                var anim = this.animations[a-1];
                if(anim.finished==false){
                    //Le bonus (décalage) est attribué uniquement aux animations suivantes non démarrées, sinon, leur delay est utilisé
                    var bonus2 = (anim.animating==false) ? bonus : anim.delay;
                    resetTime(anim,bonus2);
                    if(anim.lastTime!=0 && !bonus){
                        //Bonus attribué
                        bonus = anim.lastTime;
                    }   
                }
            }
        }

        function resume(){
            this.paused = false;
            actives.push(this);
            launch();
        }

        function reset(){
            this.finished = false;
            this.started = false;
            this.paused = false;
            this.currentTime = 0;
            this.reversedTime = this.duration;
            this.reversed = false;
            this.startTime = 0;
            this.lastTime = 0;
        }

        function restart(){
            this.reset();
            this.play();
        }

        function setAt(percent){
            var cd = Math.round(percent/100*this.duration), bonus = 0;
            for(var a=1; a<=this.animations.length; a++){
                var anim = this.animations[a-1],
                cTime = minMax(cd, anim.delay, (anim.duration+anim.delay)) - anim.delay;
                anim.currentTime = cTime;
                animation.currentTime = minMax(time, animation.delay, (animation.duration+animation.delay)) - animation.delay;
                var percent = (animation.currentTime/animation.duration)*100,
                reversedPercent = 100-percent;
                animation.reversedTime = reversedPercent/100*animation.duration;
                animation.percent = minMax(percent,0,100);
                anim.lastTime = cd;
                anim.startTime = 0;
                for(var prop in anim.properties){
                    var datas = anim.properties[prop];
                    var start = getStartValue(this.element,prop,datas.unit);
                    datas.start = start;
                    //Si animation de retour, les données de start et end sont donc inversées
                    datas.change = this.reversed==true ? getChangeValue(datas.start,datas.end) : getChangeValue(datas.end,datas.start);
                    var value = getEasingValue(anim,datas);
                    value = getAnimatingValue(this.element,prop,value,datas.unit);
                    setPropertyValue(this.element,prop,value,datas.unit);
                }
                if(cd >= (anim.duration+anim.delay)){
                    anim.lastTime = 0;
                    anim.finished=true;
                } 
            }
        }

        function overrideCSS(props){
            for(var a=1; a<=this.animations.length; a++){
                var anim = this.animations[a-1];

                for(var prop in anim.properties){
                    var datas = anim.properties[prop];
                    if(props[prop]!=undefined){
                        var unit = getUnit(this.element,prop,props[prop]);
                        datas.unit = unit;
                        datas.start = getStartValue(props[prop],prop,unit)
                        datas.change = this.reversed==true ? getChangeValue(datas.start,datas.end) : getChangeValue(datas.end,datas.start);  
                        var value = getEasingValue(anim,datas);
                        value = getAnimatingValue(this.element,prop,value,datas.unit);
                        setPropertyValue(this.element,prop,value,datas.unit);
                    }
                }
            }
        }

        function isDone(){
            return(this.animations.filter(function(a){ if(a.finished==true){return a}}).length==this.animations.length);
        }

        function getDurationMax(a){
            var d = 0;
            for(var b=1; b<=a.animations.length; b++){
                var bb = a.animations[b-1],
                d2 = bb.duration + bb.delay,
                d = Math.max(d,d2);   
            }
            return (d+a.delay);
        }

        function getProgressMain(o){
            var p = 0, total = o.animations.length; 
            for(var a=1; a<=o.animations.length; a++){
                var anim = o.animations[a-1];
                p+= anim.percent; 
            }
            return Math.round(p/(total*100)*100);
        }

        function setAnimating(o){
            var total = o.animations.length; 
            for(var a=1; a<=o.animations.length; a++){
                var anim = o.animations[a-1];
                if(anim.animating==true){
                    return true;
                    break;
                }
            }
            return false;
        }

        function resetTime(a,b){
            a.startTime = 0;
            a.lastTime = a.currentTime + b;
        }

		if(Array.isArray(options.properties)==false){
			options.properties = [options.properties];
		}

		//Update css pour les transforms
		updateCSS(options.element);

		for(var p=1; p<=options.properties.length; p++){
			var a = options.properties[p-1],
            duration = typeof a.duration === "number" ? a.duration : options.duration,
            delay = a.delay!=undefined ? a.delay : options.delay,
            easing = typeof a.easing === "string" ? a.easing : options.easing;
            
            animations[p-1] = {
                duration:duration,
                delay:delay,
                easing:easing,
                id:p,
                percent:0,
                finished:false,
                animating:false,
                reversed:options.reversed,
                currentTime:0,
                reversedTime:duration,
                startTime:0,
                lastTime:0,
                properties:{}
            };
			for(var s in a){
				if(typeof s[a]==="function"||s=="delay"||s=="duration"||s=="easing"){
					continue;
				}
				var prop = changePropertyName(s),
				unit = getUnit(options.element,prop,a[s]),
	            start = getStartValue(options.element,prop,unit),
	            end = getEndValue(prop,a[s],unit,start),
	            change = getChangeValue(end,start);
	            animations[p-1].properties[prop] = {
	                start:start,
	                change:change,
	                end:end,
	                unit:unit
	            };
			}
		}

        //MAJ des délais
        for(var a=1; a<=animations.length; a++){
            var animation = animations[a-1];
            animation.delay = getDelay(animations,(a-1));
        }

        //On remet dans l'ordre les animations selon les delay
        animations.sort(function(a,b){
            var sA = a.duration + a.delay,
            sB = b.duration + b.delay;
            if(sA > sB){
                return 1
            }
            else if(sB > sA){
                return -1
            }
            return 0
        });

        ID++;

        anim.id=ID;
        anim.element=options.element;
        anim.delay=options.delay;
        anim.easing=options.easing;
        anim.start=options.start;
        anim.progress=options.progress;
        anim.end=options.end;
        anim.animations=animations;
        anim.reversed=options.reversed;
        anim.started=false;
        anim.animating=false;
        anim.finished=false;
        anim.percent=0;
        anim.currentTime=0;
        anim.paused=false;
        anim.autoplay=options.autoplay;
        anim.play=play;
        anim.reset=reset;
        anim.pause=pause;
        anim.resume=resume;
        anim.setAt=setAt;
        anim.overrideCSS = overrideCSS;
        anim.update=update;
        anim.isDone=isDone;
        anim.duration=getDurationMax(anim);
        anim.reversedTime=getDurationMax(anim);

        if(anim.autoplay==true){
            anim.play();
        }

        return anim;
	}

	window.animate = animate;
})();