import { swap, intersectionScreen1, intersectionScreen2, intersectionScreen3, intersectionScreen4 } from "./main.js";

export const timelineDatas = {
	line:[
		{"screen-1-feedback":"ignored","screen-1":0},
		{"screen-2-feedback":"ignored","screen-2":0},
		{"screen-3-feedback":"ignored","screen-3":0},
		{"screen-4-feedback":"ignored","screen-4":0},
		"screen-5",
		"screen-6"
	],
	steps: {
		"screen-1":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = true;
						intersectionScreen1();
					}
				}
			},
			line:[
				{
					element:"s1-earth",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:1, scale:"1 1"}
				},
				{
					element:"s1-circle-3",
					easing:"inOutQuad",
					duration:1200,
					delay:"+800",
					properties:{opacity:1, scale:"1 1"}
				},
				{
					element:"s1-circle-2",
					easing:"inOutQuad",
					duration:1200,
					delay:"+300",
					properties:{opacity:1, scale:"1 1"}
				},
				{
					element:"s1-circle-1",
					easing:"inOutQuad",
					duration:1200,
					delay:"+300",
					properties:{opacity:1, scale:"1 1"}
				},
				{
					element:"s1-dots",
					duration:800,
					delay:"+400",
					properties:{opacity:1}
				},
				{
					element:"s1-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:"s1-button-validate",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-1-feedback":{
			triggers:{
				"end":()=>{
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s1-button-validate",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s1-feedback",
					easing:"outBack",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translateY:"0%"}
				}
			]
		},
		"screen-2":{
			triggers:{
				"start":()=> {
					intersectionScreen2();
					document.querySelector("#s2-content").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = "up";
						intersectionScreen2();
					}
					document.querySelector("#s1-content").classList.add("hidden");
					document.querySelector("#s2-content").classList.remove("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s2-content").classList.add("hidden");
					document.querySelector("#s1-content").classList.remove("hidden");
				}
			},
			line:[
				{
					element:"s1-feedback",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateY:"70%"}
				},
				{
					element:"s1-dots",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:"s1-circle-1",
					easing:"inOutQuad",
					duration:1000,
					delay:"+300",
					properties:{opacity:0, scale:"1.3 1.3"}
				},
				{
					element:"s1-circle-2",
					easing:"inOutQuad",
					duration:1000,
					delay:"+200",
					properties:{opacity:0, scale:"1.3 1.3"}
				},
				{
					element:"s1-circle-3",
					easing:"inOutQuad",
					duration:1000,
					delay:"+200",
					properties:{opacity:0, scale:"1.3 1.3"}
				},
				{
					element:"s1-earth",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:0, scale:"0.5 0.5"}
				},
				{
					element:"s2-clickables",
					easing:"inOutQuad",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s2-rect-2",
					easing:"inOutQuad",
					duration:1200,
					delay:"+800",
					properties:{opacity:1, scale:"1 1"}
				},
				{
					element:"s2-rect-1",
					easing:"inOutQuad",
					duration:1200,
					delay:"+200",
					properties:{opacity:1, scale:"1 1"}
				},
				{
					element:"s1-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s2-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
				{
					element:".s2-clickable",
					easing:"outBack",
					duration:1000,
					delay:"+500/200",
					properties:{opacity:1,scale:"1 1"}
				},
				{
					element:"s2-button-validate",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1"}
				},
			]	
		},
		"screen-2-feedback":{
			triggers:{
				"end":()=>{
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s2-button-validate",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s2-feedback",
					easing:"outBack",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translateY:"0%"}
				}
			]
		},
		"screen-3":{
			triggers:{
				"start":()=> {
					intersectionScreen3();
					document.querySelector("#s3-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = "up";
						intersectionScreen3();
					}
					document.querySelector("#s3-container").classList.remove("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s3-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s2-feedback",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateY:"70%"}
				},
				{
					element:".s2-clickable",
					easing:"outExpo",
					duration:800,
					delay:"/200",
					properties:{opacity:0,scale:"0.2 0.2"}
				},
				{
					element:"s2-rect-2",
					easing:"inOutQuad",
					duration:1000,
					properties:{opacity:0, scale:"1.3 1.3"}
				},
				{
					element:"s2-rect-1",
					easing:"inOutQuad",
					duration:1000,
					delay:"+200",
					properties:{opacity:0, scale:"1.3 1.3"}
				},
				{
					element:"s1-bubble",
					easing:"inOutQuad",
					duration:1000,
					delay:"+200",
					properties:{opacity:0, translateY:"-50%"}
				},
				{
					element:"s2-content",
					easing:"outExpo",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s3-container",
					easing:"outExpo",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s3-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+600",
					properties:{opacity:1, translateX:"-50%"}
				},
				{
					element:"s3-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+300",
					properties:{scale:"1 1"}
				}
			]	
		},
		"screen-3-feedback":{
			triggers:{
				"end":()=>{
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s3-button-validate",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s3-feedback",
					easing:"outBack",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translateY:"0%"}
				}
			]
		},
		"screen-4":{
			triggers:{
				"start":()=> {
					intersectionScreen4();
					document.querySelector("#s4-content").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = "up";
						intersectionScreen4();
					}
					document.querySelector("#s4-content").classList.remove("hidden");
					document.querySelector("#s3-container").classList.add("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s4-content").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s3-feedback",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateY:"70%"}
				},
				{
					element:"s3-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0 0"}
				},
				{
					element:"s3-woman",
					easing:"inOutQuad",
					duration:1000,
					delay:"+200",
					properties:{opacity:0, translateY:"0%"}
				},
				{
					element:"s3-container",
					easing:"outExpo",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s4-content",
					easing:"outExpo",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s1-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:"s2-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:0, translateX:"70%"}
				},	
				{
					element:"s4-bubble-txt",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1, translateX:"0%"}
				},
				{
					element:".s4-clickable",
					easing:"outBack",
					duration:1000,
					delay:"+300/200",
					properties:{scale:"1 1"}
				},
				{
					element:"s4-validate-wrap",
					easing:"outExpo",
					duration:1000,
					delay:"+300",
					properties:{opacity:1}
				},
				// {
				// 	element:"s3-woman",
				// 	easing:"outExpo",
				// 	duration:1000,
				// 	delay:"+600",
				// 	properties:{opacity:1, translateX:"-50%"}
				// },
				// {
				// 	element:"s3-bubble",
				// 	easing:"outBack",
				// 	duration:1000,
				// 	delay:"+300",
				// 	properties:{scale:"1 1"}
				// }
			]	
		},
		"screen-4-feedback":{
			triggers:{
				"end":()=>{
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s4-validate-wrap",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:"s4-feedback",
					easing:"outBack",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translateY:"0%"}
				}
			]
		},
		"screen-5":{
			triggers:{
				"start":()=> {
					document.querySelector("#s5-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s4-content").classList.add("hidden");
					document.querySelector("#s5-container").classList.remove("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s5-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s4-feedback",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateY:"70%"}
				},
				{
					element:".s4-clickable",
					easing:"outExpo",
					duration:800,
					delay:"/200",
					properties:{scale:"0 0"}
				},
				{
					element:"s1-bubble",
					easing:"inOutQuad",
					duration:1000,
					delay:"+200",
					properties:{opacity:0, translateY:"-50%"}
				},
				{
					element:"s4-content",
					easing:"outExpo",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s5-container",
					easing:"outExpo",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s5-bubble-1",
					easing:"outExpo",
					duration:1000,
					delay:"+700",
					properties:{opacity:1,translateX:"0%"}
				},
				{
					element:"s5-bubble-2",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		},
		"screen-6":{
			triggers:{
				"start":()=> {
					document.querySelector("#s6-container").classList.remove("hidden");
				},
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					document.querySelector("#s5-container").classList.add("hidden");
					document.querySelector("#s6-container").classList.remove("hidden");
				},
				"reset": ()=>{
					document.querySelector("#s6-container").classList.add("hidden");
				}
			},
			line:[
				{
					element:"s5-bubble-2",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0,translateX:"-80%"}
				},
				{
					element:"s5-bubble-1",
					easing:"outExpo",
					duration:800,
					delay:"+200",
					properties:{opacity:0,translateX:"80%"}
				},
				{
					element:"s5-container",
					easing:"outExpo",
					duration:1200,
					delay:"+500",
					properties:{opacity:0}
				},
				{
					element:"s6-container",
					easing:"outExpo",
					duration:1200,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s6-circle-2",
					easing:"inOutQuad",
					duration:1200,
					delay:"+300",
					properties:{opacity:1, scale:"1 1"}
				},
				{
					element:"s6-circle-1",
					easing:"inOutQuad",
					duration:1200,
					delay:"+300",
					properties:{opacity:1, scale:"1 1"}
				},
				{
					element:"s6-item-2",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s6-item-6",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s6-item-1",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:"s6-item-5",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1,translateY:"0%"}
				},
				{
					element:"s6-item-3",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s6-item-4",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1,translate:"0% 0%"}
				},
				{
					element:"s6-item-7",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translate:"-50% -50%"}
				},
				{
					element:"s6-item-8",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{opacity:1,translate:"30% 45%"}
				},
				{
					element:"s6-texts",
					easing:"outExpo",
					duration:1000,
					delay:"+200",
					properties:{opacity:1,translateX:"0%"}
				},
			]	
		}
	}
}