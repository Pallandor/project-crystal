/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
// const clientSecret = require('./config');

/**
 * Create Express server.
 */
const app = express();

const http = require('http').Server(app);
const socketServer = require('./socket');
const io = require('socket.io')(http);
// const React = require('react');
const port = process.env.PORT || 3000;
const path = require('path');
const webpack = require('webpack');
const config = require('../webpack.config');
const compiler = webpack(config);
const router = require('./router');
const cors = require('cors');
const dotenv = require('dotenv');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const helpers = require(`${__dirname}/helpers/helpers`);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: `${__dirname}/.env` });



/**
 * Express configuration.
 */
// app.use(bodyParser.json());
app.use(bodyParser.json({ type: '*/*' }));
app.use(cors());

/**
 * Connect to PostgreSQL.
 */
const db = require(`${__dirname}/db/index`).db;
const Users = db.users;
/**
 * Seed PostgreSQL database.
 */
 if (app.get('env') === 'development'){
  console.log('see if the node_env preloaded to development as expected....');
  require('./db/populateDb')();
 }

/**
 * Primary API routes.
 */
const userAPIroutes = require('./routes/api/user');
const coupleAPIroutes = require('./routes/api/couple');
const questionAPIroutes = require('./routes/api/questions');
const eventsAPIroutes = require('./routes/api/events');
const messageAPIroutes = require('./routes/api/message');
const todoAPIroutes = require('./routes/api/todos');

app.use('/api/v1', userAPIroutes);
app.use('/api/v1', coupleAPIroutes);
app.use('/api/v1', questionAPIroutes);
app.use('/api/v1', eventsAPIroutes);
app.use('/api/v1', messageAPIroutes);
app.use('/api/v1', todoAPIroutes);


// // *** error handlers *** //
// catch 404 and forward to error handler

// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.json('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.json('error', {
//     message: err.message,
//     error: {}
//   });
// });
// +++++++++++++++++++++
// module.exports = app;

// if (app.get('env') === 'development') {
//   app.use(webpackDevMiddleware(compiler, {
//     noInfo: true,
//     publicPath: config.output.publicPath,
//   }));
//   app.use(webpackHotMiddleware(compiler));
// }

// app.use('/', express.static(path.resolve(__dirname, '../client/build')));
// app.post('/verify', (req, res, next) => {
//   const token = req.body.token;
//   const decoded = jwt.decode(token, process.env.JWT_SECRET);
//   Users.findById(decoded.sub)
//   .then(foundUser => {
//     if (foundUser) {
//       res.json({
//         success: true,
//         data: helpers.desensitize(foundUser),
//       });
//     }
//   });
// });

// app.use('*', (req, res) => {
//   res.redirect('/');
// });

// // Cors is a middleware that will handle CORS in the browser
// app.use(cors());
// // Middleware that parses incoming requests into JSON no matter the type of request
// app.use(bodyParser.json({ type: '*/*' }));
// router(app);

// const webServer = app.listen(port, () => console.log(`Server started at: http://localhost:${port}`));

// // // *** Socket.io *** //
// socketServer(webServer);
// +++++++++++++++++++++++++++++++++
router(app);

module.exports = app;

if (app.get('env') === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

// app.use('/', (req,res,next)=>{
//   console.log('going through the / route...');
//   console.log('+++++');
//   next(); 
// },express.static(path.resolve(__dirname, '../client/build')));

const AuthController = require(`${__dirname}/controllers/authentication`); 
app.post('/verify', AuthController.verifyJWT);

// app.use('*', (req, res, next)=>{
//   console.log('going through star to redirect route...');
//   console.log('+++++');
//   next(); 
// }, (req, res) => {
//   res.redirect('/');
// });


const distPath = `${__dirname}/../client/build`;
app.use('*', express.static(distPath));    
// front end has to try to reload route state from stored localstorage state! 

const webServer = app.listen(port, () => console.log(`Server started at: http://localhost:${port} and environment as ${app.get('env')}`));

// // *** Socket.io *** //
socketServer(webServer);
