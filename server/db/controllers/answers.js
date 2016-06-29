'use strict';

var sql = require('../sql').answers;

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
    add: newAnswerObj =>
      rep.one(sql.add, newAnswerObj),

    // Return all questions
    // RF: Accept an options object to limit questions by categories desired etc.
    all: () =>
      rep.any(sql.findAll),

    findByCoupleId: coupleId =>
      rep.any(sql.findByCoupleId, coupleId),

    findByUserId: userId =>
      rep.any(sql.findByUserId, userId),

    // Tries to delete a question by id, and returns the deleted answer
    remove: answerId => 
     rep.oneOrNone(sql.remove, answerId),

    // Tries to find questions by frequency;
    findByFrequency: frequency =>
      rep.any(sql.findByFrequency, frequency, questions =>
        questions),

    findById: answerId =>
      rep.oneOrNone(sql.findById, answerId),
  };
};
