const app = require("./app");
const port = 8080;
//const server = require('http').Server(app);




app.listen(port, () => {
    console.log('Starting NodeJS server on port ' + port);
});

