const express = require('express')
const router = express.Router();
const passport = require('passport');
const Repo = require('./repo');



router.post('/api/V1/login', passport.authenticate('local'), (req, res) => {
    res.status(204).send();
});


router.post('/api/V1/signup', function (req, res){
    const created = Repo.addPlayer(req.body.userId, req.body.password);

    if(! created){
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



module.exports = router;