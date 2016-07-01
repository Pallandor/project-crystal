const merge = require('lodash/merge');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const Users = require(__dirname + '/../db/controllers/users');

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  Users.findByEmail(email)
    .then(foundUser => {
      if (!foundUser) {
        return done(null, false, { msg: `Email ${email} not found.` });
      }
      helpers.comparePassword(foundUser.password, password)
        .then(isMatch => {
          if (isMatch) {
            return done(null, foundUser);
          }
          return done(null, false, { msg: 'Invalid email or password.' });
        })
        .catch(err => {
          // RF: Review helpers.comparePassword and more specifically bcrypt's compare method. 
          return done(null, false, { msg: 'Invalid email or password.' });
        });
    });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  // if a facebook linked account already exists, then sign user in
  Users.findByFacebookId(profile.id)
    .then(existingUser => {
      if (existingUser) {
        return done(null, existingUser);
      }
      // else, check for existing account with user's email
      Users.findByEmail(profile._json.email)
        .then(existingEmailUser => {
          if (existingEmailUser) {
            // NOTE: Assumes that the next line will be treated by Passport as a failed authenticate.
            // Double check this assumption. 
            // attempt using: 
            console.log('++++++++ IN: config/passport.js... +++++++++++++++++++++');
            console.log('++++++++ Account with that email already exists! +++++++');
            done(existingEmailUser);
            // Or may need to try idiomatic done(null, false, message) syntax
            // e.g. done(null, false, { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.'});
          } else {
            // NOTE: Assumes that client-side still queries user on FB signup regarding is_first_of_couple, 
            // other_user_email, etc. 
            const newUser = merge({}, {
              email: profile._json.email,
              facebook: profile.id,
              first_name: profile.name.givenName,
              last_name: profile.name.familyName,
              is_first_of_couple: req.body.is_first_of_couple,
              other_user_email: req.body.other_user_email && null,
            });
            Users.addUser(newUser)
              .then(addedUser => {
                done(null, addedUser);
              })
              .catch(err => {
                // as per above, this may instead require idiomatic done(null, false, message) syntax. 
                console.log('++++++++ IN: config/passport.js... +++++++++++++++++++++');
                console.log('++++++++ Some error in Users.addUser flow! +++++++');
                done(err);
              });
          }
        });
    });
}));
