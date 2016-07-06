/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const http = require('http').Server(app);
const socketServer = require('./socket');
const io = require('socket.io')(http);
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
 * Create Express server.
 */
const app = express();

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: `${__dirname}/.env` });

/**
 * Express configuration.
 */
app.use(bodyParser.json({ type: '*/*' }));
app.use(cors());
const port = process.env.PORT || 3000;

/**
 * Connect to PostgreSQL.
 */
const db = require(`${__dirname}/db/index`).db;
const Users = db.users;

/**
 * Seed PostgreSQL database.
 */
// if (app.get('env') === 'development') {
//   console.log('see if the node_env preloaded to development as expected....');
//   require('./db/populateDb')();
// }

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

router(app);

module.exports = app;

if (app.get('env') === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

const AuthController = require(`${__dirname}/controllers/authentication`);
app.post('/verify', AuthController.verifyJWT);


const distPath = `${__dirname}/../client/build`;
const indexFileName = `index.html`;
app.use(express.static(distPath));
// i dont think thats the issue. you can serve up the whole app on the front end. the front end should secure access to parts of
// the front end app. using protected(Dashboard) etc. 
// - server should only care about protecting API routes and prevent data injection in API routes. 
app.get('*', (req,res) => res.sendFile(path.join(distPath, indexFileName))); 
const webServer = app.listen(port, () => console.log(`Server started at: http://localhost:${port} and environment as ${app.get('env')}`));

// // *** Socket.io *** //
socketServer(webServer);
