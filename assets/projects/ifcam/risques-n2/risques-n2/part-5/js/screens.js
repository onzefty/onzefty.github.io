var tP = {
	p:{
		"textLeft-in": {translateX:"0%",opacity:1},
		"textLeft-out": {translateX:"-40%",opacity:0},
		"textRight-in": {translateX:"0%",opacity:1},
		"textRight-out": {translateX:"40%",opacity:0},
		"sep-in": {scaleX:1},
		'sep-out': {scaleX:0},
		"button-in":{scaleX:1,scaleY:1},
		"button-out":{scaleX:0,scaleY:0},	
	},
	d:{
		"standard-in":1000,
		"standard-in-s":500,
		"standard-out":800,
		"long-in":1400
	},
	e:{
		"standard-in":"outExpo",
		"standard-out":"outExpo",
		"long-in":"inOutExpo",
		"button-in":"outBack",
		"button-out":"inBack"
	}
}

var timelineDatas = {
	cbGetDatas:{
		"getSoundDuration":getSoundDuration,
	},
	line: [
		"screen-1","screen-2",
		{
			"screen-3":0,
			"screen-3-corrections-show":"ignored"
		}
	],
	steps: {
		"screen-1":{
			options:{
				forwardsStart:function(){
					showSection("section-1");
				},
				forwardsEnd:function(){
					quizInit();
					navigation.isOff();
				},
				rendered:function(){
					showSection("section-1");
				}
			},
			line:[
				{
					id:"section-1",
					properties:{scaleX:1,scaleY:1,opacity:1}, duration:1400, easing:tP.e["standard-in"]
				},
				{
					id:"s1-icon",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+800", easing:tP.e["button-in"]
				},
				{
					id:"s1-txt-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"], delayId:"sound_1", cbStart:function(){ soundManager.play("sound_1");}
				},
				{
					id:"s1-txt-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s1-txt-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"same", easing:tP.e["standard-in"]
				},
				{
					id:"s1-link",
					properties:{scaleY:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s1-btNext",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+600", easing:tP.e["button-in"]
				},
			]	
		},
		"screen-2":{
			options:{
				forwardsStart: function () {
					showSection("section-2");
					if(quiz){
						quiz.render();
					}
				},
				forwardsEnd: function () {
					quizInit();
					quiz.render();
					navigation.isOff();
					hideSection("section-1");
				},
				rendered:function(){
					showSection("section-2");
					hideSection("section-1");
				},
				resetted:function(){
				}
			},
			line:[
				{
					id:"section-2",
					properties:{translateY:"0px",scaleX:1,scaleY:1,opacity:1}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"quiz-imgs",
					properties:{scaleX:1,scaleY:1}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"section-1",
					properties:{scaleX:1.35,scaleY:1.35,opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
			]	
		},
		"screen-3":{
			options:{
				forwardsStart: function () {
					quizResults();
					showSection("section-1");
					sections[0].querySelector("#s1-group").classList.add("hidden");
					sections[0].querySelector("#s3-group").classList.remove("hidden");
				},
				forwardsEnd: function () {
					navigation.isOff();
					hideSection("section-2");
				},
				rendered:function(){
					showSection("section-1");
					hideSection("section-2");
				},
				resetted:function(){
				}
			},
			line:[
				{
					id:"section-2",
					properties:{translateY:"30px",scaleX:0.65,scaleY:0.65,opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"quiz-imgs",
					properties:{scaleX:1.55,scaleY:1.55}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"section-1",
					properties:{scaleX:1,scaleY:1,opacity:1}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s3-icon",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+800", easing:tP.e["button-in"]
				},
				{
					id:"s3-txt-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"], delayId:"sound_3", cbStart:function(){ soundManager.play("sound_3");}
				},
				{
					id:"s3-txt-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s3-link",
					properties:{scaleX:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s3-txt-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s3-button-quit",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+600", easing:tP.e["button-in"]
				},
				{
					id:"s3-button-redo",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+200", easing:tP.e["button-in"]
				},
				{
					id:"s3-button-corrections",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+200", easing:tP.e["button-in"]
				},
			]	
		},
		"screen-3-corrections-show":{
			options:{
				forwardsStart: function () {
					sections[0].querySelector("#s3-quiz-corrections-wrap").classList.add("noEvents");
					sections[0].querySelector("#s3-quiz-corrections-wrap").classList.remove("hidden");
				},
				forwardsEnd:function(){
					sections[0].querySelector("#s3-quiz-corrections-wrap").classList.remove("noEvents");
				},
				resetted:function(){
					if(sections){
						sections[0].querySelector("#s3-quiz-corrections-wrap").classList.add("hidden");
						sections[0].querySelector("#s3-quiz-corrections-wrap").classList.add("noEvents");	
					}
				}
			},
			line:[
				{
					id:"s3-quiz-corrections-wrap",
					properties:{opacity:1}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s3-circle",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s3-quiz-corrections-content",
					properties:{opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s3-quiz-corrections-helper",
					properties:{opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s3-quiz-corrections-button-close",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+600", easing:tP.e["button-in"]
				}
			]	
		},
		"screen-3-corrections-hide":{
			options:{
				forwardsStart:function(){
					sections[0].querySelector("#s3-quiz-corrections-wrap").classList.add("noEvents");
				},
				forwardsEnd: function () {
					sections[0].querySelector("#s3-quiz-corrections-wrap").classList.add("hidden");
				}
			},
			line:[
				{
					id:"s3-quiz-corrections-wrap",
					properties:{opacity:0}, duration:1000
				},
				{
					id:"s3-circle",
					properties:{scaleX:0.5,scaleY:0.5}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-quiz-corrections-content",
					properties:{opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-quiz-corrections-helper",
					properties:{opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-quiz-corrections-button-close",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				}
			]	
		},
	}
};