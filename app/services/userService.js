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

exports.createUserAdmin = user => {
  return User.findOrCreate({
    where: { email: user.email },
    defaults: { name: user.name, surname: user.surname, password: user.password, isAdmin: true }
  })
    .then(([admin, isNewUser]) => {
      if (!isNewUser) {
        return admin.update({ isAdmin: true });
      }
      return admin;
    })
    .catch(err => {
      throw errors.databaseError;
    });
};
