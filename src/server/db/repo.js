//inspiration from users db in lesson 11 with some added security
const bcrypt = require('bcrypt-nodejs');
const players = new Map();

let addPlayer = (id, password) => {
    if (getPlayer(id)) return false;
    let hased = bcrypt.hashSync(password);

    players.set(
        id,
        {
            id: id,
            password: hased
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

    return bcrypt.compareSync(password, player.password);
};


module.exports = {addPlayer, getPlayer, verifyPlayer}