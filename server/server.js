require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const Users = require(`${__dirname}/db/index`).db.users;
const helpers = require(`${__dirname}/helpers/helpers`);
const compression = require('compression');
const clientSecret = new Buffer(process.env.JWT_SECRET).toString();

const app = express();
const http = require('http').Server(app);
const socketServer = require('./socket');
const io = require('socket.io')(http);
const React = require('react');
const port = process.env.PORT || 9000;
// process.env.NODE_ENV = 'production';
app.use(compression());
app.use(express.static(`${__dirname}/../client/build`));
app.use(bodyParser.json());

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
const dateNightAPIroutes = require('./routes/api/dateNight');
const lovebucksAPIroutes = require('./routes/api/lovebucks');

app.use('/api/v1', userAPIroutes);
app.use('/api/v1', coupleAPIroutes);
app.use('/api/v1', questionAPIroutes);
app.use('/api/v1', eventsAPIroutes);
app.use('/api/v1', messageAPIroutes);
app.use('/api/v1', todoAPIroutes);
app.use('/api/v1', dateNightAPIroutes);
app.use('/api/v1', lovebucksAPIroutes);

router(app);

module.exports = app;

if (app.get('env') === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.use('/', express.static(path.resolve(__dirname, '../client/build')));
app.post('/verify', (req, res, next) => {
  const token = req.body.token;
  const decoded = jwt.decode(token, clientSecret);
  Users.findById(decoded.sub)
  .then(foundUser => {
    if (foundUser) {
      res.json({
        success: true,
        data: helpers.desensitize(foundUser),
      });
    }
  });
});

app.use('*', (req, res) => {
  res.redirect('/');
});


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
