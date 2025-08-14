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
		{
			"screen-9":0,
			"screen-9-feedback":"ignored"
		},
		"screen-10",
		"screen-11",
		"screen-12",
		"screen-13",
		"screen-14",
		{
			"screen-15":0,
			"screen-15-info":"ignored",
		},
		"screen-16",
		"screen-17",
		"screen-18",
		"screen-19",
		"screen-20",
		"screen-21",
		"screen-22",
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
					id:"s1-group",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+400", easing:tP.e["standard-in"], delayId:"sound_1", cbStart:function(){soundManager.play("sound_1")}
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
					properties:{translateY:"619px",scaleX:0.67,scaleY:0.67}, duration:1400, delay:"+400", easing:tP.e["long-in"]
				},
				// {
				// 	id:"s1-group-2",
				// 	properties:{translateX:"0px",translateY:"0px",scaleX:1,scaleY:1}, duration:1400, delay:"same", easing:tP.e["long-in"]
				// },
				// {
				// 	id:"s2-veil",
				// 	properties:{opacity:1}, duration:1400, delay:"same", easing:tP.e["long-in"]
				// },
			]	
		},
		"screen-2":{
			options:{
				forwardsStart:function(){
					var rotated = sections[0].querySelector("#s2-rotated");
					rotated.style["transition-duration"] = "0s";
					soundManager.play("sound_2")
				},
				forwardsEnd:function(){
					var button = sections[0].querySelector("#s2-button");
					button.classList.add("active");
					if(!interactions["2"]){
						var total = 5;
						var angleStart = 40;
						var angleMax = 112;
						var rotatedCurrentAngle = 0;
						var rotated = sections[0].querySelector("#s2-rotated");
						var icons = rotated.querySelectorAll(".s2-icon");
						var infos = sections[0].querySelectorAll(".s2-info");
						var anglePart = 360/total;
						var current = 1;
						var canNext = false;
						rotated.addEventListener("transitionend",s2TransitionEnd)
						function s2Rotate(angle){
							var newAngle = Math.min(Math.max(angleStart,angle),angleMax);
							var diff = newAngle - interactions["2"].angleLast;
							rotated.style.rotate = angle+"deg";
							for(var i=1; i<=icons.length; i++){
								var icon = icons[i-1];
								icon.style.rotate = (-angle)+"deg";
							}
						}
						function s2InfoDisplay(num){
							for(var i=1; i<=infos.length; i++){
								var info = infos[i-1];
								if(typeof num === "number" && i==num){
									info.classList.add("open");
								} else {
									info.classList.remove("open");
								}
							}
						}
						function s2TransitionEnd(){
							if(current>total){
								navigation.isOn();
								current = 1;
								rotated.style["transition-duration"] = "0s";
								s2Rotate(-72);
								setTimeout(function(){
									button.style["pointer-events"] = ""
									button.classList.add("active")
								},500)
							} else {
								button.style["pointer-events"] = ""
								button.classList.add("active")
							}
						}
						interactions["2"] = new Rotable({
							element:button,
							positionsReceiver:sections[0],
							angleStart:angleStart,
							angleMin:angleStart,
							angleMax:angleMax,
							returnToStart:true,
							cbDown:function(){
								var style = window.getComputedStyle(rotated).getPropertyValue("rotate");
								if(style==="none"){
									style = "0deg";
								}
								rotatedCurrentAngle = parseFloat(style.match(/(\d|-|\.)/g).join(""));
								rotated.style["transition-duration"] = "0s";
								button.classList.remove("active");
								s2InfoDisplay();
							},
							cbRotate:function(angle,percent){
								var newAngle = Math.min(Math.max(angleStart,angle),angleMax);
								var diff = newAngle - interactions["2"].angleLast;
								s2Rotate((rotatedCurrentAngle+diff))
								canNext = diff > 0;
							},
							cbUp:function(){
								if(canNext==false){
									return;
								}
								rotated.style["transition-duration"] = "";
								s2Rotate(anglePart*(current-1));
								s2InfoDisplay(current);
								button.style["pointer-events"] = "none"
								current++;	
								setTimeout(function(){
									button.style["pointer-events"] = ""
									button.classList.add("active")
									canNext = false
								},500)
							},
							cbReset:function(){
								current = 1;
								canNext = false;
								s2Rotate(-72);
								s2InfoDisplay();
								button.classList.add("active");
							}
						})
						rotated.style["transition-duration"] = "";
					} else {
						interactions["2"].reset();
					}
					navigation.isOn("prev");
				},
				resetted:function(){
					if(interactions["2"]){
						interactions["2"].reset();
					} 
				}
			},
			line:[
				{
					id:"s2-txt-1",
					properties:{translateX:"0%",opacity:1}, duration:800, easing:tP.e["standard-in"]
				},
				{
					id:"s2-group-1",
					properties:{translateX:"0%",opacity:1}, duration:800, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s2-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'{getDelayByLanguage({"fr":4000,"en":5200})', easing:tP.e["standard-in"]
				},
				{
					id:"s2-button",
					properties:{opacity:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s2-button",
					properties:{rotate:112}, duration:1000, delay:"next"
				},
				{
					id:"s2-rotated",
					properties:{rotate:0}, duration: 1000, delay:"same"
				},
				{
					id:".s2-icon",
					properties:{rotate:0}, duration: 1000, delay:"same"
				},
				{
					id:"s2-button",
					properties:{rotate:40}, duration:1000, delay:"next+500"
				},
				{
					id:"s2-rotated",
					properties:{rotate:-72}, duration: 1000, delay:"same"
				},
				{
					id:".s2-icon",
					properties:{rotate:72}, duration: 1000, delay:"same"
				},
				{
					id:"s2-fake",
					properties:{opacity:1}, duration: 100, delay:"{getSoundDuration(sound_2)}", cbStart:function(){soundManager.play("sound_2_2");}
				}
			]	
		},
		"screen-3":{
			options:{
				forwardsStart:function(){
					showSection("section-2");
				},
				forwardsEnd:function(){
					var button = sections[1].querySelector("#s3-button");
					button.classList.add("active");
					navigation.isOn("prev");
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
					id:"section-2",
					properties:{opacity:1,scaleX:1,scaleY:1}, duration:1000
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"0px",translateY:"0px",rotate:168}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"0px",translateY:"0px",rotate:-17}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s3-group-1-right",
					properties:{"clip-polygon":"50% 0%, 100% 0%, 100% 100%, 50% 100%"}, duration:800, delay:"+900"
				},
				{
					id:"s3-group-1-left",
					properties:{"clip-polygon":"0% 0%, 50% 0%, 50% 100%, 0% 100%"}, duration:800, delay:"next"
				},
				{
					id:"s3-txt-6",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"], delayId:"sound_3", cbStart:function(){soundManager.play("sound_3")}
				},
				{
					id:"s3-bloc-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_3+{getDelayByLanguage({"fr":7100,"en":7500})', easing:tP.e["button-in"]
				},
				{
					id:"s3-txt-1",
					properties:{opacity:1}, duration:1000, delay:"+350", easing:tP.e["standard-in"]
				},
				{
					id:"s3-bloc-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_3+{getDelayByLanguage({"fr":10400,"en":12100})', easing:tP.e["button-in"]
				},
				{
					id:"s3-txt-2",
					properties:{opacity:1}, duration:1000, delay:"+350", easing:tP.e["standard-in"]
				},
				{
					id:"s3-bloc-3",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_3+{getDelayByLanguage({"fr":14600,"en":16600})', easing:tP.e["button-in"]
				},
				{
					id:"s3-txt-3",
					properties:{opacity:1}, duration:1000, delay:"+350", easing:tP.e["standard-in"]
				},
				{
					id:"s3-bloc-4",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_3+{getDelayByLanguage({"fr":21000,"en":24800})', easing:tP.e["button-in"]
				},
				{
					id:"s3-txt-4",
					properties:{opacity:1}, duration:1000, delay:"+350", easing:tP.e["standard-in"]
				},
				{
					id:"s3-bloc-5",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_3+{getDelayByLanguage({"fr":24200,"en":28700})', easing:tP.e["button-in"]
				},
				{
					id:"s3-txt-5",
					properties:{opacity:1}, duration:1000, delay:"+350", easing:tP.e["standard-in"]
				},
				{
					id:"s3-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"sound_3+{getSoundDuration(sound_3)}", easing:tP.e["button-in"], cbStart:function(){ soundManager.play("sound_3_2")}
				}
			]	
		},
		"screen-4":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s3-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s4-content").classList.remove("noEvents");
					var button = sections[1].querySelector("#s4-button-1");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				rendered:function(){
					var button = sections[1].querySelector("#s3-button");
					button.classList.remove("active");
					sections[1].querySelector("#s4-content").classList.remove("noEvents");
				},
				resetted:function(){
					if(sections){
						sections[1].querySelector("#s4-content").classList.add("noEvents");
						var button = sections[1].querySelector("#s4-button-1");
						button.classList.add("active");
					}
				}
			},
			line:[
				{
					id:"s3-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:0.6,scaleY:0.6,opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"-200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-content",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-number",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+800", easing:tP.e["button-in"]
				},
				{
					id:"s4-group-1",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"], delayId:"sound_4", cbStart:function(){soundManager.play("sound_4")}
				},
				{
					id:"s4-group-2",
					properties:{translateX:"0px",opacity:1}, duration:1000 , easing:tP.e["standard-in"], delay:"sound_4+{getSoundDuration(sound_4)}", delayId:"sound_4_2", cbStart:function(){soundManager.play("sound_4_2");}
				},
				{
					id:"s4-group-3",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:'sound_4_2+{getDelayByLanguage({"fr":5200,"en":5000})', easing:tP.e["standard-in"]
				},
				{
					id:"s4-group-4",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:'sound_4_2+{getDelayByLanguage({"fr":9600,"en":9600})', easing:tP.e["standard-in"]
				},
				{
					id:"s4-button-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, easing:tP.e["button-in"], delay:"sound_4_2+{getSoundDuration(sound_4_2)}", delayId:"sound_4_3", cbStart:function(){soundManager.play("sound_4_3");}
				}
			]	
		},
		"screen-5":{
			options:{
				forwardsStart:function(){
					var group = sections[1].querySelector("#s4-group-2");
					group.classList.add("open")
					var button = sections[1].querySelector("#s4-button-1");
					button.classList.remove("active");
					soundManager.play("sound_5")
				},
				forwardsEnd:function(){
					var group = sections[1].querySelector("#s4-group-2");
					group.classList.add("open")
					var button = sections[1].querySelector("#s4-button-1");
					button.classList.add("active");
					var info = sections[1].querySelector("#s5-infos");
					info.classList.remove("noEvents");
					navigation.isOn("prev");
				},
				resetted:function(){
					if(sections){
						var group = sections[1].querySelector("#s4-group-2");
						group.classList.remove("open")
						var button = sections[1].querySelector("#s4-button-1");
						button.classList.remove("active");
						var info = sections[1].querySelector("#s5-infos");
						info.classList.add("noEvents");
					}
				}
			},
			line:[
				{
					id:"s4-group-2",
					properties:{translateX:"-104px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-arrow-1",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-3",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-4",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s5-bg",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s5-infos",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"#s5-infos .s5-infos-row-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'{getDelayByLanguage({"fr":9600,"en":7100})/400', easing:tP.e["standard-in"]
				},
				{
					id:"#s5-infos .s5-infos-row-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'{getDelayByLanguage({"fr":15500,"en":14000})/400', easing:tP.e["standard-in"]
				},
				{
					id:"#s5-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"{getSoundDuration(sound_5)}", easing:tP.e["standard-in"]
				}
			]	
		},
		"screen-6":{
			options:{
				forwardsStart:function(){
					var group = sections[1].querySelector("#s4-group-2");
					group.classList.remove("open");
					group.classList.add("checked");
					var button = sections[1].querySelector("#s4-button-1");
					button.classList.remove("active");
					var info = sections[1].querySelector("#s5-infos");
					info.classList.add("noEvents");
				},
				forwardsEnd:function(){
					var group = sections[1].querySelector("#s4-group-2");
					group.classList.remove("open");
					group.classList.add("checked");
					var button = sections[1].querySelector("#s4-button-2");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				rendered:function(){
					var group = sections[1].querySelector("#s4-group-2");
					group.classList.remove("open");
					group.classList.add("checked");
					var info = sections[1].querySelector("#s5-infos");
					info.classList.add("noEvents");
				},
				resetted:function(){
					if(sections){
						var group = sections[1].querySelector("#s4-group-2");
						group.classList.remove("open");
						var button = sections[1].querySelector("#s4-button-2");
						button.classList.remove("active");
					}
				}
			},
			line:[
				{
					id:"#s5-helper",
					properties:{translateX:"30%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-button-1",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-group-2",
					properties:{translateX:"0px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-arrow-1",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-3",
					properties:{translateX:"0px",opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-4",
					properties:{translateX:"0px",opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s5-bg",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s5-infos",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-button-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+900", easing:tP.e["button-in"], delayId:"sound_6", cbStart:function(){soundManager.play("sound_6")}
				}
			]	
		},
		"screen-7":{
			options:{
				forwardsStart:function(){
					var group = sections[1].querySelector("#s4-group-3");
					group.classList.add("open")
					var button = sections[1].querySelector("#s4-button-2");
					button.classList.remove("active");
					soundManager.play("sound_7")
				},
				forwardsEnd:function(){
					var group = sections[1].querySelector("#s4-group-3");
					group.classList.add("open")
					var button = sections[1].querySelector("#s4-button-2");
					button.classList.add("active");
					var info = sections[1].querySelector("#s7-infos");
					info.classList.remove("noEvents");
					navigation.isOn("prev");
				},
				resetted:function(){
					if(sections){
						var group = sections[1].querySelector("#s4-group-3");
						group.classList.remove("open")
						var button = sections[1].querySelector("#s4-button-2");
						button.classList.remove("active");
						var info = sections[1].querySelector("#s7-infos");
						info.classList.add("noEvents");
					}
				}
			},
			line:[
				{
					id:"s4-group-3",
					properties:{translateX:"-567px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-arrow-2",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-2",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-4",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s7-bg",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s7-infos",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"#s7-infos .s7-infos-row-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'{getDelayByLanguage({"fr":5300,"en":5600})/400', easing:tP.e["standard-in"]
				},
				{
					id:"#s7-infos .s7-infos-row-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'{getDelayByLanguage({"fr":9900,"en":10700})/400', easing:tP.e["standard-in"]
				},
				{
					id:"#s7-infos .s7-infos-row-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'{getDelayByLanguage({"fr":14100,"en":14900})/400', easing:tP.e["standard-in"]
				},
				{
					id:"#s5-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"{getSoundDuration(sound_7)}", easing:tP.e["standard-in"]
				}
			]	
		},
		"screen-8":{
			options:{
				forwardsStart:function(){
					var group = sections[1].querySelector("#s4-group-3");
					group.classList.remove("open");
					group.classList.add("checked");
					var button = sections[1].querySelector("#s4-button-2");
					button.classList.remove("active");
					var info = sections[1].querySelector("#s7-infos");
						info.classList.add("noEvents");
				},
				forwardsEnd:function(){
					var group = sections[1].querySelector("#s4-group-3");
					group.classList.remove("open");
					group.classList.add("checked");
					var button = sections[1].querySelector("#s4-button-3");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				rendered:function(){
					var group = sections[1].querySelector("#s4-group-3");
					group.classList.remove("open");
					group.classList.add("checked");
					var info = sections[1].querySelector("#s7-infos");
					info.classList.add("noEvents");
				},
				resetted:function(){
					if(sections){
						var group = sections[1].querySelector("#s4-group-3");
						group.classList.remove("open");
						var button = sections[1].querySelector("#s4-button-3");
						button.classList.remove("active");
					}
				}
			},
			line:[
				{
					id:"#s5-helper",
					properties:{translateX:"30%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-button-2",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-group-3",
					properties:{translateX:"0px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-arrow-2",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-2",
					properties:{translateX:"0px",opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-4",
					properties:{translateX:"0px",opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s7-bg",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s7-infos",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-button-3",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+900", easing:tP.e["button-in"], delayId:"sound_8", cbStart:function(){soundManager.play("sound_8")}
				}
			]	
		},
		"screen-9":{
			options:{
				forwardsStart:function(){
					var group = sections[1].querySelector("#s4-group-4");
					group.classList.add("open")
					var button = sections[1].querySelector("#s4-button-3");
					button.classList.remove("active");
					soundManager.play("sound_9");
				},
				forwardsEnd:function(){
					var group = sections[1].querySelector("#s4-group-4");
					group.classList.add("open")
					var button = sections[1].querySelector("#s4-button-3");
					button.classList.add("active");
					var info = sections[1].querySelector("#s9-infos");
					info.classList.remove("noEvents");
					if(!interactions["9"]){
						interactions["9"] = new S9Clickables();
					} else {
						interactions["9"].reset().render();
					}
					navigation.isOn("prev");
				},
				resetted:function(){
					if(sections){
						var group = sections[1].querySelector("#s4-group-4");
						group.classList.remove("open")
						var button = sections[1].querySelector("#s4-button-3");
						button.classList.remove("active");
						var info = sections[1].querySelector("#s9-infos");
						info.classList.add("noEvents");
						if(interactions["9"]){
							interactions["9"].reset().render();
						}
					}
				}
			},
			line:[
				{
					id:"s4-group-4",
					properties:{translateX:"-1021px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-2",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-3",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s9-bg",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s9-infos",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"], delay:"{getSoundDuration(sound_9)}", delayId:"sound_9_2", cbStart:function(){soundManager.play("sound_9_2");}
				},
				{
					id:"#s5-helper",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"sound_9_2+{getSoundDuration(sound_9_2)}", easing:tP.e["standard-in"]
				}
			]	
		},
		"screen-9-feedback":{
			options:{
				forwardsStart:function(){
					var feedback = sections[1].querySelector("#s9-feedback");
					feedback.classList.remove("wrong");
					feedback.classList.remove("right");
					feedback.classList.remove("hidden");
					feedback.classList.add(interactions["9"].success===true?"right":"wrong");
					soundManager.play("sound_9_feedback")
				},
				forwardsEnd:function(){
					navigation.isOn()
				}
			},
			line:[
				{
					id:"s9-feedback",
					properties:{translateY:"0%",opacity:1}, duration:1000, easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-10":{
			options:{
				forwardsStart:function(){
					var group = sections[1].querySelector("#s4-group-4");
					group.classList.remove("open");
					group.classList.add("checked");
					var button = sections[1].querySelector("#s4-button-3");
					button.classList.remove("active");
					var info = sections[1].querySelector("#s9-infos");
						info.classList.add("noEvents");
				},
				forwardsEnd:function(){
					var group = sections[1].querySelector("#s4-group-4");
					group.classList.remove("open");
					group.classList.add("checked");
					navigation.isOn();
				},
				rendered:function(){
					var group = sections[1].querySelector("#s4-group-4");
					group.classList.remove("open");
					group.classList.add("checked");
					var info = sections[1].querySelector("#s9-infos");
					info.classList.add("noEvents");
				},
				resetted:function(){
					if(sections){
						var group = sections[1].querySelector("#s4-group-4");
						group.classList.remove("open");
					}
				}
			},
			line:[
				{
					id:"#s5-helper",
					properties:{translateX:"30%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-button-3",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s4-group-4",
					properties:{translateX:"0px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-2",
					properties:{translateX:"0px",opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-3",
					properties:{translateX:"0px",opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s9-bg",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s9-infos",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				}
			]	
		},
		"screen-11":{
			options:{
				forwardsEnd:function(){
					navigation.isOn();
				}
			},
			line:[
				{
					id:"s4-group-1",
					properties:{translateY:"50%",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-4",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-group-3",
					properties:{translateX:"200px",opacity:0}, duration:1200, delay:"+200", easing:tP.e["long-in"]
				},
				{
					id:"s4-group-2",
					properties:{translateX:"200px",opacity:0}, duration:1200, delay:"+200", easing:tP.e["long-in"]
				},
				{
					id:"s11-rect-6",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s11-rect-3",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"same", easing:tP.e["button-in"]
				},
				{
					id:"s11-rect-2",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"same", easing:tP.e["button-in"]
				},
				{
					id:"s11-rect-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"same", easing:tP.e["button-in"]
				},
				{
					id:"s11-rect-5",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"same", easing:tP.e["button-in"]
				},
				{
					id:"s11-rect-4",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"same", easing:tP.e["button-in"]
				},
				{
					id:"s11-txt-1",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+500", easing:tP.e["standard-in"]
				},
				{
					id:"s11-group-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"same", easing:tP.e["standard-in"], delayId:"sound_11", cbStart:function(){soundManager.play("sound_11")}
				},
				{
					id:"s11-group-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_11+{getDelayByLanguage({"fr":12800,"en":12400})', easing:tP.e["standard-in"]
				},
				{
					id:"s11-group-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_11+{getDelayByLanguage({"fr":29300,"en":28400})', easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-12":{
			options:{
				forwardsEnd:function(){
					navigation.isOn();
				}
			},
			line:[
				{
					id:"s11-rect-6",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s11-rect-5",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s11-group-2",
					properties:{translateX:"-30%",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s11-group-3",
					properties:{translateX:"-30%",opacity:0}, duration:1200, delay:"+200", easing:tP.e["long-in"]
				},
				{
					id:"s11-group-1",
					properties:{translateX:"-30%",opacity:0}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s12-group-1",
					properties:{translateX:"0%",opacity:1}, duration:1200, delay:"same", easing:tP.e["long-in"], delayId:"sound_12", cbStart:function(){soundManager.play("sound_12")}
				},
				{
					id:"s11-rect-3",
					properties:{"background-color":"rgba(158,126,197,0.2)",translateX:"32px",translateY:"163px"}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s11-rect-4",
					properties:{"background-color":"rgba(158,126,197,0.2)",translateX:"54px",translateY:"541px"}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s11-rect-1",
					properties:{"background-color":"rgba(158,126,197,0.2)",translateX:"-105px",translateY:"258px"}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s11-rect-2",
					properties:{"background-color":"rgba(158,126,197,0.2)",translateX:"-170px",translateY:"-151px"}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s12-group-3",
					properties:{translateY:"0px",opacity:1}, duration:1000, delay:'sound_12+{getDelayByLanguage({"fr":9300,"en":9700})', easing:tP.e["standard-in"]
				},
				{
					id:"s12-group-2-bloc-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_12+{getDelayByLanguage({"fr":15800,"en":16700})', easing:tP.e["standard-in"]
				},
				{
					id:"s12-group-2-bloc-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_12+{getDelayByLanguage({"fr":23700,"en":25400})', easing:tP.e["standard-in"]
				}
			]	
		},
		"screen-13":{
			options:{
				forwardsStart:function(){
					soundManager.play("sound_13")
				},
				forwardsEnd:function(){
					navigation.isOn();
				}
			},
			line:[
				{
					id:"s12-group-3",
					properties:{translateX:"-82px",translateY:"50px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s12-group-3-texts-1",
					properties:{opacity:0}, duration:1200,  easing:tP.e["long-in"]
				},
				{
					id:"s12-group-3-texts-2",
					properties:{opacity:1}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s12-group-2",
					properties:{translateX:"-125px",translateY:"-106px"}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s12-group-2-bloc-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'{getDelayByLanguage({"fr":6600,"en":7000})', easing:tP.e["standard-in"]
				},
				{
					id:"s12-group-2-bloc-4",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'{getDelayByLanguage({"fr":15400,"en":15600})', easing:tP.e["standard-in"]
				},
				{
					id:"s13-dotted",
					properties:{"clip-polygon":"0% 0%, 100% 0%, 100% 100%, 0% 100%"}, duration:800, delay:'{getDelayByLanguage({"fr":19600,"en":19600})'
				},
				{
					id:"s13-group-1",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+800", easing:tP.e["button-in"]
				}
			]	
		},
		"screen-14":{
			options:{
				forwardsStart:function(){
					sections[1].querySelector("#s3-bloc-1").classList.add("checked");
					soundManager.play("sound_14");
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s3-bloc-1").classList.add("checked");
					sections[1].querySelector("#s4-content").classList.add("noEvents");
					var button = sections[1].querySelector("#s14-button");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				rendered:function(){
					if(sections){
						sections[1].querySelector("#s4-content").classList.add("noEvents");
						sections[1].querySelector("#s3-bloc-1").classList.add("checked");
						var button = sections[1].querySelector("#s4-button-1");
						button.classList.add("active");
					}
				}
			},
			line:[
				{
					id:"s11-rect-6",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s11-rect-3",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s11-rect-2",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s11-rect-1",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s11-rect-5",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s11-rect-4",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-dots",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s4-content",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:1,scaleY:1,opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s14-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'{getDelayByLanguage({"fr":13400,"en":15700})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-15":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s14-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s15-content").classList.remove("noEvents");
					var button = sections[1].querySelector("#s15-button");
					button.classList.add("active");
					$(button).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,function(){
						if(timeline.status==="normal"){
							timeline.play("screen-15-info");
						}
					})
					navigation.isOn("prev");
				},
				rendered:function(){
					var button = sections[1].querySelector("#s14-button");
					button.classList.remove("active");
					sections[1].querySelector("#s15-content").classList.remove("noEvents");
				},
				resetted:function(){
					if(sections){
						sections[1].querySelector("#s15-content").classList.add("noEvents");
						var button = sections[1].querySelector("#s15-button");
						button.classList.add("active");
						var content = sections[1].querySelector("#s15-bloc-content-2");
						content.classList.remove("open");
					}
				}
			},
			line:[
				{
					id:"s14-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:0.6,scaleY:0.6,opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"-200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s15-content",
					properties:{opacity:1}, duration:1000, easing:tP.e["long-in"]
				},
				{
					id:"s15-circle",
					properties:{"clip-polygon":"0% 0%, 100% 0%, 100% 100%, 0% 100%"}, duration:2000
				},
				{
					id:"s15-header",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+1200", easing:tP.e["standard-in"]
				},
				{
					id:"s15-group-1",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+800", easing:tP.e["standard-in"], delayId:"sound_15", cbStart:function(){soundManager.play("sound_15")}
				},
				{
					id:"s15-arrow",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:'sound_15+{getDelayByLanguage({"fr":8700,"en":10700})-500', easing:tP.e["standard-in"]
				},
				{
					id:"s15-group-2",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:'sound_15+{getDelayByLanguage({"fr":8700,"en":10700})', easing:tP.e["standard-in"]
				},
				{
					id:"s15-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_15+{getDelayByLanguage({"fr":22300,"en":24600})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-15-info":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s15-button");
					button.classList.remove("active");
					var content = sections[1].querySelector("#s15-bloc-content-2");
					content.classList.add("open");
				},
				forwardsEnd:function(){
					navigation.isOn();
				},
				rendered:function(){
				},
				resetted:function(){
				}
			},
			line:[
				{
					id:"s15-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s15-group-1",
					properties:{translateX:"-566px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s15-arrow",
					properties:{translateX:"-566px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s15-group-2",
					properties:{translateX:"-566px"}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s15-circle",
					properties:{translateX:"-473px"}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s15-img-1",
					properties:{translateX:"-1473px"}, duration:1100, easing:tP.e["long-in"]
				},
				{
					id:"s15-img-2",
					properties:{translateX:"-1473px"}, duration:850, easing:tP.e["long-in"]
				},
				{
					id:"s15-img-3",
					properties:{translateX:"-1473px"}, duration:900, easing:tP.e["long-in"]
				},
				{
					id:"s15-bloc-content-2",
					properties:{width:"1117px",height:"374px"}, duration:1000, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s15-bloc-content-left-2",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+700", easing:tP.e["standard-in"]
				},
				{
					id:"s15-bloc-content-right-2",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:"+700", easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-16":{
			options:{
				forwardsStart:function(){
					sections[1].querySelector("#s3-bloc-2").classList.add("checked");
					soundManager.play("sound_16");
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s3-bloc-2").classList.add("checked");
					sections[1].querySelector("#s15-content").classList.add("noEvents");
					var button = sections[1].querySelector("#s16-button");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				rendered:function(){
					if(sections){
						sections[1].querySelector("#s15-content").classList.add("noEvents");
						sections[1].querySelector("#s3-bloc-2").classList.add("checked");
					}
				}
			},
			line:[
				{
					id:"s3-dots",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s15-content",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:1,scaleY:1,opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s16-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'{getDelayByLanguage({"fr":11500,"en":11500})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-17":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s16-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s17-content").classList.remove("noEvents");
					navigation.isOn();
				},
				rendered:function(){
					var button = sections[1].querySelector("#s16-button");
					button.classList.remove("active");
					sections[1].querySelector("#s17-content").classList.remove("noEvents");
				},
				resetted:function(){
					if(sections){
						sections[1].querySelector("#s17-content").classList.add("noEvents");
					}
				}
			},
			line:[
				{
					id:"s16-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:0.6,scaleY:0.6,opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"-200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s17-content",
					properties:{opacity:1}, duration:1000, easing:tP.e["long-in"]
				},
				{
					id:"s17-rect-1",
					properties:{scaleX:1,scaleY:1}, duration:1200, delay:"+100", easing:tP.e["button-in"]
				},
				{
					id:"s17-img-2",
					properties:{translateX:"0%"}, duration:1200, delay:"same",
				},
				{
					id:"s17-img-1",
					properties:{translateX:"0%"}, duration:1300, delay:"+200"
				},
				{
					id:"s17-header",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+1200", easing:tP.e["standard-in"], delayId:"sound_17", cbStart:function(){soundManager.play("sound_17")}
				},
				{
					id:"s17-group-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_17+{getDelayByLanguage({"fr":8200,"en":8400})', easing:tP.e["standard-in"]
				},
				{
					id:"s17-group-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_17+{getDelayByLanguage({"fr":14200,"en":15200})', easing:tP.e["standard-in"]
				},
				{
					id:"s17-group-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_17+{getDelayByLanguage({"fr":27600,"en":27500})', easing:tP.e["standard-in"]
				}
			]	
		},
		"screen-18":{
			options:{
				forwardsStart:function(){
					sections[1].querySelector("#s3-bloc-3").classList.add("checked");
					soundManager.play("sound_18");
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s3-bloc-3").classList.add("checked");
					sections[1].querySelector("#s17-content").classList.add("noEvents");
					var button = sections[1].querySelector("#s18-button");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				rendered:function(){
					if(sections){
						var button = sections[1].querySelector("#s18-button");
						button.classList.remove("active");
						sections[1].querySelector("#s17-content").classList.add("noEvents");
						sections[1].querySelector("#s3-bloc-3").classList.add("checked");
					}
				}
			},
			line:[
				{
					id:"s17-rect-1",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-dots",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s17-content",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:1,scaleY:1,opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s18-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'{getDelayByLanguage({"fr":10000,"en":8000})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-19":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s18-button");
					button.classList.remove("active");
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s19-content").classList.remove("noEvents");
					navigation.isOn();
				},
				rendered:function(){
					var button = sections[1].querySelector("#s18-button");
					button.classList.remove("active");
					sections[1].querySelector("#s19-content").classList.remove("noEvents");
				},
				resetted:function(){
					if(sections){
						sections[1].querySelector("#s19-content").classList.add("noEvents");
					}
				}
			},
			line:[
				{
					id:"s18-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:0.6,scaleY:0.6,opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"-200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s19-content",
					properties:{opacity:1}, duration:1000, easing:tP.e["long-in"]
				},
				{
					id:"s19-circle",
					properties:{translateY:"0%",opacity:1}, duration:1200, delay:"same",
				},
				{
					id:"s19-header",
					properties:{translateY:"0%",opacity:1}, duration:1000, delay:"+1200", easing:tP.e["standard-in"], delayId:"sound_19", cbStart:function(){soundManager.play("sound_19")}
				},
				{
					id:"s19-group-1-bloc-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_19+{getDelayByLanguage({"fr":5150,"en":4800})', easing:tP.e["standard-in"]
				},
				{
					id:"s19-group-1-bloc-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_19+{getDelayByLanguage({"fr":16700,"en":15800})', easing:tP.e["standard-in"]
				},
				{
					id:"s19-group-1-bloc-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_19+{getDelayByLanguage({"fr":28100,"en":26100})', easing:tP.e["standard-in"]
				},
				{
					id:"s19-group-1-bloc-4",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:'sound_19+{getDelayByLanguage({"fr":34400,"en":33600})', easing:tP.e["standard-in"]
				},
			]	
		},
		"screen-20":{
			options:{
				forwardsStart:function(){
					sections[1].querySelector("#s3-bloc-4").classList.add("checked");
					soundManager.play("sound_20");
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s3-bloc-4").classList.add("checked");
					sections[1].querySelector("#s19-content").classList.add("noEvents");
					var button = sections[1].querySelector("#s20-button");
					button.classList.add("active");
					navigation.isOn("prev");
				},
				rendered:function(){
					if(sections){
						sections[1].querySelector("#s19-content").classList.add("noEvents");
						sections[1].querySelector("#s3-bloc-4").classList.add("checked");
					}
				}
			},
			line:[
				{
					id:"s19-circle",
					properties:{translateX:"40%",opacity:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-dots",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s19-content",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:1,scaleY:1,opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s20-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'{getDelayByLanguage({"fr":8100,"en":8100})', easing:tP.e["button-in"]
				}
			]	
		},
		"screen-21":{
			options:{
				forwardsStart:function(){
					var button = sections[1].querySelector("#s20-button");
					button.classList.remove("active");
					if(interactions["21"]){
						interactions["21"].reset();
					}
				},
				forwardsEnd:function(){
					if(!interactions["21"]){
						interactions["21"] = new Infos({
							buttons:sections[1].querySelectorAll(".s21-group .button"),
							infos:sections[1].querySelectorAll(".s21-group"),
							infoHideClass:"faker",
							transitionsIn:{width:"343px"},
							transitionsOut:{width:"686px"},
							onlyOneInfoDisplayed:true,
							cbEnd:function(){
								navigation.isOn();
							}
						});	
					} else {
						interactions["21"].reset();
					}
					sections[1].querySelector("#s21-content").classList.remove("noEvents");
					navigation.isOn("prev");
				},
				rendered:function(){
					var button = sections[1].querySelector("#s20-button");
					button.classList.remove("active");
					sections[1].querySelector("#s21-content").classList.remove("noEvents");
				},
				resetted:function(){
					if(sections){
						sections[1].querySelector("#s21-content").classList.add("noEvents");
					}
				}
			},
			line:[
				{
					id:"s20-button",
					properties:{scaleX:0,scaleY:0}, duration:800, easing:tP.e["standard-out"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:0.6,scaleY:0.6,opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"-200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"200px",opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s21-content",
					properties:{opacity:1}, duration:1000, easing:tP.e["long-in"]
				},
				{
					id:"s21-img-1",
					properties:{translateX:"0%",opacity:1}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s21-header",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+1200", easing:tP.e["standard-in"], delayId:"sound_21", cbStart:function(){soundManager.play("sound_21")}
				},
				{
					id:"s21-group-1",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:'sound_21+{getDelayByLanguage({"fr":2600,"en":2100})', easing:tP.e["button-in"]
				},
				{
					id:"s21-group-2",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:'sound_21+{getDelayByLanguage({"fr":4000,"en":3400})', easing:tP.e["button-in"]
				},
				{
					id:"s21-group-3",
					properties:{translateX:"0px",opacity:1}, duration:1000, delay:'sound_21+{getDelayByLanguage({"fr":5800,"en":4900})', easing:tP.e["button-in"]
				},
				{
					id:"s21-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:'sound_21+{getDelayByLanguage({"fr":8000,"en":7100})', easing:tP.e["button-in"]
				},
				{
					id:"s22-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				},
				{
					id:"s23-button",
					properties:{scaleX:1,scaleY:1}, duration:1000, delay:"+400", easing:tP.e["button-in"]
				}
			]	
		},
		"screen-22":{
			options:{
				forwardsStart:function(){
					sections[1].querySelector("#s3-bloc-5").classList.add("checked");
					soundManager.play("sound_22")
				},
				forwardsEnd:function(){
					sections[1].querySelector("#s3-bloc-5").classList.add("checked");
					sections[1].querySelector("#s21-content").classList.add("noEvents");
					navigation.isOn();
				},
				rendered:function(){
					if(sections){
						sections[1].querySelector("#s21-content").classList.add("noEvents");
						sections[1].querySelector("#s3-bloc-5").classList.add("checked");
					}
				}
			},
			line:[
				{
					id:"s3-dots",
					properties:{opacity:1}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-dots-2",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s21-content",
					properties:{opacity:0}, duration:1200, easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-left",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				},
				{
					id:"s3-bg-right",
					properties:{translateX:"0px",opacity:1}, duration:1200, delay:"same", easing:tP.e["long-in"]
				},
				{
					id:"s3-group-1",
					properties:{scaleX:1,scaleY:1,opacity:1}, duration:1200, delay:"+400", easing:tP.e["long-in"]
				}
			]	
		},
	}
}