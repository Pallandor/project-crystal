const jwt = require('jwt-simple');
const config = require('../config');
const db = require(`${__dirname}/../db/index`).db;
const Users = db.users;
const Couples = db.couples;
const Events = db.events;
// const pgp = require(__dirname + '/../db/index').pgp;
// const bcrypt = require('bcrypt-nodejs');
const helpers = require(`${__dirname}/../helpers/helpers`);

// const clientSecret = require('./config'); // RF: add to process.env.JWT_SECRET

exports.verifyJWT = (req, res, next) => {
  console.log('inside verifyJWT....'); 
  var decoded = null;
  try {
    const token = req.body.token;
    // decoded = jwt.decode(token, clientSecret.jwtSecret);
    decoded = jwt.decode(token, process.env.JWT_SECRET);
    Users.findById(decoded.sub)
      .then(foundUser => {
        if (foundUser) {
          res.json({
            success: true,
            data: helpers.desensitize(foundUser),
          });
        } else {
          res.json({
            success: false,
            data: 'Unable to sign user in because user data does not match our database. Please try again',
          });
        }
      })
      .catch(err => next(err));
  } catch (e) {
    res.json({
      success: false,
      data: 'Something went wrong in verifying the JWT. Please consult our awesome back-end engineers!',
    });
  }
};







const tokenForUser = user => {
  // First argument is what to encode and the second is the secret to use
  // Sub is short for Subject and it is the convention used for JWT
  // iat is short for Issued at Time and is another convention used for JWT
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.user_id, iat: timestamp, couple_id: user.couple_id }, config.jwtSecret);
};

exports.signin = (req, res, next) => {
  // User has already had their email and password auth'd ,just need to give them a token
  res.send({
    token: tokenForUser(req.user),
    data: req.user,
  });
};

exports.signup = (req, res, next) => {
  // Create new user object and populate with values from the request
  const newUser = {};
  newUser.first_name = req.body.firstName;
  newUser.last_name = req.body.lastName;
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  if (req.body.couple === 'yes') {
    newUser.is_first_of_couple = true;
  } else {
    newUser.is_first_of_couple = false;
    newUser.other_user_email = req.body.otherEmail;
  }

  // Default event needed for each new Couple that gets registered to database
  const defaultEvent = {
    title: 'Welcome!',
    description: 'This is the default event for our calendar!',
    start_date: '2016-06-30T06:00:00.000Z',
    end_date: '2016-06-30T15:00:00.000Z',
    category: 'Misc',
  };

  Users.checkIfExists(newUser.email)
    .then(exists => {
      console.log('just after checkIfExists ********');
      if (exists) {
        res.status(422)
          .json({
            success: false,
            data: 'Email ' + newUser.email + ' is already is use!',
          });
      } else {
        helpers.hashPassword(newUser.password)
          .then(hash => {
            newUser.password = hash;
            // RF: Unify under a single addUser method, move logic to DB controllers
            // Don't need to expose this logic in routes. newUser when passed will include is_first_of_couple flag.
            if (newUser.is_first_of_couple) {
              Users.addFirstUser(newUser)
                .then(addedUser => {
                  // Set the couple_id of the default event equal to the couple_id of the user that signed up
                  defaultEvent.couple_id = addedUser.couple_id
                  // Add the defaultEvent to the Events table with the appropriate couple_id
                  Events.add(defaultEvent)
                  .then(data => {
                    res.status(200)
                    .json({
                      success: true,
                      data: helpers.desensitize(addedUser),
                    });
                  });
                });
            } else {
              Users.addSecondUser(newUser)
                .then(addedUser => {
                  if (addedUser) {
                    res.status(200)
                      .json({
                        success: true,
                        data: helpers.desensitize(addedUser),
                      });
                  } else {
                    res.status(422)
                      .json({
                        success: false,
                        data: newUser.other_user_email + ' is already connected to a Couple!',
                      });
                  }
                });
            }
          });
      }
    })
    .catch(err => next(err));
};
