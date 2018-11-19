const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const Repo = require('./db/repo');
const routes = require('./routes');
const secret = (Math.random()*1234567890934567898765).toString()

console.log('secret: '+secret)

const app = express();





// found this here
// https://stackoverflow.com/questions/39782375/how-to-add-my-own-server-code-to-webpack-dev-server-execution
if (process.env.NODE_ENV !== 'production') {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    webpackConfig        = require('../../webpack.config');
    const compiler             = require('webpack')(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        noInfo     : true,
        publicPath : webpackConfig.output.publicPath,
    }));
    app.use(webpackHotMiddleware(compiler));
}

app.use(bodyParser.json());




app.use(express.static('public'));

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));


passport.use(new LocalStrategy(
    /*
        Need to tell which fields represent the  "username" and which the "password".
        This fields will be in a Form or JSON data sent by user when authenticating.
     */
    {
        usernameField: 'userId',
        passwordField: 'password'
    },
    (userId, password, done) => {

        const ok = Repo.verifyPlayer(userId, password);


        if (!ok) {
            return done(null, false, {message: 'Invalid username/password'});
        }

        const player = Repo.getPlayer(userId);
        return done(null, player);
    }
));



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {

    const player = Repo.getPlayer(id);

    if (player !== undefined) {
        done(null, player);
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);

//handling 404
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});



module.exports = app;
