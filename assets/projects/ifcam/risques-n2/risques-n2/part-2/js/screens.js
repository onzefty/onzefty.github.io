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
	line:[
		"screen-1",
		{
			"screen-2":0,
			"screen-2-feedback":"ignored",
		},
		{
			"screen-2-out":0,
			"screen-2-feedback-out":0,
			"screen-3":600,
			"screen-3-helper-out":"ignored",
		},
		{
			"screen-3-out":0,
			"screen-4":500,
			"screen-4-feedback":"ignored",
		}
	],
	steps: {
		"screen-1":{
			options:{
				forwardsStart:function(){
					showSection("section-1");
				},
				forwardsEnd:function(){
					var buttonNext = sections[0].querySelector("#s1-btNext");
					buttonNext.classList.add("active");
					navigation.isOff();
				},
				rendered:function(){
					showSection("section-1");
					sections[0].querySelector("#s2-group").classList.add("noEvents");
				}
			},
			line:[
				{
					id:"section-1",
					properties:{opacity:1}, duration:1000
				},
				{
					id:"s1-group",
					properties:{translateX:"-50%",opacity:1}, duration:1000, delay:"+1200", easing:tP.e["standard-out"], cbStart:function(){soundManager.play("sound_1");}
				}
			]	
		},
		"screen-2":{
			options:{
				forwardsStart:function(){
					var buttonNext = sections[0].querySelector("#s1-btNext");
					buttonNext.classList.remove("active");
					if (interactions["2"]) {
						interactions["2"].reset(true);
					}
				},
				forwardsEnd:function(){
					if (!interactions["2"]) {
						interactions["2"] = new Clickables({
							datas: [{ answer: true }, { answer: true }, { answer: false }, { answer: true }],
							buttons: sections[0].querySelectorAll(".s2-clickable"),
							btValidate: sections[0].querySelector("#s2-button-validate"),
							correctionAuto: true,
							cbEnd: function () {
								if(timeline.status==="normal"){
									timeline.play("screen-2-feedback");
								}
							},
							cbReset: function(){
								sections[0].querySelector("#s2-feedback").classList.remove("wrong");
								sections[0].querySelector("#s2-feedback").classList.remove("right");
							}
						});
					} else {
						interactions["2"].reset();
					}
					navigation.isOn("prev");
					sections[0].querySelector("#s2-group").classList.remove("noEvents");
					sections[0].querySelector("#s2-feedback").classList.add("noEvents");
				}
			},
			line:[
				{
					id:"s1-btNext",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s1-group",
					properties:{translateX:"-90%",opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s1-img-1",
					properties:{translateX:"0px",translateY:"0px",scaleX:1,scaleY:1}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s2-group",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+700", easing:tP.e["standard-out"], cbStart:function(){soundManager.play("sound_2");}
				},
				{
					id:"s2-clickable-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:"outBack"
				},
				{
					id:"s2-clickable-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+200", easing:"outBack"
				},
				{
					id:"s2-clickable-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+200", easing:"outBack"
				},
				{
					id:"s2-clickable-4",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+200", easing:"outBack"
				},
				{
					id:"s2-button-validate",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+200", easing:"outBack"
				},
			]	
		},
		"screen-2-feedback":{
			options:{
				forwardsStart:function(){
					var feedback = sections[0].querySelector("#s2-feedback");
					feedback.classList.remove("wrong");
					feedback.classList.remove("right");
					feedback.classList.add(interactions["2"].success===true?"right":"wrong");
					feedback.classList.remove("noEvents");
				},
				forwardsEnd:function(){
					var buttonNext = sections[0].querySelector("#s2-btNext");
					buttonNext.classList.add("active");
				}
			},
			line:[
				{
					id:"s2-button-validate",
					properties:{scaleX:0,scaleY:0}, duration:tP.d["standard-out"], easing:tP.e["standard-out"]
				},
				{
					id:"s2-feedback",
					properties:{translateX:"-50%",opacity:1}, duration:1000, easing:"outBack", cbStart:function(){soundManager.play("sound_2_feedback");}
				}
			]	
		},
		"screen-2-feedback-out":{
			options:{
				connected:"screen-2-feedback",
				forwardsStart:function(){
					var buttonNext = sections[0].querySelector("#s2-btNext");
					buttonNext.classList.remove("active");
					var feedback = sections[0].querySelector("#s2-feedback");
					feedback.classList.add("noEvents");
				}
			},
			line:[
				{
					id:"s2-feedback",
					properties:{translateX:"-10%",opacity:0}, duration:1000, easing:tP.e["standard-out"]
				}
			]	
		},
		"screen-2-out":{
			options:{
				forwardsEnd:function(){
					sections[0].querySelector("#s2-group").classList.add("noEvents");
					sections[0].querySelector("#s2-feedback").classList.add("noEvents");
				}
			},
			line:[
				{
					id:"s1-img-1",
					properties:{translateX:"-1103px"}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s2-group",
					properties:{translateY:"-20%",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s2-clickable-1",
					properties:{translateX:"-30%",opacity:0}, duration:1000, delay:"+500", easing:tP.e["standard-out"]
				},
				{
					id:"s2-clickable-2",
					properties:{translateX:"-30%",opacity:0}, duration:1000, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s2-clickable-3",
					properties:{translateX:"-30%",opacity:0}, duration:1000, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s2-clickable-4",
					properties:{translateX:"-30%",opacity:0}, duration:1000, delay:"+100", easing:tP.e["standard-out"]
				}
			]	
		},
		"screen-3":{
			options:{
				forwardsStart:function(){
					// if (interactions["3"]) {
					// 	interactions["3"].reset();
					// }
				},
				forwardsEnd:function(){
					var buttons = sections[0].querySelectorAll(".s3-button-info"),
					infos = sections[0].querySelectorAll(".s3-info")
					helperOut = false;
					if (!interactions["3"]) {
						interactions["3"] = new Infos({
							buttons:buttons,
							infos:infos,
							easing:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",
							cbEach:function(num){
								if(!helperOut){
									helperOut = true
									if(timeline.status==="normal"){
										timeline.play("screen-3-helper-out");
									}
								}
							},
							cbEnd:function(){
								navigation.isOn();
							},
							cbReset:function(){
								helperOut = false
							},
							infoHideClass:"unavailable",
							onlyOneInfoDisplayed:true,
							transitionsOut:{translate:"0% 0%",opacity:1},
							transitionsIn:{translate:"100% 0%",opacity:0}
						});
					} else {
						interactions["3"].reset();
					}
					navigation.isOn("prev");
					sections[0].querySelector("#s3-group").classList.remove("noEvents");
				},
				resetted:function(){
					if(sections){
						sections[0].querySelector("#s3-group").classList.add("noEvents");
					}
				}
			},
			line:[
				{
					id:"s3-rect",
					properties:{translateX:"0%"}, duration:1000, easing:tP.e["standard-in"]
				},
				{
					id:"s3-button-info-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+900", easing:"outBack", delayId:"sound_3", cbStart:function(){soundManager.play("sound_3");}
				},
				{
					id:"s3-button-info-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"sound_3+{getSoundDuration(sound_3)}", easing:"outBack", delayId:"sound_3_2", cbStart:function(){soundManager.play("sound_3_2");}
				},
				{
					id:"s3-button-info-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"sound_3_2+{getSoundDuration(sound_3_2)}", easing:"outBack", delayId:"sound_3_3", cbStart:function(){soundManager.play("sound_3_3");}
				},
				{
					id:"s3-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"sound_3_3+{getSoundDuration(sound_3_3)}", easing:tP.e["standard-in"], delayId:"sound_3_4", cbStart:function(){soundManager.play("sound_3_4");}
				},
			]	
		},
		"screen-3-helper-out":{
			line:[
				{
					id:"s3-helper",
					properties:{translateX:"40%",opacity:0}, duration:800, easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-3-out":{
			options:{
				forwardsEnd:function(){
					hideSection("section-1");
					sections[0].querySelector("#s3-group").classList.add("noEvents");
				}
			},
			line:[
				{
					id:"s3-info-1",
					properties:{opacity:0}, duration:500, easing:tP.e["standard-out"]
				},
				{
					id:"s3-info-2",
					properties:{opacity:0}, duration:500, easing:tP.e["standard-out"]
				},
				{
					id:"s3-info-3",
					properties:{opacity:0}, duration:500, easing:tP.e["standard-out"]
				},
				{
					id:"s3-rect",
					properties:{translateX:"100%"}, duration:1400, easing:tP.e["standard-out"]
				},
				{
					id:"s3-button-info-3",
					properties:{translateX:"-40%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-button-info-2",
					properties:{translateX:"-40%",opacity:0}, duration:800, delay:"+200", easing:tP.e["standard-out"]
				},
				{
					id:"s3-button-info-1",
					properties:{translateX:"-40%",opacity:0}, duration:800, delay:"+200", easing:tP.e["standard-out"]
				},
				{
					id:"s1-img-1",
					properties:{translateX:"0px"}, duration:1400, easing:tP.e["standard-out"]
				},
			]	
		},
		"screen-4":{
			options:{
				forwardsStart:function(){
					var txt = sections[1].querySelector("#s4-txt-2")
					txt.classList.remove("hidden")
					showSection("section-2");
					if (interactions["4"]) {
						interactions["4"].reset();
					}
				},
				forwardsEnd:function(){
					showSection("section-2");
					if(!interactions["4"]){
						interactions["4"] = new Cards({
							datas:[{side:"left"},{side:"left"},{side:"left"},{side:"right"}],
							cards:sections[1].querySelectorAll(".s4-card"),
							leftEl:sections[1].querySelector("#s4-placeholder-left"),
							rightEl:sections[1].querySelector("#s4-placeholder-right"),
							gaugeEl:sections[1].querySelector("#s4-gauge"),
							translateLeftMax:[26,52],
							translateRightMax:[60,49],
							cbEnd: function () {
								if(timeline.status==="normal"){
									timeline.play("screen-4-feedback");
								}
							}
						})
					} else {
						interactions["4"].reset().update();
					}
					navigation.isOn("prev");
					//sections[0].querySelector("#s3-group").classList.remove("noEvents");
				},
				render:function(){
					var txt = sections[1].querySelector("#s4-txt-2")
					txt.classList.remove("hidden")
				},
				resetted:function(){
					if(interactions["4"]){
						interactions["4"].reset();
					}
					hideSection("section-2");
				}
			},
			line:[
				{
					id:"s1-img-1",
					properties:{opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s4-bg",
					properties:{opacity:1}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s4-txt-1",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+900", easing:tP.e["standard-in"]
				},
				{
					id:"s4-placeholder-left",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s4-placeholder-right",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+200", easing:tP.e["standard-in"]
				},
				{
					id:"s4-group",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"], delayId:"sound_4", cbStart:function(){soundManager.play("sound_4");}
				},
				{
					id:"s4-card-1",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
				{
					id:"s4-card-2",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:"+100", easing:tP.e["standard-in"]
				},
				{
					id:"s4-card-3",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:"+100", easing:tP.e["standard-in"]
				},
				{
					id:"s4-card-4",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:"+100", easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-4-feedback":{
			options:{
				forwardsStart:function(){
					var txt = sections[1].querySelector("#s4-txt-2")
					txt.classList.add("hidden")
					var txt2 = sections[1].querySelector("#s4-txt-13")
					txt2.classList.remove("hidden")
					var feedback = sections[1].querySelector("#s4-feedback");
					feedback.classList.remove("wrong");
					feedback.classList.remove("right");
					feedback.classList.add(interactions["4"].success===true?"right":"wrong");
				},
				forwardsEnd:function(){
					navigation.isOn()
				}
			},
			line:[
				{
					id:"s4-placeholder-left",
					properties:{translateX:"-40%",opacity:0}, duration:1000, easing:tP.e["standard-out"]
				},
				{
					id:"s4-placeholder-right",
					properties:{translateX:"40%",opacity:0}, duration:1000, easing:tP.e["standard-out"]
				},
				{
					id:"s4-feedback",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"], cbStart:function(){soundManager.play("sound_4_feedback");}
				},
			]	
		},
	}
}