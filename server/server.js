const express = require('express');
const bodyParser = require('body-parser');
const db = require(__dirname + '/db/index').db;

const dotenv = require('dotenv');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: 'server/.env' });

const app = express();
const React = require('react');
const port = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/../client/build`));
app.use(bodyParser.json());

const path = require('path');
const webpack = require('webpack');
const config = require('../webpack.config');
const compiler = webpack(config);
// const router = require('./router');

const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');


// populate postgresql db
require('./db/populateDb')();

// Cors is a middleware that will handle CORS in the browser. Must sit before routes/static serves. 
const cors = require('cors');
const logger = require('morgan');
const compression = require('compression');
const errorHandler = require('errorHandler');
app.use(cors());
app.use(logger('dev'));
app.use(compression());

/**
 * Primary app routes.
 * RF: May need to re-order other routes/middleware e.g. express.static etc. 
 */
const userController = require('./controllers/user');
app.post('/signin', userController.signin);
app.post('/signup', userController.signup);
// app.use('/dashboard', userController.getDashboard);

/**
 * OAuth authentication routes. (Sign in)
 */
const OAuthController = require('./controllers/oauth');
app.get('/auth/facebook', OAuthController.redirectSigninTo.facebook);
app.get('/auth/facebook/callback/',
  OAuthController.obtainCredentialsFrom.facebook,
  OAuthController.verifyExistingAccounts.facebook,
  // OAuthController.signSendJWT,
  (req, res,next)=>{
    console.log('hitting this fake version of sign send...');
    next(); 
  },
  OAuthController.queryCoupleStatus
);
app.post('/auth/facebook/createAccount',
  OAuthController.createAccountUsingCredentialsFrom.facebook
  // OAuthController.signSendJWT('end')
);


/**
 * API routes
 * RF: Migrate below to controllers and expose named routes in server.js for clarity. 
 */
const userAPIroutes = require('./routes/api/user');
const coupleAPIroutes = require('./routes/api/couple');
const questionAPIroutes = require('./routes/api/questions');
const answerAPIroutes = require('./routes/api/answers');

app.use('/api/v1', userAPIroutes);
app.use('/api/v1', coupleAPIroutes);
app.use('/api/v1', questionAPIroutes);
app.use('/api/v1', answerAPIroutes);

// router(app);
// -----------------
  // module.exports = (app) => {
  //   app.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
  //     res.status(200);
  //   });

  //   // Signin and signup routes
  //   const Authentication = require('./controllers/authentication');
  //   app.post('/signin', passport.authenticate('local', { session: false }), Authentication.signin);
  //   app.post('/signup', Authentication.signup);
  // };


/**
 * Error Handler.
 */
app.use(errorHandler());

module.exports = app;

if (app.get('env') === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}
app.use('/', express.static(path.resolve(__dirname, '../client/build')));


// Middleware that parses incoming requests into JSON no matter the type of request
app.use(bodyParser.json({ type: '*/*' }));
// router(app);

app.listen(port, () => console.log(`Server started at: http://localhost:${port}`));
