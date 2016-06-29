'use strict';

var sql = require('../sql').questions;

module.exports = rep => {

  return {

    // Creates Questions table;
    create: () =>
      rep.none(sql.create),

    // Initializes the table with some questions.
    init: () =>
      rep.none(sql.init),

    // Adds a new question, and returns the new question;
    add: newQuestionObj =>
      rep.one(sql.add, newQuestionObj),

    // Return all questions
    // RF: Accept an options object to limit questions by categories desired etc.
    all: () => 
      rep.any(sql.findAll),

    // Delete a question and return deleted question
    remove: questionId =>
      rep.oneOrNone(sql.remove, questionId),

    // Find question by question ID
    findById: questionId =>
      rep.oneOrNone(sql.findById, questionId),
  };
};
