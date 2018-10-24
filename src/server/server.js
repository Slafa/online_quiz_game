const app = require("./app");

const server = require('http').Server(app);


server.listen(8080, () => {
    console.log('Starting NodeJS server');
});

