var timelineDatas = {
	mainEnd:function(){
    },
	elements: {
		"Stage_section-1":{
			top:"0px",
			opacity:1
		},
		"Stage_e1_introTxts":{
				translateY:"50px",
				opacity:0
		},
		"Stage_e1_button":{
			scaleX:0,
			scaleY:0
		},
		"Stage_section-2":{
			opacity:0,
			translateY:"0%"
		},
		"Stage_question-wrap":{
			translateY:"50px",
			opacity:0
		},
		"Stage_question-wrap-1":{
			translateX:"100%",
			opacity:0
		},
		"Stage_question-wrap-2":{
			translateX:"100%",
			opacity:0
		},
		"Stage_question-wrap-3":{
			translateX:"100%",
			opacity:0
		},
		"Stage_question-wrap-4":{
			translateX:"100%",
			opacity:0
		},
		"Stage_question-wrap-5":{
			translateX:"100%",
			opacity:0
		},
		"Stage_question-wrap-6":{
			translateX:"100%",
			opacity:0
		},
		"Stage_question-wrap-7":{
			translateX:"100%",
			opacity:0
		},
		"Stage_question-wrap-8":{
			translateX:"100%",
			opacity:0
		},
		"Stage_question-wrap-9":{
			translateX:"100%",
			opacity:0
		},
		"Stage_question-wrap-10":{
			translateX:"100%",
			opacity:0
		},
		"Stage_gauge_dot_1":{
			translateX:"50px",
			opacity:0
		},
		"Stage_gauge_dot_2":{
			translateX:"50px",
			opacity:0
		},
		"Stage_gauge_dot_3":{
			translateX:"50px",
			opacity:0
		},
		"Stage_gauge_dot_4":{
			translateX:"50px",
			opacity:0
		},
		"Stage_gauge_dot_5":{
			translateX:"50px",
			opacity:0
		},
		"Stage_gauge_dot_6":{
			translateX:"50px",
			opacity:0
		},
		"Stage_gauge_dot_7":{
			translateX:"50px",
			opacity:0
		},
		"Stage_gauge_dot_8":{
			translateX:"50px",
			opacity:0
		},
		"Stage_gauge_dot_9":{
			translateX:"50px",
			opacity:0
		},
		"Stage_gauge_dot_10":{
			translateX:"50px",
			opacity:0
		},
		"Stage_section-3":{
			translateY:"100%",
			opacity:0
		},
		"Stage_btSeeAgain":{
			scaleX:0,
			scaleY:0
		},
		"Stage_btRedo":{
			scaleX:0,
			scaleY:0
		},
		"Stage_btDownload":{
			scaleX:0,
			scaleY:0
		},
		"Stage_feedbacks_good":{
			translateY:"-50px",
			opacity:0
		},
		"Stage_feedbacks_medium":{
			translateY:"-50px",
			opacity:0
		},
		"Stage_feedbacks_bad":{
			translateY:"-50px",
			opacity:0
		}
	},
	steps: {
		"screen_1":{
			options:{
				forwardsStart:function(){
					sections[0].classList.remove("hidden");
				},
				forwardsEnd:function(){
					var button = sections[0].querySelector("#Stage_e1_button");
					button.force = true;
					button.classList.add("pulseBrown");
				},
				rendered: function(){
					sections[1].classList.add("hidden");
					sections[0].classList.remove("hidden");
				}
			},
			line:[
				{
					id:"Stage_e1_introTxts",
					properties:{translateY:"0px",opacity:1}, duration:1000, easing:"outExpo"
				},
				{
					id:"Stage_e1_button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+500", easing:"outBack"
				}
			]			
		},
		"screen_2":{
			options:{
				forwardsStart:function(){
					sections[1].classList.remove("hidden");
					evalInit();
				},
				forwardsEnd:function(){
					sections[0].classList.add("hidden");
					evalInit();
				},
				rendered: function(){
					sections[0].classList.add("hidden");
					sections[1].classList.remove("hidden");
				}
			},
			line:[
				{
					id:"Stage_e1_button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:"outExpo"
				},
				{id:"Stage_section-1",properties:{opacity:0}, duration:1000, easing:"inExpo"},
				{id:"Stage_section-2",properties:{opacity:1}, duration:1000, easing:"inExpo"},
				{	
					id:"Stage_question-wrap",
					properties:{translateY:"0px",opacity:1}, duration:1000, delay:"+800", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_1",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+300", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_2",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+100", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_3",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+100", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_4",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+100", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_5",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+100", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_6",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+300", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_7",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+100", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_8",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+100", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_9",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+100", easing:"outExpo"
				},
				{
					id:"Stage_gauge_dot_10",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+100", easing:"outExpo"
				}
			]			
		},
		"screen_3":{
			options:{
				forwardsStart:function(){
					displayResults();
					sections[2].classList.remove("hidden");
				},
				forwardsEnd:function(){
					sections[1].classList.add("hidden");
				},
				rendered: function(){
					sections[1].classList.add("hidden");
					sections[2].classList.remove("hidden");
				}
			},
			line:[
				{
					id:"Stage_section-2",
						properties:{translateY:"-100%",opacity:0}, duration:1500, easing:"inOutQuad"
				},
				{
					id:"Stage_section-3",
						properties:{translateY:"0%",opacity:1}, duration:1500, easing:"inOutQuad"
				},
				{
					id:"Stage_feedbacks_good",
						properties:{translateY:"0px",opacity:1}, duration:1000, delay:"next", easing:"outExpo"
				},
				{
					id:"Stage_feedbacks_medium",
						properties:{translateY:"0px",opacity:1}, duration:1000, delay:"same", easing:"outExpo"
				},
				{
					id:"Stage_feedbacks_bad",
						properties:{translateY:"0px",opacity:1}, duration:1000, delay:"same", easing:"outExpo"
				},
				{
					id:"Stage_btSeeAgain",
						properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+500", easing:"outBack"
				},
				{
					id:"Stage_btRedo",
						properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+100", easing:"outBack"
				},
				{
					id:"Stage_btDownload",
						properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+100", easing:"outBack"
				}
			]
		}
	}
};