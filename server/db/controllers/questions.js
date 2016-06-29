'use strict';

var sql = require('../sql').questions;

module.exports = rep => {

  return {

    // Creates the table;
    create: () =>
      rep.none(sql.create),

    // Initializes the table with some question records.
    init: () =>
      rep.none(sql.init),

    // Drops the table;
    drop: () =>
      rep.none(sql.drop),

    // Removes all records from the table;
    empty: () =>
      rep.none(sql.empty),

    // Adds a new question, and returns the new question;
    add: newQuestionObj =>
      rep.one(sql.add, newQuestionObj),

    // Return all questions
    // RF: Accept an options object to limit questions by categories desired etc.
    all: () => 
      rep.any(sql.findAll),

    // Tries to delete a question by id, and returns the number of records deleted;
    remove: questionId =>
      rep.oneOrNone(sql.remove, questionId),

    // Tries to find questions by frequency;
    findByFrequency: frequency =>
      rep.any(sql.findByFrequency, frequency, questions =>
        questions),

    findById: questionId =>
      rep.oneOrNone(sql.findById, [questionId]),
  };
};
