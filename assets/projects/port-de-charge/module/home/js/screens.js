var timelineDatas = {
    mainEnd:function(){
    },
	elements: {
		"Stage_e1_man": {
			translateX:"-50%",
			opacity:0
		},
		"Stage_e1_logo": {
			translateX:"50%",
			opacity:0
		},
		"Stage_e1_title": {
			translateX:"50%",
			opacity:0
		},
		"Stage_e1_txt": {
			translateX:"50%",
			opacity:0
		},
		"Stage_end-txt": {
			translateX:"50%",
			opacity:0
		},
		"Stage_e1_button": {
			scaleX:0,
			scaleY:0
		},
		"Stage_buttonQuit": {
			scaleX:0,
			scaleY:0
		},
	},
	steps: {
		"screen_1": {
			options:{
				forwardsStart:function(){
					var button = stageDom.querySelector("#Stage_e1_button"),
					p = button.querySelector("p"),
					txt1 = stageDom.querySelector("#Stage_e1_txt"),
					buttonQuit = stageDom.querySelector("#Stage_buttonQuit"),
					endTxt = stageDom.querySelector("#Stage_end-txt");
					//La formation vient d'être achevée (évaluation terminée)
					if(dataP.justFinished==true){
						button.classList.add("hidden");
						txt1.classList.add("hidden");
						dataP.justFinished = false;
					} else {
						buttonQuit.classList.add("hidden");
						endTxt.classList.add("hidden");
						p.innerHTML = isFormationStarted() ? "Reprendre" : "Commencer";
					}
					
				},
				forwardsEnd:function(){
					
				},	
			},
			line: [
				{
					id:"Stage_e1_man",
					properties:{translateX:"0%",opacity:1},
					easing:"outExpo",
					duration:1000
				},
				{
					id:"Stage_e1_logo",
					properties:{translateX:"0%",opacity:1},
					easing:"outExpo",
					delay:"+200",
					duration:1000
				},
				{
					id:"Stage_e1_title",
					properties:{translateX:"0%",opacity:1},
					easing:"outExpo",
					delay:"+200",
					duration:1000
				},
				{
					id:"Stage_e1_txt",
					properties:{translateX:"0%",opacity:1},
					easing:"outExpo",
					delay:"+200",
					duration:1000
				},
				{
					id:"Stage_end-txt",
					properties:{translateX:"0%",opacity:1},
					easing:"outExpo",
					delay:"same",
					duration:1000
				},
				{
					id:"Stage_e1_button",
					properties:{scaleX:1,scaleY:1},
					easing:"outBack",
					delay:"+200",
					duration:1000
				},
				{
					id:"Stage_buttonQuit",
					properties:{scaleX:1,scaleY:1},
					easing:"outBack",
					delay:"same",
					duration:1000
				},
			]
		}
	}
};