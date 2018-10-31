const players = new Map();

let addPlayer = (id, password) => {
    if (getPlayer(id)) return false;

    players.set(
        id,
        {
            id: id,
            password: password
        });
    return true;
};

let getPlayer = (id) => {
    return players.get(id);
};

let verifyPlayer = (id, password) =>{

    const player = getPlayer(id);
    if(player === undefined){
        return false;
    }

    return player.password === password;
};


module.exports = {addPlayer, getPlayer, verifyPlayer}