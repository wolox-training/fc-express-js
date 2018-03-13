const User = require('../models').User,
  logger = require('../logger'),
  Album = require('../models').Album,
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

exports.getAlbumsMe = userId => {
  return Album.findAll({
    attributes: ['userId', 'albumId', 'title'],
    where: {
      userId
    }
  }).catch(err => {
    throw errors.databaseError;
  });
};
