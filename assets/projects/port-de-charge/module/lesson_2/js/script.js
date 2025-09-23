pulseAnims();

var soundsData = [
    { id:'open', name:'open', path:'common' },
    { id:'close', name:'close', path:'common' },
    { id:'click', name:'click', path:'common' },
    { id:'take', name:'take', path:'common' },
    { id:'drop', name:'drop', path:'common' },
    { id:'right', name:'right', path:'common' },
    { id:'wrong', name:'wrong', path:'common' },
];

videoDatas = {
	"e4_video-container":{
		loop:true,
		src:"Port_de_charge_V01"
	},
	"e5_video-container":{
		timeEnd:8.1,
		src:"Port_de_charge_V04"
	},
	"e6_video-container":{
		timeStart:8.1,
		src:"Port_de_charge_V04"
	},
	"e7_video-container":{
		timeEnd:6,
		src:"Port_de_charge_V06"
	}
}

var screen3Slider;

function screen3Exo(){
	var sliderGroup1 = sections[0].querySelector("#Stage_e3_schema"),
	sliderGroup2 = sections[0].querySelector("#Stage_e3_slider-group-2"),
	sliderGroup3 = sections[0].querySelector("#Stage_e3_slider-group-3"),
	updateGauge = function(current){
		var sliderCurrents = sections[0].querySelectorAll(".sliderCurrent");
		for(var s=1; s<=sliderCurrents.length; s++){
			var sliderCurrent = sliderCurrents[s-1];
			if(s==current){
				sliderCurrent.classList.add("current");
			} else {
				sliderCurrent.classList.remove("current");
			}
		}
	}
	if(screen3Slider==undefined){
		screen3Slider = new Slider({
			element:sections[0].querySelector("#Stage_e3_slider"),
		    btNext:sections[0].querySelector("#Stage_e3_btSliderNext"),
		    btPrev:sections[0].querySelector("#Stage_e3_btSliderPrev"),
		    easing:"cubic-bezier(0.16, 1, 0.3, 1)",
		    duration:0.8,
		    reverse:true,
		    onEnd:function(){
		    	navigation.isOn();
		    },
		    onEach:function(current,dir){
		    	updateGauge(current);
		    	switch(current){
		    		case 1:
		    			if(dir=="next"){
		    			}
		    			else if(dir=="prev"){
		    				var a = animate({
		    					element:sliderGroup2,
		    					properties:{opacity:0},
		    					duration:700
		    				});
		    			}
		    		break;

		    		case 2:
		    			if(dir=="next"){
		    				var a = animate({
		    					element:sliderGroup2,
		    					properties:{opacity:1},
		    					duration:700
		    				});
		    			}
		    			else if(dir=="prev"){
		    				var a = animate({
		    					element:sliderGroup3,
		    					properties:{opacity:0},
		    					duration:700
		    				});
		    				var b = animate({
		    					element:sliderGroup1,
		    					properties:{opacity:1},
		    					duration:700
		    				});
		    			}
		    		break;

		    		case 3:
		    			if(dir=="next"){
		    				var a = animate({
		    					element:sliderGroup3,
		    					properties:{opacity:1},
		    					duration:700
		    				});
		    				var b = animate({
		    					element:sliderGroup1,
		    					properties:{opacity:0},
		    					duration:700
		    				});
		    			}
		    		break;
		    	}
		    }
		});
	} else {
		screen3Slider.setAtPos(1);
		screen3Slider.onEach(1);
    	screen3Slider.activate();
	}
}