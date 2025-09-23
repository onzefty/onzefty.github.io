/**
 * Classe "App" permettant d'executer des commandes pour interagir avec le serveur
 */
class App {
    constructor(socket, options) {
        this.socket = socket;
        const defautHandlers = {
            onConnect: () => {},
            onDisconnect: () => {},
            onMessage: (message) => {},
            onChallenge: (challenger) => {},
            onChallengeEmitterDisconnected: () => {},
            onChallengeReceiverDisconnected: () => {},
            onDisconnectedFromChallenger: () => {},
            onChallengerFound: (challenger) => {},
            onNoChallengerFound: () => {},
            onChallengerAlreadySet: () => {},
            onChallengeCanceled: () => {},
            onChallengeAccepted: () => {},
            onChallengeFromChatAccepted: () => {},
            onChallengeRefused: () => {},
            onGameProposal: () => {},
            onGameProposalAccepted: () => {},
            onGameProposalRefused: () => {},
            onGameProposalCanceled: () => {},
            onGameWaitingForPlayers: () => {},
            onGameStart: () => {},
            onGameStop: () => {},
            onSetQuestion: (question) => {},
            onReceiveRanking: (ranking) => {}, // ranking = array
            onReceiveUserRanking: (ranking) => {}, // ranking = object
            onRankingChange: (ranking) => {}, // ranking = array
            onReceiveChallengerActualScore: (score) => {},
            onReceiveChallengerResponseTime: (time) => {},
            onReceiveActualScore: (score) => {},
            onReceiveResponseTime: (time) => {},
            onReceiveChallengerUserData: (name, value) => {},
            onReceiveAllChallengerUserData: (udata) => {},
            onReceiveChallengerResponse: (correct) => {},

            onReceiveAllPeersInRoom: (roomId, peers) => {},
            onReceiveAllPeers: (peers) => {},
            onChat: (userData) => {},
            onChatCanceled: () => {},
            onChatAccepted: () => {},
            onChatRefused: () => {},
            onChatPeerAlreadySet: () => {},
            onDisconnectedFromChatPeer: () => {},
            onChatEmitterDisconnected: () => {},
            onChatReceiverDisconnected: () => {},
            onReceiveChatMessage: (message) => {},

            onPeerConnection: (data) => {},
            onPeerDataChange: (data) => {},
            onPeerDisconnection: (data) => {}
        };

        this.handlers = { ...defautHandlers, ...(options || {}) };
        this.addListeners();
    }

    addListeners = () => {
        this.socket.on('connect', this.handlers.onConnect);
        this.socket.on('disconnect', this.handlers.onDisconnect);
        this.socket.on('peer:connection', this.handlers.onPeerConnection);
        this.socket.on('peer:data-change', this.handlers.onPeerDataChange);
        this.socket.on('peer:disconnection', this.handlers.onPeerDisconnection);

        // écouteur de proposition de challenge
        this.socket.on(Constants.CHALLENGE, (data) => {
            if (data && Utility.isDefined(data.challenger)) {
                this.handlers.onChallenge.call(this, data.challenger);
            }
        });

        // écouteur de l'événement déconnecté du peer qui a lancé le challenge
        this.socket.on(Constants.SEND_CHALLENGE_EMITTER_DISCONNECTED, this.handlers.onChallengeEmitterDisconnected);

        // écouteur de l'événement déconnecté du peer auquel un challenge a été lancé
        this.socket.on(Constants.SEND_CHALLENGE_RECEIVER_DISCONNECTED, this.handlers.onChallengeReceiverDisconnected);

        // écouteur de l'événement déconnecté du challenger
        this.socket.on(Constants.SEND_DISCONNECTED_FROM_CHALLENGER, this.handlers.onDisconnectedFromChallenger);

        // écouteur de l'événement un challenger a été trouvé lors de la recherche
        this.socket.on(Constants.SEND_CHALLENGER_FOUND, (data) => {
            if (data && Utility.isDefined(data.challenger)) {
                this.handlers.onChallengerFound.call(this, data.challenger);
            }
        });

        // écouteur de l'événement aucun challenger trouvé lors de la recherche
        this.socket.on(Constants.SEND_NO_CHALLENGER_FOUND, this.handlers.onNoChallengerFound);

        // écouteur de jeu en attente de l'indication que tous les players sont prêts (chaque joueur doit envoyer un événement "READY_TO_PLAY")
        this.socket.on(Constants.GAME_WAITING_FOR_PLAYERS, this.handlers.onGameWaitingForPlayers);

        // écouteur de début du jeu
        this.socket.on(Constants.START_GAME, this.handlers.onGameStart);

        // écouteur de fin du jeu
        this.socket.on(Constants.END_GAME, (data) => {
            this.handlers.onGameStop.call(this, data);
        });

        // écouteur de challenger déjà attribué
        this.socket.on(Constants.CHALLENGER_ALREADY_SET, this.handlers.onChallengerAlreadySet);

        // écouteur de challenge annulé
        this.socket.on(Constants.CANCEL_CHALLENGE, this.handlers.onChallengeCanceled);

        // écouteur de challenge accepté
        this.socket.on(Constants.CHALLENGE_ACCEPTED, this.handlers.onChallengeAccepted);

        // écouteur de challenger refusé
        this.socket.on(Constants.CHALLENGE_REFUSED, this.handlers.onChallengeRefused);

        // écouteur de proposition de jeu
        this.socket.on(Constants.GAME_PROPOSAL, this.handlers.onGameProposal);

        // écouteur de proposition de jeu acceptée
        this.socket.on(Constants.GAME_PROPOSAL_ACCEPTED, this.handlers.onGameProposalAccepted);

        // écouteur de proposition de jeu refusée
        this.socket.on(Constants.GAME_PROPOSAL_REFUSED, this.handlers.onGameProposalRefused);

        // écouteur de proposition de jeu annulée
        this.socket.on(Constants.CANCEL_GAME_PROPOSAL, this.handlers.onGameProposalCanceled);

        // écouteur de réception du tableau de classement des scores
        this.socket.on(Constants.SEND_RANKING, (data) => {
            if (data && Utility.isDefined(data.ranking)) {
                this.handlers.onReceiveRanking.call(this, data.ranking);
            }
        });

        // écouteur de réception du score d'un utilisateur au sein du tableau de classement
        this.socket.on(Constants.SEND_USER_RANKING, (data) => {
            if (data && Utility.isDefined(data.ranking)) {
                this.handlers.onReceiveUserRanking.call(this, data.ranking);
            }
        });

        // écouteur de réception de l'événement de modification du tableau de classement
        this.socket.on(Constants.RANKING_CHANGE, (data) => {
            if (data && Utility.isDefined(data.ranking)) {
                this.handlers.onRankingChange.call(this, data.ranking);
            }
        });

        // écouteur de réception d'une question ayant été tirée de façon aléatoire côté serveur
        this.socket.on(Constants.SET_QUESTION, (data) => {
            if (data && Utility.isDefined(data.question)) {
                this.handlers.onSetQuestion.call(this, data.question);
            }
        });

        // écouteur de réception du score actuel du challenger
        this.socket.on(Constants.SEND_CHALLENGER_ACTUAL_SCORE, (data) => {
            if (data && Utility.isDefined(data.score)) {
                this.handlers.onReceiveChallengerActualScore.call(
                    this,
                    data.score
                );
            }
        });

        // écouteur de réception du temps total de réponses justes du challenger
        this.socket.on(Constants.SEND_CHALLENGER_RESPONSE_TIME, (data) => {
            if (data && Utility.isDefined(data.totalResponseTime)) {
                this.handlers.onReceiveChallengerResponseTime.call(
                    this,
                    data.totalResponseTime
                );
            }
        });

        // écouteur de réception du score actuel dans la partie s'il y en a une en cours
        this.socket.on(Constants.SEND_ACTUAL_SCORE, (data) => {
            if (data && Utility.isDefined(data.score)) {
                this.handlers.onReceiveActualScore.call(this, data.score);
            }
        });

        // écouteur de réception du temps total de réponses justes dans la partie s'il y en a une en cours
        this.socket.on(Constants.SEND_RESPONSE_TIME, (data) => {
            if (data && Utility.isDefined(data.totalResponseTime)) {
                this.handlers.onReceiveResponseTime.call(
                    this,
                    data.totalResponseTime
                );
            }
        });

        // écouteur de réception des données utilisateur du challenger
        this.socket.on(Constants.SEND_CHALLENGER_USER_DATA, (data) => {
            if (
                data &&
                Utility.isDefined(data.userDataName) &&
                Utility.isDefined(data.userDataValue)
            ) {
                this.handlers.onReceiveChallengerUserData.call(
                    this,
                    data.userDataName,
                    data.userDataValue
                );
            }
        });

        // écouteur de réception de toutes les données utilisateur du challenger
        this.socket.on(Constants.SEND_ALL_CHALLENGER_USER_DATA, (data) => {
            if (data && Utility.isDefined(data.userData)) {
                this.handlers.onReceiveAllChallengerUserData.call(
                    this,
                    data.userData
                );
            }
        });

        // écouteur de réception de la réponse correcte ou non du challenger
        this.socket.on(Constants.SEND_CHALLENGER_RESPONSE, (data) => {
            if (data && Utility.isDefined(data.correctResponse)) {
                this.handlers.onReceiveChallengerResponse.call(
                    this,
                    data.correctResponse
                );
            }
        });

        // écouteur de réception de la liste complète des utilisateurs connectés à la même room
        this.socket.on(Constants.SEND_ALL_PEERS_IN_ROOM, (data) => {
            if (
                data &&
                Utility.isDefined(data.roomId) &&
                Utility.isDefined(data.peers)
            ) {
                this.handlers.onReceiveAllPeersInRoom.call(
                    this,
                    data.roomId,
                    data.peers
                );
            }
        });

        // écouteur de réception de la liste complète des utilisateurs connectés
        this.socket.on(Constants.SEND_ALL_PEERS, (data) => {
            if (data && Utility.isDefined(data.peers)) {
                this.handlers.onReceiveAllPeers.call(this, data.peers);
            }
        });

        // écouteur de proposition de chat
        this.socket.on(Constants.CHAT, (data) => {
            if (data) {
                this.handlers.onChat.call(this, data);
            }
        });

        // écouteur de chat annulé
        this.socket.on(Constants.CANCEL_CHAT, this.handlers.onChatCanceled);

        // écouteur de chat accepté
        this.socket.on(Constants.CHAT_ACCEPTED, this.handlers.onChatAccepted);

        // écouteur de chat refusé
        this.socket.on(Constants.CHAT_REFUSED, this.handlers.onChatRefused);

        // écouteur de correspondant chat déjà attribué
        this.socket.on(Constants.CHAT_PEER_ALREADY_SET, this.handlers.onChatPeerAlreadySet);

        // écouteur de l'événement déconnecté du peer qui a lancé la demande de chat
        this.socket.on(Constants.SEND_CHAT_EMITTER_DISCONNECTED, this.handlers.onChatEmitterDisconnected);

        // écouteur de l'événement déconnecté du peer auquel un chat a été lancé
        this.socket.on(Constants.SEND_CHAT_RECEIVER_DISCONNECTED, this.handlers.onChatReceiverDisconnected);

        // écouteur de l'événement déconnecté du chat
        this.socket.on(Constants.SEND_DISCONNECTED_FROM_CHAT_PEER, this.handlers.onDisconnectedFromChatPeer);

        // écouteur de l'événement réception d'un message chat
        this.socket.on(Constants.SEND_CHAT_MESSAGE, (data) => {
            if (data && Utility.isDefined(data.message)) {
                this.handlers.onReceiveChatMessage.call(this, data.message);
            }
        });

        return this;
    };

    // supprime les écouteurs d'une instance de App qui correspondent à un scénario, ceci car le socket étant dans l'interface il ne faut pas cumuler les écouteurs ajoutés à chaque ouverture d'un scénario
    removeListeners = () => {};

    // demande d'enregistrement de l'identifiant utilisateur
    setUserId = (id) => {
        this.setProperty("userId", id);
    };

    // demande d'enregistrement du nom d'utilisateur
    setUserName = (name) => {
        this.setProperty("name", name);
    };
    // demande d'enregistrement de l'URL d'origine de l'utilisateur
    setUserOrigin = (origin) => {
        this.setProperty("origin", origin);
    };
    // demande d'enregistrement de l'ip de l'utilisateur
    setUserIp = (ip) => {
        this.setProperty("ip", ip);
    };
    // demande d'enregistrement de la room de l'utilisateur
    setUserRoomId = (roomId) => {
        this.setProperty("roomId", roomId);
    };
    // demande d'enregistrement de la variable "administrator" de l'utilisateur
    setAdministrator = (isAdmin) => {
        this.setProperty("administrator", isAdmin);
    };

    // demande d'enregistrement de l'id et du nom d'utilisateur
    setUser = (data) => {
        for (const property in data) {
            this.setProperty(property, data[property]);
        }
    };

    // demande de la valeur d'une donnée utilisateur précédement enregistrée
    getUserData = (dataName, callback) => {
        const onReceiveUserData = (args) => {
            if (
                args
                && Utility.isDefined(args.userDataName)
                && args.userDataName == dataName
            ) {
                callback.call(this, args);
            }
            this.socket.removeListener(
                Constants.SEND_USER_DATA,
                onReceiveUserData
            );
        };
        this.socket.on(Constants.SEND_USER_DATA, onReceiveUserData);
        this.socket.emit(Constants.GET_USER_DATA, { name: dataName });
    };

    // demande d'enregistrement d'une donnée utilisateur
    setUserData = (name, value) => {
        this.socket.emit(Constants.SET_USER_DATA, {
            name,
            value,
        });
    };

    // demande de la valeur des données utilisateur du challenger
    getChallengerUserData = (name) => {
        this.socket.emit(Constants.GET_CHALLENGER_USER_DATA, {
            name,
        });
    };

    // demande de la valeur de toutes les données utilisateur précédement enregistrées
    getAllUserData = () => {
        this.socket.emit(Constants.GET_ALL_USER_DATA);
    };

    // demande de la valeur de toutes les données utilisateur du challenger
    getAllChallengerUserData = () => {
        this.socket.emit(Constants.GET_ALL_CHALLENGER_USER_DATA);
    };

    // demande de recherche d'un challenger potentiel
    getChallenger = () => {
        this.socket.emit(Constants.GET_CHALLENGER);
    };

    // envoi un challenge de battle à un user
    sendChallengeTo = (identifier) => {
        this.socket.emit(Constants.CHALLENGE_PROPOSAL, {
            identifier,
        });
    };

    // demande d'une nouvelle partie avec le même challenger
    playNewGameWithChallenger = () => {
        this.socket.emit(Constants.PLAY_NEW_GAME_WITH_CHALLENGER);
    };

    // envoi de l'acceptation du challenge
    acceptChallenge = () => {
        this.socket.emit(Constants.ACCEPT_CHALLENGE);
    };

    // envoi du refus du challenge
    declineChallenge = () => {
        this.socket.emit(Constants.DECLINE_CHALLENGE);
    };

    // envoi de l'acceptation de la nouvelle partie
    acceptGameProposal = () => {
        this.socket.emit(Constants.ACCEPT_GAME_PROPOSAL);
    };

    // envoi du refus de la nouvelle partie
    declineGameProposal = () => {
        this.socket.emit(Constants.DECLINE_GAME_PROPOSAL);
    };

    // envoi du statut prêt à commencer la partie
    readyToPlay = () => {
        // récupération de l'identifiant du socket en fonction des paramètres de l'app : si utilisation d'un namespace ou non
        const id =
            this.socket.nsp == "/"
                ? this.socket.id
                : this.socket.nsp + "#" + this.socket.id;
        this.socket.emit(
            Constants.READY_TO_PLAY,
            { emitterSocketId: id } // on passe l'identifiant du socket complet (namespace+id car c'est sous cette forme que l'id est enregistré pour les objets Peer) afin de pouvoir identifier l'émetteur côté serveur
        );
    };

    // envoi d'une demande de deconnexion du challenger actuel
    disconnectFromChallenger = () => {
        this.socket.emit(Constants.DISCONNECT_FROM_CHALLENGER);
    };

    // envoi du score final obtenu au jeu
    value = (value, context) => {
        this.socket.emit(
            Constants.VALUE,
            { value, context } // enregistrement du score
        );
    };

    // envoi d'une demande de MAJ d'une propriété
    setProperty = (name, value) => {
        this.socket.emit(Constants.SET_PROPERTY, {
            name,
            value,
        });
    };

    // envoi d'une demande de MAJ du score
    setActualScore = (score) => {
        this.socket.emit(Constants.SET_ACTUAL_SCORE, { score });
    };
    // envoi d'une demande de MAJ de la variable indiquant si le peer est disponible ou non pour une battle
    setFreeToPlay = (free) => {
        this.socket.emit(Constants.SET_FREE_TO_PLAY, { free });
    };
    // envoi d'une demande de MAJ de la variable indiquant si le peer est disponible ou non pour un chat
    setFreeToChat = (free) => {
        this.socket.emit(Constants.SET_FREE_TO_CHAT, { free });
    };

    // envoi d'une demande de tirage aléatoire d'une question
    getQuestion = () => {
        this.socket.emit(Constants.GET_QUESTION);
    };

    // envoi d'une demande du score actuel
    getActualScore = () => {
        this.socket.emit(Constants.GET_ACTUAL_SCORE);
    };

    // envoi d'une demande du temps total de réponses justes
    getResponseTime = () => {
        this.socket.emit(Constants.GET_RESPONSE_TIME);
    };

    // envoi d'une demande du score actuel du challenger
    getChallengerActualScore = () => {
        this.socket.emit(Constants.GET_CHALLENGER_ACTUAL_SCORE);
    };

    // envoi d'une demande du temps total de réponses justes du challenger
    getChallengerResponseTime = () => {
        this.socket.emit(Constants.GET_CHALLENGER_RESPONSE_TIME);
    };

    // demande la liste complète des utilisateurs connectés à la même room
    getAllPeersInRoom = (roomId) => {
        this.socket.emit(Constants.GET_ALL_PEERS_IN_ROOM, { roomId: roomId });
    };

    // demande la liste complète des utilisateurs connectés
    getAllPeers = () => {
        return new Promise((resolve) => {
            this.socket.emit(Constants.GET_ALL_PEERS, (data) => {
                this.handlers.onReceiveAllPeers(data);
                resolve(data);
            });
        });
    };

    // envoi d'une demande de chat avec un user
    sendChatProposalTo = (identifier) => {
        this.socket.emit(Constants.CHAT_PROPOSAL, { identifier });
    };

    // envoi de l'acceptation du chat
    acceptChat = () => {
        this.socket.emit(Constants.ACCEPT_CHAT);
    };

    // envoi du refus du chat
    declineChat = () => {
        this.socket.emit(Constants.DECLINE_CHAT);
    };

    // envoi d'une demande de deconnexion du correspondant chat actuel
    disconnectFromChatPeer = () => {
        this.socket.emit(Constants.DISCONNECT_FROM_CHAT_PEER);
    };

    // envoi d'un message au correspondant chat actuel
    sendChatMessage = (message) => {
        this.socket.emit(Constants.CHAT_MESSAGE, { message });
    };
}
