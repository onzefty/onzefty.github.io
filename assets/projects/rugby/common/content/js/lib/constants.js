Object.defineProperty(window, 'Constants', {
    get: function () {
        var touchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

        return {
            CLICK_TOUCH: touchDevice ? 'touchend' : 'click',
            DOWN_TOUCHSTART: touchDevice ? 'touchstart' : 'mousedown',
            MOVE_TOUCHMOVE: touchDevice ? 'touchmove' : 'mousemove',
            UP_TOUCHEND: touchDevice ? 'touchend' : 'mouseup',
            MOUSEENTER_TOUCHSTART: touchDevice ? 'touchstart' : 'mouseenter',
            MOUSELEAVE_TOUCHEND: touchDevice ? 'touchend' : 'mouseleave',
            CONTEXTMENU: 'contextmenu',
            FOCUS: 'focus',
            BLUR: 'blur',
            TEXT_INPUT: 'input',
            KEY_DOWN: 'keydown',
            KEY_UP: 'keyup',
            LOAD: 'load',
            LOADED_META_DATA: 'loadedmetadata',
            CHANGE: 'change',
            WHEEL: 'wheel',
            ORIENTATION_CHANGE: 'orientationchange',
            RESIZE: 'resize',
            BEFORE_UNLOAD: 'beforeunload',
            UNLOAD: 'unload',
            TRANSITION_START:
                'transitionstart webkitTransitionStart otransitionstart oTransitionStart msTransitionStart',
            TRANSITION_END:
                'transitionend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd',
            ANIMATION_END:
                'animationend webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd',
            EASINGS: {
                linear: function (t) {
                    return t;
                },
                easeInSine: function (t) {
                    return -1 * Math.cos(t * (Math.PI / 2)) + 1;
                },
                easeOutSine: function (t) {
                    return Math.sin(t * (Math.PI / 2));
                },
                easeInOutSine: function (t) {
                    return -0.5 * (Math.cos(Math.PI * t) - 1);
                },
                easeInQuad: function (t) {
                    return t * t;
                },
                easeOutQuad: function (t) {
                    return t * (2 - t);
                },
                easeInOutQuad: function (t) {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                },
                easeInCubic: function (t) {
                    return t * t * t;
                },
                easeOutCubic: function (t) {
                    return --t * t * t + 1;
                },
                easeInOutCubic: function (t) {
                    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                },
                easeInQuart: function (t) {
                    return t * t * t * t;
                },
                easeOutQuart: function (t) {
                    return 1 - --t * t * t * t;
                },
                easeInOutQuart: function (t) {
                    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
                },
                easeInQuint: function (t) {
                    return t * t * t * t * t;
                },
                easeOutQuint: function (t) {
                    return 1 + --t * t * t * t * t;
                },
                easeInOutQuint: function (t) {
                    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
                },
                easeInExpo: function (t) {
                    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
                },
                easeOutExpo: function (t) {
                    return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
                },
                easeInOutExpo: function (t) {
                    return t === 0
                        ? 0
                        : t === 1
                        ? 1
                        : t < 0.5
                        ? Math.pow(2, 20 * t - 10) / 2
                        : (2 - Math.pow(2, -20 * t + 10)) / 2;
                },
                easeInBack: function (t) {
                    return (1.70158 + 1) * t * t * t - 1.70158 * t * t;
                },
                easeOutBack: function (t) {
                    return 1 + (1.70158 + 1) * pow(t - 1, 3) + 1.70158 * pow(t - 1, 2);
                },
                easeInOutBack: function (t) {
                    return t < 0.5
                        ? (pow(2 * t, 2) * ((1.70158 * 1.525 + 1) * 2 * t - 1.70158 * 1.525)) / 2
                        : (pow(2 * t - 2, 2) *
                              ((1.70158 * 1.525 + 1) * (t * 2 - 2) + 1.70158 * 1.525) +
                              2) /
                              2;
                },
            },
            GET_DATE: "getDate",
            SEND_DATE: "sendDate",

            GET_CHALLENGER: "getChallenger",
            CHALLENGE: "challenge",
            CHALLENGE_PROPOSAL: "challengeProposal",
            CANCEL_CHALLENGE: "cancelChallenge",
            CANCEL_ASYNC_CHALLENGE_FROM_CHAT: "cancelAsyncChallengeFromChat",
            CHALLENGE_ACCEPTED: "challengeAccepted",
            CHALLENGE_FROM_CHAT_ACCEPTED: "challengeFromChatAccepted",
            CHALLENGE_REFUSED: "challengeRefused",
            ACCEPT_CHALLENGE: "acceptChallenge",
            ACCEPT_ASYNC_CHALLENGE: "acceptAsyncChallenge",
            ACCEPT_ASYNC_CHALLENGE_FROM_CHAT: "acceptAsyncChallengeFromChat",
            DECLINE_CHALLENGE: "declineChallenge",
            SEND_CHALLENGE_EMITTER_DISCONNECTED: "sendChallengeEmitterDisconnected",
            SEND_CHALLENGE_RECEIVER_DISCONNECTED: "sendChallengeReceiverDisconnected",
            SEND_DISCONNECTED_FROM_CHALLENGER: "sendDisconnectedFromChallenger",
            SEND_CHALLENGER_FOUND: "sendChallengerFound",
            SEND_NO_CHALLENGER_FOUND: "sendNoChallengerFound",
            GET_CHALLENGER_USER_DATA: "getChallengerUserData",
            SEND_CHALLENGER_USER_DATA: "sendChallengerUserData",
            GET_ALL_CHALLENGER_USER_DATA: "getAllChallengerUserData",
            SEND_ALL_CHALLENGER_USER_DATA: "sendAllChallengerUserData",
            CHALLENGER_ALREADY_SET: "challengerAlreadySet",
            DISCONNECT_FROM_CHALLENGER: "disconnectFromChallenger",
            GET_CHALLENGER_ACTUAL_SCORE: "getChallengerActualScore",
            SEND_CHALLENGER_ACTUAL_SCORE: "sendChallengerActualScore",
            GET_CHALLENGER_RESPONSE_TIME: "getChallengerResponseTime",
            SEND_CHALLENGER_RESPONSE_TIME: "sendChallengerResponseTime",
            PLAY_NEW_GAME_WITH_CHALLENGER: "playNewGameWithChallenger",
            SEND_ASYNC_CHALLENGER_CONNECTED: "sendAsyncChallengerConnected",
            SEND_ASYNC_CHALLENGER_FROM_CHAT_CONNECTED: "sendAsyncChallengerFromChatConnected",
            SEND_WAITING_FOR_ASYNC_CHALLENGE_EMITTER: "sendWaitingForAsyncChallengeEmitter",
            SEND_CHALLENGER_RESPONSE: "sendChallengerResponse",
            GAME_PROPOSAL: "gameProposal",
            GAME_PROPOSAL_ACCEPTED: "gameProposalAccepted",
            GAME_PROPOSAL_REFUSED: "gameProposalRefused",
            CANCEL_GAME_PROPOSAL: "cancelGameProposal",
            ACCEPT_GAME_PROPOSAL: "acceptGameProposal",
            DECLINE_GAME_PROPOSAL: "declineGameProposal",
            GAME_WAITING_FOR_PLAYERS: "gameWaitingForPlayers",
            READY_TO_PLAY: "readyToPlay",
            START_GAME: "game:start",
            END_GAME: "game:end",
            GET_RANKING: "getRanking",
            GET_USER_RANKING: "getUserRanking",
            SEND_RANKING: "sendRanking",
            SEND_USER_RANKING: "sendUserRanking",
            RANKING_CHANGE: "rankingChange",
            SET_PROPERTY: "setProperty",
            GET_QUESTION: "getQuestion",
            SET_QUESTION: "setQuestion",
            GET_ACTUAL_SCORE: "getActualScore",
            SET_ACTUAL_SCORE: "setActualScore",
            SEND_ACTUAL_SCORE: "sendActualScore",
            GET_RESPONSE_TIME: "getResponseTime",
            SEND_RESPONSE_TIME: "sendResponseTime",
            SET_FREE_TO_PLAY: "setFreeToPlay",
            GET_USER_DATA: "getUserData",
            SET_USER_DATA: "setUserData",
            SEND_USER_DATA: "sendUserData",
            VALUE: "value",
            GET_ALL_PEERS_IN_ROOM: "getAllPeersInRoom",
            SEND_ALL_PEERS_IN_ROOM: "sendAllPeersInRoom",
            GET_ALL_PEERS: "getAllPeers",
            SEND_ALL_PEERS: "sendAllPeers",
            CHAT_PROPOSAL: "chatProposal",
            CHAT: "chat",
            CANCEL_CHAT: "cancelChat",
            CHAT_ACCEPTED: "chatAccepted",
            CHAT_REFUSED: "chatRefused",
            ACCEPT_CHAT: "acceptChat",
            DECLINE_CHAT: "declineChat",
            CHAT_PEER_ALREADY_SET: "chatPeerAlreadySet",
            SEND_CHAT_EMITTER_DISCONNECTED: "sendChatEmitterDisconnected",
            SEND_CHAT_RECEIVER_DISCONNECTED: "sendChatReceiverDisconnected",
            DISCONNECT_FROM_CHAT_PEER: "disconnectFromChatPeer",
            SEND_DISCONNECTED_FROM_CHAT_PEER: "sendDisconnectedFromChatPeer",
            CHAT_MESSAGE: "chatMessage",
            SEND_CHAT_MESSAGE: "sendChatMessage",
            SET_FREE_TO_CHAT: "setFreeToChat"
        };
    },
});
