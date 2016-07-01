const express = require('express');
const bodyParser = require('body-parser');
const db = require(__dirname + '/db/index').db;

const app = express();
const React = require('react');
const port = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/../client/build`));
app.use(bodyParser.json());

const path = require('path');
const webpack = require('webpack');
const config = require('../webpack.config');
const compiler = webpack(config);
const router = require('./router');
const dotenv = require('dotenv');
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
app.post('/signin', userController.postSignin);
app.post('/signup', userController.postSignup);
// app.use('/dashboard', userController.getDashboard);

/**
 * OAuth authentication routes. (Sign in)
 */
const oAuthController = require('./routes/oauth');
app.get('/auth/facebook', oAuthController.redirectToFacebookSignin);
app.get('/auth/facebook/callback/', oAuthController.obtainFacebookCredentials, oAuthController.jwtAuthentication);
});

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

router(app);



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
router(app);

app.listen(port, () => console.log(`Server started at: http://localhost:${port}`));
