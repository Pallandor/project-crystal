// const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport'); // => thats the config i.e strategy setting!
const passport = require('passport');

// Auth
// const requireAuth = passport.authenticate('jwt', { session: false });
// const requireSignin = passport.authenticate('local', { session: false });
// const facebookSignin = passport.authenticate('facebook');
// const facebookSigninCallback = passport.authenticate('facebook', { failureRedirect: '/login' });

// @TODO placeholder data that will later be on each user in db
// const stats = {
//   total: 70,
//   spontaneity: 20,
//   helpful: 5,
//   romance: 99,
//   generosity: 65
// }


  // @TODO serves up fake stats from above currently
  // app.get('/health', (req, res) => {
  //   res.send(stats);
  // });
  // app.get('/auth/facebook', passport.authenticate('facebook'));
  // app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }, 
  //   (req, res) => {
  //   res.redirect('/dashboard');
  // });


module.exports = (app) => {
  app.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200);
  });

  // Signin and signup routes
  const Authentication = require('./controllers/authentication');
  app.post('/signin', passport.authenticate('local', { session: false }), Authentication.signin);
  app.post('/signup', Authentication.signup);
};