var passport = require('passport');

module.exports = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ msg: 'not authorized' }); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            res.json({ msg: 'ok' }); 
        });
    })(req, res, next);
};
