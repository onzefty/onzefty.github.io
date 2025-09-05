import { swap, interactions, interactionScreen5, interactionScreen6, interactionScreen9, interactionScreen23, 
	interactionScreen31, interactionScreen33, interactionScreen43, interactionScreen46, interactionScreen50 ,interactionScreen55, interactionScreen56 } from "./main.js";

export const timelineDatas = {
	line:[
		"screen-1","screen-2","screen-3","screen-4","screen-5","screen-6","screen-7","screen-8","screen-9","screen-10",
		"screen-11","screen-12","screen-13","screen-14","screen-15","screen-16","screen-17","screen-18","screen-19","screen-20","screen-21","screen-22",{"screen-23-feedback":"ignored","screen-23":0},"screen-24",
		"screen-25","screen-26","screen-27","screen-28","screen-29","screen-30","screen-31","screen-32","screen-33","screen-34","screen-35","screen-36","screen-37","screen-38","screen-39",
		"screen-40","screen-41","screen-42","screen-43","screen-44",
		"screen-45","screen-46","screen-47",
		"screen-48","screen-49",{"screen-50-right":"ignored","screen-50-wrong":"ignored","screen-50":0},"screen-51","screen-52","screen-53","screen-54",{"screen-55-feedback":"ignored","screen-55":0},{"screen-56-feedback":"ignored","screen-56":0},"screen-57","screen-58","screen-59"
	],
	steps: {
		"screen-1":{
			triggers:{
				"start":()=> {
					document.querySelector("#s1-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = "down";
					}
					document.querySelector("#s1-container").classList.remove("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s1-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s1-container",
					easing:"outExpo",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s1-bubble-1",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s1-bubble-2",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-2":{
			triggers:{
				"start":()=> {
					document.querySelector("#s2-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s2-container").classList.remove("hidden");
					document.querySelector("#s4-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s2-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s1-bubble-2",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s1-bubble-1",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s1-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s2-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s2-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s2-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-3":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
						document.querySelector("#s2-container").classList.remove("hidden");
					}
				}
			},
			line:[
				{
					element:"s2-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s3-woman",
					easing:"inOutQuad",
					duration:1200,
					properties:{"clip-path": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"}
				},
				{
					element:"s2-woman",
					duration:1200,
					delay:"+700",
					properties:{opacity:0}
				},
				{
					element:"s3-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-4":{
			triggers:{
				"start": () => {
					document.querySelector("#s4-container").classList.remove("hidden");
					document.querySelector("#s4-content").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s4-container").classList.remove("hidden");
					document.querySelector("#s4-content").classList.remove("hidden");
				},
				"reset":() => {
					document.querySelector("#s4-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s3-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s3-woman",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0, translateX:"-70%"}
				},
				{
					element:"s2-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s4-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s4-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1, translateX:"0%"}
				},
				{
					element:"s4-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1, translateX:"0%"}
				},
				{
					element:"s4-colors-panel",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1, translateY:"0%"}
				},
				{
					element:".s4-color-picker",
					easing:"outBack",
					duration:1000,
					delay:"+500/100",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-5":{
			triggers:{
				"start":()=> {
					document.querySelector("#s5-content").classList.remove("hidden");
					
				},
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					document.querySelector("#s5-content").classList.remove("hidden");
					document.querySelector("#s4-content").classList.add("hidden");
					interactionScreen5();
				},
				"reset": ()=>{
					interactionScreen5();
					interactions["5"].disabled = true;
					document.querySelector("#s5-content").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s4-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0, translateX:"60%"}
				},
				{
					element:"s4-woman",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0, translateX:"60%"}
				},
				{
					element:"s4-colors-panel",
					easing:"inOutQuad",
					duration:1000,
					delay:"same",
					properties:{opacity:0, translateY:"-60%"}
				},
				{
					element:"s4-content",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s5-content",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s5-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:".s5-color-picker",
					easing:"outBack",
					duration:1000,
					delay:"+500/100",
					properties:{scale:"1 1"}
				},
				{
					element:"#s5-interactions-wrap",
					easing:"inOutQuad",
					duration:800,
					delay:"+200",
					properties:{opacity:1}
				},
				{
					element:".s5-card",
					easing:"outExpo",
					duration:1000,
					delay:"+500/200",
					properties:{opacity:1, translate:"0% 0%"}
				},
				{
					element:"s5-cursor",
					easing:"outBack",
					duration:1000,
					delay:"+800",
					properties:{scale:"1 1",opacity:1}
				},
				{
					element:"s5-cursor",
					duration:700,
					delay:"next",
					properties:{rotate:"-6deg"}
				},
				{
					element:"s5-card-1",
					duration:700,
					delay:"same",
					properties:{rotate:"-6deg"}
				},
				{
					element:"s5-cursor",
					duration:1400,
					delay:"next",
					properties:{rotate:"6deg"}
				},
				{
					element:"s5-card-1",
					duration:1400,
					delay:"same",
					properties:{rotate:"6deg"}
				},
				{
					element:"s5-cursor",
					duration:1400,
					delay:"next",
					properties:{rotate:"-6deg"}
				},
				{
					element:"s5-card-1",
					duration:1400,
					delay:"same",
					properties:{rotate:"-6deg"}
				},
				{
					element:"s5-cursor",
					duration:400,
					delay:"+700",
					properties:{opacity:0}
				},
				{
					element:"s5-card-1",
					duration:400,
					delay:"same",
					properties:{opacity:0}
				},
			]	
		},
		"screen-6":{
			triggers:{
				"start":()=> {
					document.querySelector("#s6-content").classList.remove("hidden");
					
				},
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					document.querySelector("#s6-content").classList.remove("hidden");
					document.querySelector("#s5-content").classList.add("hidden");
					document.querySelector("#s4-container").classList.remove("hidden");
					interactionScreen6();
				},
				"reset": ()=>{
					interactionScreen6();
					interactions["6"].disabled = true;
					document.querySelector("#s6-content").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s6-content",
					easing:"inOutQuad",
					duration:800,
					properties:{opacity:1}
				},
				{
					element:"#s5-interactions-wrap",
					easing:"inOutQuad",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:".s5-color-picker",
					easing:"outExpo",
					duration:1000,
					delay:"+300/100",
					properties:{scale:"0 0"}
				},
				{
					element:"s5-content",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s5-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s6-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
				{
					element:".s6-color-picker",
					easing:"outBack",
					duration:1000,
					delay:"+500/100",
					properties:{scale:"1 1"}
				},
				{
					element:"#s6-interactions-wrap",
					easing:"inOutQuad",
					duration:800,
					delay:"+200",
					properties:{opacity:1}
				},
				{
					element:".s6-card",
					easing:"outExpo",
					duration:1000,
					delay:"+500/200",
					properties:{opacity:1, translate:"0% 0%"}
				},
				{
					element:"s6-cursor",
					easing:"outBack",
					duration:1000,
					delay:"+800",
					properties:{scale:"1 1",opacity:1}
				},
				{
					element:"s6-cursor",
					duration:700,
					delay:"next",
					properties:{rotate:"-6deg"}
				},
				{
					element:"s6-card-1",
					duration:700,
					delay:"same",
					properties:{rotate:"-6deg"}
				},
				{
					element:"s6-cursor",
					duration:1400,
					delay:"next",
					properties:{rotate:"6deg"}
				},
				{
					element:"s6-card-1",
					duration:1400,
					delay:"same",
					properties:{rotate:"6deg"}
				},
				{
					element:"s6-cursor",
					duration:1400,
					delay:"next",
					properties:{rotate:"-6deg"}
				},
				{
					element:"s6-card-1",
					duration:1400,
					delay:"same",
					properties:{rotate:"-6deg"}
				},
				{
					element:"s6-cursor",
					duration:400,
					delay:"+700",
					properties:{opacity:0}
				},
				{
					element:"s6-card-1",
					duration:400,
					delay:"same",
					properties:{opacity:0}
				},
			]	
		},
		"screen-7":{
			triggers:{
				"start":()=> {
					document.querySelector("#s2-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s2-container").classList.remove("hidden");
					document.querySelector("#s4-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s2-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s5-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateY:"-50%"}
				},
				{
					element:"#s6-interactions-wrap",
					easing:"inOutQuad",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:".s6-color-picker",
					easing:"outExpo",
					duration:1000,
					delay:"+300/100",
					properties:{scale:"0 0"}
				},
				{
					element:"s4-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s2-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s7-man",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s7-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-8":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s7-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s7-man",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s8-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s8-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-9":{
			triggers:{
				"start":()=> {
					document.querySelector("#s9-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					interactionScreen9();
					document.querySelector("#s9-container").classList.remove("hidden");
					document.querySelector("#s2-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s2-container").classList.remove("hidden");
					document.querySelector("#s9-container").classList.add("hidden");
					if(interactions["9"]){
						interactionScreen9();
						interactions["9"].disabled = true;
					}
				}
			},
			line:[
				{
					element:"s8-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s8-woman",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"-70%"}
				},
				{
					element:"s2-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s9-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:".s9-item",
					easing:"outBack",
					duration:1000,
					delay:"+500/100",
					properties:{scale:"1 1"}
				},
				{
					element:"s9-interactions-wrap",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:".s9-button",
					easing:"outBack",
					duration:1000,
					delay:"+500/300",
					properties:{scale:"1 1"}
				},
				{
					element:"s9-cursor",
					easing:"outBack",
					duration:1000,
					delay:"+800",
					properties:{scale:"1 1",opacity:1}
				},
				{
					element:"s9-cursor",
					duration:700,
					delay:"next",
					properties:{rotate:"-22deg"}
				},
				{
					element:"s9-suggestion-1",
					duration:700,
					delay:"same",
					properties:{rotate:"-22deg"}
				},
				{
					element:"s9-cursor",
					duration:1400,
					delay:"next",
					properties:{rotate:"22deg"}
				},
				{
					element:"s9-suggestion-1",
					duration:1400,
					delay:"same",
					properties:{rotate:"22deg"}
				},
				{
					element:"s9-cursor",
					duration:700,
					delay:"next",
					properties:{rotate:"0deg"}
				},
				{
					element:"s9-suggestion-1",
					duration:700,
					delay:"same",
					properties:{rotate:"0deg"}
				},
				{
					element:"s9-cursor",
					duration:400,
					delay:"+700",
					properties:{opacity:0}
				},
			]	
		},
		"screen-10":{
			triggers:{
				"start":()=> {
					document.querySelector("#s4-container").classList.remove("hidden");
					document.querySelector("#s10-content").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s4-container").classList.remove("hidden");
					document.querySelector("#s10-content").classList.remove("hidden");
					document.querySelector("#s9-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s4-container").classList.add("hidden");
					document.querySelector("#s10-content").classList.add("hidden");
					document.querySelector("#s9-container").classList.remove("hidden");
				}
			},
			line:[
				{
					element:".s9-button",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s9-interactions-wrap",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateY:"50%"}
				},
				{
					element:".s9-item",
					easing:"outExpo",
					duration:800,
					delay:"/50",
					properties:{scale:"0 0"}
				},
				{
					element:"s9-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s4-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s10-circle-2",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:1,scale:"1 1"}
				},
				{
					element:"s10-circle-1",
					easing:"inOutQuad",
					duration:1200,
					delay:"+200",
					properties:{opacity:1,scale:"1 1"}
				},
				{
					element:"s10-texts",
					easing:"inOutQuad",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:".s10-color-picker",
					easing:"outBack",
					duration:1000,
					delay:"+900/100",
					properties:{scale:"1 1"}
				},
				{
					element:"#s10-colors > p",
					easing:"outExpo",
					duration:1000,
					delay:"+200/100",
					properties:{opacity:1}
				},
				{
					element:"s10-item-1",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s10-item-2",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s10-item-4",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s10-item-5",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translate:"0% 0%"}
				},
			]	
		},
		"screen-11":{
			triggers:{
				"start":()=> {
					document.querySelector("#s1-container").classList.remove("hidden");
					document.querySelector("#s11-content").classList.remove("hidden");
					document.querySelector("#s1-content").classList.add("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s1-container").classList.remove("hidden");
					document.querySelector("#s11-content").classList.remove("hidden");
					document.querySelector("#s1-content").classList.add("hidden");
					document.querySelector("#s4-container").classList.add("hidden");
					document.querySelector("#s10-content").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s1-container").classList.add("hidden");
					document.querySelector("#s11-content").classList.add("hidden");
					document.querySelector("#s1-content").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s10-item-1",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translate:"-50% -50%"}
				},
				{
					element:"s10-item-2",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translate:"50% -50%"}
				},
				{
					element:"s10-item-4",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translate:"-50% 50%"}
				},
				{
					element:"s10-item-5",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translate:"50% 50%"}
				},
				{
					element:"s10-circle-1",
					easing:"inOutQuad",
					duration:1000,
					properties:{opacity:0,scale:"1.3 1.3"}
				},
				{
					element:"s10-circle-2",
					easing:"inOutQuad",
					duration:1000,
					delay:"+200",
					properties:{opacity:0,scale:"1.3 1.3"}
				},
				{
					element:"s4-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+400",
					properties:{opacity:0}
				},
				{
					element:"s1-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s11-bubble-1",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s11-bubble-2",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-12":{
			triggers:{
				"start":()=> {
					document.querySelector("#s12-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s12-container").classList.remove("hidden");
					document.querySelector("#s1-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s12-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s11-bubble-2",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s11-bubble-1",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s1-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s12-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s12-woman",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s12-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+600",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s12-shadow",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{opacity:1,scale:"1 1"}
				},
			]	
		},
		"screen-13":{
			triggers:{
				"start":()=> {
					document.querySelector("#s13-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s13-container").classList.remove("hidden");
					document.querySelector("#s12-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s13-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s12-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"50%"}
				},
				{
					element:"s12-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s12-shadow",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,scale:"1.3 1.3"}
				},
				{
					element:"s12-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{opacity:0}
				},
				{
					element:"s13-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s13-woman",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s13-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+600",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s13-shadow",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{opacity:1,scale:"1 1"}
				},
			]	
		},
		"screen-14":{
			triggers:{
				"start":()=> {
					document.querySelector("#s1-container").classList.remove("hidden");
					document.querySelector("#s14-content").classList.remove("hidden");
					document.querySelector("#s11-content").classList.add("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s1-container").classList.remove("hidden");
					document.querySelector("#s14-content").classList.remove("hidden");
					document.querySelector("#s11-content").classList.add("hidden");
					document.querySelector("#s13-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s1-container").classList.add("hidden");
					document.querySelector("#s14-content").classList.add("hidden");
					document.querySelector("#s11-content").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s13-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"50%"}
				},
				{
					element:"s13-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s13-shadow",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,scale:"1.3 1.3"}
				},
				{
					element:"s13-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+400",
					properties:{opacity:0}
				},
				{
					element:"s1-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s14-bubble-1",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s14-bubble-2",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-15":{
			triggers:{
				"start":()=> {
					document.querySelector("#s15-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s15-container").classList.remove("hidden");
					document.querySelector("#s1-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s15-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s14-bubble-2",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s14-bubble-1",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s1-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s15-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s15-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-16":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s15-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"-100%"}
				},	
				{
					element:"s16-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"0%"}
				},
				{
					element:"s15-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+800",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s16-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
			]	
		},
		"screen-17":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s16-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"-100%"}
				},	
				{
					element:"s17-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"0%"}
				},
				{
					element:"s16-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+800",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s17-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
			]	
		},
		"screen-18":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s17-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"-100%"}
				},	
				{
					element:"s18-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"0%"}
				},
				{
					element:"s17-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+800",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s18-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
			]	
		},
		"screen-19":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s18-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"-100%"}
				},	
				{
					element:"s19-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"0%"}
				},
				{
					element:"s18-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+800",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s19-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
			]	
		},
		"screen-20":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s19-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"-100%"}
				},	
				{
					element:"s20-slide",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateX:"0%"}
				},
				{
					element:"s19-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+800",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s20-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
			]	
		},
		"screen-21":{
			triggers:{
				"start":()=> {
					document.querySelector("#s1-container").classList.remove("hidden");
					document.querySelector("#s21-content").classList.remove("hidden");
					document.querySelector("#s14-content").classList.add("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s1-container").classList.remove("hidden");
					document.querySelector("#s21-content").classList.remove("hidden");
					document.querySelector("#s14-content").classList.add("hidden");
					document.querySelector("#s15-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s1-container").classList.add("hidden");
					document.querySelector("#s21-content").classList.add("hidden");
					document.querySelector("#s14-content").classList.remove("hidden");
					document.querySelector("#s15-container").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s15-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateY:"-50%"}
				},
				{
					element:"s15-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s1-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s21-man",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s21-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-22":{
			triggers:{
				"start":()=> {
					document.querySelector("#s22-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s22-container").classList.remove("hidden");
					document.querySelector("#s1-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s22-container").classList.add("hidden");
				}
			},
			line:[
				//TEMP
				{
					element:"s23-interactions-wrap",
					duration:10,
					properties:{translateY:"100%"}
				},
				{
					element:"s21-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s21-man",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s1-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s22-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s22-woman",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s22-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+600",
					properties:{opacity:1,translateX:"0%"}
				}
			]	
		},
		"screen-23":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					interactionScreen23();
					document.querySelector("#s23-content").classList.add("hidden");
				},
				"reset":() => {
					interactionScreen23();
				}
			},
			line:[
				{
					element:"s22-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-50%"}
				},
				{
					element:"s22-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s22-content",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{translateY:"-5%"}
				},
				{
					element:"s23-interactions-wrap",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{translateY:"0%"}
				},
				{
					element:"#s23-interactions-wrap > .column",
					easing:"outBack",
					duration:1000,
					delay:"+600/200",
					properties:{opacity:1,translateX:"0%"}
				},
				,
				{
					element:"s22-drop",
					easing:"outExpo",
					duration:1000,
					delay:"+800",
					properties:{"clip-path":"polygon(-10% -10%, 110% -10%, 110% 110%, -10% 110%)"}
				}
			]	
		},
		"screen-23-feedback":{
			triggers:{
				"start": ()=> {
					const {success} = interactions["23"];
					const cl = success ? "right" : "wrong";
					document.querySelector("#s23-bubble").classList.remove("right","wrong");
					document.querySelector("#s23-bubble").classList.add(cl);
					document.querySelector("#s23-content").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				},
				"reset": () =>{
					document.querySelector("#s23-content").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s22-drop",
					easing:"outExpo",
					duration:800,
					properties:{"clip-path":"polygon(-10% -10%, -10% -10%, -10% 110%, -10% 110%)"}
				},
				{
					element:"#s23-interactions-wrap > .column",
					easing:"outBack",
					duration:50,
					delay:"+600/200",
					properties:{opacity:0}
				},
				{
					element:"s23-interactions-wrap",
					easing:"inOutQuad",
					duration:800,
					properties:{translateY:"70%"}
				},
				{
					element:"s23-content",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:1}
				},
				{
					element:"s23-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s23-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translateX:"0%"}
				},
				
			]	
		},
		"screen-24":{
			triggers:{
				"start":()=> {
					document.querySelector("#s4-container").classList.remove("hidden");
					document.querySelector("#s24-content").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s4-container").classList.remove("hidden");
					document.querySelector("#s24-content").classList.remove("hidden");
					document.querySelector("#s22-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s4-container").classList.add("hidden");
					document.querySelector("#s24-content").classList.add("hidden");
					document.querySelector("#s22-container").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s23-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-50%"}
				},
				{
					element:"s23-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s22-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s4-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s24-circle-2",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:1,scale:"1 1"}
				},
				{
					element:"s24-circle-1",
					easing:"inOutQuad",
					duration:1200,
					delay:"+200",
					properties:{opacity:1,scale:"1 1"}
				},
				{
					element:"s24-texts",
					easing:"inOutQuad",
					duration:1000,
					delay:"+800",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:".s24-img",
					easing:"outBack",
					duration:1000,
					delay:"+900/100",
					properties:{scale:"1 1"}
				}
			]	
		},
		"screen-25":{
			triggers:{
				"start":()=> {
					document.querySelector("#s1-container").classList.remove("hidden");
					document.querySelector("#s25-content").classList.remove("hidden");
					document.querySelector("#s21-content").classList.add("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s1-container").classList.remove("hidden");
					document.querySelector("#s25-content").classList.remove("hidden");
					document.querySelector("#s21-content").classList.add("hidden");
					document.querySelector("#s4-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s1-container").classList.add("hidden");
					document.querySelector("#s25-content").classList.add("hidden");
					document.querySelector("#s21-content").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s24-circle-1",
					easing:"inOutQuad",
					duration:1000,
					properties:{opacity:0,scale:"1.3 1.3"}
				},
				{
					element:"s24-circle-2",
					easing:"inOutQuad",
					duration:1000,
					delay:"+200",
					properties:{opacity:0,scale:"1.3 1.3"}
				},
				{
					element:"s4-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+400",
					properties:{opacity:0}
				},
				{
					element:"s1-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s25-bubble-1",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s25-bubble-2",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-26":{
			triggers:{
				"start":()=> {
					document.querySelector("#s26-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s26-container").classList.remove("hidden");
					document.querySelector("#s1-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s26-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s25-bubble-2",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s25-bubble-1",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s1-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s26-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s26-woman",
					easing:"outExpo",
					duration:1200,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s26-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+600",
					properties:{opacity:1,translateX:"0%"}
				}
			]	
		},
		"screen-27":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s26-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-50%"}
				},
				{
					element:"s26-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s27-man",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s27-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+600",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"#s27-content > div",
					duration:1000,
					delay:"+600",
					properties:{opacity:1}
				},
				{
					element:"s27-triangle-1",
					duration:1000,
					delay:"+500",
					properties:{"clip-path":"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"}
				},
				{
					element:"s27-triangle-2",
					duration:1000,
					delay:"same",
					properties:{"clip-path":"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"}
				}
			]	
		},
		"screen-28":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s27-man",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s27-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s26-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s28-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+600",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"#s26-content",
					duration:1000,
					delay:"+600",
					properties:{opacity:0}
				},
				{
					element:"#s27-content",
					duration:1000,
					delay:"same",
					properties:{opacity:0}
				},
				{
					element:"#s28-content",
					duration:1000,
					delay:"same",
					properties:{opacity:1}
				},
			]	
		},
		"screen-29":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s26-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:0}
				},
				{
					element:"s29-woman",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s28-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s29-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+600",
					properties:{opacity:1,translateX:"0%"}
				}
			]	
		},
		"screen-30":{
			triggers:{
				"start":()=> {
					document.querySelector("#s30-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s30-container").classList.remove("hidden");
					document.querySelector("#s26-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s30-container").classList.add("hidden");
					document.querySelector("#s26-container").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s29-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s29-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:0}
				},
				{
					element:"s26-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s30-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s30-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s30-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				}
			]	
		},
		"screen-31":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					interactionScreen31();
				}
			},
			line:[
				{
					element:"s30-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s30-shelf",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{scale:"1 1",translateY:"0%"}
				},
				{
					element:"s30-floor",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{translate: "0% 40%"}
				},
				{
					element:"s31-interactions-wrap",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{translateY:"0%"}
				},
				{
					element:"#s31-interactions-wrap > .column",
					easing:"outBack",
					duration:1000,
					delay:"+600/200",
					properties:{opacity:1,translateX:"0%"}
				},
				,
				{
					element:"s30-drop",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{"clip-path":"polygon(-10% -10%, 110% -10%, 110% 110%, -10% 110%)"}
				},
				{
					element:"s31-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-32":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s30-drop",
					easing:"outExpo",
					duration:800,
					properties:{"clip-path":"polygon(-10% -10%, -10% -10%, -10% 110%, -10% 110%)"}
				},
				{
					element:"s31-drag-1",
					easing:"outExpo",
					duration:200,
					properties:{opacity:0}
				},
				{
					element:"s31-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s31-interactions-wrap",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateY:"100%"}
				},
				{
					element:"s32-item",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:1}
				},
				{
					element:"s30-woman",
					easing:"inOutQuad",
					duration:1000,
					delay:"+700",
					properties:{translate:"-8% 41%"}
				},
				{
					element:"s32-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-33":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					interactionScreen33();
				},
				"reset":()=> {
					interactionScreen33();
				}
			},
			line:[
				{
					element:["s33-item-1","s33-item-2","s33-item-1-2","s33-item-2-2","s33-item-3"],
					easing:"outExpo",
					duration:200,
					properties:{opacity:0}
				},
				{
					element:["s33-drag-1","s33-drag-2","s33-drag-3"],
					easing:"outExpo",
					duration:200,
					properties:{opacity:1}
				},
				{
					element:".s33-drop",
					easing:"outExpo",
					duration:200,
					properties:{"clip-path":"polygon(-10% -10%, -10% -10%, -10% 110%, -10% 110%)"}
				},
				{
					element:"s32-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s30-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s33-interactions-wrap",
					easing:"inOutQuad",
					duration:1200,
					delay:"+400",
					properties:{translateY:"0%"}
				},
				{
					element:"#s33-interactions-wrap > .column",
					easing:"outBack",
					duration:1000,
					delay:"+600/200",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:".s33-drop",
					easing:"outExpo",
					duration:1000,
					delay:"+400/200",
					properties:{"clip-path":"polygon(-10% -10%, 110% -10%, 110% 110%, -10% 110%)"}
				}
			]	
		},
		"screen-34":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				},
				"render": () => {
					const drops = document.querySelectorAll(".s33-drop");
					const imgs = [
						document.querySelector("#s33-item-3"),
						[document.querySelector("#s33-item-1"),document.querySelector("#s33-item-2-2")],
						[document.querySelector("#s33-item-2"),document.querySelector("#s33-item-1-2")]
					]
					for(let d=1; d<=drops.length; d++){
						drops[d-1].style["clip-path"] = "polygon(-10% -10%, -10% -10%, -10% 110%, -10% 110%)";
					}
					imgs.forEach((img) => {
						if(Array.isArray(img)){
							for(let i=1; i<=img.length; i++){
								const next = img[i];
								if(img[i-1].style.opacity == 0 && next && next.style.opacity == 0){
									img[i-1].style.opacity = 1;
									break;
								}
							}
						} else {
							if(img.style.opacity == 0){
								img.style.opacity = 1;
							}
						}
					});
				}
			},
			line:[
				{
					element:"s33-interactions-wrap",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateY:"100%"}
				},
				{
					element:"s30-shelf",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateY:"-15%", scale:"0.75 0.75"}
				},
				{
					element:"s30-floor",
					easing:"inOutQuad",
					duration:1200,
					properties:{translate: "0% 0%"}
				},
				{
					element:"s34-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s34-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-35":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s34-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s34-woman",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"-50%"}
				},
				{
					element:"s30-shelf",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{scale:"1 1",translateY:"0%"}
				},
				{
					element:"s30-floor",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{translate: "0% 40%"}
				},
				{
					element:"s30-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s35-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:".s35-space-break",
					easing:"inOutQuad",
					duration:1000,
					delay:"+800/50",
					properties:{opacity:1}
				},
			]	
		},
		"screen-36":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:".s35-space-break",
					easing:"inOutQuad",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:"s35-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s36-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
				{
					element:"s36-shadow",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{opacity:1,scale:"1 1"}
				},
				{
					element:"s36-shapes",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1}
				},
			]	
		},
		"screen-37":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s36-shapes",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:"s36-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s37-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
				{
					element:"s36-shadow",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{translateY:"-49%",height:"29.5%"}
				},
				{
					element:"s37-shapes",
					easing:"outExpo",
					duration:1000,
					delay:"+1000",
					properties:{opacity:1}
				},
			]	
		},
		"screen-38":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s37-shapes",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:"s37-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s38-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
				{
					element:"s36-shadow",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{translateY:"-245%",height:"17.5%"}
				},
				{
					element:"s38-shapes",
					easing:"outExpo",
					duration:1000,
					delay:"+1000",
					properties:{opacity:1}
				},
			]	
		},
		"screen-39":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s35-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s38-shapes",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:"s30-woman",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateY:"8%"}
				},
				{
					element:"s36-shadow",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:0,scale:"1.3 1.3"}
				},
				{
					element:"s30-shelf",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateY:"-15%", scale:"0.75 0.75"}
				},
				{
					element:"s30-floor",
					easing:"inOutQuad",
					duration:1200,
					properties:{translate: "0% 0%"}
				},
				{
					element:"s39-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+900",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-40":{
			triggers:{
				"start":()=> {
					document.querySelector("#s40-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s40-container").classList.remove("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s40-container").classList.add("hidden");
					const drops = document.querySelectorAll(".s33-drop");
					const imgs = [
						document.querySelector("#s33-item-3"),
						[document.querySelector("#s33-item-1"),document.querySelector("#s33-item-2-2")],
						[document.querySelector("#s33-item-2"),document.querySelector("#s33-item-1-2")]
					]
					for(let d=1; d<=drops.length; d++){
						drops[d-1].style["clip-path"] = "polygon(-10% -10%, -10% -10%, -10% 110%, -10% 110%)";
					}
					imgs.forEach((img) => {
						if(Array.isArray(img)){
							for(let i=1; i<=img.length; i++){
								const next = img[i];
								if(img[i-1].style.opacity == 0 && next && next.style.opacity == 0){
									img[i-1].style.opacity = 1;
									break;
								}
							}
						} else {
							if(img.style.opacity == 0){
								img.style.opacity = 1;
							}
						}
					});
				}
			},
			line:[
				{
					element:"s39-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s30-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:0,translateX:"50%"}
				},
				{
					element:"s30-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{filter:"blur(5px)"}
				},
				{
					element:"s40-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s41-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s41-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-42":{
			triggers:{
				"start":()=> {
					document.querySelector("#s42-content").classList.remove("hidden");
					interactionScreen9();
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					interactionScreen9();
					document.querySelector("#s42-content").classList.remove("hidden");
					document.querySelector("#s40-content").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s40-content").classList.remove("hidden");
					document.querySelector("#s42-content").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s41-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s41-woman",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s40-content",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s42-content",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s42-hand",
					duration:1000,
					delay:"+600",
					properties:{rotate:"60deg"}
				},
				{
					element:"s42-elapsed",
					duration:1280,
					delay:"same",
					//properties:{"clip-path": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"}
					properties: {"clip-path":"polygon(0% -100%, 180% 15%, 0% 100%)"}
				}
			]	
		},
		"screen-43":{
			triggers:{
				"start":()=> {
					document.querySelector("#s43-content").classList.remove("hidden");
					interactionScreen43();
				},
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					interactionScreen43();
					document.querySelector("#s43-content").classList.remove("hidden");
					document.querySelector("#s42-content").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s43-content").classList.remove("hidden");
					document.querySelector("#s42-content").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s42-content",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:0}
				},
				{
					element:"s43-content",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:1}
				},
				{
					element:"s43-woman",
					easing:"inOutQuad",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s43-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-44":{
			triggers:{
				"start": () => {
					if(interactions["43"]){
						const buttons = interactions["43"].clickables.buttons;
						for (let b = 1; b <= buttons.length; b++) {
							const button = buttons[b - 1];
							button.unCheck();
						}
					}
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s43-woman",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateY:"-32%"}
				},
				{
					element:"s43-shelf",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateY:"-15%", scale:"0.75 0.75"}
				},
				{
					element:"s43-floor",
					easing:"inOutQuad",
					duration:1200,
					properties:{translate: "0% 0%"}
				},
				{
					element:"s43-bubble",
					easing:"outExpo",
					duration:800,
					delay:"+2000",
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s44-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+900",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-45":{
			triggers:{
				"start":()=> {
					document.querySelector("#s2-container").classList.remove("hidden");
				},
				"end":()=> {
					if(interactions["46"]){
						interactions["46"].swap.removeEvents();
					}
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s2-container").classList.remove("hidden");
					document.querySelector("#s40-container").classList.add("hidden");
					document.querySelector("#s30-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s2-container").classList.add("hidden");
					document.querySelector("#s40-container").classList.remove("hidden");
					document.querySelector("#s30-container").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s44-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s43-woman",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s40-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s30-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:0}
				},
				{
					element:"s2-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s8-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s45-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-46":{
			triggers:{
				"start":()=> {
					document.querySelector("#s46-container").classList.remove("hidden");
					interactionScreen46();
				},
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					interactionScreen46();
					document.querySelector("#s46-container").classList.remove("hidden");
					document.querySelector("#s2-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s2-container").classList.remove("hidden");
					document.querySelector("#s46-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s45-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s8-woman",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"-70%"}
				},
				{
					element:"s2-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0,translateY:"44%"}
				},
				{
					element:"s46-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:"s46-woman",
					easing:"inOutQuad",
					duration:1200,
					delay:"+700",
					properties:{opacity:1,translateX:"-50%"}
				},
				{
					element:"s46-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+800",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-47":{
			triggers:{
				"start":()=> {
					document.querySelector("#s47-container").classList.remove("hidden");
					interactionScreen46();
					interactions["46"].swap.removeEvents();
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					interactionScreen46();
					interactions["46"].swap.removeEvents();
					document.querySelector("#s47-container").classList.remove("hidden");
					document.querySelector("#s46-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s46-container").classList.remove("hidden");
					document.querySelector("#s47-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s46-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s46-woman",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"100%"}
				},
				{
					element:"s46-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s47-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s47-circle-1",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:1,scale:"1 1"}
				},
				// {
				// 	element:"s47-circle-texts-1",
				// 	easing:"inOutQuad",
				// 	duration:1200,
				// 	delay:"+500",
				// 	properties:{opacity:1,scale:"1 1"}
				// },
				{
					element:"s47-texts",
					easing:"inOutQuad",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,scale:"1 1"}
				},
				{
					element:"s47-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s47-man",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-48":{
			triggers:{
				"start":()=> {
					document.querySelector("#s48-container").classList.remove("hidden");
					document.querySelector("#s48-content").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s48-container").classList.remove("hidden");
					document.querySelector("#s48-content").classList.remove("hidden");
					document.querySelector("#s47-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s48-container").classList.add("hidden");
					document.querySelector("#s48-content").classList.add("hidden");
					document.querySelector("#s47-container").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s47-texts",
					easing:"inOutQuad",
					duration:1000,
					properties:{opacity:0,scale:"1.3 1.3"}
				},
				{
					element:"s47-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s47-man",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-70%"}
				},
				{
					element:"s47-circle-1",
					easing:"inOutQuad",
					duration:1000,
					properties:{opacity:0,scale:"1.3 1.3"}
				},
				// {
				// 	element:"s47-circle-texts-1",
				// 	easing:"inOutQuad",
				// 	duration:1000,
				// 	properties:{opacity:0,scale:"1.3 1.3"}
				// },
				{
					element:"s47-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+800",
					properties:{opacity:0}
				},
				{
					element:"s48-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s48-bubble-1",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s48-bubble-2",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				}
			]	
		},
		"screen-49":{
			triggers:{
				"start":()=> {
					document.querySelector("#s49-content").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s49-content").classList.remove("hidden");
					document.querySelector("#s48-content").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s49-content").classList.add("hidden");
					document.querySelector("#s48-content").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s48-bubble-2",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s48-bubble-1",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s48-content",
					easing:"inOutQuad",
					duration:1200,
					delay:"+800",
					properties:{opacity:0}
				},
				{
					element:"s49-content",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s49-woman",
					easing:"inOutQuad",
					duration:1000,
					delay:"+700",
					properties:{translateX:"0%", opacity:1}
				},
				{
					element:"s49-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-50":{
			triggers:{
				"start": ()=>{

				},
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					interactionScreen50();
				},
				"reset": ()=>{
					interactionScreen50();
					if(interactions["50"]){
						interactions["50"].desactivateAll();
					}
				}
			},
			line:[
				{
					element:"s49-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s49-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s50-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:"s50-bubble-txt",
					easing:"outExpo",
					duration:10,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},	
				{
					element:"s50-interactions-wrap",
					easing:"inOutQuad",
					duration:1200,
					delay:"+400",
					properties:{translateY:"0%"}
				},
				{
					element:"#s50-interactions-wrap > .column",
					easing:"outBack",
					duration:1000,
					delay:"+600/200",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s50-drop",
					easing:"outExpo",
					duration:1000,
					delay:"+400",
					properties:{opacity:1}
				},
			]	
		},
		"screen-50-wrong":{
			line:[
				{
					element:"s50-bubble-txt",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0, translateX:"80%"}
				},	
				{
					element:"s50-bubble-txt-wrong",
					easing:"outExpo",
					duration:800,
					properties:{opacity:1, translateX:"0%"}
				},
				
			]	
		},
		"screen-50-right":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s50-bubble-txt",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0, translateX:"80%"}
				},
				{
					element:"s50-bubble-txt-wrong",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0, translateX:"80%"}
				},
				{
					element:"s50-bubble-txt-right",
					easing:"outExpo",
					duration:800,
					properties:{opacity:1, translateX:"0%"}
				},
				
			]	
		},
		"screen-51":{
			triggers:{
				"start":()=> {
					document.querySelector("#s50-drop").classList.remove("right");
					document.querySelector("#s51-content").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s51-content").classList.remove("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s51-content").classList.add("hidden");
				},
				"render": () => {
					document.querySelector("#s50-drop").classList.remove("right");
					document.querySelector("#s50-drop").setAttribute("plaid",3);
				}
			},
			line:[
				{
					element:".s50-drag",
					duration:10,
					properties:{opacity:0}
				},
				{
					element:"s50-interactions-wrap",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateY:"100%",opacity:0}
				},
				{
					element:"s50-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateY:"-80%"}
				},
				{
					element:"s49-bars",
					easing:"inOutQuad",
					duration:1200,
					delay:"+800",
					properties:{translateY:"14%",filter:"blur(2px)"}
				},
				{
					element:"s51-bubble-1",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s51-bubble-2",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				}
			]	
		},
		"screen-52":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s52-bubble",
					easing:"outExpo",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:1,translateY:"-50%"}
				},
				{
					element:"s51-bubble-2",
					easing:"outExpo",
					easing:"inOutQuad",
					duration:1200,
					delay:"+200",
					properties:{translateY:"-60%"}
				},
				{
					element:"s51-bubble-1",
					easing:"outExpo",
					easing:"inOutQuad",
					duration:1200,
					delay:"+200",
					properties:{opacity:0.2,translateY:"-50%"}
				}
			]	
		},
		"screen-53":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s52-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s51-bubble-2",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s51-bubble-1",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s49-bars",
					easing:"inOutQuad",
					duration:1200,
					delay:"+800",
					properties:{translateY:"-12%",filter:"blur(0px)"}
				},
				{
					element:"s53-woman",
					easing:"inOutQuad",
					duration:1000,
					delay:"+700",
					properties:{translateX:"0%", opacity:1}
				},
				{
					element:"s53-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-54":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s53-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s53-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-70%"}
				},
				{
					element:"s54-man",
					easing:"inOutQuad",
					duration:1000,
					delay:"+700",
					properties:{translateX:"0%", opacity:1}
				},
				{
					element:"s54-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-55":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					interactionScreen55();
				},
				"reset": ()=>{
					interactionScreen55();
				}
			},
			line:[
				{
					element:"s54-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s54-man",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s55-woman",
					easing:"inOutQuad",
					duration:1000,
					delay:"+700",
					properties:{translateX:"0%", opacity:1}
				},
				{
					element:"s55-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s55-interactions-wrap",
					easing:"inOutQuad",
					duration:1200,
					delay:"+400",
					properties:{translateY:"0%"}
				},
				{
					element:"#s55-interactions-wrap > .column",
					easing:"outBack",
					duration:1000,
					delay:"+600/200",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s55-drop",
					easing:"outExpo",
					duration:1000,
					delay:"+400",
					properties:{opacity:1}
				},
			]	
		},
		"screen-55-feedback":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s55-bubble-txt",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0, translateX:"80%"}
				},
				{
					element:"s55-bubble-txt-right",
					easing:"outExpo",
					duration:800,
					properties:{opacity:1, translateX:"0%"}
				},
				
			]	
		},
		"screen-56":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = "up";
					}
					interactionScreen56();
				},
				"reset": ()=>{
					interactionScreen56();
					interactions["56"].disabled = true;
				}
			},
			line:[
				{
					element:"#s55-drop",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:"#s56-plaid-1",
					easing:"outExpo",
					duration:800,
					properties:{opacity:1}
				},
				{
					element:"s55-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s55-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-70%"}
				},
				{
					element:"s55-interactions-wrap",
					easing:"inOutQuad",
					duration:1000,
					properties:{translateY:"100%",opacity:0}
				},
				{
					element:"s49-bars",
					easing:"inOutQuad",
					duration:1200,
					delay:"+800",
					properties:{translateY:"9%"}
				},
				{
					element:"s56-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:"s56-bubble-txt",
					easing:"outExpo",
					duration:10,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
				{
					element:"s56-interactions-wrap",
					easing:"outBack",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:"s56-cursor",
					easing:"outBack",
					duration:1000,
					delay:"+800",
					properties:{scale:"1 1",opacity:1}
				},
				{
					element:"s56-cursor",
					duration:1000,
					delay:"next",
					properties:{translateX:"397%"}
				},
				{
					element:"s56-dot",
					duration:1000,
					delay:"same",
					properties:{translateX:"671%"}
				},
				{
					element:"s56-plaid-1",
					duration:1000,
					delay:"same",
					properties:{translateX:"106%"}
				},
				{
					element:"s56-cursor",
					duration:1000,
					delay:"next",
					properties:{translateX:"0%"}
				},
				{
					element:"s56-dot",
					duration:1000,
					delay:"same",
					properties:{translateX:"0%"}
				},
				{
					element:"s56-plaid-1",
					duration:1000,
					delay:"same",
					properties:{translateX:"0%"}
				},
				{
					element:"s56-cursor",
					easing:"outExpo",
					duration:1000,
					delay:"next",
					properties:{scale:"1.3 1.3",opacity:0}
				},
			]	
		},
		"screen-56-feedback":{
			triggers:{
				"start": ()=> {
					if(interactions["56"]){
						interactions["56"].disabled = true;
					}
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s56-bubble-txt",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0, translateX:"80%"}
				},
				{
					element:"s56-bubble-txt-right",
					easing:"outExpo",
					duration:800,
					properties:{opacity:1, translateX:"0%"}
				},
				
			]	
		},
		"screen-57":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				},
				"render": () => {
					if(document.querySelector("#s56-plaid-1").style.translate === "0%"){
						document.querySelector("#s56-plaid-1").style.translate = "40% 0%"; 
					}
				}
			},
			line:[
				{
					element:"s56-interactions-wrap",
					easing:"inOutQuad",
					duration:1200,
					properties:{translateY:"-100%",opacity:0}
				},
				{
					element:"s56-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateY:"-80%"}
				},
				{
					element:"s49-bars",
					easing:"inOutQuad",
					duration:1200,
					delay:"+800",
					properties:{translateY:"-12%"}
				},
				{
					element:"s57-woman",
					easing:"inOutQuad",
					duration:1000,
					delay:"+700",
					properties:{translateX:"0%", opacity:1}
				},
				{
					element:"s57-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-58":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s57-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s57-woman",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-70%"}
				},
				{
					element:"s58-man",
					easing:"inOutQuad",
					duration:1000,
					delay:"+300",
					properties:{translateX:"0%", opacity:1}
				},
				{
					element:"s58-bubble",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-59":{
			triggers:{
				"start":()=> {
					document.querySelector("#s59-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s59-container").classList.remove("hidden");
					document.querySelector("#s48-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s48-container").classList.remove("hidden");
					document.querySelector("#s59-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s58-bubble",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s58-man",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"70%"}
				},
				{
					element:"s48-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s59-container",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s59-circle-1",
					easing:"inOutQuad",
					duration:1200,
					delay:"+500",
					properties:{opacity:1,scale:"1 1"}
				},
				{
					element:"s59-img-1",
					easing:"inOutQuad",
					duration:1200,
					delay:"+200",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s59-img-2",
					easing:"inOutQuad",
					duration:1200,
					delay:"+200",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s59-img-3",
					easing:"inOutQuad",
					duration:1200,
					delay:"+200",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s59-texts",
					easing:"inOutQuad",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,scale:"1 1"}
				}
			]	
		},
	}
}