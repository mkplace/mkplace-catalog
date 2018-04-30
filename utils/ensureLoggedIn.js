module.exports = function(req, res, next) {
    if(!req.user) {
        return next(new Error('user must be logged!'));
    }
    return next();
}