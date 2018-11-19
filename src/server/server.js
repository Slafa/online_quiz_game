const app = require("./app");
const port = 8080;
const wsHandler = require('./ws/ws_handler');
const server = require('http').Server(app);
wsHandler.start(server);


server.listen(port, () => {
    console.log('Starting NodeJS server on port ' + port);
});

