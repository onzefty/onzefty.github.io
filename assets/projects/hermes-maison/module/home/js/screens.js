import { swap, interactionScreen2, interactionScreen5 } from "./main.js";

export const timelineDatas = {
	line:[
		"screen-1",
		"screen-2",
		"screen-3",
		"screen-4",
		"screen-5"
	],
	steps: {
		"screen-1":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = true;
						document.querySelector("#s1-button-start").classList.remove("noEvents");
						//swap.showHelper();
					}
				}
			},
			line:[
				{
					element:"s1-hermes-logo",
					easing:"inOutQuad",
					duration:1000,
					properties:{opacity:1, translate:"0% 0%"}
				},
				{
					element:"s1-circle",
					easing:"inOutQuad",
					delay:300,
					duration:1000,
					properties:{opacity:1, scale:"1 1"}
				},
				{
					element:"s1-woman",
					easing:"inOutBack",
					delay:"+600",
					duration:1000,
					properties:{opacity:1, translate:"0% 0%"}
				},
				{
					element:"s1-man",
					easing:"inOutBack",
					delay:"+200",
					duration:1000,
					properties:{opacity:1, translate:"0% 0%"}
				},
				{
					element:"s1-button-start",
					easing:"inOutBack",
					delay:"+700",
					duration:1000,
					properties:{opacity:1, translateY:"0%"}
				}
			]	
		},
		"screen-2":{
			triggers:{
				"start": () => {
					document.querySelector("#s1-button-start").classList.add("noEvents");
				},
				"end":()=> {
					interactionScreen2();
					document.querySelector("#s1-button-start").classList.add("noEvents");
					if(swap){
						swap.disabled = "up";
					}
				},
				"reset":() => {
					const cursorHelper = document.querySelector("#s2-swap-helper");
					cursorHelper.classList.add("unavailable");
				}
			},
			line:[
				{
					element:"s1-button-start",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:0, translateY:"-50%"}
				},
				{
					element:"s1-hermes-logo",
					easing:"inOutQuad",
					duration:1200,
					properties:{translate:"0% -200%"}
				},
				{
					element:"s1-circle",
					easing:"inOutQuad",
					duration:1200,
					properties:{translate:"0% 22%"}
				},
				{
					element:"s1-woman",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:0}
				},
				{
					element:"s1-man",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:0}
				},
				{
					element:"s2-woman",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:1}
				},
				{
					element:"s2-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1",opacity:1}
				},
				// {
				// 	element:"s2-swap-wrap",
				// 	easing:"outBack",
				// 	duration:1000,
				// 	delay:"+500",
				// 	properties:{translateX:"-50%",opacity:1}
				// }
			]	
		},
		"screen-3":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
					interactionScreen5();
				},
				"reset":() => {
					interactionScreen5();
				},
				"render": () => {
					const cursorHelper = document.querySelector("#s2-swap-helper");
					cursorHelper.classList.add("unavailable");
				}
			},
			line:[
				{
					element:"s2-woman",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:0}
				},
				{
					element:"s2-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0.5 0.5",opacity:0}
				},	
				{
					element:"s1-circle",
					easing:"inOutQuad",
					duration:1200,
					properties:{translate:"0% -100%"}
				},
				{
					element:"s4-woman",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:0}
				},
				{
					element:"s1-woman",
					easing:"inOutQuad",
					duration:1200,
					properties:{translate:"32% 33%",opacity:1}
				},
				{
					element:"s1-man",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:0}
				},
				{
					element:"s5-veil",
					easing:"inOutQuad",
					duration:1200,
					properties:{opacity:1}
				},
				{
					element:"s5-group",
					easing:"outExpo",
					duration:1000,
					delay:"+800",
					properties:{opacity:1,translate:"-50% 0%"}
				},
				{
					element:"s5-gauge",
					easing:"outExpo",
					duration:1000,
					delay:"+500",
					properties:{opacity:1}
				}
			]	
		},
		"screen-4":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s5-veil",
					easing:"inOutQuad",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:"s5-gauge",
					easing:"outExpo",
					duration:800,
					properties:{opacity:0}
				},
				{
					element:"s5-group",
					easing:"outExpo",
					duration:1000,
					properties:{opacity:0,translate:"-150% 0%"}
				},
				{
					element:"s1-circle",
					easing:"inOutQuad",
					duration:1200,
					properties:{translate:"0% -20.5%"}
				},
				{
					element:"s1-circle",
					easing:"inOutQuad",
					duration:800,
					delay:"next",
					properties:{opacity:0}
				},
				{
					element:"s6-content",
					easing:"inOutQuad",
					duration:800,
					delay:"same",
					properties:{opacity:1}
				},
				{
					element:"s6-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+800",
					properties:{translate:"0% 0%",opacity:1}
				},
				{
					element:"s6-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1",opacity:1}
				}
			]	
		},
		"screen-5":{
			triggers:{
				"end":()=> {
					if(swap){
						swap.disabled = false;
					}
				}
			},
			line:[
				{
					element:"s6-bubble",
					easing:"outExpo",
					duration:800,
					properties:{scale:"0.5 0.5",opacity:0}
				},
				{
					element:"s6-woman",
					easing:"outExpo",
					duration:1000,
					delay:"+300",
					properties:{translate:"-100% 0%",opacity:0}
				},
				{
					element:"s7-man",
					easing:"outExpo",
					duration:1000,
					delay:"same",
					properties:{translate:"0% 0%",opacity:1}
				},
				{
					element:"s7-bubble",
					easing:"outBack",
					duration:1000,
					delay:"+500",
					properties:{scale:"1 1",opacity:1}
				}
			]	
		}
	}
}