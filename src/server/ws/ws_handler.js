const socketIo = require('socket.io');
const Tokens = require('./tokens');
const ActivePlayers = require('../online/active_players');
const Games = require('../online/games');

let io;

const start = (server) => {

    //start a WebSocket server besides the REST API from Express
    io = socketIo(server);

    /*
        Every time a new user connects, a "connect" even is sent to the server,
        and we can obtain the "socket" object associated with such new user.
        On such object, we will register a series of event listeners using
        ".on".
     */
    io.on('connection', function (socket) {
        console.log('someone connected');

        onLogin(socket);
        onDisconnect(socket);
        onStartGame(socket);
        onAnswer(socket);

    });
};

onLogin = (socket) => {
    socket.on('login', (data) => {

        if (data === null || data === undefined) {
            socket.emit("update", {error: "No payload provided"});
            return;
        }

        const token = data.wstoken;

        if (token === null || token === undefined) {
            socket.emit("update", {error: "Missing token"});
            return;
        }

        //token can be used only once to authenticate only a single socket
        const userId = Tokens.consumeToken(token);

        if (userId === null || userId === undefined) {
            socket.emit("update", {error: "Invalid token"});
            return;
        }

        ActivePlayers.registerSocket(socket, userId);

        let gameObject = Games.add(userId);

        socket.emit('updatePlayer', gameObject);

        console.log('obj: ' + JSON.stringify(gameObject))

        updatePlayerList(gameObject.id);

    });
};

onAnswer = (socket) => {
    socket.on('answer', (dto) => {
        let game = Games.getGameInfo(Games.getGameId(dto.userId));

        if (dto.answer === game.question[game.round - 1].correct_answer) {
            Games.updatePoints(dto.userId, dto.time);
            console.log('points: ' + Games.getPoints(dto.userId));
            let socket = ActivePlayers.getSocket(dto.userId);

            socket.emit('points', Games.getPoints(dto.userId));
        }

    })
};

onStartGame = (socket) => {

    socket.on('startGame', (dto) => {
        if (!Games.exist(dto)) return;
        Games.startGame(dto);
        sendGameInfo(dto);

        let gameInfo = Games.getGameInfo(dto);
        let timer = gameInfo.timer * 1000;

        let intervalObj = setInterval(() => {
            if (!Games.exist(dto) || Games.finalRound(dto)) {
                console.log('finnished');
                clearInterval(intervalObj);
                let players = Games.getGameInfo(dto).players.sort((a, b) => a.points < b.points);
                sendToAll(dto,'scoreBoard', players);
                //players.forEach((a) => console.log('player: ' + a.userId + 'points: ' + a.points));
            } else {
                Games.incrementRound(dto);
                sendGameInfo(dto);
            }
        }, timer);
    });

};

sendToAll = (gameId, topic, obj) => {
    let players = Games.getPlayers(gameId);
    for (let player of players) {
        let socket = ActivePlayers.getSocket(player);
        socket.emit(topic, obj);
    }
};


sendGameInfo = (gameId) => {
    let players = Games.getPlayers(gameId);
    let gameInfo = Games.getGameInfo(gameId);
console.log('i sendGameInfo: ' + players);
console.log('i sendGameInfo 2: ' + JSON.stringify(gameInfo));

    for (let player of players) {
        let socket = ActivePlayers.getSocket(player);
        socket.emit('updateGame', {
            hasStarted: gameInfo.hasStarted,
            question: gameInfo.question[gameInfo.round - 1],
            round: gameInfo.round,
            timer: gameInfo.timer,
            rounds: gameInfo.rounds
        });
    }
};

onDisconnect = (socket) => {
    socket.on('disconnect', () => {

        const userId = ActivePlayers.getUser(socket.id);
        if (userId !== undefined) {

            const gameId = Games.getGameId(userId);

            Games.removePlayer(userId, gameId);

            ActivePlayers.removeSocket(socket.id);
            updatePlayerList(gameId);

        }
        console.log("User '" + userId + "' is disconnected.");
    });
};

updatePlayerList = (gameId) => {
    console.log('kom hit da for faen!!!!!!!' + Games.exist(gameId));
    if (!Games.exist(gameId)) return;
    if (gameId !== undefined) {
        let players = Games.getPlayers(gameId);
        if (players === undefined) return;
        console.log('player exist? ' +players);
        for (let player of players) {
            ActivePlayers.getSocket(player).emit(`updateGameInfo`, {
                players: Games.getPlayers(gameId),
            })
        }
    } else {
        console.log('np er jeg her');
        for (let x of Games.getAllGameIdes()) {
            for (let player of Games.getPlayers(x)) {
                ActivePlayers.getSocket(player).emit(`updateGameInfo`, {
                    players: Games.getPlayers(x),
                })
            }
        }
    }
};


module.exports = {start};