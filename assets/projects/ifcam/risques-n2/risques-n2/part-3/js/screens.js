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
		"getDelayByLanguage":getDelayByLanguage,
	},
	line:[
		"screen-1",
		{
			"screen-1-out":0,
			"screen-2":1400
		},
		"screen-3",
		"screen-4",
		"screen-5",
		"screen-6",
		"screen-7",
		"screen-8",
		"screen-9",
		{
			"screen-10":0,
			"screen-10-feedback":"ignored"
		},
		"screen-11",
		{
			"screen-12":0,
			"screen-12-helper-out":"ignored"
		},
		"screen-13",
		"screen-14",
		{
			"screen-15":0,
			"screen-15-feedback":"ignored"
		},
		"screen-16",
		"screen-17",
		"screen-18",
		"screen-19",
		"screen-20",
		"screen-21",
		"screen-22",
		{
			"screen-23":0
		},
		{
			"screen-24":0,
			"screen-23-helper-out":0
		},
		{
			"screen-25":0	
		},
		{
			"screen-26":0,
			"screen-25-helper-out":0,
			"screen-27":3000
		},
		"screen-28"
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
				}
			},
			line:[
				{
					id:"section-1",
					properties:{opacity:1}, duration:1000
				},
				{
					id:"s1-dotted",
					properties:{"clip-polygon":"0% 0%, 100% 0%, 100% 100%, 0% 100%"}, duration:1400, delay:"+1200"
				},
				{
					id:"s1-shape-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+200", easing:tP.e["button-in"]
				},
				{
					id:"s1-shape-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s1-shape-3",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+700", easing:tP.e["button-in"]
				},
				{
					id:"s1-group",
					properties:{translateX:"0%",opacity:1}, duration:1400, delay:"same", easing:tP.e["standard-in"], cbStart:function(){soundManager.play("sound_1")}
				},
				
			]	
		},
		"screen-1-out":{
			options:{
				forwardsStart:function(){
					var buttonNext = sections[0].querySelector("#s1-btNext");
					buttonNext.classList.remove("active");
				}
			},
			line:[
				{
					id:"s1-btNext",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s1-group",
					properties:{translateX:"-40%",opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s1-bg",
					properties:{translateX:"0px",translateY:"0px",scaleX:1,scaleY:1}, duration:1400, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s1-group-2",
					properties:{translateX:"0px",translateY:"0px",scaleX:1,scaleY:1}, duration:1400, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s2-veil",
					properties:{opacity:1}, duration:1400, delay:"same", easing:tP.e["long-in"]
				},
			]	
		},
		"screen-2":{
			options:{
				forwardsStart:function(){
					soundManager.play("sound_2")
				},
				forwardsEnd:function(){
					var button = sections[0].querySelector("#s2-button");
					button.classList.add("active");
					navigation.isOn("prev");
				}
			},
			line:[
				{
					id:"s2-title",
					properties:{translateY:"0%",opacity:1}, duration:1000, easing:tP.e["standard-in"], delayId:"sound_2"
				},
				{
					id:"s2-txt-2",
					properties:{opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
				{
					id:"s2-txt-3",
					properties:{opacity:1}, duration:1000, delay:"sound_2+{getSoundDuration(sound_2)}", easing:tP.e["standard-in"], delayId:"sound_2_2", cbStart:function(){soundManager.play("sound_2_2")}
				},
				{
					id:"s2-txt-4",
					properties:{opacity:1}, duration:1000, delay:"sound_2_2+{getSoundDuration(sound_2_2)}", easing:tP.e["standard-in"], delayId:"sound_2_3", cbStart:function(){soundManager.play("sound_2_3")}
				},
				{
					id:"s2-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"sound_2_3+{getSoundDuration(sound_2_3)}", easing:tP.e["standard-in"], delayId:"sound_2_4", cbStart:function(){soundManager.play("sound_2_4")}
				},
				{
					id:"s2-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
			]	
		},
		"screen-3":{
			options:{
				forwardsStart:function(){
					var button = sections[0].querySelector("#s2-button");
					button.classList.remove("active");
					showSection("section-2");
				},
				forwardsEnd:function(){
					var button = sections[1].querySelector("#s3-button");
					button.classList.add("active");
					navigation.isOn("prev");
					showSection("section-2");
				},
				rendered:function(){
					showSection("section-2");
				},
				resetted:function(){
					hideSection("section-2");
				}
			},
			line:[
				{
					id:"s2-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s2-helper",
					properties:{translateX:"-40%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"section-2",
					properties:{opacity:1}, duration:500
				},
				{
					id:"s3-header",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+900", easing:tP.e["standard-in"], delayId:"sound_3", cbStart:function(){soundManager.play("sound_3")}
				},
				{
					id:"s3-group-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
				{
					id:"s3-group-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_3+{getDelayByLanguage({"fr":5000,"en":5400})', easing:tP.e["standard-in"]
				},
				{
					id:"s3-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_3+{getDelayByLanguage({"fr":8400,"en":8700})', easing:tP.e["button-in"]
				},
				{
					id:"s3-helper",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-4":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s3-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					var button = sections[1].querySelector("#s4-button");
					button.classList.add("active");
					navigation.isOn("prev");
				}
			},
			line:[
				{
					id:"s3-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-helper",
					properties:{translateY:"70%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-arrow-1",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"], delayId:"sound_4", cbStart:function(){soundManager.play("sound_4")}
				},
				{
					id:"s4-bloc-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_4+{getDelayByLanguage({"fr":4600,"en":4200})', easing:tP.e["button-in"]
				},
				{
					id:"s4-bloc-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_4+{getDelayByLanguage({"fr":8600,"en":7500})', easing:tP.e["button-in"]
				},
				{
					id:"s4-arrow-2",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:'sound_4+{getDelayByLanguage({"fr":12800,"en":11700})', easing:tP.e["standard-in"]
				},
				{
					id:"s4-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s4-helper",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-5":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s4-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					var button = sections[1].querySelector("#s5-button");
					button.classList.add("active");
					navigation.isOn("prev");
				}
			},
			line:[
				{
					id:"s4-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-helper",
					properties:{translateY:"70%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-bloc-1",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-bloc-2",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-arrow-1",
					properties:{translateY:"10%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s5-group-1",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"], delayId:"sound_5", cbStart:function(){soundManager.play("sound_5")}
				},
				{
					id:"s5-bloc-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_5+{getDelayByLanguage({"fr":4800,"en":4900})', easing:tP.e["button-in"]
				},
				{
					id:"s5-bloc-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_5+{getDelayByLanguage({"fr":7800,"en":8200})', easing:tP.e["button-in"]
				},
				{
					id:"s5-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_5+{getDelayByLanguage({"fr":12100,"en":11900})', easing:tP.e["button-in"]
				},
				{
					id:"s5-helper",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-6":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s5-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					var button = sections[1].querySelector("#s6-button");
					button.classList.add("active");
					navigation.isOn("prev");
				}
			},
			line:[
				{
					id:"s5-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s5-helper",
					properties:{translateY:"70%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s5-bloc-1",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s5-bloc-2",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-arrow-1",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"]
				},
				{
					id:"s6-arrow-1",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:"same", easing:tP.e["standard-in"], delayId:"sound_6", cbStart:function(){soundManager.play("sound_6")}
				},
				{
					id:"s6-group",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s6-bloc-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_6+{getDelayByLanguage({"fr":3400,"en":1100})', easing:tP.e["standard-in"]
				},
				{
					id:"s6-bloc-1",
					properties:{opacity:1}, duration:1000, delay:'sound_6+{getDelayByLanguage({"fr":7200,"en":5500})', easing:tP.e["standard-in"]
				},
				{
					id:"s6-img-2",
					properties:{opacity:1}, duration:1000, delay:'sound_6+{getDelayByLanguage({"fr":9400,"en":7900})', easing:tP.e["standard-in"]
				},
				{
					id:"s6-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_6+{getDelayByLanguage({"fr":13800,"en":12800})', easing:tP.e["button-in"]
				},
				{
					id:"s6-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-7":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s6-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					var button = sections[1].querySelector("#s7-button");
					button.classList.add("active");
					navigation.isOn("prev");
				}
			},
			line:[
				{
					id:"s6-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s6-helper",
					properties:{translateY:"70%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-arrow-1",
					properties:{translateY:"10%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s6-group",
					properties:{opacity:0.3}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s7-arrow-1",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"], delayId:"sound_7", cbStart:function(){soundManager.play("sound_7")}
				},
				{
					id:"s7-bloc-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_7+{getDelayByLanguage({"fr":8500,"en":8400})', easing:tP.e["button-in"]
				},
				{
					id:"s7-arrow-2",
					properties:{translateX:"0%",translateY:"0%",opacity:1}, duration:1000, delay:'sound_7+{getDelayByLanguage({"fr":10900,"en":10600})', easing:tP.e["standard-in"]
				},
				{
					id:"s7-group-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
				{
					id:"s7-group-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+1000", easing:tP.e["standard-in"]
				},
				{
					id:"s7-bloc-2",
					properties:{opacity:1}, duration:1000, delay:'sound_7+{getDelayByLanguage({"fr":16000,"en":16000})', easing:tP.e["standard-in"]
				},
				{
					id:"s7-img-2",
					properties:{opacity:1}, duration:1000, delay:'sound_7+{getDelayByLanguage({"fr":18900,"en":18500})', easing:tP.e["standard-in"]
				},
				{
					id:"s7-bloc-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_7+{getDelayByLanguage({"fr":22300,"en":22000})', easing:tP.e["standard-in"]
				},
				{
					id:"s7-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_7+{getDelayByLanguage({"fr":27300,"en":27800})', easing:tP.e["button-in"]
				},
				{
					id:"s7-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-8":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s7-button");
					button.classList.remove("active");
					sections[1].querySelector("#s8-popup-wrap").classList.remove("hidden");
				},
				forwardsEnd:function(){
					var button = sections[1].querySelector("#s8-button");
					button.classList.add("active");
					sections[1].querySelector("#s8-popup-wrap").classList.remove("hidden");
					navigation.isOn("prev");
				},
				resetted:function(){
					if(sections){
						sections[1].querySelector("#s8-popup-wrap").classList.add("hidden");
					}
				}
			},
			line:[
				{
					id:"s7-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s7-helper",
					properties:{translateY:"70%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s8-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, easing:tP.e["button-in"]
				},
				{
					id:"s8-popup-wrap",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s8-popup",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+900", easing:tP.e["button-in"], delayId:"sound_8", cbStart:function(){soundManager.play("sound_8")}
				},
				
			]	
		},
		"screen-9":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s8-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s8-popup-wrap").classList.add("hidden");
					navigation.isOn();
				},
				rendered:function(){
					if(sections){
						sections[1].querySelector("#s8-popup-wrap").classList.add("hidden");
					}
					if(interactions["10"]){
						interactions["10"].dispose();
					}
				}
			},
			line:[
				{
					id:"s8-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s8-popup",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s8-popup-wrap",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s7-bloc-3",
					properties:{translateY:"-10%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s6-bloc-2",
					properties:{translateY:"-10%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s6-group",
					properties:{opacity:1}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s7-bloc-1",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s5-group-1",
					properties:{translateY:"30%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s7-group-1",
					properties:{translateY:"-30%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-group-1",
					properties:{translateY:"-40%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-group-2",
					properties:{translateY:"40%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s7-arrow-2",
					properties:{translateY:"-10%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s7-arrow-1",
					properties:{translateY:"-10%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s6-arrow-1",
					properties:{translateX:"10%",translateY:"10%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-arrow-2",
					properties:{translateX:"10%",translateY:"10%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-txt-1",
					properties:{translateX:"30%",opacity:0}, duration:1000, delay:"+1000", easing:tP.e["standard-in"]
				},
				{
					id:"s9-txt-5",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"same", easing:tP.e["standard-in"], delayId:"sound_9", cbStart:function(){soundManager.play("sound_9")}
				},
				{
					id:"s9-group-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_9+{getDelayByLanguage({"fr":6300,"en":5800})', easing:tP.e["standard-in"]
				},
				{
					id:"s9-group-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_9+{getDelayByLanguage({"fr":14200,"en":14500})', easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-10":{
			options:{
				forwardsStart:function(){
					var drags = sections[1].querySelectorAll(".s10-drag");
					for(var d=1; d<=drags.length; d++){
						drags[d-1].style.translate = "";
					}
				},
				forwardsEnd:function(){
					var drags = sections[1].querySelectorAll(".s10-drag"),
					drops = sections[1].querySelectorAll(".s10-drop"),
					btValidate = sections[1].querySelector("#s10-button-validate");
					for(var d=1; d<=drags.length; d++){
						drags[d-1].style.left = "";
						drags[d-1].style.top = "";
					}
					if(!interactions["10"]){
						interactions["10"] = new DragDrop({
							drags: drags,
							drops: drops,
							dropDatas: [{answer:[1,2]},{answer:[3]}],
							dropAxis: "top",
							dropGap: 7,
							btValidate: btValidate,
							btClass: "hidden",
							dropHostRange: 3,
							correctionDelay:2000,
							cbEnd: function (correct) { 
								if(timeline.status=="normal"){
									timeline.play("screen-10-feedback");
								}
							},
							cbReset: function () { },
						});
					} else {
						interactions["10"].reset();
					}
					navigation.isOn("prev");
				},
				resetted:function(){
					if(interactions["10"]){
						interactions["10"].reset();
					}
				}
			},
			line:[
				{
					id:"s9-group-1",
					properties:{translateX:"30%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s9-group-2",
					properties:{translateX:"-30%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s7-img-2",
					properties:{opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s6-img-2",
					properties:{opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s6-bloc-1",
					properties:{translateY:"172px",height:"92px"}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s7-bloc-2",
					properties:{translateY:"172px",height:"92px"}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
				{
					id:"s3-group-1",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s3-group-2",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
				{
					id:"s9-txt-5",
					properties:{translateX:"30%",opacity:0}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s10-txt-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"same", easing:tP.e["standard-in"], delayId:"sound_10", cbStart:function(){soundManager.play("sound_10")}
				},
				{
					id:"s10-txt-2",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
				{
					id:"s10-drop-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s10-drop-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+300", easing:tP.e["standard-in"]
				},
				{
					id:"s10-drag-1",
					properties:{translateX:"0px",translateY:"0px",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"]
				},
				{
					id:"s10-drag-2",
					properties:{translateX:"0px",translateY:"0px",opacity:1}, duration:1000, delay:"+100", easing:tP.e["standard-in"]
				},
				{
					id:"s10-drag-3",
					properties:{translateX:"0px",translateY:"0px",opacity:1}, duration:1000, delay:"+100", easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-10-feedback":{
			options:{
				forwardsStart:function(){
					var feedback = sections[1].querySelector("#s10-feedback");
					feedback.classList.remove("wrong");
					feedback.classList.remove("right");
					feedback.classList.remove("hidden");
					feedback.classList.add(interactions["10"].success===true?"right":"wrong");
				},
				forwardsEnd:function(){
					navigation.isOn()
				}
			},
			line:[
				{
					id:"s10-feedback",
					properties:{scaleX:1,scaleY:1,opacity:1}, duration:1000, delay:500, easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-11":{
			options:{
				forwardsStart:function(){
					var button = sections[0].querySelector("#s2-button");
					button.classList.add("checked");
					soundManager.play("sound_11")
				},
				forwardsEnd:function(){
					var button = sections[0].querySelector("#s11-button");
					button.classList.add("active");
					navigation.isOn("prev");
					hideSection("section-2");
				},
				rendered:function(){
					var button2 = sections[0].querySelector("#s2-button");
					button2.classList.add("checked");
					hideSection("section-2");
				},
				resetted:function(){
					showSection("section-2");
				}
			},
			line:[
				{
					id:"s2-button",
					properties:{scaleX:1,scaleY:1}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"section-2",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s11-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"{getSoundDuration(sound_11)}", easing:tP.e["standard-in"], delayId:"sound_11_2", cbStart:function(){soundManager.play("sound_11_2");}
				},
				{
					id:"s11-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
			]	
		},
		"screen-12":{
			options:{
				forwardsStart:function(){
					var button = sections[0].querySelector("#s11-button");
					button.classList.remove("active");
					showSection("section-3");
				},
				forwardsEnd:function(){
					if(!interactions["12"]){
						interactions["12"] = new Infos({
							buttons:sections[2].querySelectorAll(".s12-button-info"),
							infos:[
								[sections[2].querySelector("#s12-row-3-element-2"),sections[2].querySelector("#s12-row-3-element-3")],
								[sections[2].querySelector("#s12-row-3-element-4"),sections[2].querySelector("#s12-row-3-element-5")],
								[sections[2].querySelector("#s12-row-3-element-6"),sections[2].querySelector("#s12-row-3-element-7")]
							],
							infoHideClass:"faker",
							hideButtons:true,
							transitionsIn:{opacity:0,translate:"40px 0px"},
							transitionsOut:{opacity:1,translate:"0px 0px"},
							cbEach:function(num){
								soundManager.play("sound_12_info_"+num)
								var step = timeline.getStep("screen-12-helper-out")
								if(step && step.seen===false){
									timeline.play("screen-12-helper-out")
								}
							},
							cbEnd:function(){
								navigation.isOn();
							}
						});	
					} else {
						interactions["12"].reset();
					}
					
					navigation.isOn("prev");
					showSection("section-3");
				},
				rendered:function(){
					showSection("section-3");
				},
				resetted:function(){
					if(interactions["12"]){
						interactions["12"].reset();
					}
					hideSection("section-3");
				}
			},
			line:[
				{
					id:"s11-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s11-helper",
					properties:{translateX:"40%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"section-3",
					properties:{opacity:1}, duration:500
				},
				{
					id:"s12-header",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+900", easing:tP.e["standard-in"], delayId:"sound_12", cbStart:function(){soundManager.play("sound_12")}
				},
				{
					id:"s12-row-1",
					properties:{translateY:"0px",opacity:1}, duration:1000, delay:'sound_12+{getDelayByLanguage({"fr":3800,"en":3400})', easing:tP.e["standard-in"]
				},
				{
					id:"s12-row-1-element-2",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+200", easing:tP.e["standard-in"]
				},
				{
					id:"s12-row-1-element-3",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+200", easing:tP.e["standard-in"]
				},
				{
					id:"s12-row-1-element-4",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+300", easing:tP.e["standard-in"]
				},
				{
					id:"s12-row-2",
					properties:{translateY:"0px",opacity:1}, duration:1000, delay:'sound_12+{getDelayByLanguage({"fr":6300,"en":6600})', easing:tP.e["standard-in"]
				},
				{
					id:"s12-row-2-element-2",
					properties:{translateX:"0px",opacity:1}, duration:1000, easing:tP.e["standard-in"], delay:"sound_12+{getSoundDuration(sound_12)}", delayId:"sound_12_2", cbStart:function(){soundManager.play("sound_12_2");}
				},
				{
					id:"s12-row-2-element-4",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:'sound_12_2+{getDelayByLanguage({"fr":6500,"en":7700})', easing:tP.e["standard-in"]
				},
				{
					id:"s12-row-2-element-3",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:'sound_12_2+{getDelayByLanguage({"fr":11600,"en":13200})', easing:tP.e["standard-in"]
				},
				{
					id:"s12-row-3",
					properties:{translateY:"0px",opacity:1}, duration:1000, easing:tP.e["standard-in"], delay:"sound_12_2+{getSoundDuration(sound_12_2)}", delayId:"sound_12_3", cbStart:function(){soundManager.play("sound_12_3");}
				},
				{
					id:"s12-button-info-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_12_3+{getDelayByLanguage({"fr":2900,"en":3500})', easing:tP.e["button-in"]
				},
				{
					id:"s12-button-info-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s12-button-info-3",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s12-helper",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-12-helper-out":{
			line:[
				{
					id:"s12-helper",
					properties:{translateX:"30%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
			]	
		},
		"screen-13":{
			options:{
				forwardsEnd:function(){
					var button = sections[2].querySelector("#s13-button");
					button.classList.add("active");
					sections[2].querySelector("#s13-group").classList.remove("noEvents")
					navigation.isOn();
				},
				rendered:function(){
					sections[2].querySelector("#s13-group").classList.remove("noEvents")
				},
				resetted:function(){
					if(sections){
						var button = sections[2].querySelector("#s13-button");
						button.classList.remove("active");
						sections[2].querySelector("#s13-group").classList.add("noEvents")
					}
				}
			},
			line:[
				{
					id:"s12-button-info-1",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s12-button-info-2",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s12-button-info-3",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s12-patterns",
					properties:{opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s12-img-1",
					properties:{opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s12-content",
					properties:{translateX:"-80%",opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s13-bg",
					properties:{translateX:"0%",opacity:1}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s12-header",
					properties:{translateX:"-40%",opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s13-header",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"]
				},
				{
					id:"s13-group",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+600", easing:tP.e["standard-in"]
				},
				{
					id:"s13-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"], delayId:"sound_13", cbStart:function(){soundManager.play("sound_13")}
				},
			]	
		},
		"screen-14":{
			options:{
				forwardsStart:function(){
					var button = sections[0].querySelector("#s11-button");
					button.classList.add("checked");
					soundManager.play("sound_14");
					sections[2].querySelector("#s13-group").classList.add("noEvents")
				},
				forwardsEnd:function(){
					var button = sections[0].querySelector("#s14-button");
					button.classList.add("active");
					navigation.isOn("prev");
					hideSection("section-3");
				},
				rendered:function(){
					var button2 = sections[0].querySelector("#s11-button");
					button2.classList.add("checked");
					sections[2].querySelector("#s13-group").classList.add("noEvents")
					hideSection("section-3");
				},
				resetted:function(){
					showSection("section-3");
				}
			},
			line:[
				{
					id:"s11-button",
					properties:{scaleX:1,scaleY:1}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"section-3",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s14-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, easing:tP.e["standard-in"], delay:"{getSoundDuration(sound_14)}", delayId:"sound_14_2", cbStart:function(){soundManager.play("sound_14_2");}
				},
				{
					id:"s14-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
			]	
		},
		"screen-15":{
			options:{
				forwardsStart:function(){
					var button = sections[0].querySelector("#s14-button");
					button.classList.remove("active");
					showSection("section-4");
					if(!interactions["15"]){
						var datas = [
							[{json:"s15-txt-8",answer:false},{json:"s15-txt-9",answer:false},{json:"s15-txt-10",answer:true}],
							[{json:"s15-txt-11",answer:false},{json:"s15-txt-8",answer:false},{json:"s15-txt-12",answer:true}],
							[{json:"s15-txt-13",answer:true},{json:"s15-txt-14",answer:false}],
							[{json:"s15-txt-15",answer:false},{json:"s15-txt-16",answer:true}]
						]
						interactions["15"] = new Lists({
							datas:datas,
							lists:sections[3].querySelectorAll(".s15-list"),
							btValidate:sections[3].querySelector("#s15-button-validate"),
							cbEnd: function (correct) { 
								if(timeline.status=="normal"){
									timeline.play("screen-15-feedback");
								}
							},
							cbSelect:function(listChoice){
								this.displayEl.querySelector("p").setAttribute("json",listChoice.element.getAttribute("json"));
							},
							cbInitListChoice:function(){
								var text = datas[this.listNum-1][this.num-1].json;
								this.element.innerHTML = languageManager.jsonObj[text];
								this.element.setAttribute("json",text);
							}
						});	
					} else {
						interactions["15"].reset();
					}
				},
				forwardsEnd:function(){
					if(!interactions["15"]){
						var datas = [
							[{json:"s15-txt-8",answer:false},{json:"s15-txt-9",answer:false},{json:"s15-txt-10",answer:true}],
							[{json:"s15-txt-11",answer:false},{json:"s15-txt-8",answer:false},{json:"s15-txt-12",answer:true}],
							[{json:"s15-txt-13",answer:true},{json:"s15-txt-14",answer:false}],
							[{json:"s15-txt-15",answer:false},{json:"s15-txt-16",answer:true}]
						]
						interactions["15"] = new Lists({
							datas:datas,
							lists:sections[3].querySelectorAll(".s15-list"),
							btValidate:sections[3].querySelector("#s15-button-validate"),
							cbEnd: function (correct) { 
								if(timeline.status=="normal"){
									timeline.play("screen-15-feedback");
								}
							},
							cbSelect:function(listChoice){
								this.displayEl.querySelector("p").setAttribute("json",listChoice.element.getAttribute("json"));
							},
							cbInitListChoice:function(){
								var text = datas[this.listNum-1][this.num-1].json;
								this.element.innerHTML = languageManager.jsonObj[text];
								this.element.setAttribute("json",text);
							}
						});	
					} else {
						interactions["15"].reset();
					}
					sections[3].querySelector("#s15-content").classList.remove("noEvents");
					navigation.isOn("prev");
					showSection("section-4");
				},
				rendered:function(){
					showSection("section-4");
				},
				resetted:function(){
					if(interactions["15"]){
						interactions["15"].reset();
					}
					hideSection("section-4");
				}
			},
			line:[
				{
					id:"s14-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s14-helper",
					properties:{translateX:"40%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"section-4",
					properties:{opacity:1}, duration:500
				},
				{
					id:"s15-header",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+900", easing:tP.e["standard-in"], delayId:"sound_15", cbStart:function(){soundManager.play("sound_15")}
				},
				{
					id:"s15-button-validate",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				}
			]	
		},
		"screen-15-feedback":{
			options:{
				forwardsStart:function(){
					var feedback = sections[3].querySelector("#s15-feedback");
					feedback.classList.remove("wrong");
					feedback.classList.remove("right");
					feedback.classList.remove("hidden");
					feedback.classList.add(interactions["15"].success===true?"right":"wrong");
				},
				forwardsEnd:function(){
					navigation.isOn()
				}
			},
			line:[
				{
					id:"s15-button-validate",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s15-feedback",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:500, easing:tP.e["standard-in"], delayId:"sound_15_feedback", cbStart:function(){soundManager.play("sound_15_feedback")}
				},
			]	
		},
		"screen-16":{
			options:{
				forwardsStart:function(){
					soundManager.play("sound_16")
				},
				forwardsEnd:function(){
					var button = sections[3].querySelector("#s16-button");
					button.classList.add("active");
					sections[3].querySelector("#s16-content").classList.remove("noEvents");
					sections[3].querySelector("#s15-content").classList.add("noEvents");
					navigation.isOn("prev");
				},
				rendered:function(){
					sections[3].querySelector("#s16-content").classList.remove("noEvents");
					sections[3].querySelector("#s15-content").classList.add("noEvents");
				},
				resetted:function(){
					if(sections){
						sections[3].querySelector("#s16-content").classList.add("noEvents");
						var button = sections[3].querySelector("#s16-button");
						button.classList.remove("active");
					}
				}
			},
			line:[
				{
					id:"s15-content",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s16-content",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s15-header-txts",
					properties:{translateX:"70px",opacity:0}, duration:1500, delay:'{getDelayByLanguage({"fr":2100,"en":2400})', easing:tP.e["standard-in"]
				},
				{
					id:"s16-txt-1",
					properties:{translateX:"0px",opacity:1}, duration:1500, delay:"same", easing:tP.e["standard-in"]
				},
				{
					id:"s16-bloc",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:'{getDelayByLanguage({"fr":5400,"en":5200})', easing:tP.e["standard-in"]
				},
				{
					id:"s17-bloc",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s16-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'{getDelayByLanguage({"fr":10900,"en":10500})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-17":{
			options:{
				forwardsStart:function(){
					var button = sections[3].querySelector("#s16-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					var button = sections[3].querySelector("#s17-button");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				resetted:function(){
					if(sections){
						var button = sections[3].querySelector("#s17-button");
						button.classList.remove("active");
					}
				}
			},
			line:[
				{
					id:"s16-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s16-bloc-triangle",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s17-bloc-content",
					properties:{opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"]
				},
				{
					id:"s18-bloc",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"]
				},
				{
					id:"s17-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				}
			]	
		},
		"screen-18":{
			options:{
				forwardsStart:function(){
					var button = sections[3].querySelector("#s17-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					var button = sections[3].querySelector("#s18-button");
					button.classList.add("active");
					sections[3].querySelector("#s16-content").classList.remove("noEvents");
					navigation.isOn("prev");
				},
				resetted:function(){
					if(sections){
						var button = sections[3].querySelector("#s18-button");
						button.classList.remove("active");
					}
				}
			},
			line:[
				{
					id:"s17-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s18-bloc-content",
					properties:{opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s19-bloc",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"], delayId:"sound_18", cbStart:function(){soundManager.play("sound_18")}
				},
				{
					id:"s18-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_18+{getDelayByLanguage({"fr":4700,"en":4600})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-19":{
			options:{
				forwardsStart:function(){
					var button = sections[3].querySelector("#s18-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					var button = sections[3].querySelector("#s19-button");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				resetted:function(){
					if(sections){
						var button = sections[3].querySelector("#s18-button");
						button.classList.remove("active");
					}
				}
			},
			line:[
				{
					id:"s18-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s18-bloc-triangle",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s19-bloc-content",
					properties:{opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"]
				},
				{
					id:"s20-bloc",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"]
				},
				{
					id:"s19-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				}
			]	
		},
		"screen-20":{
			options:{
				forwardsStart:function(){
					var button = sections[3].querySelector("#s19-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					var button = sections[3].querySelector("#s20-button");
					button.classList.add("active");
					sections[3].querySelector("#s16-content").classList.remove("noEvents");
					navigation.isOn("prev");
				},
				resetted:function(){
					if(sections){
						var button = sections[3].querySelector("#s20-button");
						button.classList.remove("active");
					}
				}
			},
			line:[
				{
					id:"s19-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s20-bloc-content",
					properties:{opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s21-bloc",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"], delayId:"sound_20", cbStart:function(){soundManager.play("sound_20")}
				},
				{
					id:"s20-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_20+{getDelayByLanguage({"fr":5300,"en":5800})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-21":{
			options:{
				forwardsStart:function(){
					var button = sections[3].querySelector("#s20-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					navigation.isOn();
				}
			},
			line:[
				{
					id:"s20-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s20-bloc-triangle",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s21-bloc-content",
					properties:{opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"]
				}
			]	
		},
		"screen-22":{
			options:{
				forwardsStart:function(){
				},
				forwardsEnd:function(){
					var button = sections[3].querySelector("#s22-button");
					button.classList.add("active");
					sections[3].querySelector("#s22-content").classList.remove("noEvents");
					navigation.isOn("prev");
				},
				rendered:function(){
					sections[3].querySelector("#s22-content").classList.remove("noEvents");
				},
				resetted:function(){
					if(sections){
						sections[3].querySelector("#s22-content").classList.add("noEvents");
						var button = sections[3].querySelector("#s22-button");
						button.classList.remove("active");
					}
				}
			},
			line:[
				{
					id:"s16-bloc",
					properties:{translateX:"-20%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s17-bloc",
					properties:{translateX:"20%",opacity:0}, duration:800, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s18-bloc",
					properties:{translateX:"-20%",opacity:0}, duration:800, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s19-bloc",
					properties:{translateX:"20%",opacity:0}, duration:800, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s20-bloc",
					properties:{translateX:"-20%",opacity:0}, duration:800, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s21-bloc",
					properties:{translateX:"20%",opacity:0}, duration:800, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s16-content",
					properties:{opacity:0}, duration:1200, delay:"+100", easing:tP.e["long-in"]
				},
				{
					id:"s22-content",
					properties:{opacity:1}, duration:1200, delay:"+100", easing:tP.e["long-in"]
				},
				{
					id:"s15-header",
					properties:{translateX:"-50%",translateY:"200%",opacity:0}, duration:1000, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s22-header",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"], delayId:"sound_22", cbStart:function(){soundManager.play("sound_22")}
				},
				{
					id:"s22-gauge-wrap-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_22+{getDelayByLanguage({"fr":3800,"en":4300})', easing:tP.e["standard-in"]
				},
				{
					id:"s22-bloc-1",
					properties:{rotateY:0,scaleX:1,scaleY:1,opacity:1}, duration:1500, delay:"same", easing:tP.e["standard-in"]
				},
				{
					id:"s22-rect-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+600", easing:tP.e["standard-in"]
				},
				{
					id:"s22-gauge-wrap-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_22+{getDelayByLanguage({"fr":5700,"en":6100})', easing:tP.e["standard-in"]
				},
				{
					id:"s22-bloc-2",
					properties:{rotateY:0,scaleX:1,scaleY:1,opacity:1}, duration:1500, delay:"same", easing:tP.e["standard-in"]
				},
				{
					id:"s22-rect-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+600", easing:tP.e["standard-in"]
				},
				{
					id:"s22-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_22+{getDelayByLanguage({"fr":12000,"en":12800})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-23":{
			options:{
				forwardsStart:function(){
					var button = sections[3].querySelector("#s22-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					if(!interactions["23"]){
						var level = sections[3].querySelector("#s22-gauge-1 .gauge-content > div")
						var values = [33,66,100];
						level.style.height = "0%"
						interactions["23"] = new Infos({
							buttons:sections[3].querySelectorAll(".s23-button-info"),
							infos:[
								[sections[3].querySelector("#s23-info-arrow-1")],
								[sections[3].querySelector("#s23-info-arrow-2")],
								[sections[3].querySelector("#s23-info-arrow-3")]
							],
							infoHideClass:"faker",
							hideButtons:true,
							onlyOneInfoDisplayed:true,
							transitionsIn:{"clip-path":"polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"},
							transitionsOut:{"clip-path":"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"},
							cbEach:function(){
								var step = timeline.getStep("screen-23-helper-out");
								timeline.play("screen-23-helper-out")
							},
							cbEachEnd:function(info){
								if(info.state=="out"){
									var count = interactions["23"].getInfoSeen();
									if(level){
										level.style.height = values[count-1]+"%"
									}
								}
							},
							cbEnd:function(){
								navigation.isOn();
							},
							cbReset:function(){
								level.style.height = "0%"
							}
						});	
					} else {
						interactions["23"].reset();
					}
					navigation.isOn("prev");
					var step = timeline.getStep("screen-23-helper-out");
					if(step && step.seen===true){
						step.seen = false;
					}
				},
				resetted:function(){
					if(interactions["23"]){
						interactions["23"].reset();
					}
				}
			},
			line:[
				{
					id:"s22-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s22-bloc-2",
					properties:{opacity:0.3}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s23-bloc-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+900", easing:tP.e["button-in"], delayId:"sound_23", cbStart:function(){soundManager.play("sound_23")}
				},
				{
					id:"s23-bloc-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_23+{getDelayByLanguage({"fr":5600,"en":5300})', easing:tP.e["button-in"]
				},
				{
					id:"s23-bloc-3",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_23+{getDelayByLanguage({"fr":11200,"en":11600})', easing:tP.e["button-in"]
				},
				{
					id:"s23-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_23+{getDelayByLanguage({"fr":21300,"en":22400})', easing:tP.e["standard-in"]
				},
				{
					id:"s23-button-info-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s23-button-info-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s23-button-info-3",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				
			]	
		},
		"screen-23-helper-out":{
			options:{
				once:true
			},
			line:[
				{
					id:"s23-helper",
					properties:{translateX:"40%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
			]	
		},
		"screen-24":{
			options:{
				forwardsStart:function(){
					if(interactions["23"]){
						interactions["23"].hideAll();
					}
					var button = sections[3].querySelector("#s22-button");
					button.classList.add("checked");
				},
				forwardsEnd:function(){
					var button = sections[3].querySelector("#s24-button");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				rendered:function(){
					var level = sections[3].querySelector("#s22-gauge-1 .gauge-content > div")
					level.style.height = "100%";
					var button = sections[3].querySelector("#s22-button");
					button.classList.add("checked");
				},
				resetted:function(){
					if(sections){
						var button = sections[3].querySelector("#s22-button");
						button.classList.remove("checked");
						var button2 = sections[3].querySelector("#s24-button");
						button2.classList.remove("active");
					}
				}
			},
			line:[
				{
					id:"s23-bloc-3",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s23-bloc-2",
					properties:{scaleX:0,scaleY:0}, duration:800, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s23-bloc-1",
					properties:{scaleX:0,scaleY:0}, duration:800, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s22-bloc-2",
					properties:{opacity:1}, duration:1200, delay:"+900", easing:tP.e["long-in"], delayId:"sound_24", cbStart:function(){soundManager.play("sound_24")}
				},
				{
					id:"s22-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"same", easing:tP.e["button-in"]
				},
				{
					id:"s24-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_24+{getDelayByLanguage({"fr":4300,"en":4600})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-25":{
			options:{
				forwardsStart:function(){
					var button = sections[3].querySelector("#s24-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					if(!interactions["25"]){
						var level = sections[3].querySelector("#s22-gauge-2 .gauge-content > div")
						var values = [50,100];
						level.style.height = "0%"
						interactions["25"] = new Infos({
							buttons:sections[3].querySelectorAll(".s25-button-info"),
							infos:[
								[sections[3].querySelector("#s25-info-arrow-1")],
								[sections[3].querySelector("#s25-info-arrow-2")]
							],
							infoHideClass:"faker",
							hideButtons:true,
							onlyOneInfoDisplayed:true,
							transitionsIn:{"clip-path":"polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"},
							transitionsOut:{"clip-path":"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"},
							cbEach:function(){
								var step = timeline.getStep("screen-25-helper-out");
								timeline.play("screen-25-helper-out")
							},
							cbEachEnd:function(info){
								if(info.state=="out"){
									var count = interactions["25"].getInfoSeen();
									if(level){
										level.style.height = values[count-1]+"%"
									}
								}
							},
							cbEnd:function(){
								navigation.isOn();
							},
							cbReset:function(){
								level.style.height = "0%"
							}
						});	
					} else {
						interactions["25"].reset();
					}
					navigation.isOn("prev");
					var step = timeline.getStep("screen-25-helper-out");
					if(step && step.seen===true){
						step.seen = false;
					}
				},
				resetted:function(){
					if(interactions["25"]){
						interactions["25"].reset();
					}
				}
			},
			line:[
				{
					id:"s22-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s24-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s22-bloc-1",
					properties:{opacity:0.3}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s25-bloc-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+900", easing:tP.e["button-in"], delayId:"sound_25", cbStart:function(){soundManager.play("sound_25")}
				},
				{
					id:"s25-bloc-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_25+{getDelayByLanguage({"fr":6700,"en":6000})', easing:tP.e["button-in"]
				},
				{
					id:"s25-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_25+{getDelayByLanguage({"fr":11800,"en":11200})', easing:tP.e["standard-in"]
				},
				{
					id:"s25-button-info-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s25-button-info-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
			]	
		},
		"screen-25-helper-out":{
			options:{
				once:true
			},
			line:[
				{
					id:"s25-helper",
					properties:{translateX:"40%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
			]	
		},
		"screen-26":{
			options:{
				forwardsStart:function(){
					if(interactions["25"]){
						interactions["25"].hideAll();
					}
					var button = sections[3].querySelector("#s24-button");
					button.classList.add("checked");
				},
				forwardsEnd:function(){
					navigation.isOn();
				},
				rendered:function(){
					var level = sections[3].querySelector("#s22-gauge-2 .gauge-content > div")
					level.style.height = "100%";
					var button = sections[3].querySelector("#s24-button");
					button.classList.add("checked");
				},
				resetted:function(){
					if(sections){
						var button = sections[3].querySelector("#s24-button");
						button.classList.remove("checked");
					}
				}
			},
			line:[
				{
					id:"s25-bloc-2",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s25-bloc-1",
					properties:{scaleX:0,scaleY:0}, duration:800, delay:"+100", easing:tP.e["standard-out"]
				},
				{
					id:"s22-bloc-1",
					properties:{opacity:1}, duration:1200, delay:"+900", easing:tP.e["long-in"]
				},
				{
					id:"s22-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+800", easing:tP.e["button-in"]
				},
				{
					id:"s24-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"same", easing:tP.e["button-in"]
				}
			]	
		},
		"screen-27":{
			options:{
				forwardsStart:function(){
					soundManager.play("sound_26");
					var button = sections[0].querySelector("#s14-button");
					button.classList.add("checked");
				},
				forwardsEnd:function(){
					navigation.isOn();
					hideSection("section-4");
				},
				rendered:function(){
					var button2 = sections[0].querySelector("#s14-button");
					button2.classList.add("checked");
					hideSection("section-4");
				},
				resetted:function(){
					showSection("section-4");
				}
			},
			line:[
				{
					id:"s14-button",
					properties:{scaleX:1,scaleY:1}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"section-4",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				}
			]	
		},
		"screen-28":{
			options:{
				forwardsStart:function(){
					showSection("section-5");
				},
				forwardsEnd:function(){
					navigation.isOn();
					showSection("section-5");
				},
				rendered:function(){
					showSection("section-5");
				},
				resetted:function(){
					hideSection("section-5");
				}
			},
			line:[
				{
					id:"section-5",
					properties:{opacity:1}, duration:800
				},
				{
					id:"s28-img-1",
					properties:{translateX:"0px"}, duration:1200
				},
				{
					id:"s28-img-2",
					properties:{translateX:"0px"}, duration:1200
				},
				{
					id:"s28-content",
					properties:{translateX:"0px"}, duration:1200
				},
				{
					id:"s28-txt-1",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+900", easing:tP.e["standard-in"], delayId:"sound_27", cbStart:function(){soundManager.play("sound_27")}
				},
				{
					id:"s28-bloc-1",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:'sound_27+{getDelayByLanguage({"fr":4000,"en":4300})', easing:tP.e["standard-in"]
				},
				{
					id:"s28-bloc-2",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:'sound_27+{getDelayByLanguage({"fr":12300,"en":12300})', easing:tP.e["standard-in"]
				},
				{
					id:"s28-bloc-3",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:'sound_27+{getDelayByLanguage({"fr":21600,"en":18300})', easing:tP.e["standard-in"]
				},
				{
					id:"s28-content-bottom-left",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_27+{getDelayByLanguage({"fr":27000,"en":23800})', easing:tP.e["standard-in"]
				},
				{
					id:"s28-txt-6",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_27+{getDelayByLanguage({"fr":29800,"en":27900})', easing:tP.e["standard-in"]
				},
				{
					id:"s28-txt-7",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_27+{getDelayByLanguage({"fr":32600,"en":32100})', easing:tP.e["standard-in"]
				},
				{
					id:"s28-txt-8",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_27+{getDelayByLanguage({"fr":39800,"en":40200})', easing:tP.e["standard-in"]
				}
			]	
		},
	}
}