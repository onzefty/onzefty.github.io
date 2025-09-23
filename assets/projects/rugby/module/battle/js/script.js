let interactions = {};
let parts = {
    1: { title: "Battle", subparts: { 1: "" } }
}
const situation = {
    // 'sort' | 'battle' | 'customize'
    location:"home",
    disconnected:false,
    finished:false,
    searching:false,
    // 'asker' | 'receiver' | 'none'
    challenge: false,
    // 'waiting' | 'no' | 'refused' | 'asker' | 'receiver'
    rematch: false,
    timeout: false,
    // 'ready' | true
    ready:false,
    // 'solo' | 'vs'
    battling:false,
    // true | false
    chatting:false,
    isBusy:()=>situation.battling!=false||usersM.mode!="normal",
    isBattling:()=>situation.battling!=false,
    canSearch:()=>!situation.isBattling()&&situation.searching==false,
    canBeChallenged:()=>situation.canChallenge(),
    canChallenge:()=>situation.challenge==false&&situation.battle!="vs"&&situation.timeout==false
};
//Données de l'adversaire
let foeDatas = {};
//Tableau par défaut des valeurs de l'avatar écrasé dans le SCORM
const avatarDatasDefault = [1,0,0,0,2,3,1];
let avatarDatas = [1,0,0,0,2,3,1];
//Données par défaut d'une battle
let battleDefaultDatas = {
    mode:"solo",
    points:0,
    current:1,
    corrects:[null,null,null,null,null],
    time:20,
    id:null,
    nbCorrects:0,
    state:""
};
let battleDatas = {};
//Données de la question en cours
let questionDatas = {};
const questionsPicked = [];
let questionsTotal = 5;
const winningPoints = 10;
const bonusPoints = 50;
//Données du quiz
let quizDatas;


///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////     MAIN      //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// -> trigger tous les événements de la battle (customisation - boutons)
function mainEvents(){
    //Screen 1
    const customizeButton = sections[0].querySelector("#s1-button-customize");
    const sortButton = sections[0].querySelector("#s1-button-sort");
    const soloButton = sections[0].querySelector("#s1-button-play-solo");
    const vsButton = sections[0].querySelector("#s1-button-play-vs");
    const rewardsButton = sections[0].querySelector("#s1-button-rewards");
    const popupRewardsCloseButton =sections[0].querySelector("#s1-popup-rewards-button-close");
    //Battle
    const battleButtonOut = document.querySelector("#battle-button-out"); 
    const popupAcceptButton = document.querySelector("#popup-challenge-button-accept");
    const popupRefuseButton = document.querySelector("#popup-challenge-button-refuse");
    const popupChatAcceptButton = document.querySelector("#popup-chat-button-accept");
    const popupChatRefuseButton = document.querySelector("#popup-chat-button-refuse");
    // //TEMP FOR TESTING
    // const interactionsQuestionWrap = document.querySelector("#battle-interactions-question-wrap");
    // interactionsQuestionWrap.addEventListener(Constants.CLICK_TOUCH,function(){
    //     battleDatas.timer.stop();
    //     battleDatas.current++;
    //     battleSet();
    // });
    // //TEMP FOR TESTING
    //Customize
    const customizeButtonOut = document.querySelector("#customize-button-out");
    //Sort
    const sortButtonOut = document.querySelector("#sort-button-out");
    const sortButtonSwitch = document.querySelector("#sort-button-switch");
    const sortButtonSwitchLeft = sortButtonSwitch.querySelector("[side='left']");
    const sortButtonSwitchRight = sortButtonSwitch.querySelector("[side='right']");

    customizeButton.addEventListener(Constants.CLICK_TOUCH,function(){
        if(timeline.status=="normal"){
            situation.location = "customize";
            timeline.play("customize-in");
        }
    });

    sortButton.addEventListener(Constants.CLICK_TOUCH,function(){
        if(timeline.status=="normal"){
            situation.location = "sort";
            timeline.play("sort-in");
        }
    });

    soloButton.addEventListener(Constants.CLICK_TOUCH,function(){
        if(timeline.status=="normal"){
            window["_ui-123456"].app.setFreeToChat(false);
            sendToFooter({
                type: MessagesConstants.FOOTER_SHOW,
                status: "invisible"
            });
            if(usersM.status=="open"){
                usersM.close();
            }
            situation.location = "battle";
            situation.disconnected = false;
            timeline.play("battle-solo-in");
        }
    });

    vsButton.addEventListener(Constants.CLICK_TOUCH,function(){
        if(situation.canSearch()){
            situation.searching = true;
            situation.challenge = "asker";
            vsButton.setAttribute("mode","searching");
            window["_ui-123456"].app.getChallenger();
        }
    });

    rewardsButton.addEventListener(Constants.CLICK_TOUCH,function(){
        if(timeline.status=="normal"){
            timeline.play("popup-rewards-in");
        }
    });

    popupRewardsCloseButton.addEventListener(Constants.CLICK_TOUCH,function(){
        if(timeline.status=="normal"){
            timeline.play("popup-rewards-out");
        }
    });

    popupAcceptButton.addEventListener(Constants.CLICK_TOUCH,function(){
        //Battle solo en cours interrompue
        if(situation.battling=="solo"){
            battleInterrupted();
        }
        //Cas l'apprenant est déjà en mode battle (vs) et est relancé (son previous challenger a déco entre temps)
        else if(situation.location=="battle"){
            popup.hide();
        }
        challengeAccepted();
        window["_ui-123456"].app.acceptChallenge();
    });
    
    popupRefuseButton.addEventListener(Constants.CLICK_TOUCH,function(){
        window["_ui-123456"].app.declineChallenge();
        challengeRefused();
    });

    popupChatAcceptButton.addEventListener(Constants.CLICK_TOUCH,function(){
        window["_ui-123456"].app.acceptChat();
        popupChatHide();
        usersM.goToChat();
    });
    popupChatRefuseButton.addEventListener(Constants.CLICK_TOUCH,function(){
        window["_ui-123456"].app.declineChat();
        popupChatHide();
    });

    battleButtonOut.addEventListener(Constants.CLICK_TOUCH,function(){
        timeline.stopPlaying();
        battleInterrupted();
        sendToFooter({
            type: MessagesConstants.FOOTER_SHOW,
            status: "visible"
        });
        situation.location = "home";
        situation.battling = false;
        window["_ui-123456"].app.setFreeToChat(true);
        timeline.play({"battle-interactions-out":0,"battle-solo-out":500,"battle-scoring-out":0},true);
        popup.hide();
    });

    popup = new Popup({
        element:document.querySelector("#battle-popup-wrap")
    });

    customizeButtonOut.addEventListener(Constants.CLICK_TOUCH,function(){
        if(timeline.status=="normal"){
            situation.location = "home";
            timeline.play("customize-out");
        }
    });

    sortButtonOut.addEventListener(Constants.CLICK_TOUCH,function(){
        if(timeline.status=="normal"){
            situation.location = "home";
            timeline.play("sort-out");
        }
    });

    sortButtonSwitchLeft.addEventListener(Constants.CLICK_TOUCH,sortSwitch);
    sortButtonSwitchRight.addEventListener(Constants.CLICK_TOUCH,sortSwitch);

    if(ofp.state.from!=null){
        situation.challenge = "receiver";
        ofp.setState({from:null});
        window["_ui-123456"].app.handlers.onGameWaitingForPlayers();
    }
    
}

///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////    BATTLE     //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

const cubics = {
    "right": [
        [[367,541],[12,323],[108,38],[367,20]],
        [[367,541],[109,340],[133,23],[315,90]],
        [[367,541],[279,472],[222,145],[365,75]],
        [[367,541],[532,464],[735,43],[365,75]],
        [[367,541],[546,82],[442,-1],[310,40]],
        [[367,541],[912,177],[743,48],[400,80]],
        [[367,541],[209,112],[318,-14],[400,80]],
        [[367,541],[408,418],[664,182],[350,30]],
        [[367,541],[252,318],[199,179],[350,30]],
        [[367,541],[566,383],[568,-3],[311,111]]
    ],
    "wrong": [
        [[367,541],[566,383],[568,-3],[191,111]],
        [[367,541],[741,273],[653,34],[501,101]],
        [[367,541],[121,354],[261,8],[501,101]],
        [[367,541],[440,407],[543,-12],[462,66]],
        [[367,541],[130,-2],[273,-106],[462,66]],
        [[367,541],[522,2],[349,-158],[241,4]],
        [[367,541],[88,321],[140,5],[241,4]],
        [[367,541],[-14,44],[492,-306],[641,160]],
        [[367,541],[384,113],[492,-306],[641,160]],
        [[367,541],[517,65],[249,-155],[138,48]]
    ]
}

function battleInit(options){
    if(!options){
        options = {};
    }
    battleDatas = Object.assign({},battleDefaultDatas,options);
    battleDatas.corrects = [null,null,null,null,null];
    situation.finished = false;
    const battleScoringWrapEl = document.querySelector("#battle-scoring-wrap");
    battleScoringWrapEl.setAttribute("mode",battleDatas.mode);
    document.querySelector("#chat-wrap").classList.add("unavailable");
    battleRender();
}

function battleRender(){
    const battleEl = document.querySelector("#battle");
    //Player
    const battlePlayerEl = battleEl.querySelector("#battle-player");
    const battlePlayerAvatarEl = battlePlayerEl.querySelector("#battle-player-avatar");
    const battlePlayerNameEl = battlePlayerEl.querySelector("#battle-player-name");
    const battlePlayerCorrectEls = battlePlayerEl.querySelectorAll(".battle-correct");
    const battlePlayerLevelEl = battlePlayerEl.querySelector(".battle-gauge-level").querySelector("p");
    //Foe
    const battleFoeEl = battleEl.querySelector("#battle-foe");
    const battleFoeAvatarEl = battleFoeEl.querySelector("#battle-foe-avatar");
    const battleFoeNameEl = battleFoeEl.querySelector("#battle-foe-name");
    const battleFoeCorrectEls = battleFoeEl.querySelectorAll(".battle-correct");
    const battleFoeLevelEl = battleFoeEl.querySelector(".battle-gauge-level").querySelector("p");

    battlePlayerNameEl.innerHTML = ofp.getUser().pseudo;
    battlePlayerLevelEl.innerHTML = level;
    avatarUpdate(battlePlayerAvatarEl,avatarDatas);

    if(battleDatas.mode=="vs"){
        battleFoeNameEl.innerHTML = foeDatas.pseudo;
        battleFoeLevelEl.innerHTML = foeDatas.level;
        avatarUpdate(battleFoeAvatarEl,foeDatas.avatarDatas);
        battleGaugeUpdate(battlePlayerCorrectEls,battleDatas.corrects);
        battleGaugeUpdate(battleFoeCorrectEls,foeDatas.corrects);
    } 
}

function battleSet(){
    questionGet(battleDatas.id);
    questionRender();
}

function battleStart(){
    situation.battling = battleDatas.mode;
    battleDatas.state = "";
    battleDatas.nbCorrects = 0;
    const battleInteractionsEl = document.getElementById("battle-interactions");
    battleInteractionsEl.classList.remove("noEvents");
    //TEMP FOR TESTING
    // if(situation.battling=="solo"){
    //     questionsTotal = quizDatas.questions.length;
    // }
    //TEMP FOR TESTING
    if(situation.battling=="vs"){
        if (ofp.getStatus() == 'i') {
            ofp.setStatus('c');
            save(true);
        }
    }
    battleDatas.timer.start();
}

function battleEnd(correct){
    battleInterrupted();
    battleDatas.corrects[battleDatas.current-1] = correct;
    if(correct==true){
        battleDatas.points += winningPoints;
    }
    var obj = {};
    let stepName = correct==true? "battle-scoring-right" : "battle-scoring-wrong";
    obj[stepName] = 1500;
    if(battleDatas.mode=="vs"){
        battleDatas.current++;
        if(timeline.status=="normal"){
            timeline.play(obj);
        }
    } else {
        obj["battle-scoring-out"] = 5000;
        if(battleDatas.current < questionsTotal){
            battleDatas.current++;
            obj["battle-resume-in"] = 6000;
            if(timeline.status=="normal"){
                timeline.play(obj);
            }
        } else {
            situation.finished = true;
			situation.battling = false;
            if(timeline.status=="normal"){
                timeline.play(obj);
            }
            setTimeout(function(){
                popup.show();
            },5000);
            
        }    
    }
}

function battleInterrupted(){
    battleDatas.timer.stop();
    situation.battling = false;
    const battleInteractionsEl = document.getElementById("battle-interactions");
    battleInteractionsEl.classList.add("noEvents");
    if(situation.disconnected==true){
        timeline.play({"battle-interactions-out":0,"battle-scoring-out":0},true);
    }
    
}

function battleShowAnimations(which){
    const battleBall = document.getElementById("battle-ball");
    const cubic = cubics[which][Math.floor(Math.random()*cubics[which].length)];
    animate({
        element:battleBall,
        duration:800,
        easing:"outExpo",
        properties:{
            left:cubic[cubic.length-1][0]+"px",
            top:cubic[cubic.length-1][1]+"px",
        },
        end:function(){
            if(battleDatas.mode=="solo"){
                const battlePlayerCorrectEls = document.querySelector("#battle-player").querySelectorAll(".battle-correct");
                battleGaugeUpdate(battlePlayerCorrectEls,battleDatas.corrects);    
            }
            battleBall.classList.add("kicked");
        },
        cubic:cubic
    });
    animate({
        element:battleBall.querySelector("img"),
        duration:800,
        properties:{
            rotate:200,
            scaleX:0.3,
            scaleY:0.3
        }
    });
    document.getElementById("battle-base").classList.add("kicked");
}

function battleGaugeUpdate(els,tab){
    for(var e=1; e<=els.length; e++){
        var el = els[e-1];
        if(tab[e-1]==true){
            el.classList.add("full");
        } else {
            el.classList.remove("full");
        }
    }
    const currentEl = els[0].parentNode.querySelector(".current");
    if(currentEl){
        currentEl.classList.remove("current");
    }
    const newCurrentEl = els[battleDatas.current-1];
    if(newCurrentEl){
        newCurrentEl.classList.add("current");
    }
    
}


///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   QUESTIONS    //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function questionGet(id){
    if(typeof id != "number"){
        //Au hasard
        id = questionPickIdRandom();
        // //TEMP FOR TESTING
        // id = battleDatas.current;
        // //TEMP FOR TESTING
    }
    var datas = quizDatas.questions.filter(function(q){ if(q.id==id){return q}})[0];
    questionDatas = Object.assign({},datas);
    //Randomize des proposals
    questionDatas.proposals = cUtils.a.shuffle(questionDatas.proposals);
}

function questionRender(){
    const battleEl = document.querySelector("#battle");
    const battleTimerWrapEl = battleEl.querySelector("#battle-timer-wrap");
    const battleTimerContentEl = battleEl.querySelector("#battle-timer-wrap-content");
    const battleTimerContainer = battleTimerWrapEl.querySelector("#battle-timer-container");
    const battleImgEl = battleEl.querySelector("#battle-question-img");
    const battleTxtEl = battleEl.querySelector("#battle-question-txt");
    const battleClickableEls = battleEl.querySelectorAll(".clickable");
    //Player
    const battlePlayerEl = battleEl.querySelector("#battle-player");
    const battlePlayerCorrectEls = battlePlayerEl.querySelectorAll(".battle-correct");
    //Foe
    const battleFoeEl = battleEl.querySelector("#battle-foe");
    const battleFoeCorrectEls = battleFoeEl.querySelectorAll(".battle-correct");

    battleGaugeUpdate(battlePlayerCorrectEls,battleDatas.corrects);
    battleTxtEl.innerHTML = questionDatas.wording.text;
    const picture = questionDatas.wording.picture;
    if(typeof picture == "string" && picture.indexOf("-img")!=-1){
        battleImgEl.src = "imgs/questions/"+picture+".png";
    } else {
        const int = cUts.n.getRandomInt(1,5);
        battleImgEl.src = "imgs/questions/q-default-"+int+".png";
    }
    //Image here when done
    battleTimerContentEl.classList.remove("nearEnd");
    battleDatas.timer = new PieTimer(battleTimerContainer,{
        duration:battleDatas.time,
        steps:[],
        handlers: {
            onTick: function (values) {
                var percent = Math.floor(values.seconds/battleDatas.time*100);
                if(percent<=30){
                    battleTimerContentEl.classList.add("nearEnd");
                }
            },
            onComplete: function () {
                battleTimerContentEl.classList.remove("nearEnd");
                battleDatas.interaction.correction();
            }
        }
    });

    for(var c=1; c<=battleClickableEls.length; c++){
        var battleClickableEl = battleClickableEls[c-1];
        battleClickableEl.querySelector("p").innerHTML = questionDatas.proposals[c-1].text;
        questionDatas.proposals[c-1].answer = questionDatas.proposals[c-1].correct;
    }

    battleDatas.interaction = new Clickables({
        datas: questionDatas.proposals,
        buttons: battleClickableEls,
        wrongAttemptEl: null,
        cbEnd: function (correct) {
            battleEnd(correct==1?true:false);
        },
        cbCorrection: function () { },
        cbClicked: function () { },
    })

    if(battleDatas.mode=="vs"){
        battleGaugeUpdate(battleFoeCorrectEls,foeDatas.corrects);
    }
    
}

function questionPickIdRandom(){
    var id = cUtils.n.getRandomInt(1,quizDatas.questions.length);
    if(questionsPicked.indexOf(id)==-1){
        questionsPicked.push(id);
        return id;
    } else {
        return questionPickIdRandom();
    }
}

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////     POPUPS     //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

let popup;

class Popup{
    constructor(props){
        var defaultOptions = {
            element: document.createElement("div")
        }
        this.options = Object.assign(defaultOptions, props);
        this.els = {
            "getReadyEl":this.options.element.querySelector("#battle-popup-get-ready-wrap"),
            "readyEl":this.options.element.querySelector("#battle-popup-ready-wrap"),
            "pointsEl":this.options.element.querySelector("#battle-popup-points-wrap"),
            "levelEl":this.options.element.querySelector("#battle-popup-level-wrap"),
            "unlockEl":this.options.element.querySelector("#battle-popup-unlock-wrap"),
            "ballEl":this.options.element.querySelector("#battle-popup-level-ball"),
            "timeOutEl":this.options.element.querySelector("#battle-popup-time-out-wrap"),
            "logoutEl":this.options.element.querySelector("#battle-popup-logout-wrap"),
            "waitingEl":this.options.element.querySelector("#battle-popup-waiting-wrap"),
            "rematchEl":this.options.element.querySelector("#battle-popup-rematch-wrap"),
            "rematchNoEl":this.options.element.querySelector("#battle-popup-rematch-no-wrap"),
            "rematchUnansweredEl":this.options.element.querySelector("#battle-popup-rematch-unanswered-wrap"),
            "noneEl":this.options.element.querySelector("#battle-popup-none-wrap"),
            "searchingEl":this.options.element.querySelector("#battle-popup-searching-wrap"),
            "buttonGo":this.options.element.querySelector("#battle-popup-button-go"),
            "buttonRedo":this.options.element.querySelector("#battle-popup-button-redo"),
            "buttonAccept":this.options.element.querySelector("#battle-popup-button-accept"),
            "buttonRefuse":this.options.element.querySelector("#battle-popup-button-refuse"),
            "buttonChallengeAgain":this.options.element.querySelector("#battle-popup-button-challenge-again"),
            "buttonChallengeOther":this.options.element.querySelector("#battle-popup-button-challenge-other"),
            "buttonQuit":this.options.element.querySelector("#battle-popup-button-quit")
        }
        this.init();
    }

    show(){
        this.render();
        timeline.play("battle-popup-in",true,true);
    }

    hide(){
        timeline.play("battle-popup-out",true,true);
    }

    render(){
        for(var e in this.els){
            this.els[e].classList.add("hidden");
        }
        //Reset les éléments du changement de niveau (cas déconnexion / changement)
        timeline.steps["battle-popup-level-up"].reset();
        if(situation.disconnected==true){
            this.els["logoutEl"].classList.remove("hidden");
            this.els["buttonChallengeOther"].classList.remove("hidden");
            this.els["buttonQuit"].classList.remove("hidden");
        } else {
            //Pour être prêt
            if(situation.ready=="get"){
                this.els["getReadyEl"].classList.remove("hidden");
                this.els["buttonGo"].classList.remove("hidden");
            }
            //Prêt ! En attente de l'autre joueur
            else if(situation.ready==true){
                this.els["readyEl"].classList.remove("hidden");
            }
            //En attente d'une demande de revanche
            else if(situation.rematch=="waiting"){
                this.els["waitingEl"].classList.remove("hidden");
            }
            //Réponse à une demande de revanche
            else if(situation.rematch=="receiver"){
                this.els["rematchEl"].classList.remove("hidden");
                this.els["buttonAccept"].classList.remove("hidden");
                this.els["buttonRefuse"].classList.remove("hidden");
            }
            //Demande de revanche non répondue
            else if(situation.rematch=="no"){
                this.els["rematchNoEl"].classList.remove("hidden");
                this.els["buttonChallengeAgain"].classList.remove("hidden");
                this.els["buttonChallengeOther"].classList.remove("hidden");
                this.els["buttonQuit"].classList.remove("hidden");
            }
            //Demande de revanche non répondue (receiver)
            else if(situation.rematch=="unanswered"){
                this.els["rematchUnansweredEl"].classList.remove("hidden");
                this.els["buttonChallengeAgain"].classList.remove("hidden");
                this.els["buttonChallengeOther"].classList.remove("hidden");
                this.els["buttonQuit"].classList.remove("hidden");
            }
            //Demande de revanche refusée
            else if(situation.rematch=="refused"){
                situation.rematch = false;
                this.els["rematchNoEl"].classList.remove("hidden");
                this.els["buttonChallengeOther"].classList.remove("hidden");
                this.els["buttonQuit"].classList.remove("hidden");
            }
            //En attente d'une demande de revanche
            else if(situation.searching==true){
                this.els["searchingEl"].classList.remove("hidden");
            }
            //Aucun challenger trouvé lors d'une nouvelle recherche
            else if(situation.challenge=="none"){
                situation.challenge = false;
                this.els["noneEl"].classList.remove("hidden");
                this.els["buttonChallengeOther"].classList.remove("hidden");
                this.els["buttonQuit"].classList.remove("hidden");
            }
            //Battle terminée
            else if(situation.finished==true){
                this.els["pointsEl"].classList.remove("hidden");
                const pointsResultEl = this.els["pointsEl"].querySelector("#battle-popup-result-txt");
                const pointsResultWrapEl = this.els["pointsEl"].querySelector("#battle-popup-result-wrap");
                const pointsTxtEl = this.els["pointsEl"].querySelector("#battle-popup-points-txt");
                if(battleDatas.mode=="vs"){
                    this.els["buttonChallengeAgain"].classList.remove("hidden");
                    this.els["buttonChallengeOther"].classList.remove("hidden");
                    this.els["buttonQuit"].classList.remove("hidden");
                    if(battleDatas.points==0){
                        pointsResultEl.innerHTML = "Aucun point de gagné.";
                        pointsResultWrapEl.classList.add("hidden");
                    } else {
                        pointsResultEl.innerHTML = "Gagné !";
                        pointsResultWrapEl.classList.remove("hidden");
                    }
                } else {
                    this.els["buttonRedo"].classList.remove("hidden");
                    this.els["buttonQuit"].classList.remove("hidden");
                }
                
                //Scores mis à jour
                let points = 0;
                if(battleDatas.state!=""){
                    const state = battleDatas.state;
                    pointsResultEl.innerHTML = (state=="winner") ? "Gagné !" : state=="loser" ? "Perdu..." : "Égalité !";
                }
                
                points += battleDatas.points;
                pointsResultWrapEl.classList.remove("hidden");
                //Points bonus en mode vs
                if(battleDatas.mode=="vs"){
                    if(battleDatas.state=="draw"){
                        if(battleDatas.responseTime<foeDatas.responseTime){
                            points+=bonusPoints;
                        }
                    }
                    else if(battleDatas.state=="winner"){
                        points+=bonusPoints;
                    }
                }
                pointsTxtEl.innerHTML = points + " points";
                console.log("VALUE CALLED");
                window["_ui-123456"].app.value(points,battleDatas.mode);
                score+=points;
                //Niveau du challenger
                let levelO = level;
                level = getLevelByScore();
                if(level>levelO){
                    this.els["levelEl"].classList.remove("hidden");
                    this.els["levelEl"].querySelector("#battle-popup-level-previous").querySelector("p").innerHTML = levelO;
                    this.els["levelEl"].querySelector("#battle-popup-level-new").querySelector("p").innerHTML = level;
                    this.els["unlockEl"].classList.remove("hidden");
                    const itemNew = getItemByLevel(level);
                    if(itemNew){
                        this.els["unlockEl"].querySelector(".unlocked").src = "imgs/avatar/"+itemNew.type+"/"+itemNew.item.src+".png";
                    }
                    timeline.play({"battle-popup-level-up":1500},true,true);
                }
            }
            
        }
    }

    init(){
        const self = this;

        this.els["buttonGo"].addEventListener(Constants.CLICK_TOUCH,function(){
            situation.ready = true;
            window["_ui-123456"].app.readyToPlay();
            self.render();
        });

        this.els["buttonChallengeAgain"].addEventListener(Constants.CLICK_TOUCH,function(){
            situation.finished = false;
            situation.challenge = false;
            situation.rematch = "waiting";
            self.render();
            window["_ui-123456"].app.playNewGameWithChallenger();
        });
    
        this.els["buttonChallengeOther"].addEventListener(Constants.CLICK_TOUCH,function(){
            situation.finished = false;
            situation.challenge = "asker";
            situation.rematch = false;
            situation.searching = true;
            self.render();
            window["_ui-123456"].app.disconnectFromChallenger();
            window["_ui-123456"].app.getChallenger();
        });

        this.els["buttonQuit"].addEventListener(Constants.CLICK_TOUCH,function(){
            if(timeline.status=="normal"){
                window["_ui-123456"].app.disconnectFromChallenger();
                sendToFooter({
                    type: MessagesConstants.FOOTER_SHOW,
                    status: "visible"
                });
                situation.location = "home";
                situation.battling = false;
                situation.finished = false;
                situation.disconnected = false;
                window["_ui-123456"].app.setFreeToChat(true);
                timeline.play({"battle-solo-out":500});
                self.hide();
            }
        });
    
        this.els["buttonRedo"].addEventListener(Constants.CLICK_TOUCH,function(){
            if(timeline.status=="normal"){
                situation.finished = false;
                timeline.play({"battle-solo-in":1200});
                self.hide();
            }
        });

        this.els["buttonAccept"].addEventListener(Constants.CLICK_TOUCH,function(){
            situation.rematch = false;
            window["_ui-123456"].app.acceptGameProposal();
            self.hide();
        });

        this.els["buttonRefuse"].addEventListener(Constants.CLICK_TOUCH,function(){
            //situation.rematch = false;
            window["_ui-123456"].app.declineGameProposal();
            window["_ui-123456"].app.disconnectFromChallenger();
            situation.disconnected = false;
            popup.render();
        });
    }
}

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// CUSTOMIZATION //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

const swipables = {};

// -> met à jour les tableaux des items selon les points du player
function customizationUpdateItems(tab){
    if(isBattleEnded()){
        return tab;
    }
    return tab.filter((t) => level>=t.level);
}

// -> initialise les swipes des éléments customisables ainsi que l'avatar
function customizationInit(){
    const customizeEl = document.querySelector("#customize");
    const idEl = customizeEl.querySelector("#customize-user-id");
    const levelEl = customizeEl.querySelector("#customize-user-level");
    const swipablesEls = customizeEl.querySelectorAll(".swipables");
    const avatarEl = customizeEl.querySelector("#customize-avatar");
    const paletteSkin = customizeEl.querySelector("#customize-skin-palette");
    const skinColorEls = paletteSkin.querySelectorAll(".palette-color");
    const paletteShoes = customizeEl.querySelector("#customize-shoes-palette");
    const shoesColorEls = paletteShoes.querySelectorAll(".palette-color");
    const btValidate = customizeEl.querySelector("#customize-button-validate");

    idEl.innerHTML = ofp.getUser().pseudo;
    levelEl.querySelector("p").innerHTML = level;

    //Swipables
    for(var s=1; s<=swipablesEls.length; s++){
        var swipablesEl = swipablesEls[s-1],
        type = swipablesEl.getAttribute("type");
        if(!swipables[type]){
            swipables[type] = {
                element:swipablesEl,
                type:type,
                index:parseInt(avatarDatas[itemsOrder.indexOf(type)]),
                render:customizationRender,
                swipe:customizationSwipe
            }
            swipables[type].wheel = new WheelManager({
                receiver:swipablesEl,
                cbWheel:swipables[type].swipe.bind(swipables[type])
            })    
        }
        swipables[type].render();
    }

    //Palettes
    for(var s=1; s<=skinColorEls.length; s++){
        var skinColorEl = skinColorEls[s-1],
        index = skinColorEl.getAttribute("index");
        //TEMP
        if(avatarDatas[0]==parseInt(index)){
            skinColorEl.classList.add("selected");
        }
        skinColorEl.addEventListener(Constants.CLICK_TOUCH,function(){
            var mainIndex = itemsOrder.indexOf(this.getAttribute("type")),
            selectedEl = paletteSkin.querySelector(".selected");
            if(selectedEl){
                selectedEl.classList.remove("selected");
            }
            this.classList.add("selected");
            avatarDatas[mainIndex] = this.getAttribute("index");
            avatarUpdate(avatarEl,avatarDatas);
        });
    }

    for(var sh=1; sh<=shoesColorEls.length; sh++){
        var shoesColorEl = shoesColorEls[sh-1],
        index = shoesColorEl.getAttribute("index");
        if(avatarDatas[6]==parseInt(index)){
            shoesColorEl.classList.add("selected");
        }
        shoesColorEl.addEventListener(Constants.CLICK_TOUCH,function(){
            var mainIndex = itemsOrder.indexOf(this.getAttribute("type")),
            selectedEl = paletteShoes.querySelector(".selected");
            if(selectedEl){
                selectedEl.classList.remove("selected");
            }
            this.classList.add("selected");
            avatarDatas[mainIndex] = this.getAttribute("index");
            avatarUpdate(avatarEl,avatarDatas);
        });
    }
    
    //Bouton valider
    btValidate.addEventListener(Constants.CLICK_TOUCH,customizationValidate);

    //Avatar
    avatarUpdate(avatarEl,avatarDatas);
    //Si première fois, on stocke les valeurs par défaut dans le scorm
    if(!Array.isArray(scorm.parsedDatas[scorm.parsedDatas.length-1][3])){
        scorm.parsedDatas[scorm.parsedDatas.length-1][3] = avatarDatasDefault;
        sendToMenu({
            avatarDatas:scorm.parsedDatas[scorm.parsedDatas.length-1][3]
        });
        window["_ui-123456"].app.setUserData('avatarDatas',avatarDatas);
        save(true);
    }
}

// -> met à jour les items dans les swipables
function customizationRender(){
    var itemsTab = customizationUpdateItems(items[this.type]),
    levelsEls = this.element.querySelectorAll(".swipable-el");
    const customizeEl = document.querySelector("#customize");
    const avatarEl = customizeEl.querySelector("#customize-avatar");
    for(var l=1; l<=levelsEls.length; l++){
        var levelsEl = levelsEls[l-1],
        level = parseInt(levelsEl.getAttribute("level")),
        index = (this.index+level);
        if(index<0){
            index = (itemsTab.length-1)+(index+1);
        }
        if(index>=itemsTab.length){
            index = index-itemsTab.length;
        }
        levelsEl.querySelector("img").src = "imgs/avatar/"+this.type+"/"+itemsTab[index].src+".png";
        levelsEl.querySelector("img").className = "customize-item-el-"+this.type;
    }
    var mainIndex = itemsOrder.indexOf(this.type);
    avatarDatas[mainIndex] = this.index;
    avatarUpdate(avatarEl,avatarDatas);
}

// -> swipe les items dans les swipables
function customizationSwipe(dir){
    var itemsTab = customizationUpdateItems(items[this.type]),
    levelsEls = this.element.querySelectorAll(".swipable-el");
    if(dir>0){
        this.index = ((this.index+1)>(itemsTab.length-1)) ? 0 : this.index+1;
    } else {
        this.index = ((this.index-1)<0) ? (itemsTab.length-1) : this.index-1;
    }
    for(var l=1; l<=levelsEls.length; l++){
        var levelsEl = levelsEls[l-1],
        level = parseInt(levelsEl.getAttribute("level"));
        level = (dir>0) ? level-1 : level+1;
        if(level<-3){
            level = 3;
        }
        if(level>3){
            level = -3;
        }
        levelsEl.setAttribute("level",level);
    }
    this.render();
}

// -> sauvegarde les changements de la customisation
function customizationSave(){
    scorm.parsedDatas[scorm.parsedDatas.length-1][3] = avatarDatas;
    sendToMenu({
        avatarDatas:scorm.parsedDatas[scorm.parsedDatas.length-1][3]
    });
    window["_ui-123456"].app.setUserData('avatarDatas',avatarDatas);
    save(true);
}

// -> valide les changements de la customisation, sauvegarde, et retour à l'écran d'accueil
function customizationValidate(){
    customizationSave();
    if(timeline.status=="normal"){
        situation.location = "home";
        timeline.play("customize-out");
    }
}

// -> met à jour un élément d'avatar (dans la customisation ou dans les battles)
function avatarUpdate(el,datas){
    if(!datas){
        return;
    }
    const parts = [
        el.querySelector(".avatar-chest"),
        el.querySelector(".avatar-hair"),
        el.querySelector(".avatar-eyes"),
        el.querySelector(".avatar-mouth"),
        el.querySelector(".avatar-tee-shirt"),
        el.querySelector(".avatar-pants"),
        el.querySelector(".avatar-shoes") 
    ];
    
    let no = [];

    for(var o=1; o<=itemsOrder.length; o++){
        const itemDatas = items[itemsOrder[o-1]][datas[o-1]];
        parts[o-1].setAttribute("type",datas[o-1]);
        parts[o-1].src = "imgs/avatar/"+itemsOrder[o-1]+"/"+itemDatas.src+".png";
        if(itemDatas.no){
            const itNo = !Array.isArray(itemDatas.no)?[itemDatas.no]:itemDatas.no;
            no = no.concat(itNo);
        }
        if(el.getAttribute(itemsOrder[o-1])){
            el.removeAttribute(itemsOrder[o-1]);
        }
    }

    itemsOrder.forEach(function(it){
        if(el.getAttribute(it)){
            el.removeAttribute(it);
        }
    });

    if(no.length > 0){
        no.forEach(function(n){
            el.setAttribute(n,"no");
        });
    }
}

// -> Moteur gestionnaire du scroll de la souris (ou swipe sur mobile)
class WheelManager {
    constructor(props){
        var defaultOptions = {
            receiver: window,
            current: null,
            direction: "*",
            rewind: false,
            cbWheel: function () { }
        }
        this.options = Object.assign(defaultOptions, props);
        this.current = typeof this.options.current == "number" ? this.options.current : 0;
        this.handleWheel = this.onWheel.bind(this);
        this.handleTouchStart = this.onTouchStart.bind(this);
        this.handleTouchMove = this.onTouchMove.bind(this);
        this.active = true;
        this.startPosX;
        this.startPosY;

        this.addEvents();    
    }
    onWheel(e) {
        if (this.active == false) {
            return;
        }
        var condition = typeof this.options.direction == "number" ? (this.options.direction > 0) ? (e.deltaY > 0) : (e.deltaY < 0) : true;
        if (condition == true) {
            this.current = this.options.rewind == true && (e.deltaY < 0) ? this.current - 1 : this.current + 1;
            this.options.cbWheel(e.deltaY>0?1:-1);
        }
    }
    onTouchStart(e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        this.startPosX = event.clientX;
        this.startPosY = event.clientY;
    }
    onTouchMove(e) {
        if (this.active == false) {
            return;
        }
        if (!this.startPosX || !this.startPosY) {
            return;
        }

        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        var xUp = event.clientX;
        var yUp = event.clientY;

        var xDiff = this.startPosX - xUp;
        var yDiff = this.startPosY - yUp;

        var condition = typeof this.options.direction == "number" ? (this.options.direction > 0) ? (yDiff < 0) : (yDiff > 0) : true;

        if (condition) {
            this.current = this.options.rewind == true && (yDiff > 0) ? this.current - 1 : this.current + 1;
            this.options.cbWheel(yDiff>0?1:-1);
        }
        /*
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {most significant
            if ( xDiff > 0 ) {
                //right swipe 
            } else {
                //left swipe
            }                       
        } else {
            if ( yDiff > 0 ) {
                //down swipe 
            } else { 
                //up swipe
            }                                                                 
        }
        */
        this.startPosX = null;
        this.startPosY = null;
    }
    addEvents() {
        this.options.receiver.addEventListener(Constants.DOWN_TOUCHSTART, this.handleTouchStart);
        this.options.receiver.addEventListener(Constants.MOVE_TOUCHMOVE, this.handleTouchMove);
        this.options.receiver.addEventListener("wheel", this.handleWheel);
    }
    removeEvents() {
        this.options.receiver.removeEventListener(Constants.DOWN_TOUCHSTART, this.handleTouchStart);
        this.options.receiver.removeEventListener(Constants.MOVE_TOUCHMOVE, this.handleTouchMove);
        this.options.receiver.removeEventListener("wheel", this.handleWheel);
    }
    desactivate() {
        this.active = false;
    }
    activate() {
        this.active = true;
    }   
}

///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////      SORT     //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

let scrollable;
let sortType = "general";
const sortTypes = ["general","site","sites"];

function sortInit(){
    const sortEl = document.querySelector("#sort");
    const sortNameTxt = sortEl.querySelector("#sort-name");
    const sortAvatarEl = sortEl.querySelector("#sort-avatar");
    const sortListEl = sortEl.querySelector("#sort-list");
    const sortScrollEl = sortEl.querySelector("#sort-list-cursor");
    const levelEl = sortEl.querySelector("#sort-level");
    sortNameTxt.innerHTML = ofp.getUser().pseudo;
    levelEl.querySelector("p").innerHTML = level;

    avatarUpdate(sortAvatarEl,avatarDatas);

    if(!scrollable){
        scrollable = new Scrollable({
            scrollable:sortListEl,
            cursor:sortScrollEl
       });
    } else {
        scrollable.reset();
    }

    const txt = sortType=="general"?"National":sortType=="site"?"Site":"Sites";
    const ftc = sortType=="general"?"getRanking":sortType=="site"?"getSiteRanking":"getSitesRanking";
    const param = sortType=="general"?null:sortType=="site"?ofp.getUser().site:null;
    window["_ui-123456"].api[ftc](param)
        .then(function (response) {
            sortRender(response);
        });
}

function sortRender(datas){
    const sortEl = document.querySelector("#sort");
    const sortLeftEl = sortEl.querySelector("#sort-list-left");
    const sortSwitchTxt = sortEl.querySelector("#sort-button-switch-txt");
    const sortListYouEl = sortEl.querySelector("#sort-list-you");
    const sortListEl = sortEl.querySelector("#sort-list");
    const sortListItems = sortListEl.querySelectorAll(".sort-list-item");
    let notYou =  sortType=="sites" ? true : false;
    sortLeftEl.setAttribute("type",sortType);
    switch(sortType){
        default:
            for(var i=1; i<=sortListItems.length; i++){
                const sortListItem = sortListItems[i-1];
                const player = datas.result[i-1];
                if(player){
                    sortListItem.classList.remove("hidden");
                    if(player.identifier==ofp.getUser().identifier){
                        notYou = true;
                    }
                    sortItemRender(sortListItem,player,player.identifier==ofp.getUser().identifier);
                    
                } else {
                    sortListItem.classList.add("hidden");
                }
            }
            if(notYou){
                sortListYouEl.classList.add("hidden");
            } else {
                window["_ui-123456"].api.getUserRanking(window["_ui-123456"].user.identifier)
					.then(function (resp) {
                        if (resp.result.length) {
                            sortListYouEl.classList.remove("hidden");
                            sortItemRender(sortListYouEl,resp.result[0]);
                        }
                    })
            }
        
        break;
    }
    sortListEl.style.transform = "translateY(0px)";
    scrollable.reset();
}

function sortItemRender(el,datas,you){
    const nameEl = el.querySelector(".name");
    const rankEl = el.querySelector(".rank");
    const photoEl = el.querySelector(".photo img");
    const siteEl = el.querySelector(".site");
    const scoreEl = el.querySelector(".score");
    const arrowEl = el.querySelector(".arrow");
    if(nameEl){
        nameEl.innerHTML = sortType=="sites" ? datas.site : datas.pseudo;
    }
    photoEl.src = `/apprenant/photo.php?guid=${datas.identifier}`;
    rankEl.innerHTML = datas.rank;
    siteEl.innerHTML = sortType=="sites" ? "" : datas.site;
    scoreEl.innerHTML = datas.total ? datas.total+" pts." : datas.score+" pts.";
    
    let rankAttribute = 'same';
    if(datas.previousRank != null){
        rankAttribute = datas.rank < datas.previousRank
            ? 'up'
            : (datas.rank > datas.previousRank ? 'down' : 'same');
    }
    el.setAttribute('rank', rankAttribute);

    if(you){
        el.setAttribute("type","blue");
    } else {
        el.removeAttribute("type");
    }
}

function sortSwitch(){
    const sortButtonSwitch = document.querySelector("#sort-button-switch");
    const sortButtonSwitchTxt = sortButtonSwitch.querySelector("#sort-button-switch-txt");
    const side = this.getAttribute("side");
    const index = sortTypes.indexOf(sortType);
    const value = side=="left" ? index-1 : index+1;
    const newIndex = value==sortTypes.length ? 0 : value<0 ? (sortTypes.length-1) : value;
    sortType = sortTypes[newIndex];
    const txt = sortType=="general"?"National":sortType=="site"?"Site":"Sites";
    const ftc = sortType=="general"?"getRanking":sortType=="site"?"getSiteRanking":"getSitesRanking";
    const param = sortType=="general"?null:sortType=="site"?ofp.getUser().site:null;
    sortButtonSwitchTxt.innerHTML = txt;
    window["_ui-123456"].api[ftc](param)
        .then(function (response) {
            sortRender(response);
        });
}

function svgSetDashOffset(el, percent) {
    var ray = el.getAttribute("r"),
        d = el.getAttribute("d"), dashoffset, dasharray;

    if (ray) {
        dasharray = Math.PI * (ray * 2),
            dashoffset = ((100 - percent) / 100) * dasharray;
    }
    else if (d) {
        /*
        var tab = [percent,(100-percent)],
        total = el.getTotalLength(),
        dasharray = "";
        for(var t=1; t<=tab.length; t++){
            dasharray += tab[t-1] / 100 * total + " ";
        }
        dashoffset = 0;
        */
        dasharray = el.getTotalLength();
        dashoffset = ((100 - percent) / 100) * dasharray;
    } else {
        return "failed";
    }

    el.style["stroke-dashoffset"] = dashoffset + "px";
    el.style["stroke-dasharray"] = dasharray + "px";
    //el.setAttribute('stroke-dashoffset',dashoffset);
    //el.setAttribute('stroke-dasharray',dasharray);
}

function fakeCubicCurve(el, cubic) {
    if (document.querySelector("#main").querySelector("#faker-cubic")) {
        document.querySelector("#main").removeChild(document.querySelector("#main").querySelector("#faker-cubic"));
    }
    var svg = document.createElementNS('http://www.w3.org/2000/svg', "svg"),
        content = "<path id=\"curve\" fill=\"none\" stroke=\"#000\"></path><circle id=\"dot\" fill=\"red\" r=\"10\" stroke=\"none\"></circle>";
    svg.setAttribute("width", 10000);
    svg.setAttribute("height", 10000);
    svg.style["background"] = "transparent";
    svg.style["z-index"] = 1000;
    svg.style["overflow"] = "visible";
    svg.setAttribute("class", "absolute");
    svg.setAttribute("id", "faker-cubic");
    svg.innerHTML = content;
    var curve = svg.querySelector("#curve"),
        box = el.parentNode.getBoundingClientRect();
    svg.style.left = "0px";
    svg.style.top = "0px";

    var cursor,
        dotSelected;

    function onDown(e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        cursor = getCursorIn(event, this);
        $(svg).off(Constants.MOVE_TOUCHMOVE).on(Constants.MOVE_TOUCHMOVE, onMove);
        $(svg).off(Constants.UP_TOUCHEND).on(Constants.UP_TOUCHEND, onUp);
        $(this).off();
        dotSelected = this;
    }

    function onMove(e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e,
            c = getCursorIn(event, el.parentNode);

        dotSelected.setAttribute("cx", (c.x - cursor.x));
        dotSelected.setAttribute("cy", (c.y - cursor.y));

        update();
    }

    function onUp(e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        $(svg).off(Constants.MOVE_TOUCHMOVE);
        $(svg).off(Constants.UP_TOUCHEND);
        $(dotSelected).on(Constants.DOWN_TOUCHSTART, onDown);
    }

    function draw() {
        for (var c = 1; c <= cubic.length - 2; c++) {
            var circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
            circle.setAttribute("fill", "blue");
            circle.setAttribute("r", 10);
            circle.setAttribute("cx", cubic[c][0]);
            circle.setAttribute("cy", cubic[c][1]);
            circle.setAttribute("class", "cubic-dot");
            svg.appendChild(circle);
            $(circle).off().on(Constants.DOWN_TOUCHSTART, onDown);
        }
    }

    function update() {
        var dotsCubics = svg.querySelectorAll(".cubic-dot");
        let d = "";
        for (var c = 1; c <= cubic.length; c++) {
            var cub = cubic[c - 1];
            if (c == 1) {
                d += "M";
            }
            if (c == 2) {
                d += (cubic.length == 4) ? "C" : (cubic.length == 2) ? "L" : "Q";
            }
            if (c == 2) {
                d += dotsCubics[0].getAttribute("cx") + "," + dotsCubics[0].getAttribute("cy") + " ";
            }
            else if (c == 3) {
                d += dotsCubics[1].getAttribute("cx") + "," + dotsCubics[1].getAttribute("cy") + " ";
            } else {
                d += cub[0] + "," + cub[1] + " ";
            }

        }
        d = d.trim();
        curve.setAttribute("d", d);
    }

    let d = "";
    for (var c = 1; c <= cubic.length; c++) {
        var cub = cubic[c - 1];
        if (c == 1) {
            d += "M";
        }
        if (c == 2) {
            d += (cubic.length == 4) ? "C" : (cubic.length == 2) ? "L" : "Q";
        }
        d += cub[0] + "," + cub[1] + " ";
    }
    d = d.trim();
    curve.setAttribute("d", d);

    el.parentNode.appendChild(svg);

    draw();
}