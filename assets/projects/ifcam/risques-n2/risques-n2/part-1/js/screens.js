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
	line:["screen-1","screen-2","screen-3","screen-4"],
	steps: {
		"screen-1":{
			options:{
				forwardsStart:function(){
					sendToHeader({
						type: MessagesConstants.HEADER_HIDE,
					});
					sendToFooter({
						type: MessagesConstants.FOOTER_HIDE,
					});
					showSection("section-1");
					soundManager.play("sound_1");
				},
				forwardsEnd:function(){
				},
				rendered:function(){
					sendToMenu({
						type: MessagesConstants.MENU_TOGGLE,
						condition:"opened"
					});
					sendToHeader({
						type: MessagesConstants.HEADER_HIDE,
					});
					sendToFooter({
						type: MessagesConstants.FOOTER_HIDE,
					});
					showSection("section-1");
				}
			},
			line:[
				{
					id:"s1-txt-5-1",
					properties:{translateX:"0%",opacity:1}, duration:2100
				},
				{
					id:"s1-txt-5-2",
					properties:{translateX:"0%",opacity:1}, duration:2100
				},
				{
					id:"s1-group-1",
					properties:{translateX:"0%",opacity:1}, duration:tP.d["standard-in"], easing:tP.e["standard-in"]
				},
				{
					id:"s1-group-2",
					properties:{translateX:"0%",opacity:1}, duration:tP.d["standard-in"], delay:"+300", easing:tP.e["standard-in"]
				},
				{
					id:"s1-img-1",
					properties:{translateX:"0px",opacity:1}, duration:tP.d["standard-in"], delay:"+300", easing:"outBack"
				},
				{
					id:"s1-img-2",
					properties:{translateX:"475px",opacity:1}, duration:tP.d["standard-in"], delay:"+300", easing:"outBack"
				},
				{
					id:"s1-fake",
					properties:{opacity:1}, duration:100, delay:"{getSoundDuration(sound_1)}", cbStart:function(){ soundManager.play("sound_1_2");}
				}
			]	
		},
		"screen-2":{
			options:{
				forwardsStart:function(){
					//soundManager.play("sound-2");
				},
				forwardsEnd:function(){
					sendToFooter({
						type: MessagesConstants.FOOTER_SHOW,
					});
					sendToMenu({
						type: MessagesConstants.MENU_TOGGLE,
						animated:true,
						byFooter:true
					});
					navigation.isOn();
				},
				rendered:function(){
					sendToFooter({
						type: MessagesConstants.FOOTER_SHOW,
					});
					if(videoManager){
						videoManager.stop();
					}
				}
			},
			line:[
				{
					id:"s1-img-2",
					properties:{translateX:"0px",translateY:"0px",scaleX:1,scaleY:1}, duration:1400, easing:tP.e["long-in"]
				}
			]	
		},
		"screen-3":{
			options:{
				forwardsStart:function(){
					sendToMenu({
						type: MessagesConstants.MENU_TOGGLE,
						animated:true,
						condition:"opened",
						byFooter:true
					});	
				},
				forwardsEnd:function(){
					sendToMenu({
						type: MessagesConstants.MENU_TOGGLE,
						condition:"opened",
						byFooter:true
					});
					//LOCAL
					//navigation.isOn("prev");
					//screen3Video();
					//LINK
					navigation.isOn();
					var iframe = sections[0].querySelector("#s3-video-iframe");
					if(iframe.getAttribute("loaded")=="false"){
						iframe.setAttribute("loaded","true");
						iframe.src = languageManager.jsonObj[iframe.getAttribute("json")]
					}
				},
				rendered:function(){
				}
			},
			line:[
				{
					id:"s1-content",
					properties:{opacity:0}, duration:10
				},
				{
					id:"s3-video-wrap",
					properties:{translateY:"0px"}, duration:1000, easing:tP.e["standard-out"]
				},
				{
					id:"s1-img-2",
					properties:{translateY:"424px"}, duration:1000, easing:tP.e["standard-out"]
				},
				{
					id:"s3-img-1",
					properties:{opacity:1}, duration:10
				},
				{
					id:"s3-img-1",
					properties:{translateY:"424px"}, duration:1000, easing:tP.e["standard-out"]
				}
			]	
		},
		"screen-4":{
			options:{
				forwardsStart:function(){
					//LINK
					var iframe = sections[0].querySelector("#s3-video-iframe");
					iframe.src = "";
					iframe.setAttribute("loaded","false");
					//soundManager.play("sound-4");
				},
				forwardsEnd:function(){
					navigation.isOn();
				},
				rendered:function(){
				}
			},
			line:[
				{
					id:"s3-video-wrap",
					properties:{translateY:"791px"}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s4-content",
					properties:{translateY:"0px"}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s1-img-2",
					properties:{opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s3-img-1",
					properties:{translateY:"792px",opacity:0}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s4-img-2",
					properties:{opacity:1}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s4-img-3",
					properties:{translateY:"0px",opacity:1}, duration:1400, easing:tP.e["long-in"]
				},
				{
					id:"s4-rect",
					properties:{translateX:"0%"}, duration:1000, delay:"+900", easing:tP.e["standard-out"]
				},
				{
					id:"s4-img-1",
					properties:{translateX:"0%"}, duration:1000, delay:"+200", easing:tP.e["standard-out"]
				},
				{
					id:"s4-row-1",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"+200", easing:tP.e["standard-out"], delayId:"sound_4", cbStart:function(){ soundManager.play("sound_4");}
				},
				{
					id:"s4-row-2",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"sound_4+{getSoundDuration(sound_4)}", easing:tP.e["standard-out"], delayId:"sound_4_2", cbStart:function(){ soundManager.play("sound_4_2");}
				},
				{
					id:"s4-row-3",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"sound_4_2+{getSoundDuration(sound_4_2)}", easing:tP.e["standard-out"], delayId:"sound_4_3", cbStart:function(){ soundManager.play("sound_4_3");}
				},
				{
					id:"s4-row-4",
					properties:{translateX:"0%",opacity:1}, duration:1000, delay:"sound_4_3+{getSoundDuration(sound_4_3)}", easing:tP.e["standard-out"], cbStart:function(){ soundManager.play("sound_4_4");}
				}
			]	
		},
		"languagePopupShow":{
			options:{
				forwardsStart:function(){
					mainDom.querySelector("#languages").classList.remove("hidden");
					setPopupLanguage();
				},
				forwardsEnd:function(){
					
				},
				rendered: function(){
				}
			},
			line:[
				{
					id:"languages",
					properties:{opacity:1}, duration:tP.d["long-in"], easing:"inOutQuad"
				},
				{
					id:"languages-popup",
					properties:{translateX:"0%",opacity:1}, easing:tP.d["standard-in"], delay:"+200", easing:tP.e["button-in"]
				}
			]
		},
		"languagePopupHide":{
			options:{
				forwardsStart:function(){
				},
				forwardsEnd:function(){
					mainDom.querySelector("#languages").classList.add("hidden");
				}
			},
			line:[
				{
					id:"languages",
					properties:{opacity:0}, duration:800, easing:"inOutQuad"
				},
				{
					id:"languages-popup",
					properties:{translateX:"-100%",opacity:0}, duration:450, easing:"inBack"
				}
			]
		}	
	}
}