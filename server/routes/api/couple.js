const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../../db/index').db;
const Couples = db.couples;
const CouplesUsers = db.couples_users;
const pgp = require(__dirname + '/../../db/index').pgp;

// RF: Standarize post-catch error handling procedure i.e. in some routes
// you appear to translate to res.json response, in others you pass on to final route/error handler using next. 

// get all couples with their associated users
router.get('/couples', (req, res, next) => {
  Couples.all()
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data,
        });
    })
    .catch(err => next(err));
});

// get a single couple and associated user information by couple ID
router.get('/couples/:coupleId', (req, res, next) => {
  Couples.findById(parseInt(req.params.coupleId))
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data,
        });
    })
    .catch(err => next(err));
});

router.post('/couples/add', (req, res, next) => {
  res.send('The Couples/Add route has been deprecated. Couple creation is handled implicitly by user creation and passing correct user creation flags e.g. is_first_of_couple.');
});

router.post('/couples/answers', (req, res, next) => {
  res.send('The couples/answers route has been deprecated. See the Answers API for an alternative to obtain all answers related to a particular Couple');
});

// update couple relationship score and return couple
router.put('/couples/:coupleId/:newScore', (req, res, next) => {
  res.send('Couple update score logic needs to be refactored, please see Couples API Routes and correct this!'); 
  // Couples.updateScore(req.params.coupleId, req.params.newScore)
  //   .then(data => {
  //     return res.status(200)
  //       .json({
  //         success: true,
  //         data,
  //       });
  //   })
  //   .catch(err => next(err));
});

// delete a couple and return the deleted couple
router.delete('/couples/:id', (req, res, next) => {
  res.send('The DELETE couples route has been deprecated. Deletion should be on a user by user basis, couple deletion is handled implicitly and automatically following user deletions'); 
});

module.exports = router;
