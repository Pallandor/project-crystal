const express = require('express');
const router = express.Router();
const Questions = require(__dirname + '/../../db/index').db.questions;
const pgp = require(__dirname + '/../../db/index').pgp;


router.put('/questions/:id', (req,res,next) => {
  res.send('Nothing yet on the questions update route, stay tuned folks! :)'); 
});

// get all existing questions
// RF: Allow a qualifier object to be passed in for category-limiting
router.get('/questions', (req, res, next) => {
  Questions.all()
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data, 
        });
    })
    .catch(err=>done(err)); 
});

// get a question by question id
router.get('/questions/:id', (req, res, next) => {
  Questions.findById(req.params.id)
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data
        });
    })
    .catch(err => next(err));
});

// add a new question and return the added question
router.post('/questions/add', (req, res, next) => {
  const newQuestion = req.body;
  Questions.add(newQuestion)
    .then(data =>
      res.status(200)
      .json({
        success: true,
        data,
      }))
    .catch(err => next(err));
});

// delete a question and return the deleted question
router.delete('/questions/:id', (req, res, next) => {
  Questions.remove(req.params.id)
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
