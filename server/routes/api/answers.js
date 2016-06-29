const express = require('express');
const router = express.Router();
const Answers = require(__dirname + '/../../db/index').db.answers;
const pgp = require(__dirname + '/../../db/index').pgp;


router.put('/answers/:id', (req, res, next) => {
  res.send('Nothing yet on the questions update route, stay tuned folks! :)');
});

// get all existing answers for a couple
router.get('/answers/couples/:coupleId', (req, res, next) => {
  Answers.findByCoupleId(req.params.coupleId)
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data,
        });
    })
    .catch(err => done(err));
});

// get all existing answers for a user
router.get('/answers/users/:userId', (req, res, next) => {
  Answers.findByUserId(req.params.userId)
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data,
        });
    })
    .catch(err => done(err));
});


// get a question by question id
// router.get('/questions/:id', (req, res, next) => {
//   Questions.findById(req.params.id)
//     .then(data => {
//       return res.status(200)
//         .json({
//           success: true,
//           data
//         });
//     })
//     .catch(err => next(err));
// });

// add a new question and return the added question
router.post('/answers/add', (req, res, next) => {
  const newAnswer = req.body;
  Answers.add(newAnswer)
    .then(data => {
      res.status(200)
        .json({
          success: true,
          data,
        });
    })
    .catch(err => next(err));
});

// delete an answer and return the deleted question
router.delete('/answers/:answerId', (req, res, next) => {
  // PRF: Include Answers.findById to ensure answer exists. If does not exist,
  // return res.json with specific success: failure, data: 'that answer Id does not exist'
  Answers.remove(parseInt(req.params.answerId))
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data,
        });
    })
    .catch(err => next(err));
});

module.exports = router;
