var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
let mkplaceapi = require('./platform').client();

passport.use(new LocalStrategy(
  function (username, password, done) {
    mkplaceapi.customer_auth(username, password).then(function(data){
      if (data.result) {
        return done(null, data.result.store_on_session.customer)
      } else {
        return done(null, false, { message: 'Invalid user' });
      }
    });
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
