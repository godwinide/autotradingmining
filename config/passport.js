const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../model/User');

module.exports = function (passport) {
  // Regular user authentication strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
      // Match user
      User.findOne({
        email: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'invalid email or password' });
        }
        if (user.disabled) {
          return done(null, false, { message: 'sorry, your account has been deactivated' });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'invalid email or password' });
          }
        });
      });
    })
  );

  // Admin authentication strategy
  passport.use('admin-local',
    new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
      // Match admin user
      User.findOne({
        email: username,
        isAdmin: true
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'invalid email or password' });
        }
        if (user.disabled) {
          return done(null, false, { message: 'sorry, your account has been deactivated' });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'invalid email or password' });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    console.log('=== deserializeUser called ===');
    console.log('User ID:', id);
    try {
      const user = await User.findById(id);
      console.log('User found:', user ? `${user.email} (isAdmin: ${user.isAdmin})` : 'null');
      console.log('============================');
      done(null, user);
    } catch (err) {
      console.log('Error in deserializeUser:', err);
      console.log('============================');
      done(err, null);
    }
  });
};