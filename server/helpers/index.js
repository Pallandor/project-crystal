// require omit method from lodash module
const omit = require('lodash/omit');

// remove password data from single record or array of records
exports.desensitize = (recordOrRecords) => {
  const sensitiveKeys = ['password'];

  if (Array.isArray(recordOrRecords)) {
    const records = recordOrRecords;
    return records.map(record => omit(record, sensitiveKeys));
  } else if (typeof recordOrRecords === 'object') {
    const record = recordOrRecords;
    return omit(record, sensitiveKeys);
  }
};
