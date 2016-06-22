const omit = require('lodash/omit');

// remove password data from array of records
exports.desensitize = (records) => records.map(record =>
  omit(record, ['password'])
);
