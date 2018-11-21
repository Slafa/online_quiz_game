const crypto = require("crypto");
const questions = require('../data/questions');
let games = new Map();


const add = (userId) => {
    let gameId;
    let gameObject = {
        players: [userId],
        admin: false
    };

    if (gameId = getAvailableGame()) {
        addPlayer(gameId, userId);
        gameObject.players = getPlayers(gameId);
        gameObject.id = gameId;
    } else {
        // we need to create a new game
        let gameId = randomId();
        gameObject.admin = true;
        gameObject.id = gameId;
        addPlayer(gameId, userId);
    }

    return gameObject;
};

const getAllGameIdes = () =>{
    let keys = [];
    for (let pair of games) {
        keys.push(pair[0])
    }
    return keys;
};

const getAvailableGame = () =>{
  for (let g of games) {
      if (!g[1].hasStarted) return g[0];
  }
};

const removePlayer = (userId, gameId) =>{
    if(!userId || !gameId) return console.log('undefined values');
    console.log('før vi fjerner: '+ games.get(gameId).players)
    let players = games.get(gameId).players.filter((i) => i.userId !== userId);

    console.log('i remove: '+ JSON.stringify(players) + 'typeof: ' + typeof players)
    if(players[0] !== null || players.length === 0){
        deleteGame(gameId);
        console.log('game deleted!!!!!')
    }else
    setPlayers(gameId, players);

};

const setPlayers = (gameId, players) =>{
    games.get(gameId).players = players;
};

const getGameId = (userId) =>{
  for (let x of games){
      console.log('innei getGameId: ' +JSON.stringify(x[1].players))
      for(let player of x[1].players){
          if (player.userId === userId) return x[0]
      }
  }
};

const deleteGame = (gameId) => {
    games.delete(gameId);
};

const isPlaying = (gameId) => {
    return games.get(gameId);
};

const getPlayers = (gameId) => {
    if(games.get(gameId).players === undefined) return;
    console.log('getPlayer: ' + games.get(gameId).players);
    let arr = games.get(gameId).players.map((p) => p.userId);

    return arr;
};

const hasStarted = (gameId) => {
    return games.get(gameId).hasStarted;
};

const startGame = (gameId) => {
    games.get(gameId).hasStarted = true;
};

const finalRound = (gameId) =>{
  return getGameInfo(gameId).round === getGameInfo(gameId).rounds;
};

const randomId = () => {
    return crypto.randomBytes(10).toString('hex');
};

const exist = (gameId) =>{
    console.log('lalala ' + JSON.stringify(games));
   return games.has(gameId);
};

const addPlayer = (gameId, userId) => {
    if(games.get(gameId)) {
        games.get(gameId).players.push({userId:userId, points:0});
    }
    else {
        let shuffled = questions.sort(() => .5 - Math.random());
        let q = shuffled.slice(0,10);
        games.set(gameId, {
            players: [{userId: userId, points: 0}],
            hasStarted: false,
            admin: userId,
            question: q,
            round: 1,
            rounds: 1,
            timer: 2
        });
    }
};

const getGameInfo = (gameId) =>{
    return games.get(gameId);
};

const updatePoints = (userId, time) =>{
    let gameId = getGameId(userId);
    let totalTime = getGameInfo(gameId).timer;
    let points = time/totalTime *100;
    console.log('points now ' + points);

    for (let player of games.get(gameId).players){
        if(player.userId === userId){
            player.points += points;
            return
        }
    }
};

const getPoints = (userId) =>{
    for(let player of getGameInfo(getGameId(userId)).players){
        if(player.userId === userId){
           return player.points
        }
    }
};

const incrementRound = (gameId) =>{
    getGameInfo(gameId).round++;
};

module.exports = {
    add,
    removePlayer,
    deleteGame,
    isPlaying,
    getPlayers,
    hasStarted,
    startGame,
    getAllGameIdes,
    getGameInfo,
    getGameId,
    setPlayers,
    incrementRound,
    finalRound,
    exist,
    updatePoints,
    getPoints

};