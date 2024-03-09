// passport-config.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const isValidPassword = await User.validPassword(username, password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      const user = await User.findByUsername(username);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
