const express = require('express');
const router = express.Router();
const passport = require('passport');
const Repo = require('./db/repo');
const Tokens = require('./ws/tokens');


router.post('/api/V1/login', passport.authenticate('local'), (req, res) => {
    res.status(204).send();
});


router.post('/api/V1/signup', (req, res) => {
    const created = Repo.addPlayer(req.body.userId, req.body.password);

    if (!created) {
        res.status(400).send();
        return;
    }

    passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.status(204).send();
        });
    });
});

router.post('/api/V1/wstoken', (req, res) => {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    const t = Tokens.createToken(req.user.id);
    console.log(t);
    res.status(201).json({wstoken: t});
});

router.get('/api/V1/user', (req, res) => {
    console.log('req: ' + req.user)

    if(! req.user){
        res.status(401).send();
        return;
    }

    res.status(200).json({userId: req.user.id});
});


module.exports = router;