'use strict';

var sql = require('../sql').answers;

module.exports = rep => {

  return {

    // Creates Answers table
    create: () =>
      rep.none(sql.create),

    // Initializes Answers Table with initial Answers
    init: () =>
      rep.none(sql.init),

    // Adds a new answer, and returns the added answer
    add: newAnswerObj =>
      rep.one(sql.add, newAnswerObj),

    // Find all answers related to a couple
    findByCoupleId: coupleId =>
      rep.any(sql.findByCoupleId, coupleId),

    // find all answers related to a user
    findByUserId: userId =>
      rep.any(sql.findByUserId, userId),

    // Tries to delete a question by id, and returns the deleted answer
    remove: answerId => 
     rep.oneOrNone(sql.remove, answerId),

    // Find an answer by answer ID
    findById: answerId =>
      rep.oneOrNone(sql.findById, answerId),
  };
};
