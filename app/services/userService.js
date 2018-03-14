const User = require('../models').User,
  logger = require('../logger'),
  errors = require('../errors');

const getOne = email => {
  return User.findOne({ where: email }).catch(err => {
    logger.error(err.message);
    throw errors.databaseError(err.detail);
  });
};

exports.getByEmail = email => {
  return getOne({ email });
};
