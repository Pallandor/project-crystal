'use strict';

const sql = require('../sql').couples;

module.exports = rep => {

  return {

    // Creates the table;
    create: () =>
      rep.none(sql.create),

    // Initializes the table with some couple records, and returns each couple
    init: () =>
      rep.tx('Demo-Couples', t =>
        t.map(sql.init, null, couple =>
          couple)),

    // Find a couple by couple ID, return existing couple record.
    findById: couple_id =>
      rep.oneOrNone(sql.findById, couple_id),

    // Updates couple's scores
    // RF: Should expect and receive in the same format as on database (respect_score etc)! 
    // RF: Average operations should be extracted from hardcoded SQL file. e.g. sql.getCurrentScores
    // then a helper function to perform averaging calculations and then SQL update operation on single, calculated values. 
    updateScore: (scoreObj, coupleId) => {
      return rep.one(sql.updateScore, [
        coupleId, scoreObj.Total, scoreObj.Respect, scoreObj.Communication,
        scoreObj.Intimacy, scoreObj.Generosity, scoreObj.Spontaneity,
      ]);
    },

    // Returns all couple records;
    all: () =>
      rep.any(sql.all),

    // Returns the total number of couples;
    total: () =>
      rep.one('SELECT count(*) FROM Couples', [], data => parseInt(data.count))
  };
};
