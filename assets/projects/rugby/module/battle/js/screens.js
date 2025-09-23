var tP = {
	p: {
		"textLeft-in": { translateX: "0%", opacity: 1 },
		"textLeft-out": { translateX: "-40%", opacity: 0 },
		"textRight-in": { translateX: "0%", opacity: 1 },
		"textRight-out": { translateX: "40%", opacity: 0 },
		"sep-in": { scaleX: 1 },
		'sep-out': { scaleX: 0 },
		"button-in": { scaleX: 1, scaleY: 1 },
		"button-out": { scaleX: 0, scaleY: 0 },
	},
	d: {
		"standard-in": 1000,
		"standard-in-s": 500,
		"standard-out": 800,
		"long-in": 1400
	},
	e: {
		"standard-in": "outExpo",
		"standard-out": "outExpo",
		"long-in": "inOutExpo",
		"button-in": "outBack",
		"button-out": "inBack"
	}
}

var timelineDatas = {
	line: [
		"screen-1-in"
	],
	steps: {
		"screen-1-in": {
			options: {
				forwardsStart: function () {
					showSection("section-1");
				},
				forwardsEnd: function () {
					mainEvents();
				},
				rendered: function () {
					mainEvents();
					showSection("section-1");
				}
			},
			line: [
				{
					id: "s1-france",
					properties: { "clip-polygon":"0% 0%, 100% 0%, 100% 100%, 0% 100%" }, duration: 1800
				},
				{
					id: "s1-txt-1",
					properties: { translateX: "0px", opacity: 1 }, duration: tP.d["standard-in"], easing: tP.e["standard-in"]
				},
				{
					id: "s1-txt-2",
					properties: { translateX: "0px", opacity: 1 }, delay:"+400", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "s1-img-1",
					properties: { translateY: "0%", opacity: 1 }, delay:"+200", duration: tP.d["standard-in"], easing: tP.e["standard-in"]
				},
				{
					id: "s1-img-2",
					properties: { translateX: "0%", translateY: "0%", opacity: 1 }, delay:"+300", duration: tP.d["standard-in"], easing: tP.e["standard-in"]
				},
				{
					id: "s1-img-3",
					properties: { translateX: "0%", translateY: "0%", opacity: 1 }, delay:"+300", duration: tP.d["standard-in"], easing: tP.e["standard-in"]
				},
				{
					id: "s1-button-customize",
					properties: { scaleX: 1, scaleY: 1, opacity: 1 }, delay: "+700", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "s1-button-sort",
					properties: { scaleX: 1, scaleY: 1, opacity: 1 }, delay: "+400", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "s1-button-play-solo",
					properties: { scaleX: 1, scaleY: 1, opacity: 1 }, delay: "+400", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "s1-button-play-vs",
					properties: { scaleX: 1, scaleY: 1, opacity: 1 }, delay: "+400", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "s1-button-rewards",
					properties: { scaleX: 1, scaleY: 1, opacity: 1 }, delay: "+400", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "s1-group-rules",
					properties: { translateX: "0px", opacity: 1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-in"]
				},
			]
		},
		"customize-in": {
			options: {
				forwardsStart: function () {
					document.getElementById("customize").classList.remove("hidden");
					customizationInit();
				},
				forwardsEnd: function () {
					document.getElementById("customize").classList.remove("noEvents");
				}
			},
			line: [
				{
					id: "customize-avatar",
					properties: { translateX: "-50%", opacity: 0, translateY:"-100px" }, duration:10
				},
				{
					id: "customize",
					properties: { scaleX:1, scaleY:1, opacity:1 }, duration: 1000, easing: tP.e["long-in"]
				},
				{
					id: "customize-bg",
					properties: { translateX: "0px", translateY: "0px" }, duration: 1800
				},
				{
					id: "customize-left-up",
					properties: { translateX: "0%", opacity: 1 }, delay:"+1100", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-item-group-1",
					properties: { translateX: "0px", opacity: 1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-item-group-2",
					properties: { translateX: "0px", opacity: 1 }, delay:"+200", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-item-group-3",
					properties: { translateX: "0px", opacity: 1 }, delay:"+200", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-item-group-4",
					properties: { translateX: "0px", opacity: 1 }, delay:"+200", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-item-group-5",
					properties: { translateX: "0px", opacity: 1 }, delay:"+200", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-avatar",
					properties: { translateY: "0px", opacity: 1 }, delay:"+500", duration: tP.d["standard-in"], easing: "outElastic"
				},
				{
					id: "customize-user",
					properties: { translateY: "0%", opacity: 1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-1",
					properties: { scaleX:1,scaleY:1 }, delay:"+200", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-2",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-3",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-4",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-5",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-1",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-2",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-3",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-4",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-5",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-6",
					properties: { scaleX:1,scaleY:1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-1",
					properties: { rotate:-60 }, delay:"next+10", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-2",
					properties: { rotate:-30 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-3",
					properties: { rotate:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-4",
					properties: { rotate:30 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-skin-palette-color-5",
					properties: { rotate:60 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-1",
					properties: { rotate:75 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-2",
					properties: { rotate:60 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-3",
					properties: { rotate:45 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-4",
					properties: { rotate:-45 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-5",
					properties: { rotate:-60 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-shoes-palette-color-6",
					properties: { rotate:-75 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "customize-button-validate",
					properties: { translateX:"0%" }, delay:"+500", duration:800, easing: tP.e["button-in"]
				},
				{
					id:"customize-shoes-circle",
					properties: { opacity:1 }, delay:"same", duration:800, easing: tP.e["button-in"]
				}
			]
		},
		"customize-out": {
			options: {
				forwardsStart: function () {
					document.getElementById("customize").classList.add("noEvents");
				},
				forwardsEnd: function () {
					document.getElementById("customize").classList.add("hidden");
				}
			},
			line: [
				{
					id: "customize-button-validate",
					properties: { translateX:"100%" }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-circle",
					properties: { opacity:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-1",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-2",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-3",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-4",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-5",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-1",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-2",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-3",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-4",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-5",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-6",
					properties: { rotate:0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-1",
					properties: { scaleX:0,scaleY:0 }, delay:"next+10", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-2",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-3",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-4",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-skin-palette-color-5",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-1",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-2",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-3",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-4",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-5",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-shoes-palette-color-6",
					properties: { scaleX:0,scaleY:0 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-avatar",
					properties: { translateX: "-260%" }, delay:"+100", duration: tP.d["standard-in"], easing: tP.e["long-in"]
				},
				{
					id: "customize-user",
					properties: { translateY: "100%", opacity: 0 }, delay:"same", duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "customize-left-up",
					properties: { translateX: "30%", opacity: 0 }, delay:"+200", duration: tP.d["standard-out"], easing: tP.e["long-in"]
				},
				{
					id: "customize-item-group-5",
					properties: { translateX: "-100px", opacity: 0 }, delay:"same", duration: tP.d["standard-out"], easing: tP.e["long-in"]
				},
				{
					id: "customize-item-group-4",
					properties: { translateX: "-100px", opacity: 0 }, delay:"+200", duration: tP.d["standard-out"], easing: tP.e["long-in"]
				},
				{
					id: "customize-item-group-3",
					properties: { translateX: "-100px", opacity: 0 }, delay:"+200", duration: tP.d["standard-out"], easing: tP.e["long-in"]
				},
				{
					id: "customize-item-group-2",
					properties: { translateX: "-100px", opacity: 0 }, delay:"+200", duration: tP.d["standard-out"], easing: tP.e["long-in"]
				},
				{
					id: "customize-item-group-1",
					properties: { translateX: "-100px", opacity: 0 }, delay:"+200", duration: tP.d["standard-out"], easing: tP.e["long-in"]
				},
				{
					id: "customize",
					properties: { scaleX:1.3, scaleY:1.3, opacity:0 }, delay:"+200", duration: 1000, easing: tP.e["long-in"]
				}
			]
		},
		"sort-in": {
			options: {
				forwardsStart: function () {
					document.getElementById("sort").classList.remove("hidden");
					sortInit();
				},
				forwardsEnd: function () {
					document.getElementById("sort").classList.remove("noEvents");
				}
			},
			line: [
				{
					id: "sort",
					properties: { opacity:1 }, duration: tP.d["standard-in"], easing: tP.e["long-in"]
				},
				{
					id: "sort-right",
					properties: { translateX: "0%", opacity:1}, delay:"+400", duration: tP.d["standard-in"], easing: tP.e["standard-in"]
				},
				{
					id: "sort-left",
					properties: { translateX: "0%", opacity:1}, delay:"+200", duration: tP.d["standard-in"], easing: tP.e["standard-in"]
				},
				{
					id: "sort-button-out",
					properties: { translateX: "0px", opacity: 1 }, delay:"+600", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				}
			]
		},
		"sort-out": {
			options: {
				forwardsStart: function () {
					document.getElementById("sort").classList.add("noEvents");
				},
				forwardsEnd: function () {
					document.getElementById("sort").classList.add("hidden");
				}
			},
			line: [
				{
					id: "sort-right",
					properties: { translateX: "50%", opacity:0}, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "sort-left",
					properties: { translateX: "-50%", opacity:0}, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "sort-button-out",
					properties: { translateX: "-100px", opacity: 0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "sort",
					properties: { opacity:0 }, delay:"+400", duration: tP.d["standard-out"], easing: tP.e["long-in"]
				}
			]
		},
		"popup-rewards-in": {
			options: {
				forwardsStart: function () {
					document.getElementById("s1-popup-rewards-wrap").classList.remove("hidden");
				},
				forwardsEnd: function () {
					document.getElementById("s1-popup-rewards-wrap").classList.remove("noEvents");
				}
			},
			line: [
				{
					id: "s1-popup-rewards-wrap",
					properties: { opacity:1 }, duration: tP.d["standard-in"], easing: tP.e["long-in"]
				},
				{
					id: "s1-popup-rewards",
					properties: { translateY: "0%", opacity:1}, delay:"+400", duration: tP.d["standard-in"], easing: tP.e["standard-in"]
				},
				{
					id: "s1-popup-rewards-path",
					properties: { "stroke-dashoffset":"0px"}, delay:"+500", duration: tP.d["standard-in"]
				}
			]
		},
		"popup-rewards-out": {
			options: {
				forwardsStart: function () {
					document.getElementById("s1-popup-rewards-wrap").classList.add("noEvents");
				},
				forwardsEnd: function () {
					document.getElementById("s1-popup-rewards-wrap").classList.add("hidden");
				}
			},
			line: [
				{
					id: "s1-popup-rewards-path",
					properties: { "stroke-dashoffset":"0px"}, duration: tP.d["standard-in"], easing: tP.e["standard-in"]
				},
				{
					id: "s1-popup-rewards",
					properties: { translateY: "40%", opacity:0}, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "s1-popup-rewards-wrap",
					properties: { opacity:0 }, delay:"+400", duration: tP.d["standard-out"], easing: tP.e["long-in"]
				}
			]
		},
		"battle-solo-in": {
			options: {
				forwardsStart: function () {
					document.getElementById("battle").classList.remove("hidden");
					document.getElementById("battle-button-out").classList.add("noEvents");
					battleInit();
					battleSet();
				},
				forwardsEnd: function () {
					battleStart();
					document.getElementById("battle-button-out").classList.remove("noEvents");
				}
			},
			line: [
				{
					id: "battle",
					properties: { scaleX:1, scaleY:1, opacity:1 }, duration: 1000, easing: tP.e["long-in"]
				},
				{
					id: "battle-button-out",
					properties: { translateX: "0px", opacity: 1 }, delay:"+700", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "battle-player",
					properties: { translateX: "0px", opacity: 1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "battle-interactions",
					properties: { translateY: "0px", opacity: 1 }, delay:"+500", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "battle-foe",
					properties: { translateX: "200px", opacity: 0 }, duration:10
				}
			]
		},
		"battle-solo-out": {
			options: {
				forwardsStart: function () {
					document.getElementById("battle-button-out").classList.add("noEvents");
				},
				forwardsEnd: function () {
					document.getElementById("battle").classList.add("hidden");
				}
			},
			line: [
				{
					id: "battle-button-out",
					properties: { translateX: "-100px", opacity: 0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "battle-player",
					properties: { translateX: "-200px", opacity: 0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "battle",
					properties: { scaleX:1.3, scaleY:1.3, opacity:0 }, duration: 1500, easing: tP.e["long-in"]
				}
			]
		},
		"battle-vs-in": {
			options: {
				forwardsStart: function () {
					document.getElementById("battle").classList.remove("hidden");
					document.getElementById("battle-button-out").classList.add("noEvents");
					battleInit({mode:"vs"});
				},
				forwardsEnd: function () {
					popup.show();
				}
			},
			line: [
				{
					id: "battle-button-out",
					properties: { translateX: "-100px", opacity: 0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "battle-interactions",
					properties: { translateY: "200px", opacity: 0 }, duration: 10, easing: tP.e["standard-out"]
				},
				{
					id: "battle",
					properties: { scaleX:1, scaleY:1, opacity:1 }, duration: 1000, easing: tP.e["long-in"]
				},
				{
					id: "battle-player",
					properties: { translateX: "0px", opacity: 1 }, delay:"+700", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				},
				{
					id: "battle-foe",
					properties: { translateX: "0px", opacity: 1 }, delay:"same", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				}
			]
		},
		"battle-vs-out": {
			options: {
				forwardsStart: function () {
					document.getElementById("battle-button-out").classList.add("noEvents");
				},
				forwardsEnd: function () {
					document.getElementById("battle").classList.add("hidden");
				}
			},
			line: [
				{
					id: "battle-player",
					properties: { translateX: "-200px", opacity: 0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "battle-foe",
					properties: { translateX: "200px", opacity: 0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "battle",
					properties: { scaleX:1.3, scaleY:1.3, opacity:0 }, duration: 1500, easing: tP.e["long-in"]
				}
			]
		},
		"battle-resume-in": {
			options: {
				forwardsStart: function () {
					battleSet();
				},
				forwardsEnd: function () {
					battleStart();
				}
			},
			line: [
				{
					id: "battle-interactions",
					properties: { translateY: "0px", opacity: 1 }, duration: tP.d["standard-in"], easing: tP.e["button-in"]
				}
			]
		},
		"battle-interactions-out": {
			line: [
				{
					id: "battle-interactions",
					properties: { translateY: "200px", opacity: 0 }, duration: tP.d["standard-in"], easing: tP.e["button-in"]
				}
			]
		},
		"battle-scoring-right": {
			options: {
				forwardsStart: function () {
					document.querySelector("#battle-animations").classList.remove("hidden");
					document.querySelector("#battle-scoring-wrap").classList.add("right");
					document.querySelector("#battle-scoring-wrap").classList.remove("wrong");
					document.getElementById("battle-ball").style.left = "";
					document.getElementById("battle-ball").style.top = "";
					document.getElementById("battle-ball").querySelector("img").style["transform"] = "scaleX(1) scaleY(1) rotate(0deg)";
					document.getElementById("battle-ball").classList.remove("kicked");
					document.getElementById("battle-base").classList.remove("kicked");
					document.querySelector("#battle-scoring-wrap").querySelector("p").innerHTML = "Tir réussi !";
				},
				forwardsEnd: function() {
					if(battleDatas.mode=="vs"){
						window["_ui-123456"].app.setActualScore(battleDatas.corrects.filter((c) => c==true).length);
					}
				}
			},
			line: [
				{
					time:700,
					ftc:function(){
						battleShowAnimations("right");
					}
				},
				{
					id: "battle-interactions",
					properties: { translateY: "200px", opacity: 0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "battle-scoring-wrap",
					properties: { scaleX:1, scaleY:1, rotate: -5 }, delay:"next+500", duration: tP.d["standard-in"], easing: tP.e["long-in"]
				}
			]
		},
		"battle-scoring-wrong": {
			options: {
				forwardsStart: function () {
					document.querySelector("#battle-animations").classList.remove("hidden");
					document.querySelector("#battle-scoring-wrap").classList.remove("right");
					document.querySelector("#battle-scoring-wrap").classList.add("wrong");
					document.getElementById("battle-ball").style.left = "";
					document.getElementById("battle-ball").style.top = "";
					document.getElementById("battle-ball").querySelector("img").style["transform"] = "scaleX(1) scaleY(1) rotate(0deg)";
					document.getElementById("battle-ball").classList.remove("kicked");
					document.getElementById("battle-base").classList.remove("kicked");
					document.querySelector("#battle-scoring-wrap").querySelector("p").innerHTML = "Tir raté !";
				},
				forwardsEnd: function() {
					if(battleDatas.mode=="vs"){
						window["_ui-123456"].app.setActualScore(battleDatas.corrects.filter((c) => c==true).length);
					}
				}
			},
			line: [
				{
					time:700,
					ftc:function(){
						battleShowAnimations("wrong");
					}
				},
				{
					id: "battle-interactions",
					properties: { translateY: "200px", opacity: 0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "battle-scoring-wrap",
					properties: { scaleX:1, scaleY:1, rotate: -5 }, delay:"next+500", duration: tP.d["standard-in"], easing: tP.e["long-in"]
				}
			]
		},
		"battle-scoring-out": {
			options: {
				forwardsStart: function () {
					document.getElementById("battle-base").classList.remove("kicked");
				},
				forwardsEnd: function () {
					document.querySelector("#battle-animations").classList.add("hidden");
				}
			},
			line: [
				{
					id: "battle-scoring-wrap",
					properties: { scaleX:0, scaleY:0, rotate: 360 }, duration: tP.d["standard-out"], easing: tP.e["long-in"]
				}
			]
		},
		"battle-popup-in": {
			options: {
				forwardsStart: function () {
					document.getElementById("battle-popup").classList.add("noEvents");
					document.getElementById("battle-popup-wrap").classList.remove("hidden");
				},
				forwardsEnd:function(){
					document.getElementById("battle-popup").classList.remove("noEvents");
				}
			},
			line: [
				{
					id: "battle-popup-wrap",
					properties: {opacity:1 }, duration: 1000, easing: tP.e["long-in"]
				},
				{
					id: "battle-popup",
					properties: { translateY: "0%", opacity: 1 }, delay:"+800", duration: tP.d["standard-in"], easing: tP.e["button-in"]
				}
			]
		},
		"battle-popup-level-up": {
			options: {
				forwardsEnd: function () {
					document.getElementById("battle-popup-level-ball").classList.add("hidden");
				},
				resetted:function(){
					document.getElementById("battle-popup-level-wrap").classList.add("hidden");
					document.getElementById("battle-popup-unlock-wrap").classList.add("hidden");
                    document.getElementById("battle-popup-level-ball").classList.add("hidden");
				}
			},
			line: [
				{
					id: "battle-popup-level-wrap",
					properties: { scaleX:1, scaleY:1 }, duration: 1000, easing: tP.e["button-in"]
				},
				{
					id: "battle-popup-level-ball",
					properties: { left:"977px", top:"92px" }, delay:"+500", duration: tP.d["standard-in"], cubic:[[13,92],[387,-151],[803,-151],[977,92]], cbStart:function(){document.getElementById("battle-popup-level-ball").classList.remove("hidden");}
				},
				{
					id: "battle-popup-level-ball-img",
					properties: { rotate:130 }, delay:"same", duration: tP.d["standard-in"]
				},
				{
					id: "battle-popup-unlock-wrap",
					properties: { scaleX:1, scaleY:1 }, delay:"+800",  duration: 1000, easing: tP.e["button-in"]
				},
				
			]
		},
		"battle-popup-out": {
			options: {
				forwardsStart: function () {
					document.getElementById("battle-popup").classList.add("noEvents");
				},
				forwardsEnd: function () {
					document.getElementById("battle-popup-wrap").classList.add("hidden");
				}
			},
			line: [
				{
					id: "battle-popup",
					properties: { translateY: "70%", opacity: 0 }, duration: tP.d["standard-out"], easing: tP.e["standard-out"]
				},
				{
					id: "battle-popup-wrap",
					properties: {opacity:0 }, duration: 1500, easing: tP.e["long-in"]
				}
			]
		},
	}
};