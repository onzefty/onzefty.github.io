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

var completionScore = ofp.getFromDataProvider('completionScore');

var evaluation,
btValidate, sentencesWrap, question1, question2, questionHelper, gaugeDots, questionWraps,
questions = [
	{
		s:"Quel est le pourcentage de salariés impactés par le mal de dos durant leur carrière ?",
		ss:"Déplacez le curseur pour retrouver le bon pourcentage, puis validez.",
		move:[{answer:false,text:"10 %"},{answer:false,text:"30 %"},{answer:false,text:"50 %"},{answer:true,text:"70 %"},{answer:false,text:"90 %"}]
	},
	{
		s:"Quel est le pourcentage du poids total du corps supporté par<br>la colonne vertébrale lorsqu'une personne de se penche en avant ?",
		ss:"Sélectionnez la bonne réponse, puis validez.",
		choices:[{answer:false,text:"50 %"},{answer:false,text:"100 %"},{answer:false,text:"150 %"},{answer:false,text:"200 %"},{answer:false,text:"250 %"},{answer:true,text:"300 %"}]
	},
	{
		s:"Quel est le pourcentage de pression supplémentaire par rapport à la position axiale lorsque la colonne est en position de rotation ?",
		ss:"Sélectionnez la bonne réponse, puis validez.",
		choices:[{answer:false,text:"0 % à 10 %"},{answer:true,text:"10 % à 20 %"}]
	},
	{
		s:"À quelle distance vous positionnez-vous de la charge à porter ?",
		ss:"Sélectionnez la bonne réponse, puis validez.",
		choices:[{answer:false,text:"À 50 cm"},{answer:true,text:"Le plus proche possible"}],
		sentenceClass:"flexXEnd"
	},
	{
		s:"À présent, comment positionnez-vous vos pieds ?",
		ss:"Sélectionnez la bonne réponse, puis validez.",
		choices:[{answer:false,text:"Pieds parallèles"},{answer:true,text:"Pieds en équerre"}]
	},
	{
		s:"Comment devez-vous fléchir vos jambes pour approcher de la charge ?",
		ss:"Sélectionnez la bonne réponse, puis validez.",
		choices:[{answer:true,text:"Je fléchis mes genoux à 90°"},{answer:false,text:"Je fléchis au maximum pour être le<br>plus proche possible de la charge"}]
	},
	{
		s:"Quel est l'ordre des étapes d'un port de charge bien effectué ?",
		ss:"Cliquez et déplacez les étapes, puis validez.",
		order:[{answer:4,text:"Je plie les jambes"},{answer:2,text:"Je garde le dos droit"},{answer:5,text:"J'aligne les centres de gravité"},{answer:3,text:"Je garde les bras près du corps"},{answer:1,text:"Je regarde devant moi"}],
		sentenceClass:"flexXEnd"
	},
	{
		s:"Quelle est la règle d'or à appliquer lors de votre échauffement<br>avant d'effectuer un port de charge ?",
		ss:"Sélectionnez la bonne réponse, puis validez.",
		choices:[{answer:false,text:"Réaliser des activités physiques lourdes"},{answer:true,text:"Aller doucement et progressivement sans trop forcer"}]
	},
	{
		s:"Placez dans l'ordre les principales sources du mal de dos.",
		ss:"Cliquez, déplacez, puis validez.",
		drag:[{text:"Manutention manuelle<br>d'objets régulière",answer:2},{text:"Chutes de hauteur ou<br>de plain-pied",answer:3},{text:"Port et transport de charges",answer:1}]
	},
	{
		s:"Quel est le pourcentage de mal dos dos issus de port et transport de charges<br>(tous secteurs confondus) ?",
		ss:"Sélectionnez la bonne réponse, puis validez.",
		choices:[{answer:false,text:"20 %"},{answer:true,text:"40 %"},{answer:false,text:"60 %"}]
	}
];

function evalInit(){
	if(evaluation==undefined){
		var current = parseInt(scorm.parsedDatas[currentFileId-1][3][0])==questions.length ? 1 : parseInt(scorm.parsedDatas[currentFileId-1][3][0]),
		score = parseInt(scorm.parsedDatas[currentFileId-1][3][0])==questions.length ? 0 : parseInt(scorm.parsedDatas[currentFileId-1][3][1]);
		evaluation = new Evaluation({
	        current:current,
	        score:score,
	        indexes:scorm.parsedDatas[currentFileId-1][4],
	        max:questions.length,
	        randomized:ofp.getFromDataProvider("randomized"),
	        sendInteractions:ofp.getFromDataProvider("sendInteractions"),
	        sendScore:ofp.getFromDataProvider("sendScore"),
	        //Paramètres depuis script.js
	        questions:questions,
	        onCustomEnd:evalEnd,
	        onCustomNext:evalNext,
	        onCustomStart:evalStart,
	        //onCustomFeedback:evalFeedbacks,
	        onCustomReset:evalReset
	    });	
	    evaluation.start();
	}
}

function evalStart(){
	sentencesWrap = sections[1].querySelector("#Stage_question-wrap");
	question1 = sections[1].querySelector("#Stage_question-1");
	question2 = sections[1].querySelector("#Stage_question-2");
	questionHelper = sections[1].querySelector("#Stage_question-helper");
	btValidate = sections[1].querySelector("#Stage_btValidate");
	questionWraps = sections[1].querySelectorAll(".question-wrap");
	gaugeDots = sections[1].querySelectorAll(".gauge-dot");
	question1.classList.add("hidden");
	question1.style.opacity = 1;
	question1.style["transform"] = "translateY(0%)";
	question2.classList.add("hidden");
	question2.style.opacity = 1;
	question2.style["transform"] = "translateY(0%)";
	for(var q=1; q<=questionWraps.length; q++){
		var questionWrap = questionWraps[q-1];
		questionWrap.style["pointer-events"] = "none";
	}
	evalDisplay(false);
}

function evalNext(){
	btValidate.classList.add("inactive");
	soundManager.play("click");
	evalDisplay(true);
	//TEMP si feedbacks
	evalSaveProgress();
}

function evalEnd(){
	navigation.next(true);
}

function evalDisplay(animated){
	var questionShowEl = (question1.classList.contains("hidden")==true) ? question1 : question2,
	questionHideEl = (question1.classList.contains("hidden")==false) ? question1 : question2,
	questionExoHideEl = questionWraps[evaluation.index-1],
	questionExoShowEl = questionWraps[evaluation.index];
	if(animated==true){
		// Question
		animate({
			element:questionHideEl,
			properties:{
				opacity:0,
				translateY:"-80%",
				easing:"outExpo",
				duration:800
			},
			end:function(){
				setQuestion(evaluation.question);
				questionHideEl.classList.add("hidden");
			}
		});
		questionShowEl.style.opacity = 0;
		questionShowEl.style["transform"] = "translateY(80%)";
		animate({
			element:questionShowEl,
			properties:{
				opacity:1,
				translateY:"0%",
				easing:"outExpo",
				duration:800,
				delay:810
			},
			start:function(){
				questionShowEl.classList.remove("hidden");
			}
		});
		//Question aide
		animate({
			element:questionHelper,
			properties:{
				opacity:0,
				easing:"outExpo",
				duration:800
			}
		});
		animate({
			element:questionHelper,
			properties:{
				opacity:1,
				easing:"outExpo",
				duration:800,
				delay:810
			}
		});
		//Exercice
		animate({
			element:questionExoHideEl,
			properties:{
				opacity:0,
				translateX:"-100%",
				easing:"outExpo",
				duration:800
			}
		});
		animate({
			element:questionExoShowEl,
			properties:{
				opacity:1,
				translateX:"0%",
				easing:"outExpo",
				duration:800,
				delay:810
			},
			start:function(){
				questionExoShowEl.style.opacity = 0;
				questionExoShowEl.style["pointer-events"] = "none";
				questionExoShowEl.style["transform"] = "translateX(100%)";
			},
			end:function(){
				questionExoShowEl.style["pointer-events"] = "";
			}
		});
	} else {
		questionExoShowEl.style.opacity = 1;
		questionExoShowEl.style["transform"] = "translateX(0%)";
		questionExoShowEl.style["pointer-events"] = "";
		setQuestion(evaluation.question);
		questionShowEl.classList.remove("hidden");
	}
}

function evalReset(){
	scorm.parsedDatas[currentFileId-1][4] = evaluation.indexes;
    scorm.parsedDatas[currentFileId-1][3][0] = evaluation.current;
    scorm.parsedDatas[currentFileId-1][3][1] = evaluation.score;
    navigation.prev(true);
    evaluation.start();
}

function evalSaveProgress(){
	scorm.parsedDatas[currentFileId-1][3][0] = evaluation.current;
    scorm.parsedDatas[currentFileId-1][3][1] = evaluation.score;
    if(scorm.parsedDatas[currentFileId-1][4]==undefined){
        scorm.parsedDatas[currentFileId-1][4] = evaluation.indexes;
    }
    save(true);
}

function displayResults(){
	var feedbackGood = sections[2].querySelector("#Stage_feedbacks_good"),
	feedbackMedium = sections[2].querySelector("#Stage_feedbacks_medium"),
	feedbackBad = sections[2].querySelector("#Stage_feedbacks_bad"),
	feedbackCircle = sections[2].querySelector("#Stage_feedbackCircle"),
	percentEl = sections[2].querySelector("#Stage_percent"),
	scoreEl = sections[2].querySelector("#Stage_score"),
	btSeeAgain = sections[2].querySelector("#Stage_btSeeAgain"),
	btDownload = sections[2].querySelector("#Stage_btDownload"),
	btRedo = sections[2].querySelector("#Stage_btRedo");

	btRedo.classList.remove("pulseBrown");

	setSVG();

	if(evaluation.percent>=completionScore){
		scoreEl.style.color = "#64d7a0";
		feedbackCircle.classList.add("good");
		feedbackGood.classList.remove("hidden");
		feedbackMedium.classList.add("hidden");
		feedbackBad.classList.add("hidden");
		btRedo.classList.add("hidden");
		btSeeAgain.classList.remove("hidden");
		btDownload.classList.remove("hidden");
		btDownload.classList.remove("inactive");
	} else {
		feedbackCircle.classList.remove("good");
		feedbackGood.classList.add("hidden");
		feedbackMedium.classList.add("hidden");
		feedbackBad.classList.remove("hidden");
		btRedo.classList.remove("hidden");
		btRedo.classList.add("pulseBrown");
		btSeeAgain.classList.remove("hidden");
		btDownload.classList.add("hidden");
		if(evaluation.percent>=50 && evaluation.percent<completionScore){
			scoreEl.style.color = "#ff9c00";
		} else {
			scoreEl.style.color = "#fd4d40";
		}
	}

	scoreEl.querySelector("p").innerHTML = evaluation.percent;

	$(btDownload).off().on(Constants.CLICK_TOUCH,download);
	$(btSeeAgain).off().on(Constants.CLICK_TOUCH,function(){
        sendToMenu({
            type: MessagesConstants.MENU_SHOW,
        });
    });
    $(btRedo).off().on(Constants.CLICK_TOUCH,function(){
        if(timeline.status=="normal"){
           evaluation.reset();
        } 
    });

	if(evaluation.percent>=completionScore){
		dataP.justFinished = true;
		navigation.isOn("next");
	}
}

function setQuestion(question){
	var s = question.s,
	ss = question.ss,
	questionEl = (question1.classList.contains("hidden")==true) ? question1 : question2;

	questionEl.querySelector("p").innerHTML = s;
	questionHelper.querySelector("p").innerHTML = ss;
	btValidate.classList.add("inactive");
	sentencesWrap.classList.remove("flexCenter");
	sentencesWrap.classList.remove("flexXEnd");

	if(typeof question.sentenceClass == "string"){
		sentencesWrap.classList.add(question.sentenceClass);
	} else {
		sentencesWrap.classList.add("flexCenter");
	}

	setGauge();

	if(question.choices){
		setChoices(question.choices);
	}
	else if(question.order){
		setOrder(question.order);
	}
	else if(question.drag){
		setDrag(question.drag);
	}
	else if(question.move){
		setMove(question.move);
	}
}

function setGauge(){
	var parent = gaugeDots[0].parentNode,
	currentEl = parent.querySelector(".current");

	if(currentEl){
		currentEl.classList.remove("current");
	}

	gaugeDots[evaluation.index].classList.add("current");
}

function setSVG(){
	var svgWrap = sections[2].querySelector("#Stage_svgWrap");
	if(svgWrap.children.length==0){
		svgWrap.innerHTML = "\
			<svg class='widthAll heightAll' viewBox='0 0 290 290' xmlns='http://www.w3.org/2000/svg' style='overflow:visible;'>\
				<circle cx='145' cy='145' r='140' stroke='#e8e8e8' fill='#FFF' stroke-width='10'></circle>\
				<circle id='svgCircle' transform='rotate(-90,140,140)' cx='145' cy='145' r='140' fill='none' stroke-width='10' stroke-dashoffset=0 style='transform-origin:50% 50%;transform:rotate(-90deg) scaleX(1)'></circle>\
			</svg>";
	}
	var percent = Math.round(evaluation.score/evaluation.max*100),
	c = Math.PI*(140*2),
	pct = ((100-evaluation.percent)/100)*c;
	svgWrap.querySelector("#svgCircle").setAttribute('stroke-dashoffset',pct);
	svgWrap.querySelector("#svgCircle").setAttribute('stroke-dasharray',c);

	if(evaluation.percent<50){
		svgWrap.querySelector("#svgCircle").setAttribute('stroke',"#fd4d40");
	}
	else if(evaluation.percent>=50 && evaluation.percent<80){
		svgWrap.querySelector("#svgCircle").setAttribute('stroke',"#ff9c00");
	} else {
		svgWrap.querySelector("#svgCircle").setAttribute('stroke',"#64d7a0");
	}
}

function setChoices(choices){
	var questionWrap = questionWraps[evaluation.index],
	choiceEls = questionWrap.querySelectorAll(".btChoice");
	for(var c=1; c<=choiceEls.length; c++){
		var choiceEl = choiceEls[c-1],
		p = choiceEl.querySelector("p");
		p.innerHTML = choices[c-1].text;
	}
	clique({
        datas:choices,
        buttons:choiceEls,
        btValidate:btValidate,
        onCustomClick:function(){
        	soundManager.play("click");
        },
        onEnd:function(correct){
            evaluation.validate({result:correct});
        },
        correctionAuto:true
    });	
}

function setOrder(order){
	var questionWrap = questionWraps[evaluation.index],
	orderEls = questionWrap.querySelectorAll(".order"),
	comps = [];

	function onDown(){
		soundManager.play("take");
	}

	function onMove(){
	  var overLapped = getOverlapped(this);

	  if(overLapped){
	  	var el = overLapped.element,
	    comp = comps[el.num-1],
	    temp = Object.assign({},comp.startPositions),
	    tempPos = el.pos;

	    comp.startPositions = Object.assign({},this.startPositions);
	    el.pos = this.element.pos;
	    this.startPositions = temp;
	    this.element.pos = tempPos;

	    el.style.left = comp.startPositions.left+"px";
	    el.style.top = comp.startPositions.top+"px";  
	  }  
	}

	function onUp(){
		soundManager.play("drop");
		this.element.style.left = this.startPositions.left+"px";
		this.element.style.top = this.startPositions.top+"px";
		btValidate.classList.remove("inactive");
	}

	function onCheck(){
		var count = 0;
		for(var o=1; o<=orderEls.length; o++){
			var orderEl = orderEls[o-1];
			if(orderEl.pos==orderEl.answer){
				count++;
			}
		}
		if(count==orderEls.length){
			return true;
		}
		return false;
	}

	function onEnd(){
		var check = onCheck();
		for(var c=1; c<=comps.length; c++){
            comps[c-1].dispose();
        }
		evaluation.validate({result:check});
	}

	function getOverlapped(current){
		for(var c=1; c<=comps.length; c++){
		    var comp = comps[c-1];
		    if(overLap(current.element,comp.element,"80%","y") && comp.element.id != current.element.id){
		      return comp;
		    }
		}
	}

	function getOrderByPos(pos){
	  for(var c=1; c<=comps.length; c++){
	    var comp = comps[c-1];
	    if(comp.element.pos==pos){
	      return comp;
	    }
	  }
	}

	for(var o=1; o<=orderEls.length; o++){
		var orderEl = orderEls[o-1];
		orderEl.num = o;
		orderEl.pos = o;
		orderEl.answer = order[o-1].answer;
		orderEl.querySelector("p").innerHTML = order[o-1].text;
		orderEl.style.cursor = "pointer";
		if(orderEl.posO==undefined){
			orderEl.posO = {
				x:orderEl.offsetLeft,
				y:orderEl.offsetTop
			}
		} else {
			orderEl.style.left = orderEl.posO.x+"px";
			orderEl.style.top = orderEl.posO.y+"px";
		}
		comps.push(new Movable({
          element:orderEl,
          customOnDown:onDown,
          customOnMove:onMove,
          customOnUp:onUp,
          limitXStart:orderEls[0].offsetLeft,
          limitXEnd:orderEls[0].offsetLeft,
          limitYStart:orderEls[0].offsetTop,
          limitYEnd:orderEls[orderEls.length-1].posO ? orderEls[orderEls.length-1].posO.y : orderEls[orderEls.length-1].offsetTop
        }));
	}

	$(btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,onEnd);
}

function setDrag(drag){
	var questionWrap = questionWraps[evaluation.index],
	dragEls = questionWrap.querySelectorAll(".drag"),
	dropEls = questionWrap.querySelectorAll(".drop"),
	answers = [];
	for(var d=1; d<=dragEls.length; d++){
		var dragEl = dragEls[d-1];
		if(dragEl.posO==undefined){
			dragEl.posO = {
				x:dragEl.offsetLeft,
				y:dragEl.offsetTop
			}
		} else {
			dragEl.style.left = dragEl.posO.x+"px";
			dragEl.style.top = dragEl.posO.y+"px";
		}
		dragEl.querySelector("p").innerHTML = drag[d-1].text;
		answers.push(drag[d-1].answer);
	}
	var dragExo = new DragDrop({
		drags:dragEls,
	    drops:dropEls,
	    answers:answers,
	    btValidate:btValidate,
	    classInactive:"inactive",
	    noCorrection:true,
	    onCustomDown:function(){
	    	soundManager.play("take");
	    },
	    onCustomUp:function(){
	    	soundManager.play("drop");
	    },
	    onEnd:function(){
	    	evaluation.validate({result:(dragExo.status=="passed"?true:false)});
	    },
	});
}

function setMove(move){
	var questionWrap = questionWraps[evaluation.index],
	btCursor = questionWrap.querySelector(".btCursor"),
	levelEl = questionWrap.querySelector(".level"),
	min = 297,
	max = 1261;

	function onDown(){
		soundManager.play("take");
	}

	function onMove(){
	  	var percent = ((btCursor.offsetLeft-min)/(max-min)*100);
	  	levelEl.style.width = percent+"%";
	}

	function onUp(){
		var percent = ((btCursor.offsetLeft-min)/(max-min)*100);
	  	levelEl.style.width = percent+"%";
		soundManager.play("drop");
		btValidate.classList.remove("inactive");
	}

	function onValidate(){
		var check = (btCursor.offsetLeft==973);
		console.log(check);
		evaluation.validate({result:check});	
	}

	if(btCursor.posO==undefined){
		btCursor.posO = {
			x:btCursor.offsetLeft,
			y:btCursor.offsetTop
		}
	} else {
		btCursor.style.left = btCursor.posO.x+"px";
		btCursor.style.top = btCursor.posO.y+"px";
	}
	levelEl.style.width = "0%";

	new Movable({
		element:btCursor,
		customOnDown:onDown,
		customOnMove:onMove,
		customOnUp:onUp,
		limitXStart:min,
		limitXEnd:max,
		limitYStart:btCursor.offsetTop,
		limitYEnd:btCursor.offsetTop,
		snapXValues:[385,583,778,973,1167]
	});

	$(btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,onValidate);
}

function download(){
	soundManager.play("click",true);
    var link = findWindowOwnerOf('print_attest',ofpWin);
    if(link){
    	link.print_attest();
    }
}