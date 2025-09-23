///////////////////////////////////////////////////////////////
/////////////////       CLIENT ET HANDLERS       //////////////
///////////////////////////////////////////////////////////////

var challengeJson;

function battleLoading(){
	const client = new function() {
		return {
			init:function(){
				var user = ofp.getUser();
				// assignation de l'application si elle n'existe pas encore
				if(!client.app) {
	
					// instance de l'objet "App" qui permet d'executer des commandes pour interagir avec le serveur
					// var app = new App(socket, {
					var appHandlers = {
						//Réception d'une proposition de défi
						onChallenge:function(challenger){
							if(ofp.debug){
								console.warn("@Challenge from ",challenger);
							}
							foeDatas.pseudo = challenger.pseudo;
							if(situation.canBeChallenged()){
								challengeReceived(challenger);
							}
						},
						onChallengeEmitterDisconnected:function(){
							if (ofp.debug) {
								console.warn("@onChallengeEmitterDisconnected");
							}
							/*
							if(mode.indexOf("challenger")!=-1){
								popupHide(document.getElementById("popup-info"));
							}
							*/
						},
						onChallengeReceiverDisconnected:function(){
							if (ofp.debug) {
								console.warn("@onChallengeReceiverDisconnected");
							}
							challengerDisconnect();
						},
						onDisconnect:function(){
							if(situation.battling!=false){
								battleInterrupted();
							}
							disconnection();
						},
						onDisconnectedFromChallenger:function(){
							if (ofp.debug) {
								console.warn("@onDisconnectedFromChallenger");
							}
							challengerDisconnect();
						},
						onChallengerFound:function(challenger){
							if (ofp.debug) {
								console.warn('Un challenger potentiel a été trouvé : '+challenger.pseudo + ' / ' + challenger.pseudo+', challenger id : '+challenger.id+', attente de la réponse...');
							}
							if(situation.canChallenge()){
								challengerFound(challenger);
							}
							
						},
						onNoChallengerFound:function(){
							if (ofp.debug) {
								console.warn('Aucun challenger n\'est disponible actuellement, réessayez ultérieurement.');
							}
							challengerNone();                   	
							
						},
						onChallengerAlreadySet:function(){
							if (ofp.debug) {
								console.warn('Vous êtes déjà connecté avec un challenger ! Souhaitez-vous être déconnecté ?');
							}
						},
						onChallengeCanceled:function(){
							if (ofp.debug) {
								console.warn('Le délai imparti pour répondre au défi est écoulé, le challenge est annulé');
							}
							challengeTimeOut();
						},
						onChallengeAccepted:function(){
							if (ofp.debug) {
								console.warn('Votre proposition de challenge a été acceptée');
							}
							if(situation.location=="battle"){
								popup.hide();
							}
							if(usersM.status=="open"){
								usersM.hide();
							}
						},
						onChallengeRefused:function(){                  	
							if (ofp.debug) {
								console.warn('Votre proposition de challenge a été refusée');
							}
							challengeRefused(); 
						},
						onGameProposal:function(){
							if (ofp.debug) {
								console.warn('Souhaitez-vous affronter à nouveau votre challenger dans une autre partie ?');
							}
							challengeRematched();
						},
						onGameProposalAccepted:function(){
							if (ofp.debug) {
								console.warn('Votre proposition de nouvelle partie a été acceptée');
							}
							situation.rematch = false;
							if(situation.location=="battle"){
								popup.hide();
							}
	
						},
						onGameProposalRefused:function(){
							if (ofp.debug) {
								console.warn('Votre proposition de nouvelle partie a été refusée');
							}
							challengeRematchRefused(); 
						},
						onGameProposalCanceled:function(){
							if (ofp.debug) {    
								console.warn('Le délai imparti pour répondre à la proposition est écoulé, la nouvelle partie est annulé');
							}
							challengeRematchTimeout();
						},
						onGameWaitingForPlayers:function(){
							if (ofp.debug) {
								console.warn('Partie en attente des joueurs...');
							}      
							client.app.getAllChallengerUserData();
						},
						onGameStart:function(){
							if (ofp.debug) {
								console.warn('@onGameStart');
							}
							situation.ready = false;
						},
						onGameStop:function(data){
							if (ofp.debug) {
								console.warn('@onGameStop :: ',data);
							}
							//Interrompue par une déconnexion
							if(situation.disconnected==true){
								battleInterrupted();
								popup.show();
								situation.disconnected = false;
							} else {
								situation.finished = true;
								situation.battling = false;
								const playerDatas = data[0].id==user.identifier ? data[0] : data[1];
								const otherDatas = data[0].id==user.identifier ? data[1] : data[0];
								//Récupération des temps de réponse en cas d'égalité entre les challengers
								battleDatas.responseTime = playerDatas.responseTime
								battleDatas.nbCorrects = playerDatas.score;
								foeDatas.responseTime = otherDatas.responseTime;
								foeDatas.nbCorrects = otherDatas.score;
								if(battleDatas.nbCorrects>foeDatas.nbCorrects){
									battleDatas.state = "winner";
									foeDatas.state = "loser";
								}
								else if(battleDatas.nbCorrects<foeDatas.nbCorrects){
									battleDatas.state = "loser";
									foeDatas.state = "winner";
								} else {
									//Égalité mais les 2 ont 0 points
									if(battleDatas.nbCorrects==0&&foeDatas.nbCorrects==0){
										battleDatas.state = "loser";
										foeDatas.state = "loser";
									}
									battleDatas.state = "draw";
									foeDatas.state = "draw";
								}
								//Rendu des bonnes réponses + lancement popup fin résultats avec les points
								battleRender();
								timeline.play("battle-scoring-out");
            					popup.show();
							}
							          	
						},
						onSetQuestion:function(id){
							if(id) {
								if (ofp.debug) {
									console.warn('Affichage de la question : '+id);
								}
								battleDatas.id = id;
								if(timeline.status=="normal"){
									timeline.play({"battle-resume-in":500,"battle-scoring-out":0});
									if(battleDatas.current==1){
										popup.hide();
									}
								}
							}
						},
						onReceiveRanking:function(ranking){ // ranking = array
							if(ranking) {
								if (ofp.debug) {
									console.warn('===================== Classement =====================');
								}
								$(ranking).each(function(index, element){
									if (ofp.debug) {
										console.warn('score : '+element.score+', pseudo: '+element.pseudo+', userId : '+element.userId+', attemptsNumber : '+element.attemptsNumber+', lastAttempt : '+element.lastAttempt+', totalGameTime : '+Utility.timestampToHMS(element.totalGameTime));
									}
								});
								if (ofp.debug) {
									console.warn('==========================================================');
								}
							}
						}, 
						onReceiveUserRanking:function(ranking){ // ranking = object
							if (ofp.debug) {
								console.warn("onReceiveUserRanking handlers")
							}
							if(ranking) {
								if (ofp.debug) {
									console.warn('===================== Classement de l\'utilisateur : '+user.pseudo+' =====================');
								}
								if (ofp.debug) {    
									console.warn('score : '+ranking.score+', pseudo: '+ranking.pseudo+', userId : '+ranking.userId+', attemptsNumber : '+ranking.attemptsNumber+', lastAttempt : '+ranking.lastAttempt+', totalGameTime : '+Utility.timestampToHMS(ranking.totalGameTime));
								}
								if (ofp.debug) {
										console.warn('==========================================================');
									}
							}
						}, 
						onReceiveChallengerActualScore:function(score){
							if(Utility.isDefined(score)) {
								if (ofp.debug) {
									console.warn('Score actuel du challenger : '+score);
								}
							}  
						},
						onReceiveChallengerResponseTime:function(time){
							if(Utility.isDefined(time)) {
								//tempsReponseAdversaire=time;
								if (ofp.debug) {
									console.warn('Temps total de réponses justes du challenger : '+time);
								}
							}  
						},
						onReceiveActualScore:function(score){
							if(Utility.isDefined(score)) {
								if (ofp.debug) {
									console.warn('Score actuel : '+score);
								}
							} 
						},
						onReceiveResponseTime:function(time){
							if(Utility.isDefined(time)) {
								//tempsReponse=time;
								if (ofp.debug) {
									console.warn('Temps total de réponses justes : '+time);
								}
							} 
						},
						onReceiveAllChallengerUserData:function(udata){
							if (ofp.debug) {
								console.warn("@onReceiveAllChallengerUserData",udata);
							}
							//Si l'adversaire n'a réalisé aucune customisation (aucune sauvegarde réalisée)
							if(!udata.avatarDatas){
								console.log("no avatarDatas informations!");
							}
							foeDatas.avatarDatas = udata.avatarDatas ? udata.avatarDatas : avatarDatasDefault ;
							foeDatas.pseudo = udata.pseudo;
							foeDatas.level = getLevelByScore(udata.score);
							foeDatas.corrects = [null,null,null,null,null];
							sendToFooter({
								type: MessagesConstants.FOOTER_SHOW,
								status: "invisible"
							});
							if(usersM.status=="open"){
								usersM.unclose = true;
								usersM.close();
							}
							if(timeline.status=="normal"){
								const obj = {"battle-vs-in":0};
								if(situation.location=="battle"){
									obj["battle-interactions-out"] = 0;
								}
								else if(situation.location=="sort"){
									obj["sort-out"] = 0;
								}
								else if(situation.location=="customize"){
									obj["customize-out"] = 0;
								}
								obj["popup-rewards-out"] = 0;
								situation.ready = "get";
								situation.searching = false;
								situation.disconnected = false;
								situation.location = "battle";
								if(situation.rematch=="waiting"){
									situation.rematch = "asker";
								}
								document.getElementById("s1-button-play-vs").setAttribute("mode","search");
								timeline.play(obj,true);
							}
						},
						onReceiveChallengerResponse:function(correct){
							//calculScoreQuizAdversaire();
							if (ofp.debug) {
								console.warn("@onReceiveChallengerResponse: reply => "+correct+" for current => ",battleDatas.current);
							}
							//-2 car current a été incrémenté avant
							foeDatas.corrects[battleDatas.current-2] = correct;
						},
						onReceiveAllPeersInRoom:function(roomId, peers){},
						onReceiveAllPeers:function(peers){
							console.warn('🚀 :: onReceiveAllPeers :: '+peers);
							usersM.renderList(peers);
							usersM.listScrollable.reset();
						},
						onPeerConnection: (data) => {
							console.warn('🚀 :: onPeerConnection :: ');
							console.warn(data);
							usersM.delayedUpdate();
						},
						onPeerDataChange: (data) => {
							console.warn('🚀 :: onPeerDataChange :: ');
							console.warn(data);
							usersM.delayedUpdate();
						},
						onPeerDisconnection: (data) => {
							console.warn('🚀 :: onPeerDisconnection :: ');
							console.warn(data);
							client.app.getAllPeers();
						},
						onChat:function(userData){
							console.warn('🚀 :: onChat :: ');
							if(!situation.isBusy()){
								usersM.user = userData;
								popupChatShow(userData);
							}
						},
						onChatCanceled:function(){
							console.warn('🚀 :: onChatCanceled');
							if(usersM.mode=="chat-receiver"){
								popupChatHide();
							} else {
								usersM.proposalRefused();
								//Safety
								const popupChatWrap = document.querySelector("#popup-chat-wrap");
								if(!popupChatWrap.classList.contains("hidden")){
									popupChatWrap.classList.add("hidden");
								}
							}
							
						},
						onChatAccepted:function(){
							console.warn('🚀 :: onChatAccepted');
							usersM.proposalAccepted();
						},
						onChatRefused:function(){
							console.warn('🚀 :: onChatRefused');
							usersM.proposalRefused();
						},
						onChatPeerAlreadySet:function(){},
						onDisconnectedFromChatPeer:function(){
							console.warn('🚀 :: onDisconnectedFromChatPeer');
							chatDisconnected();
						},
						onChatEmitterDisconnected:function(){
							console.warn('🚀 :: onChatEmitterDisconnected');
						},
						onChatReceiverDisconnected:function(){
							console.warn('🚀 :: onChatReceiverDisconnected');
						},
						onReceiveChatMessage:function(message){
							console.warn('🚀 :: onReceiveChatMessage :: '+message);
							usersM.updateChat(message,usersM.user);
						}
	
					};

					var app = new App(parent.ofp.socket, appHandlers);
	
					// on expose l'instance de l'application dans l'objet client
					client.app = app;
					client.user = user;
					client.api = new APIClient({ ...parent.env, token: parent.ofp.token });
					usersM.app = app;
				}

				//Récupération du tableau de données de customisation de l'avatar
				if(Array.isArray(scorm.parsedDatas[scorm.parsedDatas.length-1][3])){
					avatarDatas = scorm.parsedDatas[scorm.parsedDatas.length-1][3];
				}
				
				client.app.setUserData('avatarDatas',avatarDatas);
				
				var jsonsLoading = languageManager.loadJSONs([
					languageManager.jsonURL + languageManager.language + ".json",
					languageManager.jsonURL +"quiz.json"
				]).then(function(response){
					quizDatas = response[1];
				})
	
				var loadUserRanking = client.api.getUserRanking(client.user.identifier)
					.then(function (response) {
						if ('error' in response) {
							return Promise.reject(response.error);
						} else {
							console.warn('.then :: response.result.length', response.result.length);
							if (response.result.length) {
								var data = response.result.shift();
								receiveUserRanking(data);                        }
						}
					})
					.catch(function(error) {
						console.warn('Load user ranking error ::' , error);
					});

				Promise.all([
						jsonsLoading,
						loadUserRanking
					])
					.then(function() {
						initLesson();
					})
					.catch(function(error) {
						console.warn('Promise.all error ::' , error);
					});
					
	
			}
		};
	};
	client.init();
	window["_ui-123456"] = client;
}

///////////////////////////////////////////////////////////////
/////////////////          CHALLENGES            //////////////
///////////////////////////////////////////////////////////////

function challengerFound(challenger){
	situation.searching = false;
	document.getElementById("s1-button-play-vs").setAttribute("mode","search");
}

function challengeReceived(user){
	situation.challenge = 'receiver';
	situation.searching = false;
	popupChallengeShow(user);
}

function challengeRematched(){
	situation.rematch = "receiver";
	situation.finished = false;
	popup.render();
}

function challengeAccepted(){
	if(situation.location=="home"){
		document.getElementById("s1-button-play-vs").setAttribute("mode","search");
	}
	popupChallengeHide();
}

function challengeRefused(){
	if(situation.challenge=="receiver"){
		popupChallengeHide(function(){
			situation.searching = false;
			situation.challenge = false;
		});
	} else {
		situation.rematch = "refused";
		situation.searching = false;
		situation.challenge = false;
		situation.disconnected = false;
		popup.render();	
	}

	if(situation.location=="home"){
		document.getElementById("s1-button-play-vs").setAttribute("mode","search");
		popupChallengeHide(function(){
			situation.searching = false;
			situation.challenge = false;
		});
	}

	if(usersM.mode=="battle-asker"){
		usersM.proposalRefused();
	}
}

function challengeRematchRefused(){
	situation.rematch = "refused";
	situation.disconnected = false;
}

function challengeRematchTimeout(){
	situation.timeout = true;
	if(situation.rematch=="waiting"){
		situation.timeout = false;
		situation.rematch = "no";
		popup.render();
	}
	else if(situation.rematch=="receiver"){
		situation.timeout = false;
		situation.rematch = "unanswered";
		popup.render();
	}
}

function challengeTimeOut(){
	situation.timeout = true;
	const popupChallengeWrap = document.querySelector("#popup-challenge-wrap");
	//Hors Battle VS
	if(situation.location!="battle" || situation.battle=="solo"){
		popupChallengeHide(function(){
			situation.searching = false;
			situation.timeout = false;
			situation.challenge = false;
		});
		document.getElementById("s1-button-play-vs").setAttribute("mode","search");
	} else {
		situation.searching = false;
		situation.timeout = false;
		if(situation.challenge=="receiver"){
			popupChallengeHide(function(){
				situation.challenge = false;
			});
		} else {
			situation.challenge = "none";
			situation.disconnected = false;
			popup.render();
		}
	}
	if(usersM.mode=="battle-asker"){
		usersM.proposalRefused();
	}
}

function challengerNone(){
	situation.searching = false;
	situation.challenge = "none";
	if(situation.location=="battle"){
		popup.render();
	}
	else if(situation.location=="home"){
		document.getElementById("s1-button-play-vs").setAttribute("mode","none");
		setTimeout(function(){
			document.getElementById("s1-button-play-vs").setAttribute("mode","search");
			situation.challenge = false;
		},1500);	
	}
}

function challengerDisconnect(){
	situation.disconnected = true;
	situation.challenge = false;
	situation.searching = false;

	if(situation.location=="home"){
		document.getElementById("s1-button-play-vs").setAttribute("mode","search");
	}

	if(situation.ready!=false){
		situation.ready = false;
		popup.show();
	}
	else if(situation.finished==true){
		situation.finished = false;
		popup.render();
		situation.disconnected = false;
	}
	else if(situation.rematch!=false){
		situation.rematch = false;
		popup.render();
		situation.disconnected = false;
	}
}

