const express = require('express');
const router = express.Router();
const Questions = require(__dirname + '/../../db/index').db.questions;
const pgp = require(__dirname + '/../../db/index').pgp;

/** Get all existing questions. 
May pass options on req.body to specify additional search criteria  */
router.get('/questions', (req, res, next) => {
  Questions.all()
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data
        });
    })
});

// get group of questions
router.get('/questions/:frequency', (req, res, next) => {
  Questions.findByFrequency(req.params.frequency)
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data
        });
    })
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

// delete single question
router.delete('/questions/:id', (req, res, next) => {
  Questions.remove(req.params.id)
    .then(data => {
      return res.status(200)
        .json({
          success: true,
          data
        })
    })
    .catch(err => {
      res.json({
        success: false,
        error: err.message || err
      });
    });
});

module.exports = router;
